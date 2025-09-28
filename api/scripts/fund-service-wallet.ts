#!/usr/bin/env bun

/**
 * Get Sepolia ETH for your SproutPay service wallet
 * This is the ONLY wallet that needs ETH (to pay gas for your users)
 */

const SERVICE_WALLET = '0xE47c582da944a96f76ccFAf14A0BA4163FC259e3'

console.log('🏢 Funding SproutPay Service Wallet...\n')

console.log('💡 **Important**: Only YOUR service wallet needs ETH!')
console.log('   Your users (Alice & Bob) stay 100% gasless! ✨\n')

console.log('🔑 Service Wallet Address:')
console.log(`   ${SERVICE_WALLET}\n`)

console.log('💰 Where to get Sepolia ETH (pick one):')
console.log('=====================================')
console.log('')

console.log('1️⃣  **Sepolia Faucet (Alchemy):**')
console.log('   🌐 https://sepoliafaucet.com/')
console.log('   💧 0.5 ETH per day')
console.log('   ⏱️  Instant')
console.log('')

console.log('2️⃣  **QuickNode Faucet:**')
console.log('   🌐 https://faucet.quicknode.com/ethereum/sepolia')
console.log('   💧 0.1 ETH per request')
console.log('   ⏱️  Very fast')
console.log('')

console.log('3️⃣  **Chainlink Faucet:**')
console.log('   🌐 https://faucets.chain.link/sepolia')
console.log('   💧 0.1 ETH per day')
console.log('   ⏱️  Reliable')
console.log('')

console.log('4️⃣  **Infura Faucet:**')
console.log('   🌐 https://www.infura.io/faucet/sepolia')
console.log('   💧 0.5 ETH per day')
console.log('   ⏱️  Good for larger amounts')
console.log('')

console.log('📋 **Instructions:**')
console.log('===================')
console.log('1. Visit any faucet above')
console.log(`2. Enter this address: ${SERVICE_WALLET}`)
console.log('3. Complete any verification (Twitter, etc.)')
console.log('4. Wait for ETH to arrive (~1-5 minutes)')
console.log('5. Start testing SproutPay with gasless UX!')
console.log('')

console.log('💡 **How much do you need?**')
console.log('============================')
console.log('• For testing: 0.01 ETH (~10 transactions)')
console.log('• For demo: 0.05 ETH (~50 transactions)')  
console.log('• For bizathon: 0.1 ETH (~100 transactions)')
console.log('')

console.log('🎯 **The Magic:**')
console.log('================')
console.log('• You pay tiny gas fees (~$0.001 per transaction)')
console.log('• Users pay ZERO gas fees')
console.log('• You charge service fees (2-3%)')
console.log('• Profit! 🎉')
console.log('')

console.log('⚡ **Once funded, run:**')
console.log('  bun run dev     # Start SproutPay API')
console.log('  bun run testnet:test   # Test gasless payments')
console.log('')

console.log('🚀 Ready to showcase gasless payments at Yellow Bizathon!')