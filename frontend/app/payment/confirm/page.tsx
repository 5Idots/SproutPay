"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Loader2, Sparkles, Shield } from "lucide-react"

export default function ConfirmPaymentPage() {
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    setConfirming(true)
    setTimeout(() => {
      setConfirming(false)
      setConfirmed(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "25%", animationDuration: "7s" }}></div>
        <div className="particle" style={{ left: "75%", animationDuration: "9s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/payment/receive">
            <Button variant="ghost" size="lg" className="smooth-transition hover-lift">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Confirm Payment</h1>
        </div>

        {!confirmed ? (
          <div className="text-center space-y-8">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto glow-primary">
              {confirming ? (
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              ) : (
                <Sparkles className="w-16 h-16 text-primary pulse-glow" />
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">{confirming ? "Processing Payment..." : "Ready to Claim"}</h2>
              <p className="text-xl text-muted-foreground">
                {confirming ? "Please wait while we process your transaction" : "Confirm to receive 4,980 USDC"}
              </p>
            </div>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm glow-primary max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-center gap-3">
                  <Shield className="w-7 h-7 text-primary" />
                  Transaction Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/20 rounded-xl p-6 border border-primary/20">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">4,980 USDC</div>
                      <div className="text-sm text-muted-foreground">You Receive</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">$0.00</div>
                      <div className="text-sm text-muted-foreground">Total Fees</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span>Ethereum Mainnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Fees:</span>
                    <span className="text-accent font-bold">$0.00 (Gasless)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span>~30 seconds</span>
                  </div>
                </div>

                <Badge className="w-full justify-center py-3 text-lg bg-accent/20 text-accent border-accent/30">
                  Smart Contract Protected
                </Badge>
              </CardContent>
            </Card>

            {!confirming && (
              <Button
                onClick={handleConfirm}
                className="h-16 px-16 text-xl font-bold glow-primary smooth-transition hover-lift"
              >
                Confirm & Claim Payment
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center space-y-8">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto glow-primary">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 text-primary">Payment Received!</h2>
              <p className="text-xl text-muted-foreground">4,980 USDC has been transferred to your wallet</p>
            </div>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Transaction confirmed on blockchain</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Funds transferred to your wallet</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Zero fees charged</span>
                </div>
                <div className="bg-muted/20 rounded-xl p-4 mt-6">
                  <p className="text-sm text-muted-foreground">Transaction Hash:</p>
                  <p className="font-mono text-sm text-primary">0x1a2b3c4d5e6f7890abcdef1234567890abcdef12</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-6">
              <Link href="/dashboard">
                <Button className="h-14 px-12 text-lg glow-primary smooth-transition hover-lift">View Dashboard</Button>
              </Link>
              <Link href="/history">
                <Button
                  variant="outline"
                  className="h-14 px-12 text-lg border-accent/30 smooth-transition hover-lift bg-transparent"
                >
                  Payment History
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
