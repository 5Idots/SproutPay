#!/usr/bin/env bun

/**
 * Get Yellow Test USD tokens from the official faucet
 * This gives you free testnet tokens to test SproutPay with NO real gas costs!
 */

import { privateKeyToAddress } from 'viem/accounts'

const TEST_PRIVATE_KEY = '0x50e3cf358f7f35f3871e277713e29c51ec8e8f20fbf5797384000dbc1411e78e'
const TEST_ADDRESS = privateKeyToAddress(TEST_PRIVATE_KEY)
const FAUCET_URL = 'https://clearnet-sandbox.yellow.com/faucet/requestTokens'

console.log('💰 Getting Yellow Test USD tokens from faucet...\n')

async function requestTestTokens() {
  try {
    console.log('🔑 Your test wallet:', TEST_ADDRESS)
    console.log('🌐 Faucet URL:', FAUCET_URL)
    console.log('')

    console.log('📡 Requesting tokens from Yellow Network faucet...')
    
    const response = await fetch(FAUCET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAddress: TEST_ADDRESS
      })
    })

    if (response.ok) {
      const result = await response.text()
      console.log('✅ SUCCESS! Tokens requested successfully!')
      console.log('Response:', result)
      console.log('')
      console.log('🎉 You should now have 10 Yellow Test USD in your Clearnode balance!')
      console.log('')
      console.log('📋 Next steps:')
      console.log('1. Start your SproutPay API: bun run dev')
      console.log('2. Test payment links with Yellow Test USD')
      console.log('3. NO REAL GAS FEES - it\'s all free testnet! 🆓')
      console.log('')
      console.log('💡 You can run this script multiple times to get more test tokens')
      
    } else {
      const errorText = await response.text()
      console.log('❌ Failed to request tokens from faucet')
      console.log('Status:', response.status, response.statusText)
      console.log('Error:', errorText)
      console.log('')
      console.log('🔧 Troubleshooting:')
      console.log('1. Check if the faucet is online')
      console.log('2. Verify your wallet address is correct')
      console.log('3. Try again in a few minutes (rate limiting)')
    }

  } catch (error) {
    console.error('❌ Error requesting tokens:', error.message)
    console.log('')
    console.log('🔧 Troubleshooting:')
    console.log('1. Check your internet connection')
    console.log('2. Verify the faucet URL is correct')
    console.log('3. Try again in a few minutes')
  }
}

console.log('🎯 Yellow Network Sandbox - FREE TESTNET TOKENS!')
console.log('===============================================')
console.log('• No real ETH needed!')
console.log('• No real USDC needed!')
console.log('• Test all Yellow Network features for FREE!')
console.log('')

requestTestTokens()