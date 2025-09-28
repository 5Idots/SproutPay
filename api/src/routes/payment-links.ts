import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { db, paymentLinks, contractDetails, yellowChannels } from '../lib/database'
import { validateWalletSignature } from '../lib/wallet-validation'
import { YellowNetworkService } from '../lib/yellow-network'
import { createSuccessResponse, createErrorResponse, createLegacyResponse, createLegacyError } from '../lib/api-responses'

const app = new Hono()

// Initialize Yellow Network service
const yellowService = new YellowNetworkService()

// Payment status validation helper
function validateStatusTransition(currentStatus: string, targetStatus: string): boolean {
  const validTransitions: Record<string, string[]> = {
    'created': ['pending_acceptance'],
    'pending_acceptance': ['channel_active', 'failed'],
    'channel_active': ['funds_locked', 'completed', 'disputed', 'failed'],
    'funds_locked': ['released', 'disputed', 'completed', 'failed'],
    'disputed': ['resolved', 'failed'],
    'released': ['completed'],
    'resolved': ['completed'],
    'completed': [], // Terminal state
    'failed': [], // Terminal state
  }
  
  return validTransitions[currentStatus]?.includes(targetStatus) || false
}

// Validation schemas
const createPaymentLinkSchema = z.object({
  // Link type and creator info
  linkType: z.enum(['payer', 'receiver']),
  creatorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string(), // Wallet signature for authentication
  message: z.string(), // Authentication message for signature verification
  
  // Payment details
  amount: z.string().regex(/^\d+\.?\d*$/, 'Invalid amount format'),
  token: z.string().min(2).max(10), // USDC, ETH, DAI, etc.
  chain: z.string().min(3).max(20), // ethereum, polygon, arbitrum, etc.
  
  // Escrow configuration - matching UI
  escrowType: z.enum(['instant_transfer', 'time_locked']),
  escrowHours: z.number().min(1).max(8760).optional(), // Required for time_locked
  
  // Optional fields
  targetAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(), // Specific recipient
  description: z.string().max(500).optional(),
  
  // Contract details (optional) - matching UI with file upload
  attachWorkContract: z.boolean().default(false), // "Attach work contract/requirements" checkbox
  contractTerms: z.string().optional(), // Work requirements & terms text area
  contractFileUrl: z.string().url().optional(), // Uploaded contract file URL
  contractFileName: z.string().optional(), // Original filename (PDF, DOC, etc.)
  contractFileType: z.enum(['PDF', 'DOC', 'DOCX', 'TXT']).optional(), // File type
  disputeResolution: z.boolean().default(false), // "Enable dispute resolution" checkbox
  arbitratorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  arbitrationFee: z.string().regex(/^\d+\.?\d*$/).optional(),
  
  // Early release option (payer can release funds before timelock expires)
  allowEarlyRelease: z.boolean().default(true), // Allow payer to release early
})

const acceptPaymentLinkSchema = z.object({
  acceptorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string(), // Wallet signature for authentication
  message: z.string(), // Authentication message for signature verification
})

const releasePaymentSchema = z.object({
  releaserAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string(), // Wallet signature for authentication
  message: z.string(), // Authentication message for signature verification
})

const disputePaymentSchema = z.object({
  disputerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string(), // Wallet signature for authentication
  reason: z.string().min(10).max(500), // Dispute reason
})

// Sender payment link schema (similar to receiver but for sender flow)
const createSenderPaymentLinkSchema = z.object({
  // Link type is 'payer' for sender-created links
  senderAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string(), // Wallet signature for authentication
  
  // Payment details
  amount: z.string().regex(/^\d+\.?\d*$/, 'Invalid amount format'),
  token: z.string().min(2).max(10), // USDC, ETH, DAI, etc.
  chain: z.string().min(3).max(20), // ethereum, polygon, arbitrum, etc.
  
  // Escrow configuration - same as receiver
  escrowType: z.enum(['instant_transfer', 'time_locked']),
  escrowHours: z.number().min(1).max(8760).optional(),
  
  // Optional fields
  receiverAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(), // Specific recipient
  description: z.string().max(500).optional(),
  
  // Contract details - same as receiver
  attachWorkContract: z.boolean().default(false),
  contractTerms: z.string().optional(),
  disputeResolution: z.boolean().default(false),
  arbitratorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  arbitrationFee: z.string().regex(/^\d+\.?\d*$/).optional(),
})

