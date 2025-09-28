"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

export default function HomePage() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet()
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false)

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
    <div className="min-h-screen bg-background relative overflow-x-hidden page-enter">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "10%", animationDuration: "8s" }}></div>
        <div className="particle" style={{ left: "20%", animationDuration: "6s" }}></div>
        <div className="particle" style={{ left: "60%", animationDuration: "10s" }}></div>
        <div className="particle" style={{ left: "80%", animationDuration: "7s" }}></div>
        <div className="particle" style={{ left: "90%", animationDuration: "9s" }}></div>
      </div>

      {/* Header */}
      <header className="border-b border-border/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50 cyber-border">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-foreground font-heading">Sprout</span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                onClick={handleWalletClick}
                className="bg-accent hover:bg-accent/90 text-accent-foreground glow-accent smooth-transition hover-lift btn-animate"
              >
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-7xl relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="text-center lg:text-left stagger-item">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-primary rounded-full pulse-glow"></div>
              <span className="text-sm font-medium text-primary">Built on ERC-7824 Protocol</span>
            </div>

            <h1 className="fluid-heading-xl font-bold mb-8 text-balance font-heading hyphens-none break-words">
              <span className="text-foreground">Crypto payments,</span>
              <br />
              <span className="text-primary">simplified.</span>
            </h1>

            <p className="fluid-text-xl text-foreground mb-10 text-balance max-w-lg mx-auto lg:mx-0 font-sans">
              Send or receive any EVM token, across chains, with military-grade escrow protection.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link href="/create">
                <Button
                  size="lg"
                  className="fluid-btn-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary smooth-transition hover-lift btn-animate"
                >
                  Create Payment Link
                </Button>
              </Link>
              <Link href="/receive">
                <Button
                  variant="outline"
                  size="lg"
                  className="fluid-btn-lg font-semibold border-2 border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 text-accent hover:text-accent smooth-transition hover-lift btn-animate"
                >
                  Track Payment
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center stagger-item">
            <div className="relative w-96 h-96 flex items-center justify-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/ChatGPT%20Image%20Sep%2024%2C%202025%2C%2008_50_11%20PM-2tcftScPiQHQgiFDNq3HzbeSvx7V2q.png"
                alt="Sprout Network - Cross-chain token connections"
                className="w-full h-full object-contain animate-spin-slow"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-10 max-w-7xl">
          <div className="text-center mb-8">
            <p className="text-sm text-primary font-semibold tracking-wide uppercase">Trusted Across Networks</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {[
              { name: "Ethereum", color: "bg-[#627EEA]", letter: "E" },
              { name: "Polygon", color: "bg-[#8247E5]", letter: "P" },
              { name: "Avalanche", color: "bg-[#E84142]", letter: "A" },
              { name: "BNB Chain", color: "bg-[#F3BA2F]", letter: "B" },
              { name: "Arbitrum", color: "bg-[#28A0F0]", letter: "A" },
              { name: "Optimism", color: "bg-[#FF0420]", letter: "O" },
            ].map((chain, index) => (
              <div
                key={chain.name}
                className={`flex items-center gap-3 text-foreground hover:text-foreground smooth-transition stagger-item animate-bounce-subtle`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div
                  className={`w-8 h-8 ${chain.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg hover-lift animate-pulse-slow`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  {chain.letter}
                </div>
                <span className="text-sm font-medium text-foreground">{chain.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for Section */}
      <section className="container mx-auto px-6 py-24 max-w-7xl">
        <div className="text-center mb-16 stagger-item">
          <h2 className="fluid-heading-lg font-bold text-foreground mb-6">Who is Sprout for?</h2>
          <p className="fluid-text-xl text-foreground max-w-3xl mx-auto">
            The simplest way to move value onchain. No middlemen, no locked ecosystems, no guesswork.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "Freelancers & Employers",
              desc: "Secure payments, cross-token flexibility, zero hassle",
              icon: "⭐",
              gradient: "from-primary/10 to-accent/10",
              border: "border-primary/40",
            },
            {
              title: "P2P Traders",
              desc: "Trustless escrow for peer-to-peer trades",
              icon: "🤝",
              gradient: "from-accent/10 to-primary/10",
              border: "border-accent/40",
            },
            {
              title: "Everyday Users",
              desc: "Simple crypto payments for everyone",
              icon: "👥",
              gradient: "from-primary/10 to-accent/10",
              border: "border-primary/40",
            },
            {
              title: "DAOs & Communities",
              desc: "Manage contributor payouts seamlessly",
              icon: "🏛️",
              gradient: "from-accent/10 to-primary/10",
              border: "border-accent/40",
            },
          ].map((item, index) => (
            <Card
              key={item.title}
              className={`p-8 bg-gradient-to-br ${item.gradient} border-2 ${item.border} hover:border-opacity-80 card-hover stagger-item`}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
              <p className="text-foreground leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 stagger-item">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">How it works</h2>
            <p className="text-xl text-foreground">Three simple steps to secure crypto payments</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Connect Wallet",
                desc: "Link your Web3 wallet to get started",
                gradient: "from-primary to-accent",
              },
              {
                step: "2",
                title: "Create/Send Link",
                desc: "Generate a secure payment link to share",
                gradient: "from-accent to-primary",
              },
              {
                step: "3",
                title: "Funds Unlock Securely",
                desc: "Escrow protection with optional token conversion",
                gradient: "from-primary to-accent",
              },
            ].map((item, index) => (
              <div key={item.step} className={`text-center stagger-item`}>
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl glow-primary hover-lift`}
                >
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">{item.title}</h3>
                <p className="text-foreground text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sprout */}
      <section className="container mx-auto px-6 py-24 max-w-7xl">
        <div className="text-center mb-16 stagger-item">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Why Sprout?</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Cross-Token Settlement",
              desc: "Pay in one token, receive in another",
              icon: "🔄",
              gradient: "from-primary/10 to-accent/10",
              border: "border-primary/40",
            },
            {
              title: "Escrow Protection",
              desc: "Release only after timelock or approval",
              icon: "🛡️",
              gradient: "from-accent/10 to-primary/10",
              border: "border-accent/40",
            },
            {
              title: "Trustless Links",
              desc: "No custodians, no middlemen",
              icon: "⚡",
              gradient: "from-primary/10 to-accent/10",
              border: "border-primary/40",
            },
            {
              title: "Gas Auto-Pay",
              desc: "Optional gasless transactions",
              icon: "💎",
              gradient: "from-accent/10 to-primary/10",
              border: "border-accent/40",
            },
          ].map((item, index) => (
            <Card
              key={item.title}
              className={`p-8 bg-gradient-to-br ${item.gradient} border-2 ${item.border} hover:border-opacity-80 card-hover stagger-item`}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
              <p className="text-foreground leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials & Roadmap */}
      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold text-foreground mb-12 font-heading">What users say</h2>
              <div className="space-y-8">
                {[
                  {
                    quote: "Secure payments, cross-token flexibility, zero hassle",
                    name: "Sarah Chen",
                    role: "Web Designer",
                    gradient: "from-primary/10 to-accent/10",
                  },
                  {
                    quote: "Crypto-native escrow for global hires",
                    name: "Marcus Rodriguez",
                    role: "Startup Founder",
                    gradient: "from-accent/10 to-primary/10",
                  },
                ].map((testimonial, index) => (
                  <Card
                    key={testimonial.name}
                    className={`p-8 bg-gradient-to-br ${testimonial.gradient} border-2 border-primary/40 hover:border-primary/60 card-hover`}
                  >
                    <p className="text-foreground mb-6 text-lg leading-relaxed font-sans">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold text-foreground font-heading">{testimonial.name}</div>
                        <div className="text-sm text-foreground font-sans">{testimonial.role}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="animate-fade-in animation-delay-400">
              <h2 className="text-4xl font-bold text-foreground mb-12 font-heading">Roadmap</h2>
              <div className="space-y-8">
                {[
                  { phase: "✓", title: "V1 Payment Links", desc: "Secure escrow payments", status: "complete" },
                  { phase: "2", title: "V2 Multi-Sig", desc: "Team payment approvals", status: "upcoming" },
                  {
                    phase: "3",
                    title: "V3 Fiat On/Off Ramps",
                    desc: "Traditional payment integration",
                    status: "future",
                  },
                ].map((item, index) => (
                  <div key={item.title} className="flex items-center gap-6">
                    <div
                      className={`w-12 h-12 ${item.status === "complete" ? "bg-gradient-to-r from-primary to-accent glow-primary" : "bg-muted"} rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      {item.phase}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-lg font-heading">{item.title}</div>
                      <div className="text-foreground font-sans">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-6 py-24 max-w-5xl text-center">
        <div className="stagger-item">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-8">
            Ready to simplify your crypto payments?
          </h2>
          <p className="text-xl text-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who trust Sprout for secure, gasless payments across any EVM chain.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/create">
              <Button
                size="lg"
                className="h-16 px-10 text-lg font-semibold min-w-[180px] bg-primary hover:bg-primary/90 text-primary-foreground glow-primary smooth-transition hover-lift btn-animate"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="h-16 px-10 text-lg font-semibold min-w-[180px] border-2 border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 text-accent hover:text-accent smooth-transition hover-lift btn-animate"
              >
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
                You'll need to reconnect your wallet to use SproutPay features.
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
