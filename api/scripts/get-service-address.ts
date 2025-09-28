#!/usr/bin/env bun

import { privateKeyToAddress } from 'viem/accounts'

// Get service wallet from environment
const privateKey = process.env.YELLOW_PRIVATE_KEY || process.env.SERVICE_WALLET_PRIVATE_KEY

if (!privateKey) {
  console.error('❌ No private key found in environment variables')
  console.error('   Set YELLOW_PRIVATE_KEY or SERVICE_WALLET_PRIVATE_KEY')
  process.exit(1)
}

try {
  // Get address from private key
  const address = privateKeyToAddress(privateKey as `0x${string}`)
  
  console.log('\n🏦 SproutPay Service Wallet')
  console.log('=' .repeat(50))
  console.log(`Address: ${address}`)
  console.log(`Private Key: ${privateKey.slice(0, 8)}...${privateKey.slice(-6)}`)
  console.log('\n💡 Fund this address with Sepolia ETH to pay gas fees')
  console.log('   Recommended amount: 0.1 - 0.5 ETH')
  console.log('\n🔗 Sepolia Faucets:')
  console.log('   • https://sepoliafaucet.com/')
  console.log('   • https://www.alchemy.com/faucets/ethereum-sepolia')
  console.log('   • https://cloud.google.com/application/web3/faucet/ethereum/sepolia')
  console.log('')

} catch (error) {
  console.error('❌ Error creating wallet:', error)
  process.exit(1)
}