// Helper function to generate short ID for user-friendly URLs
function generateShortId(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// POST /api/payment-links - Create new payment link (both payer and receiver types)
app.post('/', zValidator('json', createPaymentLinkSchema), async (c) => {
  try {
    const validatedData = c.req.valid('json')

    // Verify wallet signature
    const isValidSignature = await validateWalletSignature(
      validatedData.creatorAddress,
      validatedData.message,
      validatedData.signature
    )

    if (!isValidSignature) {
      return c.json({ error: 'Invalid wallet signature' }, 401)
    }

    // Validate escrow configuration
    if (validatedData.escrowType === 'time_locked' && !validatedData.escrowHours) {
      return c.json({ error: 'Escrow hours required for time-locked escrow' }, 400)
    }

    // Generate unique short ID
    let shortId: string
    let attempts = 0
    do {
      shortId = generateShortId()
      const existing = await db
        .select({ id: paymentLinks.id })
        .from(paymentLinks)
        .where(eq(paymentLinks.shortId, shortId))
        .limit(1)
      
      if (existing.length === 0) break
      attempts++
    } while (attempts < 10)

    if (attempts === 10) {
      return c.json({ error: 'Failed to generate unique ID' }, 500)
    }

    // Calculate expiration (default 7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Create payment link
    const [newPaymentLink] = await db
      .insert(paymentLinks)
      .values({
        shortId,
        creatorAddress: validatedData.creatorAddress,
        linkType: validatedData.linkType,
        targetAddress: validatedData.targetAddress,
        amount: validatedData.amount,
        token: validatedData.token,
        chain: validatedData.chain,
        escrowType: validatedData.escrowType,
        escrowHours: validatedData.escrowHours,
        description: validatedData.description,
        attachWorkContract: validatedData.attachWorkContract,
        disputeResolution: validatedData.disputeResolution,
        canEarlyRelease: validatedData.allowEarlyRelease,
        expiresAt,
      })
      .returning()

    // Create contract details if work contract is attached
    if (validatedData.attachWorkContract && (validatedData.contractTerms || validatedData.contractFileUrl || validatedData.arbitratorAddress)) {
      await db
        .insert(contractDetails)
        .values({
          paymentLinkId: newPaymentLink.id,
          contractTerms: validatedData.contractTerms,
          contractFileUrl: validatedData.contractFileUrl,
          contractFileName: validatedData.contractFileName,
          contractFileType: validatedData.contractFileType,
          arbitratorAddress: validatedData.arbitratorAddress,
          arbitrationFee: validatedData.arbitrationFee,
        })
    }

    return c.json({
      success: true,
      paymentLink: {
        id: newPaymentLink.id,
        shortId: newPaymentLink.shortId,
        linkType: newPaymentLink.linkType,
        creatorAddress: newPaymentLink.creatorAddress,
        targetAddress: newPaymentLink.targetAddress,
        amount: newPaymentLink.amount,
        token: newPaymentLink.token,
        chain: newPaymentLink.chain,
        escrowType: newPaymentLink.escrowType,
        escrowHours: newPaymentLink.escrowHours,
        description: newPaymentLink.description,
        attachWorkContract: newPaymentLink.attachWorkContract,
        disputeResolution: newPaymentLink.disputeResolution,
        status: newPaymentLink.status,
        // Add Yellow Network benefits as shown in UI
        yellowNetworkBenefits: {
          gasFees: 'FREE',
          settlementSpeed: 'Instant', 
          security: 'ERC-7824',
          crossChain: 'Native'
        },
        expiresAt: newPaymentLink.expiresAt,
        createdAt: newPaymentLink.createdAt,
        // Create shareable URL
        shareUrl: `${process.env.FRONTEND_URL}/link/${newPaymentLink.shortId}`,
      }
    })
  } catch (error: any) {
    console.error('Create payment link error:', error)
    return c.json({
      error: 'Internal server error',
      message: error.message
    }, 500)
  }
})

// GET /api/payment-links/:id - Get payment link details
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    // Query by either UUID or shortId
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    const whereCondition = isUuid ? eq(paymentLinks.id, id) : eq(paymentLinks.shortId, id)

    const [paymentLink] = await db
      .select()
      .from(paymentLinks)
      .where(whereCondition)
      .limit(1)

    if (!paymentLink) {
      return c.json({ error: 'Payment link not found' }, 404)
    }

    // Check if expired
    if (paymentLink.expiresAt && new Date() > paymentLink.expiresAt) {
      return c.json({ error: 'Payment link expired' }, 410)
    }

    // Get contract details if exists
    let contractInfo = null
    if (paymentLink.customContract) {
      const [contract] = await db
        .select()
        .from(contractDetails)
        .where(eq(contractDetails.paymentLinkId, paymentLink.id))
        .limit(1)
      
      if (contract) {
        contractInfo = {
          contractTerms: contract.contractTerms,
          arbitratorAddress: contract.arbitratorAddress,
          arbitrationFee: contract.arbitrationFee,
        }
      }
    }

    // Get Yellow Network channel info if exists
    let channelInfo = null
    if (paymentLink.yellowChannelId) {
      const [channel] = await db
        .select()
        .from(yellowChannels)
        .where(eq(yellowChannels.channelId, paymentLink.yellowChannelId))
        .limit(1)
      
      if (channel) {
        channelInfo = {
          channelId: channel.channelId,
          status: channel.status,
          createdAt: channel.createdAt,
          settledAt: channel.settledAt,
        }
      }
    }

    return c.json({
      success: true,
      paymentLink: {
        id: paymentLink.id,
        shortId: paymentLink.shortId,
        linkType: paymentLink.linkType,
        creatorAddress: paymentLink.creatorAddress,
        targetAddress: paymentLink.targetAddress,
        amount: paymentLink.amount,
        token: paymentLink.token,
        chain: paymentLink.chain,
        escrowType: paymentLink.escrowType,
        escrowHours: paymentLink.escrowHours,
        description: paymentLink.description,
        status: paymentLink.status,
        acceptedBy: paymentLink.acceptedBy,
        acceptedAt: paymentLink.acceptedAt,
        yellowChannelId: paymentLink.yellowChannelId,
        yellowNetworkStatus: paymentLink.yellowNetworkStatus,
        attachWorkContract: paymentLink.attachWorkContract,
        disputeResolution: paymentLink.disputeResolution,
        // Add Yellow Network benefits
        yellowNetworkBenefits: {
          gasFees: 'FREE',
          settlementSpeed: 'Instant',
          security: 'ERC-7824', 
          crossChain: 'Native'
        },
        createdAt: paymentLink.createdAt,
        expiresAt: paymentLink.expiresAt,
        completedAt: paymentLink.completedAt,
        contractInfo,
        channelInfo,
        shareUrl: `${process.env.FRONTEND_URL}/link/${paymentLink.shortId}`,
      }
    })
  } catch (error: any) {
    console.error('Get payment link error:', error)
    return c.json({
      error: 'Internal server error',
      message: error.message
    }, 500)
  }
})

