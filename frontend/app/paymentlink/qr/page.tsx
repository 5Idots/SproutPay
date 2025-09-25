"use client"

import Link from "next/link"

export default function QRCodePage() {
  const paymentLink = "https://sproutpay.app/pay/abc123def456"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">QR Code Generated</h1>
            <p className="text-xl text-white">Share this QR code for easy payment access</p>
          </div>

          {/* QR Code Display */}
          <div className="bg-white rounded-3xl p-8 mb-8 inline-block">
            <div className="w-64 h-64 bg-black rounded-2xl flex items-center justify-center">
              {/* Mock QR Code - in real app this would be generated */}
              <div className="grid grid-cols-8 gap-1">
                {[...Array(64)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Payment Link */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-600 mb-8">
            <div className="text-white mb-2">Payment Link:</div>
            <div className="text-white font-mono text-sm break-all bg-gray-700/50 p-4 rounded-xl">{paymentLink}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-2xl text-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Download QR Code
            </button>
            <Link
              href="/paymentlink/share"
              className="px-8 py-4 rounded-2xl text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Share Options
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-2xl text-lg font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
