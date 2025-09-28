#!/usr/bin/env bun

/**
 * Generate a complete test scenario with two wallets for SproutPay testing
 * This creates Alice (sender) and Bob (receiver) for full payment flow testing
 */

import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts'

console.log('👥 Generating complete SproutPay test scenario...\n')

// Generate two test wallets
const alicePrivateKey = generatePrivateKey()
const aliceAddress = privateKeyToAddress(alicePrivateKey)

const bobPrivateKey = generatePrivateKey()  
const bobAddress = privateKeyToAddress(bobPrivateKey)

console.log('🎭 Test Scenario Generated!')
console.log('========================')
console.log('')

console.log('👩 ALICE (Sender/Payer):')
console.log('  Private Key:', alicePrivateKey)
console.log('  Address:    ', aliceAddress)
console.log('')

console.log('👨 BOB (Receiver/Payee):')
console.log('  Private Key:', bobPrivateKey)
console.log('  Address:    ', bobAddress)
console.log('')

console.log('🎬 Test Scenarios You Can Run:')
console.log('===============================')
console.log('')

console.log('📋 Scenario 1: Receiver-Created Payment Link')
console.log('1. Bob creates a payment request for $50 USDC')
console.log('2. Bob shares payment link with Alice')
console.log('3. Alice accepts and pays through SproutPay')
console.log('4. Gasless payment via Yellow Network!')
console.log('')

console.log('📋 Scenario 2: Sender-Created Payment Link')
console.log('1. Alice creates a payment to send $25 USDC to Bob')
console.log('2. Alice shares payment link with Bob')
console.log('3. Bob accepts the payment')
console.log('4. Funds transfer via Yellow Network!')
console.log('')

console.log('🔧 Setup Instructions:')
console.log('======================')
console.log('')

console.log('1. Get tokens for BOTH wallets:')
console.log(`   curl -XPOST https://clearnet-sandbox.yellow.com/faucet/requestTokens -d '{"userAddress":"${aliceAddress}"}'`)
console.log(`   curl -XPOST https://clearnet-sandbox.yellow.com/faucet/requestTokens -d '{"userAddress":"${bobAddress}"}'`)
console.log('')

console.log('2. Or use the helper script:')
console.log('   bun run scripts/fund-test-wallets.ts')
console.log('')

console.log('3. Start your API:')
console.log('   bun run dev')
console.log('')

console.log('4. Test payment creation with Bob\'s wallet:')
console.log(`   POST /api/payment-links`)
console.log(`   {`)
console.log(`     "linkType": "receiver",`)
console.log(`     "creatorAddress": "${bobAddress}",`)
console.log(`     "amount": "50.0",`)
console.log(`     "token": "YUSD",`)
console.log(`     "chain": "sepolia",`)
console.log(`     "escrowType": "time_locked",`)
console.log(`     "signature": "0x..."`)
console.log(`   }`)
console.log('')

console.log('5. Test payment acceptance with Alice\'s wallet:')
console.log(`   PUT /api/payment-links/{linkId}/accept`)
console.log(`   {`)
console.log(`     "acceptorAddress": "${aliceAddress}",`)
console.log(`     "signature": "0x..."`)
console.log(`   }`)
console.log('')

console.log('💡 Pro Tips:')
console.log('============')
console.log('• Both wallets will have 10 Yellow Test USD each')
console.log('• All transactions are FREE (no real gas costs)')
console.log('• Perfect for demonstrating gasless UX')
console.log('• Great for Yellow Bizathon demo!')
console.log('')

// Create a helper script to fund both wallets
const fundScript = `#!/usr/bin/env bun

/**
 * Fund both test wallets with Yellow Test USD
 */

const FAUCET_URL = 'https://clearnet-sandbox.yellow.com/faucet/requestTokens'
const wallets = [
  { name: 'Alice', address: '${aliceAddress}' },
  { name: 'Bob', address: '${bobAddress}' }
]

console.log('💰 Funding both test wallets...\\n')

for (const wallet of wallets) {
  try {
    console.log(\`📡 Requesting tokens for \${wallet.name} (\${wallet.address})...\`)
    
    const response = await fetch(FAUCET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAddress: wallet.address })
    })

    if (response.ok) {
      const result = await response.json()
      console.log(\`✅ \${wallet.name} funded: \${result.amount} \${result.asset}\`)
    } else {
      console.log(\`❌ Failed to fund \${wallet.name}\`)
    }
  } catch (error) {
    console.log(\`❌ Error funding \${wallet.name}:\`, error.message)
  }
}

console.log('\\n🎉 Both wallets should now be funded!')
console.log('Ready to test complete payment flows! 🚀')
`

// Write the fund script
await Bun.write('./scripts/fund-test-wallets.ts', fundScript)

console.log('✅ Helper script created: ./scripts/fund-test-wallets.ts')
console.log('')
console.log('🚀 You\'re ready to test the complete SproutPay experience!')