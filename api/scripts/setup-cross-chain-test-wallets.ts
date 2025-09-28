#!/usr/bin/env bun

/**
 * Setup Cross-Chain Test Wallets
 * Creates Alice & Bob with standard testnet tokens for realistic testing
 */

import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts'
import { writeFile } from 'fs/promises'

interface TestWallet {
  name: string
  address: string
  privateKey: string
  role: string
}

interface TestWallets {
  alice: TestWallet
  bob: TestWallet
  charlie?: TestWallet
}

async function setupCrossChainTestWallets() {
  console.log('🚀 Setting up Cross-Chain Test Wallets')
  console.log('=' .repeat(50))
  console.log('')

  // Generate test wallets
  console.log('1️⃣ Generating test wallets...')
  
  const alicePrivateKey = generatePrivateKey()
  const bobPrivateKey = generatePrivateKey()
  
  const wallets: TestWallets = {
    alice: {
      name: 'Alice',
      address: privateKeyToAddress(alicePrivateKey),
      privateKey: alicePrivateKey,
      role: 'Receiver (creates payment links)'
    },
    bob: {
      name: 'Bob', 
      address: privateKeyToAddress(bobPrivateKey),
      privateKey: bobPrivateKey,
      role: 'Payer (accepts payment links)'
    }
  }

  console.log('👩 Alice (Receiver):')
  console.log(`   Address: ${wallets.alice.address}`)
  console.log(`   Private Key: ${wallets.alice.privateKey.slice(0, 8)}...${wallets.alice.privateKey.slice(-6)}`)
  console.log('')
  
  console.log('👨 Bob (Payer):')
  console.log(`   Address: ${wallets.bob.address}`)
  console.log(`   Private Key: ${wallets.bob.privateKey.slice(0, 8)}...${wallets.bob.privateKey.slice(-6)}`)
  console.log('')

  // Save wallets to file
  console.log('2️⃣ Saving wallets to file...')
  await writeFile('./test-wallets.json', JSON.stringify(wallets, null, 2))
  console.log('   ✅ Saved to test-wallets.json')
  console.log('')

  // Display funding instructions
  console.log('3️⃣ FUNDING INSTRUCTIONS - Standard Testnet Tokens')
  console.log('=' .repeat(60))
  console.log('')
  
  console.log('💰 Sepolia ETH (Both wallets need this):')
  console.log('   Faucets:')
  console.log('   • https://sepoliafaucet.com/')
  console.log('   • https://www.alchemy.com/faucets/ethereum-sepolia')
  console.log('   • https://faucet-sepolia.rockx.com/')
  console.log('')
  console.log(`   Alice: ${wallets.alice.address}`)
  console.log(`   Bob: ${wallets.bob.address}`)
  console.log('')

  console.log('🪙 Sepolia USDC (Testnet USD Coin):')
  console.log('   • Get from: https://faucet.circle.com/ (Sepolia)')
  console.log('   • Or use Aave Sepolia faucet')
  console.log('')

  console.log('💎 Sepolia DAI (Testnet DAI):')
  console.log('   • MakerDAO Sepolia faucet')
  console.log('   • Or swap from ETH on testnet DEX')
  console.log('')

  console.log('🌐 Cross-Chain Options:')
  console.log('   • Polygon Mumbai testnet')
  console.log('   • Arbitrum Sepolia')
  console.log('   • Optimism Sepolia')
  console.log('')

  console.log('🎯 TESTING SCENARIOS:')
  console.log('=' .repeat(40))
  console.log('Scenario 1: Alice requests 100 USDC, Bob pays with ETH')
  console.log('Scenario 2: Alice requests 0.1 ETH, Bob pays with DAI')
  console.log('Scenario 3: Cross-chain - Bob pays on Polygon, Alice gets on Ethereum')
  console.log('Scenario 4: Time-locked escrow with early release')
  console.log('')

  console.log('📋 NEXT STEPS:')
  console.log('1. Fund both wallets with Sepolia ETH (required)')
  console.log('2. Get USDC/DAI tokens for testing')
  console.log('3. Run: bun run test:e2e')
  console.log('4. Test cross-chain scenarios')
  console.log('')

  console.log('💡 TIP: You only need small amounts:')
  console.log('   • 0.01-0.05 ETH per wallet')
  console.log('   • 10-100 USDC/DAI for testing')
  console.log('   • Service wallet pays all gas fees!')
  console.log('')
}

setupCrossChainTestWallets()