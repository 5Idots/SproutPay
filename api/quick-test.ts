#!/usr/bin/env bun

import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'

interface TestWallets {
  alice: { address: string; privateKey: string }
  bob: { address: string; privateKey: string }
}

async function signMessage(privateKey: string, message: string): Promise<string> {
  console.log('  🔐 Signing message...')
  const account = privateKeyToAccount(privateKey as `0x${string}`)
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http('https://1rpc.io/sepolia') // Use faster RPC
  })
  
  // Add timeout to signing
  const signature = await Promise.race([
    walletClient.signMessage({ message }),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Signing timeout')), 10000)
    )
  ])
  
  console.log('  ✅ Message signed')
  return signature
}

async function quickTest() {
  const API_BASE = 'http://localhost:3001/api'

  try {
    console.log('🚀 Quick API Test')
    
    // Load wallets
    const walletsFile = Bun.file('/Users/itzmaniss/coding/SproutPay/api/test-wallets.json')
    const wallets: TestWallets = await walletsFile.json()
    console.log('✅ Wallets loaded')

    // Test 1: Create payment
    console.log('\n📝 Test 1: Creating payment...')
    const createMessage = JSON.stringify({
      action: 'create_payment_link',
      timestamp: Date.now()
    })
    
    console.log('  🔐 Creating signature...')
    const createSignature = await signMessage(wallets.alice.privateKey, createMessage)
    
    const createPayload = {
      linkType: 'receiver',
      creatorAddress: wallets.alice.address,
      amount: '0.01',
      token: 'ETH',
      chain: 'ethereum',
      escrowType: 'time_locked',
      escrowHours: 24,
      canEarlyRelease: true,
      description: 'Quick test payment',
      signature: createSignature,
      message: createMessage
    }

    console.log('  📤 Sending create request...')
    const createResponse = await fetch(`${API_BASE}/payment-links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload)
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      throw new Error(`Create failed: ${createResponse.status} - ${errorText}`)
    }

    const createResult = await createResponse.json()
    console.log('  ✅ Payment created:', createResult.paymentLink.shortId)

    // Test 2: Accept payment (this is where timeout usually happens)
    console.log('\n🤝 Test 2: Accepting payment...')
    const paymentLink = createResult.paymentLink
    
    const acceptMessage = JSON.stringify({
      action: 'accept_payment',
      linkId: paymentLink.id,
      timestamp: Date.now()
    })
    
    console.log('  🔐 Creating accept signature...')
    const acceptSignature = await signMessage(wallets.bob.privateKey, acceptMessage)
    
    const acceptPayload = {
      acceptorAddress: wallets.bob.address,
      signature: acceptSignature,
      message: acceptMessage
    }

    console.log('  📤 Sending accept request (this might take a while due to Yellow Network)...')
    
    // Use AbortController to timeout the request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    try {
      const acceptResponse = await fetch(`${API_BASE}/payment-links/${paymentLink.shortId}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acceptPayload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!acceptResponse.ok) {
        const errorText = await acceptResponse.text()
        throw new Error(`Accept failed: ${acceptResponse.status} - ${errorText}`)
      }

      const acceptResult = await acceptResponse.json()
      console.log('  ✅ Payment accepted!')
      console.log('  🌐 Yellow Channel:', acceptResult.paymentLink.yellowChannelId)
      console.log('  📊 Status:', acceptResult.paymentLink.status)

    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        console.log('  ⏰ Accept request timed out after 30 seconds')
        console.log('  💡 This likely means Yellow Network session is taking too long')
      } else {
        throw error
      }
    }

    console.log('\n✅ Test completed!')

  } catch (error: any) {
    console.error('❌ Test failed:', error.message)
    if (error.stack) {
      console.error('Stack:', error.stack)
    }
  }
}

quickTest()