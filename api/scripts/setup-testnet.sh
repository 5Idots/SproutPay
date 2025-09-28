#!/bin/bash

# SproutPay Yellow Network Testnet Setup Script
# ==============================================

echo "🌟 Setting up SproutPay for Yellow Network Testnet..."
echo ""

# Check if .env.testnet exists
if [ ! -f ".env.testnet" ]; then
    echo "❌ .env.testnet file not found!"
    echo "Please create .env.testnet file first."
    exit 1
fi

# Copy testnet env to .env for testing
echo "📋 Copying testnet configuration to .env..."
cp .env.testnet .env

echo "✅ Environment configured for testnet"
echo ""

# Check if database exists
echo "🗄️  Setting up testnet database..."

# Create testnet database (you may need to adjust connection details)
echo "Creating testnet database (sproutpay_testnet)..."
createdb sproutpay_testnet 2>/dev/null || echo "Database might already exist"

# Run database migrations
echo "🔄 Running database migrations..."
bun run db:generate
bun run db:migrate

echo ""
echo "🎯 Testnet Setup Complete!"
echo "=========================="
echo ""
echo "📝 Your test wallet details:"
echo "   Address: 0xE47c582da944a96f76ccFAf14A0BA4163FC259e3"
echo "   Private Key: 0x50e3cf358f7f35f3871e277713e29c51ec8e8f20fbf5797384000dbc1411e78e"
echo ""
echo "🔥 Next steps:"
echo "1. Get FREE Yellow Test USD: bun run testnet:tokens"
echo "2. Start the API server: bun run dev" 
echo "3. Test GASLESS payment links with NO REAL COSTS! 🆓"
echo "4. Build amazing UX for Yellow Bizathon! 🏆"
echo ""
echo "🌐 Useful testnet resources:"
echo "   - Yellow Network Testnet Explorer: https://testnet-explorer.yellow.com"
echo "   - Yellow Network Discord: https://discord.gg/yellow"
echo "   - Testnet Faucet: Get tokens for your address above"
echo ""
echo "⚠️  Remember: This is TESTNET ONLY - never use these keys on mainnet!"