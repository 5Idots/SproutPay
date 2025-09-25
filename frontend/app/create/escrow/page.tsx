"use client"

import Link from "next/link"
import { useState } from "react"

export default function EscrowPage() {
  const [escrowDate, setEscrowDate] = useState("")
  const [showCustomContract, setShowCustomContract] = useState(false)

  const quickDates = [
    { label: "1 Day", days: 1 },
    { label: "3 Days", days: 3 },
    { label: "1 Week", days: 7 },
    { label: "2 Weeks", days: 14 },
    { label: "1 Month", days: 30 },
  ]

  const setQuickDate = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    setEscrowDate(date.toISOString().split("T")[0])
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="floating-particles">
          <div className="particle" style={{ left: "10%", animationDelay: "0s" }}></div>
          <div className="particle" style={{ left: "20%", animationDelay: "1s" }}></div>
          <div className="particle" style={{ left: "30%", animationDelay: "2s" }}></div>
          <div className="particle" style={{ left: "40%", animationDelay: "3s" }}></div>
          <div className="particle" style={{ left: "50%", animationDelay: "4s" }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Set Escrow Date</h1>
            <p className="text-xl text-muted-foreground">When should the funds be released?</p>
          </div>

          {/* Quick Date Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {quickDates.map((quick) => (
              <button
                key={quick.days}
                onClick={() => setQuickDate(quick.days)}
                className="py-4 px-6 rounded-xl bg-card/50 text-foreground hover:bg-primary/20 transition-all duration-300 text-lg border border-border"
              >
                {quick.label}
              </button>
            ))}
          </div>

          {/* Custom Date Input */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border mb-8">
            <label className="block text-muted-foreground text-lg mb-4">Or choose a custom date:</label>
            <input
              type="date"
              value={escrowDate}
              onChange={(e) => setEscrowDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full text-xl p-4 bg-secondary/50 text-foreground border border-border rounded-xl outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Custom Contract Option */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Custom Contract</h3>
                <p className="text-muted-foreground">For employers with specific terms</p>
              </div>
              <button
                onClick={() => setShowCustomContract(!showCustomContract)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  showCustomContract
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {showCustomContract ? "Enabled" : "Enable"}
              </button>
            </div>

            {showCustomContract && (
              <Link
                href="/create/contract"
                className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/80 transition-colors"
              >
                Upload Contract
              </Link>
            )}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Link
              href="/create/review"
              className={`inline-flex items-center px-12 py-4 rounded-2xl text-xl font-semibold transition-all duration-300 ${
                escrowDate
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl glow-primary"
                  : "bg-secondary text-secondary-foreground cursor-not-allowed"
              }`}
            >
              Review Payment
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
