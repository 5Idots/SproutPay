"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, MessageSquare, FileText, ArrowLeft } from "lucide-react"

export default function DisputeSubmittedPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "20%", animationDuration: "8s" }}></div>
        <div className="particle" style={{ left: "80%", animationDuration: "6s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/payment/dispute">
            <Button variant="ghost" size="lg" className="smooth-transition hover-lift">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Dispute Submitted</h1>
        </div>

        <div className="text-center space-y-8">
          <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto glow-primary">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4 text-primary">Dispute Successfully Submitted</h2>
            <p className="text-xl text-muted-foreground">Your dispute has been received and is under review</p>
          </div>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-center gap-3">
                <FileText className="w-7 h-7 text-primary" />
                Dispute Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/20 rounded-xl p-6 border border-primary/20">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-accent">DISP-789</div>
                    <div className="text-sm text-muted-foreground">Dispute ID</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">4,980 USDC</div>
                    <div className="text-sm text-muted-foreground">Disputed Amount</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span>December 15, 2024 at 4:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason:</span>
                  <span>Service not delivered</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Resolution:</span>
                  <span>3-5 business days</span>
                </div>
              </div>

              <Badge className="w-full justify-center py-3 text-lg bg-orange-500/20 text-orange-500 border-orange-500/30">
                <Clock className="w-5 h-5 mr-2" />
                Under Review
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-blue-500 mb-4">What Happens Next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    1
                  </div>
                  <p className="text-muted-foreground">Our team will review your dispute within 24 hours</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    2
                  </div>
                  <p className="text-muted-foreground">We may contact you for additional information</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    3
                  </div>
                  <p className="text-muted-foreground">A resolution will be provided within 3-5 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-6">
            <Link href="/dashboard">
              <Button className="h-14 px-12 text-lg glow-primary smooth-transition hover-lift">
                Return to Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-14 px-12 text-lg border-blue-500/30 text-blue-500 smooth-transition hover-lift bg-transparent"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
