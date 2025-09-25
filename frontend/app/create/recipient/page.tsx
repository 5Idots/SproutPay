"use client"

import Link from "next/link"
import { useState } from "react"

export default function RecipientPage() {
  const [recipient, setRecipient] = useState("")
  const [recipientType, setRecipientType] = useState<"address" | "email" | "ens">("address")

  const isValidInput = () => {
    if (recipientType === "address") {
      return recipient.startsWith("0x") && recipient.length === 42
    }
    if (recipientType === "email") {
      return recipient.includes("@") && recipient.includes(".")
    }
    if (recipientType === "ens") {
      return recipient.includes(".eth")
    }
    return false
  }

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
            <h1 className="text-5xl font-bold text-white mb-4">Enter Recipient</h1>
            <p className="text-xl text-white">Who are you sending this payment to?</p>
          </div>

          {/* Recipient Type Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800/50 rounded-2xl p-2 flex">
              {[
                { type: "address" as const, label: "Wallet Address", icon: "🔗" },
                { type: "email" as const, label: "Email", icon: "📧" },
                { type: "ens" as const, label: "ENS Domain", icon: "🌐" },
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => setRecipientType(type)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                    recipientType === type ? "bg-purple-600 text-white" : "text-white hover:text-white"
                  }`}
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600 mb-8">
            <div className="mb-6">
              <label className="block text-white text-lg mb-4">
                {recipientType === "address" && "Wallet Address"}
                {recipientType === "email" && "Email Address"}
                {recipientType === "ens" && "ENS Domain"}
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={
                  recipientType === "address"
                    ? "0x..."
                    : recipientType === "email"
                      ? "user@example.com"
                      : "username.eth"
                }
                className="w-full text-xl p-4 bg-gray-700/50 text-white placeholder-gray-500 border border-gray-600 rounded-xl outline-none focus:border-purple-400 transition-colors"
              />
            </div>

            {isValidInput() && (
              <div className="flex items-center text-green-400">
                <span className="mr-2">✓</span>
                Valid {recipientType}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Link
              href="/create/escrow"
              className={`inline-flex items-center px-12 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 ${
                isValidInput()
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-600 text-white cursor-not-allowed"
              }`}
            >
              Continue to Escrow
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
