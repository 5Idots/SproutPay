"use client"

import Link from "next/link"

export default function SharePage() {
  const paymentLink = "https://sprout.app/pay/abc123def456"

  const shareOptions = [
    { name: "Email", icon: "📧", color: "bg-blue-600" },
    { name: "WhatsApp", icon: "💬", color: "bg-green-600" },
    { name: "Telegram", icon: "✈️", color: "bg-cyan-600" },
    { name: "Twitter", icon: "🐦", color: "bg-sky-600" },
    { name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
    { name: "Copy Link", icon: "🔗", color: "bg-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Share Payment Link</h1>
            <p className="text-xl text-gray-300">Choose how to share your payment request</p>
          </div>

          {/* Share Options Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                className={`${option.color} p-6 rounded-2xl text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <div className="text-4xl mb-3">{option.icon}</div>
                <div className="text-lg font-semibold">{option.name}</div>
              </button>
            ))}
          </div>

          {/* Payment Link Preview */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Payment Link Preview</h3>
            <div className="bg-gray-700/50 p-6 rounded-2xl">
              <div className="text-gray-400 text-sm mb-2">💰 Sprout Payment Request</div>
              <div className="text-white font-semibold mb-2">
                You have received a payment request for 2.5 ETH ($8,100.00)
              </div>
              <div className="text-purple-400 font-mono text-sm break-all">{paymentLink}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/paymentlink/qr"
              className="px-8 py-4 rounded-2xl text-lg font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Back to QR Code
            </Link>
            <Link
              href="/dashboard"
              className="px-12 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
