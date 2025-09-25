"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Shield, AlertCircle, CheckCircle, Eye, MessageSquare } from "lucide-react"

export default function PaymentStatusPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "30%", animationDuration: "8s" }}></div>
        <div className="particle" style={{ left: "70%", animationDuration: "6s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/dashboard">
            <Button variant="ghost" size="lg" className="smooth-transition hover-lift">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Payment Status</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Status Timeline */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Clock className="w-7 h-7 text-primary" />
                  Payment Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-primary">Payment Link Created</h3>
                      <p className="text-muted-foreground">December 15, 2024 at 2:30 PM</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Smart contract deployed with 30-day escrow period
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-primary">Funds Deposited</h3>
                      <p className="text-muted-foreground">December 15, 2024 at 3:45 PM</p>
                      <p className="text-sm text-muted-foreground mt-1">2.5 ETH deposited into escrow contract</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center pulse-glow">
                      <Clock className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-accent">Awaiting Recipient</h3>
                      <p className="text-muted-foreground">Current Status</p>
                      <p className="text-sm text-muted-foreground mt-1">Waiting for recipient to claim 8,100 DAI</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 opacity-50">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-muted-foreground">Payment Complete</h3>
                      <p className="text-muted-foreground">Pending</p>
                      <p className="text-sm text-muted-foreground mt-1">Funds will be released to recipient</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details & Actions */}
          <div className="space-y-6">
            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm glow-accent">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Shield className="w-6 h-6 text-accent" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-accent/10 rounded-xl">
                  <div className="text-2xl font-bold text-accent">8,100 DAI</div>
                  <div className="text-sm text-muted-foreground">Recipient Amount</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original:</span>
                    <span>2.5 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conversion:</span>
                    <span className="text-primary">ETH → DAI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Escrow:</span>
                    <span>28 days remaining</span>
                  </div>
                </div>

                <Badge className="w-full justify-center py-2 bg-accent/20 text-accent border-accent/30">
                  Active Escrow
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/payment/receive">
                  <Button className="w-full h-12 glow-primary smooth-transition">
                    <Eye className="w-5 h-5 mr-2" />
                    View Payment Link
                  </Button>
                </Link>

                <Button variant="outline" className="w-full h-12 border-accent/30 smooth-transition bg-transparent">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Recipient
                </Button>

                <Link href="/payment/dispute">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-orange-500/30 text-orange-500 smooth-transition bg-transparent"
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Dispute Payment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-bold text-green-500">Gasless Transaction</p>
                    <p className="text-sm text-muted-foreground">No fees charged</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