// PUT /api/payment-links/:id/accept - Accept a payment link
app.put('/:id/accept', zValidator('json', acceptPaymentLinkSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const validatedData = c.req.valid('json')

    // Verify wallet signature
    const isValidSignature = await validateWalletSignature(
      validatedData.acceptorAddress,
      validatedData.message,
      validatedData.signature
    )

    if (!isValidSignature) {
      return c.json({ error: 'Invalid wallet signature' }, 401)
    }

    // Get payment link
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    const whereCondition = isUuid ? eq(paymentLinks.id, id) : eq(paymentLinks.shortId, id)

    const [paymentLink] = await db
      .select()
      .from(paymentLinks)
      .where(whereCondition)
      .limit(1)

    if (!paymentLink) {
      return c.json({ error: 'Payment link not found' }, 404)
    }

    // Check if expired
    if (paymentLink.expiresAt && new Date() > paymentLink.expiresAt) {
      return c.json({ error: 'Payment link expired' }, 410)
    }

    // Check current status and validate state transition
    if (!['created', 'pending_acceptance'].includes(paymentLink.status)) {
      return c.json({ error: 'Payment link already processed' }, 400)
    }

    // Role-based validation
    if (paymentLink.linkType === 'receiver') {
      // Receiver-created link: Payer is accepting to pay
      if (paymentLink.targetAddress && paymentLink.targetAddress.toLowerCase() !== validatedData.acceptorAddress.toLowerCase()) {
        return c.json({ error: 'You are not the intended payer' }, 403)
      }
    } else {
      // Payer-created link: Receiver is accepting to receive
      if (paymentLink.targetAddress && paymentLink.targetAddress.toLowerCase() !== validatedData.acceptorAddress.toLowerCase()) {
        return c.json({ error: 'You are not the intended recipient' }, 403)
      }
    }

    // Prevent creator from accepting their own link
    if (paymentLink.creatorAddress.toLowerCase() === validatedData.acceptorAddress.toLowerCase()) {
      return c.json({ error: 'Cannot accept your own payment link' }, 400)
    }

    // Check if payment is already being processed or completed
    if (!['created', 'pending_acceptance'].includes(paymentLink.status)) {
      return c.json({ 
        error: `Payment link is ${paymentLink.status}. Cannot accept.`,
        currentStatus: paymentLink.status 
      }, 400)
    }

    // Step 1: Update to processing status immediately to prevent concurrent accepts
    console.log(`🔄 Setting payment ${paymentLink.shortId} to processing status...`)
    const [processingPaymentLink] = await db
      .update(paymentLinks)
      .set({
        status: 'processing', // Prevents other requests from interfering
        acceptedBy: validatedData.acceptorAddress,
        acceptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(paymentLinks.id, paymentLink.id))
      .returning()

    // Step 2: Complete Yellow Network channel setup (this takes time)
    const channelParams = {
      senderAddress: paymentLink.linkType === 'receiver' ? validatedData.acceptorAddress : paymentLink.creatorAddress,
      receiverAddress: paymentLink.linkType === 'receiver' ? paymentLink.creatorAddress : validatedData.acceptorAddress,
      asset: paymentLink.token,
      amount: paymentLink.amount,
      paymentId: paymentLink.id,
    }

    let channelResult
    let finalPaymentLink
    
    try {
      console.log('🚀 Creating Yellow Network channel (this may take 10-30 seconds)...')
      
      // Wait for Yellow Network setup to complete entirely
      channelResult = await yellowService.createPaymentChannel(channelParams)
      
      console.log('✅ Yellow Network channel created:', channelResult.channelId);
      // Channel created successfully
      
      // Step 3: Update to final active status only after Yellow Network is ready
      const updateResult = await db
        .update(paymentLinks)
        .set({
          status: 'channel_active',
          yellowChannelId: channelResult.channelId,
          yellowNetworkStatus: channelResult.status,
          updatedAt: new Date(),
        })
        .where(eq(paymentLinks.id, paymentLink.id))
        .returning();
      
      finalPaymentLink = updateResult[0];
      
      console.log(`🎉 Payment ${paymentLink.shortId} fully activated with Yellow Network!`)
      
    } catch (error) {
      console.error('❌ Yellow Network setup failed:', error);
      
      // Set to failed state so it can be retried
      const updateResult = await db
        .update(paymentLinks)
        .set({
          status: 'failed',
          yellowNetworkStatus: 'failed', 
          updatedAt: new Date(),
        })
        .where(eq(paymentLinks.id, paymentLink.id))
        .returning()
      
      finalPaymentLink = updateResult[0];
      
      return c.json({
        error: 'Yellow Network setup failed',
        message: error.message,
        paymentLink: {
          id: finalPaymentLink.id,
          shortId: finalPaymentLink.shortId,
          status: finalPaymentLink.status
        }
      }, 500)
    }
    
    const result = { updatedPaymentLink: finalPaymentLink, channelResult }

    return c.json({
      success: true,
      message: 'Payment link accepted successfully',
      paymentLink: {
        id: finalPaymentLink.id,
        status: finalPaymentLink.status,
        acceptedBy: finalPaymentLink.acceptedBy,
        acceptedAt: finalPaymentLink.acceptedAt,
        yellowChannelId: finalPaymentLink.yellowChannelId,
        yellowNetworkStatus: finalPaymentLink.yellowNetworkStatus,
      },
      yellowChannel: channelResult
    })
  } catch (error: any) {
    console.error('Accept payment link error:', error)
    return c.json({
      error: 'Internal server error',
      message: error.message
    }, 500)
  }
})

