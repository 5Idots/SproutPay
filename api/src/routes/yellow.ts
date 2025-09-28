import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { YellowNetworkService } from '../lib/yellow-network'
import { createSuccessResponse, createErrorResponse } from '../lib/api-responses'

const app = new Hono()

// Validation schemas
const createChannelSchema = z.object({
  senderAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid sender address'),
  receiverAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid receiver address'),
  asset: z.string().min(1).max(10),
  amount: z.string().regex(/^\d+\.?\d*$/, 'Invalid amount format'),
  paymentId: z.string().uuid('Invalid payment ID'),
})

const settleChannelSchema = z.object({
  targetChain: z.string().min(1).max(50),
})

// POST /api/yellow/channels - Create new Yellow Network channel
app.post('/channels', zValidator('json', createChannelSchema), async (c) => {
  try {
    const validatedData = c.req.valid('json')
    const yellowService = new YellowNetworkService()
    
    const result = await yellowService.createPaymentChannel({
      senderAddress: validatedData.senderAddress,
      receiverAddress: validatedData.receiverAddress,
      asset: validatedData.asset,
      amount: validatedData.amount,
      paymentId: validatedData.paymentId,
    })

    return c.json({
      success: true,
      channel: result
    })
  } catch (error: any) {
    console.error('Create channel error:', error)
    return c.json({
      error: 'Failed to create channel',
      message: error.message
    }, 500)
  }
})

// GET /api/yellow/channels/:channelId/status - Get channel status
app.get('/channels/:channelId/status', async (c) => {
  try {
    const channelId = c.req.param('channelId')
    const yellowService = new YellowNetworkService()
    
    const status = await yellowService.getChannelStatus(channelId)

    return c.json({
      success: true,
      status
    })
  } catch (error: any) {
    console.error('Get channel status error:', error)
    return c.json({
      error: 'Failed to get channel status',
      message: error.message
    }, 500)
  }
})

// POST /api/yellow/channels/:channelId/settle - Settle channel
app.post('/channels/:channelId/settle', zValidator('json', settleChannelSchema), async (c) => {
  try {
    const channelId = c.req.param('channelId')
    const { targetChain } = c.req.valid('json')
    const yellowService = new YellowNetworkService()
    
    const result = await yellowService.settleCrossChain(channelId, targetChain)

    return c.json({
      success: true,
      settlement: result
    })
  } catch (error: any) {
    console.error('Settle channel error:', error)
    return c.json({
      error: 'Failed to settle channel',
      message: error.message
    }, 500)
  }
})

// GET /api/yellow/monitoring/stats - Get monitoring statistics
app.get('/monitoring/stats', async (c) => {
  try {
    const yellowService = new YellowNetworkService()
    const stats = await yellowService.getMonitoringStats()

    return c.json({
      success: true,
      stats
    })
  } catch (error: any) {
    console.error('Get monitoring stats error:', error)
    return c.json({
      error: 'Failed to get monitoring stats',
      message: error.message
    }, 500)
  }
})

// POST /api/yellow/monitoring/start - Start channel monitoring (dev endpoint)
app.post('/monitoring/start', async (c) => {
  try {
    const yellowService = new YellowNetworkService()
    await yellowService.startChannelMonitoring()

    return c.json({
      success: true,
      message: 'Channel monitoring started'
    })
  } catch (error: any) {
    console.error('Start monitoring error:', error)
    return c.json({
      error: 'Failed to start monitoring',
      message: error.message
    }, 500)
  }
})

export default app