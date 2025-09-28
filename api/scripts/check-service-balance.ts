#!/usr/bin/env bun

import { createPublicClient, http, formatEther } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAddress } from 'viem/accounts'

// Get service wallet address from environment
const privateKey = process.env.YELLOW_PRIVATE_KEY || process.env.SERVICE_WALLET_PRIVATE_KEY

if (!privateKey) {
  console.error('❌ No private key found in environment variables')
  process.exit(1)
}

const serviceAddress = privateKeyToAddress(privateKey as `0x${string}`)

// Create Sepolia client
const client = createPublicClient({
  chain: sepolia,
  transport: http('https://rpc.sepolia.eth.gateway.fm') // Free public Sepolia RPC
})

async function checkServiceWalletBalance() {
  console.log('💰 Checking Service Wallet Sepolia ETH Balance')
  console.log('=' .repeat(50))
  console.log(`Address: ${serviceAddress}`)
  console.log('')

  try {
    console.log('🔍 Fetching balance from Sepolia network...')
    
    const balance = await client.getBalance({
      address: serviceAddress,
    })

    const balanceInEth = formatEther(balance)
    const balanceNum = parseFloat(balanceInEth)

    console.log(`📊 Current Balance: ${balanceInEth} ETH`)
    console.log('')

    // Check if balance is sufficient
    const minimumRequired = 0.01 // 0.01 ETH should be enough for testing
    const recommendedAmount = 0.1  // 0.1 ETH recommended

    if (balanceNum === 0) {
      console.log('❌ NO BALANCE FOUND')
      console.log('')
      console.log('🔧 Next steps:')
      console.log('1. Visit a Sepolia faucet:')
      console.log('   • https://sepoliafaucet.com/')
      console.log('   • https://www.alchemy.com/faucets/ethereum-sepolia')
      console.log('   • https://cloud.google.com/application/web3/faucet/ethereum/sepolia')
      console.log('2. Request ETH for:', serviceAddress)
      console.log('3. Wait a few minutes for confirmation')
      console.log('4. Run this script again to verify')
    } else if (balanceNum < minimumRequired) {
      console.log('⚠️  LOW BALANCE - May not be sufficient')
      console.log('')
      console.log('💡 Recommendation: Get more Sepolia ETH')
      console.log(`   Minimum needed: ${minimumRequired} ETH`)
      console.log(`   Recommended: ${recommendedAmount} ETH`)
    } else if (balanceNum < recommendedAmount) {
      console.log('✅ SUFFICIENT - But could use more')
      console.log('')
      console.log('💡 You have enough to start testing!')
      console.log(`   Consider getting up to ${recommendedAmount} ETH for extensive testing`)
    } else {
      console.log('🎉 EXCELLENT BALANCE!')
      console.log('')
      console.log('✅ You have plenty of Sepolia ETH for testing')
      console.log('🚀 Ready to run SproutPay API with Yellow Network!')
    }

    console.log('')
    console.log('📈 Gas cost estimates:')
    console.log('• Payment creation: ~0.001 ETH')
    console.log('• Channel settlement: ~0.002 ETH')  
    console.log('• Full payment flow: ~0.005 ETH')
    console.log(`• Your balance covers: ~${Math.floor(balanceNum / 0.005)} full payment flows`)

  } catch (error: any) {
    console.error('❌ Error fetching balance:', error.message)
    console.log('')
    console.log('🔧 This might be due to:')
    console.log('1. Network connection issues')
    console.log('2. RPC endpoint problems')
    console.log('3. Invalid wallet address')
    console.log('')
    console.log('💡 Try again in a few seconds')
  }
}

checkServiceWalletBalance()