// POST /api/payment-links/:id/early-release - Early release by payer (before timelock expires)
app.post('/:id/early-release', zValidator('json', releasePaymentSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const validatedData = c.req.valid('json')

    // Verify wallet signature using the message from the request
    const isValidSignature = await validateWalletSignature(
      validatedData.releaserAddress,
      validatedData.message,
      validatedData.signature
    )

    if (!isValidSignature) {
      return c.json({ error: 'Invalid wallet signature' }, 401)
    }

    // Get payment link
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    const whereCondition = isUuid ? eq(paymentLinks.id, id) : eq(paymentLinks.shortId, id)

    const [paymentLink] = await db
      .select()
      .from(paymentLinks)
      .where(whereCondition)
      .limit(1)

    if (!paymentLink) {
      return c.json({ error: 'Payment link not found' }, 404)
    }

    // Check if early release is allowed
    if (!paymentLink.canEarlyRelease) {
      return c.json({ error: 'Early release not allowed for this payment' }, 400)
    }

    // Check if payment is in time-locked state
    if (paymentLink.escrowType !== 'time_locked') {
      return c.json({ error: 'Early release only available for time-locked payments' }, 400)
    }

    if (!['channel_active', 'funds_locked'].includes(paymentLink.status)) {
      return c.json({ error: 'Payment not in releasable state' }, 400)
    }

    // Determine who the payer is based on link type
    const payerAddress = paymentLink.linkType === 'receiver' ? paymentLink.acceptedBy : paymentLink.creatorAddress

    // Only payer can release funds early
    if (!payerAddress || payerAddress.toLowerCase() !== validatedData.releaserAddress.toLowerCase()) {
      return c.json({ error: 'Only the payer can release funds early' }, 403)
    }

    // Process early release through Yellow Network
    if (paymentLink.yellowChannelId) {
      try {
        console.log(`🚀 Processing early release for payment ${id} by payer ${payerAddress}`)
        
        const settlementResult = await yellowService.settleCrossChain(
          paymentLink.yellowChannelId,
          paymentLink.chain
        )

        // Update payment link status with early release info
        const [updatedPaymentLink] = await db
          .update(paymentLinks)
          .set({
            status: 'early_released',
            yellowNetworkStatus: 'settled',
            earlyReleasedAt: new Date(),
            earlyReleasedBy: validatedData.releaserAddress,
            completedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(paymentLinks.id, paymentLink.id))
          .returning()

        return c.json({
          success: true,
          message: 'Funds released early by payer',
          paymentLink: {
            id: updatedPaymentLink.id,
            status: updatedPaymentLink.status,
            earlyReleasedAt: updatedPaymentLink.earlyReleasedAt,
            earlyReleasedBy: updatedPaymentLink.earlyReleasedBy,
            completedAt: updatedPaymentLink.completedAt,
            yellowNetworkStatus: updatedPaymentLink.yellowNetworkStatus,
          },
          settlement: settlementResult
        })
      } catch (yellowError: any) {
        console.error('Yellow Network early release error:', yellowError)
        return c.json({
          error: 'Failed to process early release through Yellow Network',
          message: yellowError.message
        }, 500)
      }
    } else {
      return c.json({ error: 'No Yellow Network channel found' }, 400)
    }
  } catch (error: any) {
    console.error('Early release payment error:', error)
    return c.json({
      error: 'Internal server error',
      message: error.message
    }, 500)
  }
})

