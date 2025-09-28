#!/usr/bin/env bun

import { createPublicClient, http, formatEther } from 'viem'
import { sepolia } from 'viem/chains'
import { readFile } from 'fs/promises'

interface TestWallet {
  name: string
  address: string
  privateKey: string
  role: string
}

interface TestWallets {
  alice: TestWallet
  bob: TestWallet
}

// Create Sepolia client
const client = createPublicClient({
  chain: sepolia,
  transport: http('https://rpc.sepolia.eth.gateway.fm') // Free public Sepolia RPC
})

async function checkTestWalletBalances() {
  console.log('💰 Checking Test Wallet Balances')
  console.log('=' .repeat(50))

  try {
    // Load test wallets
    const walletsFile = await readFile('./test-wallets.json', 'utf-8')
    const wallets: TestWallets = JSON.parse(walletsFile)

    console.log('\n🔍 Fetching balances from Sepolia network...\n')

    // Check Alice's balance
    console.log('👩 Alice (Receiver):')
    console.log(`   Address: ${wallets.alice.address}`)
    try {
      const aliceBalance = await client.getBalance({
        address: wallets.alice.address as `0x${string}`,
      })
      const aliceEth = formatEther(aliceBalance)
      const aliceNum = parseFloat(aliceEth)
      
      console.log(`   Balance: ${aliceEth} ETH`)
      
      if (aliceNum === 0) {
        console.log('   Status: ❌ NO BALANCE - Needs funding')
      } else if (aliceNum < 0.01) {
        console.log('   Status: ⚠️  LOW BALANCE - Could use more')
      } else {
        console.log('   Status: ✅ SUFFICIENT for testing')
      }
    } catch (error: any) {
      console.log(`   Balance: ❌ Error fetching balance: ${error.message}`)
    }

    console.log('')

    // Check Bob's balance
    console.log('👨 Bob (Payer):')
    console.log(`   Address: ${wallets.bob.address}`)
    try {
      const bobBalance = await client.getBalance({
        address: wallets.bob.address as `0x${string}`,
      })
      const bobEth = formatEther(bobBalance)
      const bobNum = parseFloat(bobEth)
      
      console.log(`   Balance: ${bobEth} ETH`)
      
      if (bobNum === 0) {
        console.log('   Status: ❌ NO BALANCE - Needs funding')
      } else if (bobNum < 0.01) {
        console.log('   Status: ⚠️  LOW BALANCE - Could use more')
      } else {
        console.log('   Status: ✅ SUFFICIENT for testing')
      }
    } catch (error: any) {
      console.log(`   Balance: ❌ Error fetching balance: ${error.message}`)
    }

    console.log('')
    console.log('📋 FUNDING INSTRUCTIONS:')
    console.log('If balances are low, visit these Sepolia faucets:')
    console.log('• https://sepoliafaucet.com/')
    console.log('• https://www.alchemy.com/faucets/ethereum-sepolia')
    console.log('• https://faucet-sepolia.rockx.com/')
    console.log('')
    console.log('💡 You only need 0.01-0.05 ETH per wallet for testing')
    console.log('   (Service wallet pays the real gas fees)')

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log('❌ Test wallets not found!')
      console.log('Run: bun run setup-test-wallets')
    } else {
      console.error('❌ Error checking balances:', error.message)
    }
  }
}

checkTestWalletBalances()