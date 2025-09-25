"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, AlertCircle, Zap, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "disputed">("active")

  return (
    <div className="min-h-screen bg-background relative overflow-hidden page-enter">
      <div className="absolute inset-0 grid-bg opacity-20"></div>

      <div className="floating-particles">
        <div className="particle" style={{ left: "15%", animationDuration: "7s" }}></div>
        <div className="particle" style={{ left: "35%", animationDuration: "9s" }}></div>
        <div className="particle" style={{ left: "65%", animationDuration: "6s" }}></div>
        <div className="particle" style={{ left: "85%", animationDuration: "8s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8 stagger-item">
          <h1 className="text-3xl font-bold text-foreground">Your Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/create">
              <Button className="glow-primary btn-animate">
                <Zap className="w-4 h-4 mr-2" />
                Deploy New Contract
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm card-hover stagger-item">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold text-primary">$47.2K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/80 backdrop-blur-sm card-hover stagger-item">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Contracts</p>
                  <p className="text-2xl font-bold text-accent">3</p>
                </div>
                <Shield className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm card-hover stagger-item">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-primary">12</p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted/20 bg-card/80 backdrop-blur-sm card-hover stagger-item">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                </div>
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/transaction-active">
            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm hover:glow-accent transition-all duration-300 cursor-pointer card-hover stagger-item">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Contracts</p>
                    <p className="text-2xl font-bold text-accent">3</p>
                  </div>
                  <Shield className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/transaction-completed">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:glow-primary transition-all duration-300 cursor-pointer card-hover stagger-item">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-primary">12</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/transaction-disputed">
            <Card className="border-muted/20 bg-card/80 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 cursor-pointer card-hover stagger-item">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Disputed</p>
                    <p className="text-2xl font-bold text-foreground">0</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="space-y-4">
          <Link href="/payment/detail">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:glow-primary transition-all duration-300 cursor-pointer card-hover stagger-item">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">Latest Active Payment</div>
                      <div className="text-sm text-muted-foreground font-mono">ETH → USDC Transaction</div>
                    </div>
                  </div>
                  <Badge className="bg-accent/20 text-accent border-accent/30">Funded & Locked</Badge>
                </div>
                <div className="text-sm text-muted-foreground">Click to view all active payments and details</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12 text-center stagger-item">
          <Link href="/">
            <Button variant="ghost" className="text-foreground hover:text-primary btn-animate">
              ← Return to Home Base
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
