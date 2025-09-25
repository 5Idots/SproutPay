"use client"

import Link from "next/link"
import { useState } from "react"

export default function AmountPage() {
  const [amount, setAmount] = useState("")
  const [usdValue, setUsdValue] = useState("0.00")

  const handleAmountChange = (value: string) => {
    setAmount(value)
    // Mock USD conversion - in real app this would be live rates
    const mockRate = 3245.67 // ETH price
    const usd = (Number.parseFloat(value) * mockRate).toFixed(2)
    setUsdValue(isNaN(Number.parseFloat(usd)) ? "0.00" : usd)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Enter Amount</h1>
            <p className="text-xl text-white">Specify how much you want to send</p>
          </div>

          {/* Amount Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600 mb-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⟠</div>
              <div className="text-2xl text-white mb-2">ETH Amount</div>
            </div>

            <div className="relative mb-6">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="w-full text-6xl font-bold text-center bg-transparent text-white placeholder-gray-500 border-none outline-none"
              />
            </div>

            {/* USD Conversion */}
            <div className="text-center">
              <div className="text-3xl font-semibold text-green-400">≈ ${usdValue} USD</div>
              <div className="text-white mt-2">Live conversion rate</div>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {["0.1", "0.5", "1.0", "5.0"].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => handleAmountChange(quickAmount)}
                className="py-3 px-4 rounded-xl bg-gray-700/50 text-white hover:bg-purple-600/50 transition-all duration-300"
              >
                {quickAmount} ETH
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Link
              href="/create/recipient"
              className={`inline-flex items-center px-12 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 ${
                amount && Number.parseFloat(amount) > 0
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-600 text-white cursor-not-allowed"
              }`}
            >
              Continue to Recipient
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
