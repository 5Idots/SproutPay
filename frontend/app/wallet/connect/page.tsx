"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WalletConnect() {
  const { isConnected, address, connectWallet } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (isConnected) {
      router.push("/create")
    }
  }, [isConnected, router])

  const handleWalletConnect = async (walletType: "metamask" | "walletconnect" | "coinbase") => {
    await connectWallet(walletType)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "20%", animationDuration: "8s" }}></div>
        <div className="particle" style={{ left: "80%", animationDuration: "6s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-20 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-xl text-muted-foreground">Choose your preferred wallet to get started</p>
        </div>

        <div className="space-y-4 mb-12">
          <Card
            className="border-primary/20 bg-card/50 backdrop-blur-sm card-hover cursor-pointer"
            onClick={() => handleWalletConnect("metamask")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">MetaMask</h3>
                  <p className="text-sm text-muted-foreground">Connect using MetaMask wallet</p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-accent/20 bg-card/50 backdrop-blur-sm card-hover cursor-pointer"
            onClick={() => handleWalletConnect("walletconnect")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">WalletConnect</h3>
                  <p className="text-sm text-muted-foreground">Scan with WalletConnect</p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-primary/20 bg-card/50 backdrop-blur-sm card-hover cursor-pointer"
            onClick={() => handleWalletConnect("coinbase")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Coinbase Wallet</h3>
                  <p className="text-sm text-muted-foreground">Connect with Coinbase Wallet</p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center gap-4">
            <Link href="/create">
              <Button size="lg" className="glow-primary">
                Continue to Create Payment
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
