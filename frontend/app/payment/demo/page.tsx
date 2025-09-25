import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, CheckCircle, Zap, ArrowLeft } from "lucide-react"

export default function PaymentDemoPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 glow-primary">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Incoming Payment
          </h1>
          <p className="text-sm text-muted-foreground font-mono">sproutpay.link/demo-xyz123</p>
        </div>

        {/* Payment Amount Display */}
        <Card className="mb-8 border-primary/20 bg-card/80 backdrop-blur-sm glow-primary">
          <CardContent className="p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-3">8,100 DAI</div>
            <p className="text-muted-foreground mb-4">Auto-converted from 2.5 ETH</p>
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent">
              <Clock className="w-3 h-3 mr-1" />
              Smart Contract Timelock: 30 days
            </Badge>

            {/* Contract visualization */}
            <div className="bg-muted/20 rounded-xl p-4 border border-accent/30">
              <div className="text-xs text-muted-foreground mb-2">Contract Address:</div>
              <div className="font-mono text-xs text-accent">0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4</div>
            </div>
          </CardContent>
        </Card>

        {/* Smart Contract Info */}
        <Card className="mb-8 border-accent/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Escrow Protection Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security Level:</span>
                <span className="text-primary font-medium">Military Grade</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Auto-Release Date:</span>
                <span>October 21, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dispute Window:</span>
                <span>Available until release</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas Optimization:</span>
                <span className="text-accent">Layer 2 Enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button className="w-full h-14 text-lg font-bold glow-primary">
            <CheckCircle className="w-5 h-5 mr-2" />
            Accept & Deploy Escrow
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
          >
            Decline Payment
          </Button>
        </div>

        {/* Network info */}
        <div className="mt-8 bg-muted/20 rounded-xl p-4 border border-primary/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Network:</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-primary">Ethereum Mainnet</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sprout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
