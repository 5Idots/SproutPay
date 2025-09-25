"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWallet } from "@/hooks/use-wallet"

export default function ReceivePage() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet()
  const [paymentUrl, setPaymentUrl] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false)

  const handleCheckPayment = async () => {
    if (!paymentUrl) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPaymentStatus({
        amount: "2,500 DAI",
        usdValue: "$2,500.00",
        receiverAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c",
        senderAddress: "0x5A1Ff0F0e088fB6ed1b3ceD27D863c268e093DF9", // Your test wallet for logic testing
        status: "pending",
        releaseDate: "March 15, 2025",
        daysRemaining: 28,
        sender: "0x5A1F...3DF9", // Display version
        escrowContract: "0xabcd...efgh",
      })
      setLoading(false)
    }, 1500)
  }

  const handleWalletClick = async () => {
    if (isConnected) {
      setDisconnectModalOpen(true)
    } else {
      await connectWallet("metamask")
    }
  }

  const handleDisconnectConfirm = () => {
    disconnectWallet()
    setDisconnectModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "15%", animationDuration: "7s" }}></div>
        <div className="particle" style={{ left: "35%", animationDuration: "9s" }}></div>
        <div className="particle" style={{ left: "65%", animationDuration: "6s" }}></div>
        <div className="particle" style={{ left: "85%", animationDuration: "8s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Check Payment Status
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Enter your unique payment URL to see when funds will be available
          </p>
        </div>

        {/* Optional Wallet Connection Section */}
        <div className="text-center mb-6">
          <Button
            onClick={handleWalletClick}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isConnected
                ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                : "bg-accent hover:bg-accent/90 text-accent-foreground glow-accent smooth-transition hover-lift"
            }`}
          >
            {isConnected ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <path d="M20 13c0 5-3.5 7.5-7.5 7.5S5 18 5 13V6l7.5-3L20 6v7Z" />
                </svg>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </svg>
                Connect Wallet (Optional)
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            {isConnected ? "Connected for enhanced features" : "Connect to access additional payment controls"}
          </p>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Payment URL Lookup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Payment URL or ID</label>
              <Input
                placeholder="sprout.link/pay/xyz123abc or xyz123abc"
                value={paymentUrl}
                onChange={(e) => setPaymentUrl(e.target.value)}
                className="h-12 text-lg bg-background/50"
              />
            </div>

            <Button
              onClick={handleCheckPayment}
              disabled={!paymentUrl || loading}
              className="w-full h-12 text-lg font-semibold glow-primary"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Checking Payment...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5S17.52 5 19 5 21 7.01 21 9.5 18.99 14 15.5 14zm-1-14C7.01 2 5 6.48 5 12s2.01 10 10 10 10-2.01 10-10S17.99 2 12 2zm5 10h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  Check Payment Status
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {paymentStatus && (
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Payment Found</CardTitle>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  {paymentStatus.status === "pending" ? "Escrow Active" : "Available"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <div className="text-2xl font-bold text-primary">{paymentStatus.amount}</div>
                    <div className="text-lg text-muted-foreground">{paymentStatus.usdValue} USD</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Your Wallet Address</label>
                    <div className="text-lg font-mono bg-background/50 p-3 rounded-lg border">
                      {paymentStatus.receiverAddress}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="text-lg">
                      {paymentStatus.status === "pending" ? (
                        <span className="text-accent">
                          Funds will be deposited in {paymentStatus.daysRemaining} days
                        </span>
                      ) : (
                        <span className="text-primary">Ready for withdrawal</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Auto-release: {paymentStatus.releaseDate}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">From</label>
                    <div className="text-lg font-mono">{paymentStatus.sender}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {/* Show payer controls only if connected wallet matches the sender (payer) */}
                {isConnected && address?.toLowerCase() === paymentStatus.senderAddress.toLowerCase() ? (
                  <>
                    <Button className="flex-1 h-12 glow-primary">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      Release Funds Early
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 border-red-300 text-red-600 bg-transparent hover:!bg-red-600 hover:!text-black hover:!border-red-600 transition-all duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                      </svg>
                      Dispute Payment
                    </Button>
                  </>
                ) : (
                  <>
                    <Button disabled className="flex-1 h-12 opacity-50 cursor-not-allowed">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 6l-1.41-1.41L12 10.17 8.41 6.59 7 8l4 4-4 4 1.41 1.41L12 13.83l3.59 3.58L17 16l-4-4 4-4z" />
                      </svg>
                      {isConnected ? "Not the Payer" : "View Only"}
                    </Button>
                    <Button variant="outline" className="flex-1 h-12 border-accent/30 bg-transparent">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                      </svg>
                      Report Issue
                    </Button>
                  </>
                )}
              </div>

              {/* Show payer status info */}
              {isConnected && address?.toLowerCase() === paymentStatus.senderAddress.toLowerCase() && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="font-medium text-blue-800">You are the payer</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    You have control over this payment and can release funds early or initiate a dispute.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Disconnect Wallet Confirmation Modal */}
      <Dialog open={disconnectModalOpen} onOpenChange={setDisconnectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-3">
              ⚠️ Disconnect Wallet
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect your wallet?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Current wallet:</strong> <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              </p>
              <p className="text-sm text-amber-700 mt-2">
                You'll need to reconnect your wallet to check payment status.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDisconnectModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDisconnectConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
