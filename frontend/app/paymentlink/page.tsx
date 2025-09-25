"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, QrCode, Share2, Download, Sparkles, Shield, Clock, CheckCircle } from "lucide-react"

export default function PaymentLinkPage() {
  const [paymentLink] = useState("sproutpay.link/pay/xyz123abc")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${paymentLink}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "15%", animationDuration: "7s" }}></div>
        <div className="particle" style={{ left: "85%", animationDuration: "9s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/create">
            <Button variant="ghost" size="lg" className="smooth-transition hover-lift">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Payment Link Generated</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - QR Code & Link */}
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm glow-primary">
            <CardContent className="p-10 text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 glow-primary">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready to Share</h2>
              <p className="text-lg text-muted-foreground mb-8">Send this link to receive your payment</p>

              <div className="w-64 h-64 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 border-4 border-primary/30 cyber-border">
                <QrCode className="w-32 h-32 text-gray-800" />
              </div>

              <div className="bg-muted/30 rounded-2xl p-6 mb-8 border border-accent/30 cyber-border">
                <p className="text-lg font-mono text-accent break-all">{paymentLink}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleCopy}
                  className="h-14 text-lg border-primary/50 glow-primary bg-primary/10 smooth-transition"
                >
                  <Copy className="w-5 h-5 mr-3" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  variant="outline"
                  className="h-14 text-lg border-accent/50 hover:glow-accent bg-transparent smooth-transition"
                >
                  <Share2 className="w-5 h-5 mr-3" />
                  Share
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4 text-muted-foreground hover:text-primary smooth-transition"
              >
                <Download className="w-5 h-5 mr-3" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Right Column - Payment Details */}
          <div className="space-y-6">
            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm glow-accent">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-accent pulse-glow" />
                  Payment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <div className="text-2xl font-bold text-primary">2.5 ETH</div>
                    <div className="text-sm text-muted-foreground">Sender Pays</div>
                    <div className="text-sm text-accent">$8,114 USD</div>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-xl border border-accent/20">
                    <div className="text-2xl font-bold text-accent">8,100 DAI</div>
                    <div className="text-sm text-muted-foreground">You Receive</div>
                    <div className="text-sm text-primary">$8,100 USD</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Conversion:</span>
                    <span className="text-primary font-bold">ETH → DAI</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">All Fees:</span>
                    <span className="text-accent font-bold">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Escrow Period:</span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      30 days
                    </span>
                  </div>
                </div>

                <Badge className="w-full justify-center py-3 text-lg bg-accent/20 text-accent border-accent/30">
                  Cross-Chain Compatible
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Smart contract escrow protection</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>30-day timelock security</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Dispute resolution enabled</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Zero transaction fees</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>EVM chain compatibility</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <Link href="/dashboard">
            <Button className="h-16 px-12 text-xl font-bold glow-primary smooth-transition hover-lift">
              View Dashboard
            </Button>
          </Link>
          <Link href="/payment">
            <Button
              variant="outline"
              className="h-16 px-12 text-xl border-accent/30 bg-transparent smooth-transition hover-lift"
            >
              Payment Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
