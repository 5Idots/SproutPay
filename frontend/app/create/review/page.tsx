"use client"

import Link from "next/link"

export default function ReviewPage() {
  // Mock data - in real app this would come from state/context
  const paymentData = {
    token: "ETH",
    amount: "2.5",
    usdValue: "8,100.00",
    recipient: "0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C",
    escrowDate: "2024-01-15",
    hasCustomContract: true,
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
            <h1 className="text-5xl font-bold text-foreground mb-4">Review Payment</h1>
            <p className="text-xl text-muted-foreground">Confirm your gasless escrow payment</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Payment Details</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Token</span>
                <span className="text-foreground font-semibold">{paymentData.token}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Amount</span>
                <div className="text-right">
                  <div className="text-foreground font-semibold">
                    {paymentData.amount} {paymentData.token}
                  </div>
                  <div className="text-primary">${paymentData.usdValue}</div>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Recipient</span>
                <span className="text-foreground font-mono text-sm">{paymentData.recipient}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Escrow Release</span>
                <span className="text-foreground font-semibold">{paymentData.escrowDate}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Gas Fees</span>
                <span className="text-primary font-semibold">FREE ✨</span>
              </div>

              {paymentData.hasCustomContract && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Custom Contract</span>
                  <span className="text-accent">📄 Attached</span>
                </div>
              )}
            </div>
          </div>

          {/* Features Highlight */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-3xl p-8 border border-primary/30 mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">✨ SproutPay Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <span className="mr-2">🚀</span>
                Gasless transactions
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="mr-2">🔄</span>
                Cross-token conversion
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="mr-2">🔒</span>
                Secure escrow system
              </div>
              <div className="flex items-center text-muted-foreground">
                <span className="mr-2">⚡</span>
                No DEX required
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/create"
              className="px-8 py-4 rounded-2xl text-lg font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Back to Edit
            </Link>
            <Link
              href="/paymentlink"
              className="px-12 py-4 rounded-2xl text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 glow-primary"
            >
              Create Payment Link
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
