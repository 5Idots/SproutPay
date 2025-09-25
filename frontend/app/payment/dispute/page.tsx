"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, MessageSquare, Upload, Shield, Clock } from "lucide-react"

export default function DisputePaymentPage() {
  const [disputeReason, setDisputeReason] = useState("")

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "15%", animationDuration: "9s" }}></div>
        <div className="particle" style={{ left: "85%", animationDuration: "7s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-5xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/payment/status">
            <Button variant="ghost" size="lg" className="smooth-transition hover-lift">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Dispute Resolution</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-orange-500/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <AlertTriangle className="w-7 h-7 text-orange-500" />
                File Dispute
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-orange-500/10 rounded-xl p-6 border border-orange-500/20">
                <h3 className="font-bold text-orange-500 mb-2">Important Notice</h3>
                <p className="text-muted-foreground">
                  Disputes should only be filed if there are legitimate issues with the payment or service. False
                  disputes may result in penalties.
                </p>
              </div>

              <div>
                <label className="text-lg font-medium mb-4 block">Dispute Reason</label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full p-4 text-lg border border-orange-500/30 rounded-xl bg-background/50 backdrop-blur-sm focus:border-orange-500 smooth-transition"
                >
                  <option value="">Select a reason</option>
                  <option value="service-not-delivered">Service not delivered</option>
                  <option value="incomplete-work">Incomplete work</option>
                  <option value="quality-issues">Quality issues</option>
                  <option value="breach-of-contract">Breach of contract</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-lg font-medium mb-4 block">Detailed Description</label>
                <textarea
                  placeholder="Please provide detailed information about the dispute..."
                  rows={6}
                  className="w-full p-4 text-lg border border-orange-500/30 rounded-xl bg-background/50 backdrop-blur-sm focus:border-orange-500 smooth-transition resize-none"
                />
              </div>

              <div>
                <label className="text-lg font-medium mb-4 block">Supporting Evidence</label>
                <div className="border-2 border-dashed border-orange-500/30 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-4">Upload supporting documents</p>
                  <Button variant="outline" className="border-orange-500/50 text-orange-500 bg-transparent">
                    Choose Files
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG. Max 10MB per file.
                </p>
              </div>

              <Link href="/payment/dispute/submitted">
                <Button
                  className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600 smooth-transition"
                  disabled={!disputeReason}
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Submit Dispute
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/20 rounded-xl p-4">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-accent">4,980 USDC</div>
                    <div className="text-sm text-muted-foreground">Disputed Amount</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment ID:</span>
                      <span className="font-mono text-sm">PAY-XYZ123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>Dec 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Escrow:</span>
                      <span>28 days remaining</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Clock className="w-6 h-6 text-accent" />
                  Dispute Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-accent-foreground">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Submit Dispute</p>
                      <p className="text-sm text-muted-foreground">Provide details and evidence</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Review Period</p>
                      <p className="text-sm text-muted-foreground">3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Resolution</p>
                      <p className="text-sm text-muted-foreground">Funds released or returned</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-bold text-blue-500">Need Help?</p>
                    <p className="text-sm text-muted-foreground">
                      Contact our support team for assistance with dispute resolution.
                    </p>
                    <Button variant="ghost" className="text-blue-500 p-0 h-auto mt-2">
                      Get Support →
                    </Button>
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
