#!/usr/bin/env bun

/**
 * Fund both test wallets with Yellow Test USD
 */

const FAUCET_URL = 'https://clearnet-sandbox.yellow.com/faucet/requestTokens'
const wallets = [
  { name: 'Alice', address: '0xF828d107e39E6Ea30953F8c9865D3Ad5D3A7fe66' },
  { name: 'Bob', address: '0x7B51351e96DABed89C311eA720F1dAb163c17fd5' }
]

console.log('💰 Funding both test wallets...\n')

for (const wallet of wallets) {
  try {
    console.log(`📡 Requesting tokens for ${wallet.name} (${wallet.address})...`)
    
    const response = await fetch(FAUCET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAddress: wallet.address })
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`✅ ${wallet.name} funded: ${result.amount} ${result.asset}`)
    } else {
      console.log(`❌ Failed to fund ${wallet.name}`)
    }
  } catch (error) {
    console.log(`❌ Error funding ${wallet.name}:`, error.message)
  }
}

console.log('\n🎉 Both wallets should now be funded!')
console.log('Ready to test complete payment flows! 🚀')