// POST /api/payment-links/:id/release - Release funds early (payer only) - DEPRECATED
app.post('/:id/release', zValidator('json', releasePaymentSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const validatedData = c.req.valid('json')

    // Verify wallet signature
    const isValidSignature = await validateWalletSignature(
      validatedData.releaserAddress,
      validatedData.message,
      validatedData.signature
    )

    if (!isValidSignature) {
      return c.json({ error: 'Invalid wallet signature' }, 401)
    }

    // Get payment link
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    const whereCondition = isUuid ? eq(paymentLinks.id, id) : eq(paymentLinks.shortId, id)

    const [paymentLink] = await db
      .select()
      .from(paymentLinks)
      .where(whereCondition)
      .limit(1)

    if (!paymentLink) {
      return c.json({ error: 'Payment link not found' }, 404)
    }

    // Check if payment is in releasable state
    if (!['channel_active', 'funds_locked'].includes(paymentLink.status)) {
      return c.json({ error: 'Payment not in releasable state' }, 400)
    }

    // Validate state transition
    if (!validateStatusTransition(paymentLink.status, 'released')) {
      return c.json({ error: `Cannot release funds from status: ${paymentLink.status}` }, 400)
    }

    // Determine who the payer is based on link type
    const payerAddress = paymentLink.linkType === 'receiver' ? paymentLink.acceptedBy : paymentLink.creatorAddress

    // Only payer can release funds early
    if (!payerAddress || payerAddress.toLowerCase() !== validatedData.releaserAddress.toLowerCase()) {
      return c.json({ error: 'Only the payer can release funds early' }, 403)
    }

    // Process early release through Yellow Network with transaction safety
    if (!paymentLink.yellowChannelId) {
      return c.json({ error: 'No Yellow Network channel found' }, 400)
    }

    const result = await db.transaction(async (tx) => {
      try {
        // Update status to released first
        const [releasedPaymentLink] = await tx
          .update(paymentLinks)
          .set({
            status: 'released',
            updatedAt: new Date(),
          })
          .where(eq(paymentLinks.id, paymentLink.id))
          .returning()

        // Settle the Yellow Network channel
        const settlementResult = await yellowService.settleCrossChain(
          paymentLink.yellowChannelId!,
          paymentLink.chain
        )

        // Update to final completed status
        const [completedPaymentLink] = await tx
          .update(paymentLinks)
          .set({
            status: 'completed',
            yellowNetworkStatus: 'settled',
            completedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(paymentLinks.id, paymentLink.id))
          .returning()

        return { completedPaymentLink, settlementResult }
      } catch (error) {
        console.error('Release payment failed, rolling back transaction:', error)
        throw error
      }
    })

    return c.json({
      success: true,
      message: 'Funds released successfully',
      paymentLink: {
        id: result.completedPaymentLink.id,
        status: result.completedPaymentLink.status,
        completedAt: result.completedPaymentLink.completedAt,
        yellowNetworkStatus: result.completedPaymentLink.yellowNetworkStatus,
      },
      settlement: result.settlementResult
    })
  } catch (error: any) {
    console.error('Release payment error:', error)
    return c.json({
      error: 'Internal server error',
      message: error.message
    }, 500)
  }
})

