#!/usr/bin/env bun

async function simpleTest() {
  const API_BASE = 'http://localhost:3001/api'
  
  try {
    console.log('🧪 Simple API Test')
    
    // Test 1: Create payment with valid address format
    console.log('\n📝 Testing payment creation...')
    
    const createPayload = {
      linkType: 'receiver',
      creatorAddress: '0xB620a4E2e5257A3be3df20A88F3C0E7F944Fa0Ad', // Valid format
      amount: '0.01',
      token: 'ETH',
      chain: 'ethereum',
      escrowType: 'time_locked',
      escrowHours: 24,
      canEarlyRelease: true,
      description: 'Simple test payment',
      signature: '0x' + '1'.repeat(130), // Valid length mock signature
      message: JSON.stringify({ action: 'create_payment_link', timestamp: Date.now() })
    }

    console.log('📤 Sending create request...')
    const createResponse = await fetch(`${API_BASE}/payment-links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload)
    })

    console.log('📬 Response status:', createResponse.status)
    const responseText = await createResponse.text()
    console.log('📬 Response:', responseText.substring(0, 200) + '...')

    if (createResponse.ok) {
      console.log('✅ Payment creation endpoint works!')
    } else {
      console.log('❌ Payment creation failed, but endpoint responds')
    }

  } catch (error: any) {
    console.error('❌ Test failed:', error.message)
  }
}

simpleTest()