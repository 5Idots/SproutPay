#!/usr/bin/env bun

/**
 * Generate a new test wallet for Yellow Network integration
 * This creates a fresh wallet specifically for development/testing
 */

import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts'

console.log('🔑 Generating new test wallet for Yellow Network...\n')

// Generate a new private key
const privateKey = generatePrivateKey()
const address = privateKeyToAddress(privateKey)

console.log('✅ Test Wallet Generated:')
console.log('=======================')
console.log(`Private Key: ${privateKey}`)
console.log(`Address:     ${address}`)
console.log('')

console.log('⚠️  SECURITY NOTES:')
console.log('- This is for TESTNET ONLY - never use on mainnet!')
console.log('- Store the private key securely in your .env.testnet file')
console.log('- Never commit private keys to version control')
console.log('')

console.log('📋 Next Steps:')
console.log('1. Copy the private key to your .env.testnet file:')
console.log(`   YELLOW_PRIVATE_KEY=${privateKey}`)
console.log('')
console.log('2. Fund this wallet with testnet tokens from Yellow Network faucet')
console.log('3. Register this wallet with Yellow Network testnet (if required)')
console.log('')

console.log('🌐 Useful Links:')
console.log('- Yellow Network Testnet: https://testnet.yellow.com')
console.log('- Yellow Network Docs: https://docs.yellow.com')
console.log('- Testnet Faucet: https://faucet.yellow.com (if available)')