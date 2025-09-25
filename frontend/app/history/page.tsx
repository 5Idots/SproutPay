"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, CheckCircle, AlertCircle, DollarSign, Shield, TrendingUp, Zap } from "lucide-react"

export default function HistoryPage() {
  const payments = [
    {
      id: "1",
      type: "sent",
      amount: "5 ETH",
      usdValue: "$12,450.00",
      recipient: "0x742d...8D4",
      status: "completed",
      date: "2024-01-15",
      gasless: true,
    },
    {
      id: "2",
      type: "received",
      amount: "2,500 USDC",
      usdValue: "$2,500.00",
      sender: "0x8A3f...2B1",
      status: "pending",
      date: "2024-01-14",
      gasless: true,
    },
    {
      id: "3",
      type: "sent",
      amount: "2.5 ETH",
      usdValue: "$8,100.00",
      recipient: "0x5C2e...9F7",
      status: "completed",
      date: "2024-01-12",
      gasless: true,
    },
    {
      id: "4",
      type: "received",
      amount: "1,000 USDT",
      usdValue: "$1,000.00",
      sender: "0x9B4a...3E8",
      status: "completed",
      date: "2024-01-10",
      gasless: true,
    },
  ]

  const totalVolume = payments.reduce((sum, payment) => {
    return sum + Number.parseFloat(payment.usdValue.replace(/[$,]/g, ""))
  }, 0)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "15%", animationDuration: "9s" }}></div>
        <div className="particle" style={{ left: "85%", animationDuration: "7s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/">
            <Button variant="ghost" size="lg" className="smooth-transition hover-lift">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Payment History
          </h1>
        </div>

        {/* Stats Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm glow-primary">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Total Volume</p>
                  <p className="text-3xl font-bold text-primary">${totalVolume.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/80 backdrop-blur-sm glow-accent">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Total Payments</p>
                  <p className="text-3xl font-bold text-accent">{payments.length}</p>
                </div>
                <Shield className="w-10 h-10 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Gas Fees Saved</p>
                  <p className="text-3xl font-bold text-primary">$0.00</p>
                </div>
                <Zap className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold text-accent">100%</p>
                </div>
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment List */}
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-primary" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {payments.map((payment, index) => (
                <Link key={payment.id} href="/payment">
                  <div
                    className={`p-8 hover:bg-muted/20 smooth-transition cursor-pointer ${
                      index !== payments.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            payment.type === "sent" ? "bg-accent/20 glow-accent" : "bg-primary/20 glow-primary"
                          }`}
                        >
                          {payment.status === "completed" ? (
                            <CheckCircle
                              className={`w-8 h-8 ${payment.type === "sent" ? "text-accent" : "text-primary"}`}
                            />
                          ) : payment.status === "pending" ? (
                            <Clock className={`w-8 h-8 ${payment.type === "sent" ? "text-accent" : "text-primary"}`} />
                          ) : (
                            <AlertCircle className="w-8 h-8 text-destructive" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl font-bold">
                              {payment.type === "sent" ? "Sent" : "Received"} {payment.amount}
                            </span>
                            {payment.gasless && (
                              <Badge className="bg-accent/20 text-accent border-accent/30 text-sm">Gasless</Badge>
                            )}
                          </div>
                          <div className="text-lg text-muted-foreground">
                            {payment.type === "sent" ? "To" : "From"}:{" "}
                            {payment.type === "sent" ? payment.recipient : payment.sender}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary mb-1">{payment.usdValue}</div>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-base px-4 py-1"
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

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