// POST /api/payment-links/:id/dispute - Initiate payment dispute
app.post('/:id/dispute', zValidator('json', disputePaymentSchema), async (c) => {
  try {
    const id = c.req.param('id')
    const validatedData = c.req.valid('json')

    // Verify wallet signature
    const isValidSignature = await validateWalletSignature(
      validatedData.disputerAddress,
      validatedData.message,
      validatedData.signature
    )

    if (!isValidSignature) {
      return c.json({ error: 'Invalid wallet signature' }, 401)
    }

    // Get payment link
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    const whereCondition = isUuid ? eq(paymentLinks.id, id) : eq(paymentLinks.shortId, id)

    const [paymentLink] = await db
      .select()
      .from(paymentLinks)
      .where(whereCondition)
      .limit(1)

    if (!paymentLink) {
      return c.json({ error: 'Payment link not found' }, 404)
    }

    // Check if payment is in disputable state
    if (!['channel_active', 'funds_locked'].includes(paymentLink.status)) {
      return c.json({ error: 'Payment not in disputable state' }, 400)
    }

    // Check if dispute resolution is enabled
    if (!paymentLink.disputeResolution) {
      return c.json({ error: 'Dispute resolution not enabled for this payment' }, 400)
    }

    // Only creator or acceptor can dispute
    const canDispute = 
      paymentLink.creatorAddress.toLowerCase() === validatedData.disputerAddress.toLowerCase() ||
      paymentLink.acceptedBy?.toLowerCase() === validatedData.disputerAddress.toLowerCase()

    if (!canDispute) {
      return c.json({ error: 'Only payment participants can initiate disputes' }, 403)
    }

    // Update payment link status to disputed
    const [updatedPaymentLink] = await db
      .update(paymentLinks)
      .set({
        status: 'disputed',
        yellowNetworkStatus: 'disputed',
        updatedAt: new Date(),
      })
      .where(eq(paymentLinks.id, paymentLink.id))
      .returning()

    // In a real implementation, you would:
    // 1. Freeze the Yellow Network channel
    // 2. Notify the arbitrator
    // 3. Store dispute details
    // 4. Start arbitration process

    return c.json({
      success: true,
      message: 'Dispute initiated successfully',
      paymentLink: {
        id: updatedPaymentLink.id,
        status: updatedPaymentLink.status,
        yellowNetworkStatus: updatedPaymentLink.yellowNetworkStatus,
      },
      dispute: {
        initiatedBy: validatedData.disputerAddress,
        reason: validatedData.reason,
        initiatedAt: new Date(),
      }
    })
  } catch (error: any) {
    console.error('Dispute payment error:', error)
    return c.json({
      error: 'Internal server error',
      message: error.message
    }, 500)
  }
})

