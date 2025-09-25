"use client"

import Link from "next/link"
import { useState } from "react"

export default function TokenSelectPage() {
  const [selectedToken, setSelectedToken] = useState("")

  const tokens = [
    { symbol: "ETH", name: "Ethereum", price: "$3,245.67", icon: "⟠" },
    { symbol: "USDC", name: "USD Coin", price: "$1.00", icon: "💰" },
    { symbol: "USDT", name: "Tether", price: "$1.00", icon: "💵" },
    { symbol: "DAI", name: "Dai Stablecoin", price: "$1.00", icon: "🏛️" },
    { symbol: "MATIC", name: "Polygon", price: "$0.87", icon: "🔷" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Select Token to Send</h1>
            <p className="text-xl text-white">Choose from any EVM-compatible token - no DEX required</p>
          </div>

          {/* Token Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => setSelectedToken(token.symbol)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedToken === token.symbol
                    ? "border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25"
                    : "border-gray-600 bg-gray-800/50 hover:border-purple-400"
                }`}
              >
                <div className="text-4xl mb-3">{token.icon}</div>
                <div className="text-xl font-bold text-white mb-1">{token.symbol}</div>
                <div className="text-white mb-2">{token.name}</div>
                <div className="text-green-400 font-semibold">{token.price}</div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Link
              href="/create/amount"
              className={`inline-flex items-center px-12 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 ${
                selectedToken
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-600 text-white cursor-not-allowed"
              }`}
            >
              Continue with {selectedToken || "Token"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
