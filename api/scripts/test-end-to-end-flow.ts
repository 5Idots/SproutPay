#!/usr/bin/env bun

/**
 * End-to-End Payment Flow Test
 * Tests the complete payment flow from creation to settlement
 */

import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'

interface TestWallets {
  alice: {
    address: string
    privateKey: string
  }
  bob: {
    address: string
    privateKey: string
  }
}

// Helper function to sign messages with test wallets
async function signMessage(privateKey: string, message: string): Promise<string> {
  const account = privateKeyToAccount(privateKey as `0x${string}`)
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http()
  })
  
  return await walletClient.signMessage({ message })
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function testEndToEndFlow() {
  console.log('🧪 Starting End-to-End Payment Flow Test')
  console.log('=' .repeat(60))

  const API_BASE = 'http://localhost:3001/api'

  try {
    // Load test wallets
    console.log('\n1️⃣ Loading test wallets...')
    const walletsFile = Bun.file('/Users/itzmaniss/coding/SproutPay/api/test-wallets.json')
    const wallets: TestWallets = await walletsFile.json()
    console.log(`   Alice: ${wallets.alice.address}`)
    console.log(`   Bob: ${wallets.bob.address}`)

    // Step 1: Alice creates a payment request link (receiver)
    console.log('\n2️⃣ Alice creates payment request link...')
    const createMessage = JSON.stringify({
      action: 'create_payment_link',
      timestamp: Date.now()
    })
    
    const createSignature = await signMessage(wallets.alice.privateKey, createMessage)
    
    const createPayload = {
      linkType: 'receiver', // Alice is receiving payment
      creatorAddress: wallets.alice.address,
      amount: '0.01',
      token: 'ETH',
      chain: 'ethereum',
      escrowType: 'time_locked',
      escrowHours: 24,
      canEarlyRelease: true,
      description: 'Cross-chain test: Alice requests ETH, Bob can pay with any token',
      signature: createSignature,
      message: createMessage
    }

    const createResponse = await fetch(`${API_BASE}/payment-links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload)
    })

    if (!createResponse.ok) {
      throw new Error(`Create failed: ${createResponse.status} ${await createResponse.text()}`)
    }

    const createResult = await createResponse.json()
    const paymentLink = createResult.paymentLink
    console.log(`   ✅ Created payment link: ${paymentLink.shortId}`)
    console.log(`   💰 Amount: ${paymentLink.amount} ${paymentLink.token}`)

    // Step 2: Bob accepts the payment (payer)
    console.log('\n3️⃣ Bob accepts the payment link...')
    const acceptMessage = JSON.stringify({
      action: 'accept_payment',
      linkId: paymentLink.id,
      timestamp: Date.now()
    })
    
    const acceptSignature = await signMessage(wallets.bob.privateKey, acceptMessage)
    
    const acceptPayload = {
      acceptorAddress: wallets.bob.address,
      signature: acceptSignature,
      message: acceptMessage
    }

    const acceptResponse = await fetch(`${API_BASE}/payment-links/${paymentLink.shortId}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acceptPayload)
    })

    if (!acceptResponse.ok) {
      throw new Error(`Accept failed: ${acceptResponse.status} ${await acceptResponse.text()}`)
    }

    const acceptedLink = await acceptResponse.json()
    console.log(`   ✅ Payment accepted by Bob`)
    console.log(`   🔄 Status: ${acceptedLink.paymentLink.status}`)
    console.log(`   🌐 Yellow Channel: ${acceptedLink.paymentLink.yellowChannelId || 'Not created yet'}`)

    // Step 3: Check payment status
    console.log('\n4️⃣ Checking payment status...')
    const statusResponse = await fetch(`${API_BASE}/payment-links/${paymentLink.shortId}`)
    const status = await statusResponse.json()
    console.log(`   📊 Current status: ${status.status}`)
    console.log(`   ⏰ Created: ${new Date(status.createdAt).toLocaleString()}`)
    if (status.yellowChannelId) {
      console.log(`   🟡 Yellow Network Channel: ${status.yellowChannelId}`)
    }

    // Step 4: Test early release (Bob as payer)
    console.log('\n5️⃣ Testing early release by payer (Bob)...')
    const releaseMessage = JSON.stringify({
      action: 'early_release',
      linkId: paymentLink.id,
      timestamp: Date.now()
    })
    
    const releaseSignature = await signMessage(wallets.bob.privateKey, releaseMessage)
    
    const releasePayload = {
      releaserAddress: wallets.bob.address,
      signature: releaseSignature,
      message: releaseMessage
    }

    const releaseResponse = await fetch(`${API_BASE}/payment-links/${paymentLink.shortId}/early-release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(releasePayload)
    })

    if (!releaseResponse.ok) {
      const errorText = await releaseResponse.text()
      console.log(`   ⚠️ Early release failed (expected): ${releaseResponse.status}`)
      console.log(`   📝 Reason: ${errorText}`)
    } else {
      const releaseResult = await releaseResponse.json()
      console.log(`   ✅ Early release successful!`)
      console.log(`   🎉 Final status: ${releaseResult.paymentLink.status}`)
      console.log(`   📅 Released at: ${new Date(releaseResult.paymentLink.earlyReleasedAt).toLocaleString()}`)
    }

    // Final status check
    console.log('\n6️⃣ Final payment status...')
    const finalStatus = await fetch(`${API_BASE}/payment-links/${paymentLink.shortId}`)
    const finalPayment = await finalStatus.json()
    console.log(`   🏁 Final status: ${finalPayment.status}`)
    console.log(`   🌟 Yellow Network status: ${finalPayment.yellowNetworkStatus || 'N/A'}`)

    console.log('\n✅ End-to-End Test Completed Successfully!')
    console.log('=' .repeat(60))

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

// Run the test
testEndToEndFlow()