// POST /api/payment-links/send - Create sender payment link (payer creates link with funds)
app.post('/send', zValidator('json', createSenderPaymentLinkSchema), async (c) => {
  try {
    const validatedData = c.req.valid('json')

    // Verify wallet signature
    const message = JSON.stringify({
      linkType: 'payer',
      amount: validatedData.amount,
      token: validatedData.token,
      timestamp: Date.now()
    })
    const isValidSignature = await validateWalletSignature(
      validatedData.senderAddress,
      message,
      validatedData.signature
    )

    if (!isValidSignature) {
      return c.json({ error: 'Invalid wallet signature' }, 401)
    }

    // Validate escrow configuration
    if (validatedData.escrowType === 'time_locked' && !validatedData.escrowHours) {
      return c.json({ error: 'Escrow hours required for time-locked escrow' }, 400)
    }

    // Generate unique short ID
    let shortId: string
    let attempts = 0
    do {
      shortId = generateShortId()
      const existing = await db
        .select({ id: paymentLinks.id })
        .from(paymentLinks)
        .where(eq(paymentLinks.shortId, shortId))
        .limit(1)
      
      if (existing.length === 0) break
      attempts++
    } while (attempts < 10)

    if (attempts === 10) {
      return c.json({ error: 'Failed to generate unique ID' }, 500)
    }

    // Calculate expiration (default 7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Create sender payment link
    const [newPaymentLink] = await db
      .insert(paymentLinks)
      .values({
        shortId,
        creatorAddress: validatedData.senderAddress,
        linkType: 'payer', // Sender creates 'payer' type links
        targetAddress: validatedData.receiverAddress, // Optional specific receiver
        amount: validatedData.amount,
        token: validatedData.token,
        chain: validatedData.chain,
        escrowType: validatedData.escrowType,
        escrowHours: validatedData.escrowHours,
        description: validatedData.description,
        attachWorkContract: validatedData.attachWorkContract,
        disputeResolution: validatedData.disputeResolution,
        expiresAt,
      })
      .returning()

    // Create contract details if work contract is attached
    if (validatedData.attachWorkContract && (validatedData.contractTerms || validatedData.arbitratorAddress)) {
      await db
        .insert(contractDetails)
        .values({
          paymentLinkId: newPaymentLink.id,
          contractTerms: validatedData.contractTerms,
          arbitratorAddress: validatedData.arbitratorAddress,
          arbitrationFee: validatedData.arbitrationFee,
        })
    }

    return c.json({
      success: true,
      paymentLink: {
        id: newPaymentLink.id,
        shortId: newPaymentLink.shortId,
        linkType: newPaymentLink.linkType,
        creatorAddress: newPaymentLink.creatorAddress,
        targetAddress: newPaymentLink.targetAddress,
        amount: newPaymentLink.amount,
        token: newPaymentLink.token,
        chain: newPaymentLink.chain,
        escrowType: newPaymentLink.escrowType,
        escrowHours: newPaymentLink.escrowHours,
        description: newPaymentLink.description,
        attachWorkContract: newPaymentLink.attachWorkContract,
        disputeResolution: newPaymentLink.disputeResolution,
        status: newPaymentLink.status,
        // Add Yellow Network benefits as shown in UI
        yellowNetworkBenefits: {
          gasFees: 'FREE',
          settlementSpeed: 'Instant', 
          security: 'ERC-7824',
          crossChain: 'Native'
        },
        expiresAt: newPaymentLink.expiresAt,
        createdAt: newPaymentLink.createdAt,
        // Create shareable URL
        shareUrl: `${process.env.FRONTEND_URL}/link/${newPaymentLink.shortId}`,
      }
    })
  } catch (error: any) {
    console.error('Create sender payment link error:', error)
    return c.json({
      error: 'Internal server error',
      message: error.message
    }, 500)
  }
})

export default app
