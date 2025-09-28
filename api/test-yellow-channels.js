#!/usr/bin/env bun

const { createGryffindorsSDK, DEFAULT_GRYFFINDORS_CONFIG } = require('@gryffindors/yellow');

console.log('🔍 Testing Yellow Network channels...');

async function testChannels() {
  try {
    const sdk = createGryffindorsSDK({
      ...DEFAULT_GRYFFINDORS_CONFIG,
      wsUrl: 'wss://clearnet-sandbox.yellow.com/ws',
      appName: 'SproutPay-Testnet',
      network: 'testnet'
    });

    console.log('✅ SDK created with correct wallet');
    
    // Wait a bit for WebSocket connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test session
    console.log('\n🔐 Testing session...');
    const sessionActive = await sdk.isSessionActive();
    console.log('  Session active:', sessionActive);
    
    if (!sessionActive) {
      console.log('  Creating session...');
      await sdk.createApplicationSession();
      console.log('  ✅ Session created');
    }
    
    // Test getting channels
    console.log('\n📋 Getting all channels...');
    const channels = await sdk.getAllChannels();
    console.log('  Channels result:', channels);
    console.log('  Number of channels:', channels?.length || 'none');
    
    if (channels && channels.length > 0) {
      console.log('\n📊 Channel details:');
      channels.forEach((channel, index) => {
        console.log(`  Channel ${index + 1}:`, JSON.stringify(channel, null, 2));
      });
    }
    
    // Test getting balances
    console.log('\n💰 Getting balances...');
    const balances = await sdk.getBalances();
    console.log('  Balances:', balances);
    
    // Test session info
    console.log('\n📋 Getting session info...');
    const sessionInfo = await sdk.getSessionInfo();
    console.log('  Session info:', sessionInfo);
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testChannels();