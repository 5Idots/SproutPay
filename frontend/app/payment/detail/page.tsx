import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Clock, CheckCircle, AlertCircle, ExternalLink, Copy } from "lucide-react"

export default function PaymentDetailPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Smart Contract Analysis
          </h1>
        </div>

        {/* Contract Status */}
        <Card className="mb-8 border-primary/20 bg-card/80 backdrop-blur-sm glow-primary">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-primary">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Funds Secured in Escrow</h2>
            <div className="text-4xl font-bold text-primary mb-3">4,980 USDC</div>
            <p className="text-muted-foreground mb-6">Auto-converted from 5 ETH via DEX aggregator</p>
            <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Timelock Active: 28 days remaining
            </Badge>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card className="mb-8 border-accent/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Smart Contract Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground block">Contract Address:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-primary">0x742d35Cc...925a3b8D4</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block">Sender:</span>
                  <span className="font-mono">0x1234...5678</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Recipient:</span>
                  <span className="font-mono">0x9876...4321</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground block">Deployment Date:</span>
                  <span>Sep 21, 2024 14:30 UTC</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Auto-Release:</span>
                  <span>Oct 21, 2024 14:30 UTC</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Cosign Required:</span>
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    ✓ Enabled
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button className="h-14 text-lg font-bold glow-primary">
            <CheckCircle className="w-5 h-5 mr-2" />
            Release Early
          </Button>

          <Button variant="destructive" className="h-14 text-lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            Initiate Dispute
          </Button>
        </div>

        {/* Transaction Timeline */}
        <Card className="mb-8 border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Contract Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-primary rounded-full mt-2 glow-primary"></div>
                <div>
                  <div className="font-medium">Contract Deployed & Funded</div>
                  <div className="text-sm text-muted-foreground">Sep 21, 2024 at 14:30 UTC</div>
                  <div className="text-sm text-primary">5 ETH deposited and converted to 4,980 USDC</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-accent rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Escrow Period Active</div>
                  <div className="text-sm text-muted-foreground">Current status</div>
                  <div className="text-sm text-accent">Awaiting manual release or auto-release in 28 days</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-muted rounded-full mt-2"></div>
                <div>
                  <div className="font-medium text-muted-foreground">Scheduled Auto-Release</div>
                  <div className="text-sm text-muted-foreground">Oct 21, 2024 at 14:30 UTC</div>
                  <div className="text-sm text-muted-foreground">Automatic release if no disputes raised</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Explorer Link */}
        <Card className="border-muted/20 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium mb-1">View on Blockchain Explorer</div>
                <div className="text-sm text-muted-foreground">Verify contract on Etherscan</div>
              </div>
              <Button variant="outline" size="sm" className="border-primary/30 bg-transparent">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Explorer
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              ← Return to Your Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
