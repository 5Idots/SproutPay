#!/bin/bash

# Start SproutPay API in testnet mode
echo "🚀 Starting SproutPay API in testnet mode..."

# Copy testnet environment
cp .env.testnet .env

# Check if database is ready
echo "📊 Checking database connection..."
bun run db:migrate 2>/dev/null || echo "⚠️ Migration failed - database might not be ready"

# Start the API in development mode
echo "🌟 Starting API server on port 3001..."
echo "📡 Yellow Network: wss://clearnet-sandbox.yellow.com/ws"
echo "💾 Database: sproutpay_testnet"
echo ""
echo "Press Ctrl+C to stop"
echo ""

bun run dev