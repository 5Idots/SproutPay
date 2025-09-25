"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Zap,
  Sparkles,
} from "lucide-react"

export default function PaymentPage() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "20%", animationDuration: "8s" }}></div>
        <div className="particle" style={{ left: "80%", animationDuration: "6s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/history">
            <Button variant="ghost" size="lg" className="smooth-transition hover-lift">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Payment Details
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Payment Overview */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm glow-primary">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <DollarSign className="w-7 h-7 text-primary" />
                  Transaction Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-primary mb-2">2.5 ETH</div>
                  <div className="text-2xl text-muted-foreground">$8,114.00 USD</div>
                  <Badge className="mt-4 bg-accent/20 text-accent border-accent/30 text-lg px-6 py-2">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gasless Transaction
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Amount Sent:</span>
                    <span className="font-bold">2.5 ETH</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Recipient Gets:</span>
                    <span className="font-bold text-accent">8,100 DAI</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Exchange Rate:</span>
                    <span>1 ETH = 3,240 DAI</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Gas Fees:</span>
                    <span className="font-bold text-accent">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Platform Fees:</span>
                    <span className="font-bold text-accent">$0.00</span>
                  </div>
                </div>

                <div className="bg-muted/20 rounded-2xl p-6 border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span className="text-lg font-medium">Payment Secured</span>
                  </div>
                  <p className="text-muted-foreground">
                    Funds are safely held in smart contract escrow. Recipient can claim after timelock period.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Shield className="w-6 h-6 text-accent" />
                  Security & Escrow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Escrow Status:</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30">Active & Secured</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Timelock:</span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    28 days remaining
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dispute Resolution:</span>
                  <span className="text-accent">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Early Release:</span>
                  <span className="text-primary">Available</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Details */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Payment Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button className="w-full h-16 text-xl font-bold glow-primary smooth-transition hover-lift">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Release Funds Early
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-16 text-xl border-accent/30 bg-transparent smooth-transition hover-lift"
                >
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  Initiate Dispute
                </Button>

                <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-accent" />
                    <span className="text-lg font-medium">Auto-Release</span>
                  </div>
                  <p className="text-muted-foreground mb-2">Funds will automatically release to recipient on:</p>
                  <div className="text-xl font-bold text-accent">
                    {new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Contract Address</div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">0x742d35Cc6C4C2C3e8D4A1B2F8E9A7B6C5D4E3F2G1H</span>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Transaction Hash</div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">0x8a3f2b1c9d7e6f5a4b3c2d1e0f9g8h7i6j5k4l3m2n1o</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Recipient Address</div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">0x5C2e9F7A8B4D3E6C1A9B8C7D6E5F4A3B2C1D0E9F8G</span>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Network</div>
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      Ethereum Layer 2
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full text-muted-foreground hover:text-primary"
                >
                  {showDetails ? "Hide" : "Show"} Technical Details
                </Button>

                {showDetails && (
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Block Number:</span>
                      <span className="font-mono">18,945,672</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gas Used:</span>
                      <span className="font-mono">0 (Gasless)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confirmations:</span>
                      <span className="font-mono">1,247</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <Link href="/create">
            <Button className="h-16 px-12 text-xl font-bold glow-primary smooth-transition hover-lift">
              <Zap className="w-6 h-6 mr-3" />
              Create New Payment
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="h-16 px-12 text-xl border-accent/30 bg-transparent smooth-transition hover-lift"
            >
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
