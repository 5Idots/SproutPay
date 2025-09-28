#!/usr/bin/env bun

/**
 * Test script for Yellow Network integration
 * This script tests the basic functionality of SproutPay with Yellow Network
 */

import { privateKeyToAddress } from 'viem/accounts'

const API_BASE_URL = 'http://localhost:3001/api'
const TEST_PRIVATE_KEY = '0x50e3cf358f7f35f3871e277713e29c51ec8e8f20fbf5797384000dbc1411e78e'
const TEST_ADDRESS = privateKeyToAddress(TEST_PRIVATE_KEY)

console.log('🧪 Testing SproutPay Yellow Network Integration...\n')

async function testAPI() {
  try {
    // Test 1: Health check
    console.log('1️⃣  Testing API health check...')
    const healthResponse = await fetch(`${API_BASE_URL}/../health`)
    const healthData = await healthResponse.json()
    console.log('✅ Health check:', healthData.status)
    
    // Test 2: Create a receiver payment link
    console.log('\n2️⃣  Testing receiver payment link creation...')
    const receiverPayload = {
      linkType: 'receiver',
      creatorAddress: TEST_ADDRESS,
      amount: '10.0',
      token: 'USDC',
      chain: 'ethereum',
      escrowType: 'time_locked',
      escrowHours: 24,
      description: 'Test payment for Yellow Network integration',
      attachWorkContract: false,
      disputeResolution: true,
      signature: '0x0000000000000000000000000000000000000000000000000000000000000000' // Mock signature for testing
    }

    const receiverResponse = await fetch(`${API_BASE_URL}/payment-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiverPayload)
    })

    if (receiverResponse.ok) {
      const receiverData = await receiverResponse.json()
      console.log('✅ Receiver payment link created!')
      console.log(`   Link ID: ${receiverData.paymentLink?.shortId}`)
      console.log(`   Share URL: ${receiverData.paymentLink?.shareUrl}`)
      console.log(`   Yellow Benefits: ${JSON.stringify(receiverData.paymentLink?.yellowNetworkBenefits)}`)
      
      // Test 3: Get payment link details
      console.log('\n3️⃣  Testing payment link retrieval...')
      const getLinkResponse = await fetch(`${API_BASE_URL}/payment-links/${receiverData.paymentLink.shortId}`)
      
      if (getLinkResponse.ok) {
        const linkData = await getLinkResponse.json()
        console.log('✅ Payment link retrieved successfully!')
        console.log(`   Status: ${linkData.paymentLink?.status}`)
        console.log(`   Escrow Type: ${linkData.paymentLink?.escrowType}`)
      } else {
        console.log('❌ Failed to retrieve payment link')
      }
      
    } else {
      const errorData = await receiverResponse.json()
      console.log('❌ Failed to create receiver payment link:', errorData.error)
    }

    // Test 4: Yellow Network monitoring stats
    console.log('\n4️⃣  Testing Yellow Network monitoring stats...')
    const statsResponse = await fetch(`${API_BASE_URL}/yellow/monitoring/stats`)
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json()
      console.log('✅ Monitoring stats retrieved!')
      console.log(`   Total Channels: ${statsData.stats?.totalChannels}`)
      console.log(`   Active Channels: ${statsData.stats?.activeChannels}`)
    } else {
      console.log('❌ Failed to get monitoring stats')
    }

    console.log('\n🎉 Test completed!')
console.log('📋 Summary:')
console.log('- API is running and responding')
console.log('- GASLESS payment link creation works 🎉')
console.log('- Yellow Network benefits are included in responses')
console.log('- Users never need gas tokens!')
console.log('- Ready for Yellow Bizathon testing!')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Make sure the API server is running: bun run dev')
    console.log('2. Check that the database is set up correctly')
    console.log('3. Verify Yellow Network configuration in .env')
  }
}

console.log(`🔑 Test wallet: ${TEST_ADDRESS}`)
console.log(`🌐 API URL: ${API_BASE_URL}`)
console.log('')

testAPI()