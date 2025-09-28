#!/usr/bin/env bun

/**
 * Check what methods are available in the Yellow SDK
 */

try {
  console.log('🔍 Checking Yellow SDK methods...\n')
  
  const yellowSDK = await import('@gryffindors/yellow')
  
  console.log('✅ Yellow SDK imported successfully!')
  console.log('Available exports:', Object.keys(yellowSDK))
  
  if (yellowSDK.createGryffindorsSDK) {
    console.log('\n📋 Creating SDK instance to check methods...')
    
    const sdk = yellowSDK.createGryffindorsSDK({
      wsUrl: "wss://clearnet-sandbox.yellow.com/ws",
      appName: "SproutPay-Test",
      scope: "payments",
      sessionDuration: 3600,
      network: "testnet"
    })
    
    console.log('SDK instance created:', typeof sdk)
    console.log('SDK methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(sdk)))
    
  } else {
    console.log('❌ createGryffindorsSDK not found')
  }
  
} catch (error) {
  console.error('❌ Error checking Yellow SDK:', error.message)
  
  console.log('\n💡 Let\'s check if the package is installed:')
  try {
    const fs = require('fs')
    const packagePath = './node_modules/@gryffindors/yellow/package.json'
    const packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    console.log('Package version:', packageInfo.version)
    console.log('Main entry:', packageInfo.main)
  } catch (fsError) {
    console.log('❌ Package not found or not accessible')
    console.log('Suggestion: Try reinstalling with: bun add @gryffindors/yellow')
  }
}