"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TransactionCompletedPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-primary hover:text-primary/80 text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Completed Transactions
            </h1>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold">ETH → USDC Transaction</div>
                    <div className="text-sm text-muted-foreground font-mono">0x1A2b...3C4</div>
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">Completed</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount: </span>
                  <span className="font-medium text-primary">3 ETH → 7,440 USDC</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Completed: </span>
                  <span>2 days ago</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gas Saved: </span>
                  <span className="text-primary">$0 (Gasless)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold">USDC → ETH Transaction</div>
                    <div className="text-sm text-muted-foreground font-mono">0x5D6e...7F8</div>
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">Completed</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount: </span>
                  <span className="font-medium text-primary">2,500 USDC → 1.05 ETH</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Completed: </span>
                  <span>1 week ago</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gas Saved: </span>
                  <span className="text-primary">$0 (Gasless)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center py-16">
            <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-bold mb-2">12 Successful Contracts</h3>
            <p className="text-muted-foreground mb-6">Perfect execution record with gasless transactions</p>
            <Link href="/history">
              <Button variant="outline" className="border-primary/30 bg-transparent">
                View Full Transaction History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
