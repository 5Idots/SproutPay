'use client'

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useWallet } from "@/hooks/use-wallet"

const ArrowLeft = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

const Shield = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 13c0 5-3.5 7.5-7.5 7.5S5 18 5 13V6l7.5-3L20 6v7Z" />
  </svg>
)

const DollarSign = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const Zap = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </svg>
)

const Sparkles = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
)

const Info = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9,9 0,0a3,3 0 1,1 6,0c0,2 -3,3 -3,3" />
    <path d="m9,17 0.01,0" />
  </svg>
)

export default function CreatePaymentRequestPage() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet()

  // Receiver creates the link - they specify what they want to receive
  const [receiveAmount, setReceiveAmount] = useState("")
  const [receiveToken, setReceiveToken] = useState("USDC")
  const [receiveChain, setReceiveChain] = useState("ethereum")
  const [escrowHours, setEscrowHours] = useState("24")
  const [customHours, setCustomHours] = useState("")
  const [escrowType, setEscrowType] = useState("instant")
  const [customContract, setCustomContract] = useState(false)
  const [disputeResolution, setDisputeResolution] = useState(true)
  const [paymentDescription, setPaymentDescription] = useState("")

  // Modal states
  const [tokenModalOpen, setTokenModalOpen] = useState(false)
  const [escrowModalOpen, setEscrowModalOpen] = useState(false)
  const [contractModalOpen, setContractModalOpen] = useState(false)
  const [disputeModalOpen, setDisputeModalOpen] = useState(false)
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false)

  // Contract details
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [contractTerms, setContractTerms] = useState("")
  const [arbitratorAddress, setArbitratorAddress] = useState("")
  const [arbitrationFee, setArbitrationFee] = useState("0.01")

  // Only EVM-compatible tokens as per ERC-7824
  const evmTokens = [
    // Ethereum
    { symbol: "ETH", name: "Ethereum", price: 2490, icon: "⟠", chain: "ethereum" },
    { symbol: "USDC", name: "USD Coin", price: 1, icon: "💰", chain: "ethereum" },
    { symbol: "USDT", name: "Tether", price: 1, icon: "💵", chain: "ethereum" },
    { symbol: "DAI", name: "Dai Stablecoin", price: 1, icon: "🏛️", chain: "ethereum" },
    { symbol: "WETH", name: "Wrapped Ethereum", price: 2490, icon: "⟠", chain: "ethereum" },

    // Polygon
    { symbol: "MATIC", name: "Polygon", price: 0.87, icon: "🔷", chain: "polygon" },
    { symbol: "USDC", name: "USD Coin (Polygon)", price: 1, icon: "💰", chain: "polygon" },
    { symbol: "WETH", name: "Wrapped Ethereum", price: 2490, icon: "⟠", chain: "polygon" },

    // Arbitrum
    { symbol: "ARB", name: "Arbitrum", price: 0.75, icon: "🔵", chain: "arbitrum" },
    { symbol: "ETH", name: "Ethereum", price: 2490, icon: "⟠", chain: "arbitrum" },
    { symbol: "USDC", name: "USD Coin", price: 1, icon: "💰", chain: "arbitrum" },

    // Optimism
    { symbol: "OP", name: "Optimism", price: 1.85, icon: "🔴", chain: "optimism" },
    { symbol: "ETH", name: "Ethereum", price: 2490, icon: "⟠", chain: "optimism" },
    { symbol: "USDC", name: "USD Coin", price: 1, icon: "💰", chain: "optimism" },

    // BNB Chain
    { symbol: "BNB", name: "BNB", price: 315, icon: "🟡", chain: "bsc" },
    { symbol: "USDT", name: "Tether", price: 1, icon: "💵", chain: "bsc" },
    { symbol: "BUSD", name: "Binance USD", price: 1, icon: "💵", chain: "bsc" },

    // Avalanche
    { symbol: "AVAX", name: "Avalanche", price: 28.5, icon: "🔺", chain: "avalanche" },
    { symbol: "USDC", name: "USD Coin", price: 1, icon: "💰", chain: "avalanche" },
    { symbol: "WAVAX", name: "Wrapped AVAX", price: 28.5, icon: "🔺", chain: "avalanche" },
  ]

  const evmChains = [
    { id: "ethereum", name: "Ethereum", icon: "⟠" },
    { id: "polygon", name: "Polygon", icon: "🔷" },
    { id: "arbitrum", name: "Arbitrum", icon: "🔵" },
    { id: "optimism", name: "Optimism", icon: "🔴" },
    { id: "bsc", name: "BNB Chain", icon: "🟡" },
    { id: "avalanche", name: "Avalanche", icon: "🔺" },
  ]

  const escrowTypes = [
    {
      id: "instant",
      name: "Instant Transfer",
      description: "Direct transfer with no escrow protection",
      icon: "⚡",
      gasless: true
    },
    {
      id: "timelock",
      name: "Time-locked Escrow",
      description: "Funds release automatically after specified time",
      icon: "⏰",
      gasless: true
    }
  ]

  const getTokenPrice = (symbol: string, chain: string) => {
    const token = evmTokens.find((t) => t.symbol === symbol && t.chain === chain)
    return token?.price || 1
  }

  const calculateUsdValue = (amount: string, token: string, chain: string) => {
    const numAmount = Number.parseFloat(amount) || 0
    const price = getTokenPrice(token, chain)
    return (numAmount * price).toLocaleString()
  }

  const selectedToken = evmTokens.find(t => t.symbol === receiveToken && t.chain === receiveChain)
  const selectedChain = evmChains.find(c => c.id === receiveChain)
  const selectedEscrowType = escrowTypes.find(t => t.id === escrowType)

  const handleTokenSelect = (token: typeof evmTokens[0]) => {
    setReceiveToken(token.symbol)
    setReceiveChain(token.chain)
    setTokenModalOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setContractFile(file)
    }
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
    <div className="min-h-screen bg-background relative overflow-hidden page-enter">
      <div className="floating-particles">
        <div className="particle" style={{ left: "10%", animationDuration: "8s" }}></div>
        <div className="particle" style={{ left: "20%", animationDuration: "6s" }}></div>
        <div className="particle" style={{ left: "60%", animationDuration: "10s" }}></div>
        <div className="particle" style={{ left: "80%", animationDuration: "7s" }}></div>
        <div className="particle" style={{ left: "90%", animationDuration: "9s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/">
            <Button variant="ghost" size="lg" className="smooth-transition hover-lift">
              <ArrowLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Request Payment</h1>
            <p className="text-lg text-muted-foreground mt-2">Create a secure payment request link with ERC-7824 escrow</p>
          </div>
        </div>

        {/* Yellow Network Benefits Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg border border-primary/20 stagger-item">
          <div className="flex items-center gap-4 text-center">
            <div className="text-2xl pulse-glow">⚡</div>
            <div className="flex-1">
              <p className="font-semibold text-primary">Powered by Yellow Network + ERC-7824</p>
              <p className="text-sm text-foreground">Gasless • Instant • Secure • Cross-Chain</p>
            </div>
          </div>
        </div>

        {/* Wallet Connection Section */}
        {!isConnected ? (
          <Card className="border-amber-200 bg-amber-50/80 backdrop-blur-sm mb-8 stagger-item">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800">Connect Your Wallet</h3>
                    <p className="text-sm text-amber-700">Required for authentication and payment link creation</p>
                  </div>
                </div>
                <Button
                  onClick={handleWalletClick}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6"
                >
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50/80 backdrop-blur-sm mb-8 stagger-item">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                      <path d="M20 13c0 5-3.5 7.5-7.5 7.5S5 18 5 13V6l7.5-3L20 6v7Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">Wallet Connected</h3>
                    <p className="text-sm text-green-700 font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                  </div>
                </div>
                <Button
                  onClick={handleWalletClick}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-100 px-6"
                >
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Payment Request Form */}
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm stagger-item">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 text-primary">
                <Shield />
                Payment Request Details
              </CardTitle>
              <p className="text-muted-foreground">As the receiver, specify what payment you want to request</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="amount" className="text-lg font-medium text-primary">
                  Amount to Receive
                </Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    value={receiveAmount}
                    onChange={(e) => setReceiveAmount(e.target.value)}
                    placeholder="100.00"
                    className="flex-1 h-14 text-lg border-primary/30 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 smooth-transition"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setTokenModalOpen(true)}
                    className="h-14 px-6 border-primary/30 hover:border-primary hover:ring-2 hover:ring-primary/20 bg-background/50 backdrop-blur-sm smooth-transition hover-lift"
                  >
                    <span className="text-xl mr-2">{selectedToken?.icon}</span>
                    {receiveToken}
                  </Button>
                </div>
                {receiveAmount && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign />
                    ${calculateUsdValue(receiveAmount, receiveToken, receiveChain)} USD
                  </div>
                )}
              </div>

              <div>
                <Label className="text-lg font-medium text-accent">Receive on Chain</Label>
                <div className="mt-2 p-3 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{selectedChain?.icon}</span>
                    <span className="font-medium text-foreground">{selectedChain?.name}</span>
                    <Badge variant="outline" className="text-accent border-accent/30">EVM Compatible</Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-lg font-medium text-primary">
                  Payment Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="e.g., Website design project - Final payment"
                  className="mt-2 border-primary/30 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary/20 smooth-transition"
                />
              </div>

              <div>
                <Label className="text-lg font-medium text-gray-700 flex items-center gap-2">
                  Escrow Protection
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEscrowModalOpen(true)}
                    className="p-1 h-auto"
                  >
                    <Info className="text-yellow-600" />
                  </Button>
                </Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {escrowTypes.map((type) => (
                    <Button
                      key={type.id}
                      onClick={() => setEscrowType(type.id)}
                      className={`group h-auto min-h-[100px] p-4 text-left border smooth-transition hover-lift
                        ${
                          escrowType === type.id
                            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90"
                            : "bg-card text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        }`}
                    >
                      <div className="w-full h-full flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">{type.icon}</span>
                        <div className="flex flex-col items-start space-y-2 flex-1">
                          <span className="font-semibold text-sm leading-tight break-words">{type.name}</span>

                          {type.gasless && (
                            <Badge className={`text-xs ${
                              escrowType === type.id
                                ? "bg-primary-foreground text-primary"
                                : "bg-accent/20 text-accent border-accent/30 group-hover:bg-primary-foreground group-hover:text-primary"
                            }`}>
                              Gasless
                            </Badge>
                          )}

                          <p className="text-xs leading-snug opacity-90 break-words text-wrap">{type.description}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {escrowType === "timelock" && (
                <div>
                  <Label htmlFor="hours" className="text-lg font-medium text-primary">
                    Auto-release After
                  </Label>
                  <Select value={escrowHours} onValueChange={setEscrowHours}>
                    <SelectTrigger className="mt-2 h-12 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="72">3 days</SelectItem>
                      <SelectItem value="168">7 days</SelectItem>
                      <SelectItem value="720">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  {escrowHours === "custom" && (
                    <div className="mt-3">
                      <Label htmlFor="custom-hours" className="text-sm font-medium text-primary">
                        Hours (1-8760)
                      </Label>
                      <Input
                        id="custom-hours"
                        type="number"
                        min="1"
                        max="8760"
                        value={customHours}
                        onChange={(e) => setCustomHours(e.target.value)}
                        placeholder="e.g., 48"
                        className="mt-1 h-10 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Maximum 1 year (8760 hours)</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="contract"
                    checked={customContract}
                    onChange={(e) => {
                      setCustomContract(e.target.checked)
                      if (e.target.checked) setContractModalOpen(true)
                    }}
                    className="w-4 h-4 rounded border-2 border-yellow-400"
                  />
                  <Label htmlFor="contract" className="cursor-pointer">
                    Attach work contract/requirements
                  </Label>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id="dispute"
                    checked={disputeResolution}
                    onChange={(e) => {
                      setDisputeResolution(e.target.checked)
                      if (e.target.checked) setDisputeModalOpen(true)
                    }}
                    className="w-4 h-4 rounded border-2 border-yellow-400"
                  />
                  <Label htmlFor="dispute" className="cursor-pointer">
                    Enable dispute resolution
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Preview & Yellow Benefits */}
          <div className="space-y-6">
            <Card className="border-accent/20 bg-card/80 backdrop-blur-sm glow-accent card-hover stagger-item">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 text-accent">
                  <Sparkles />
                  Yellow Network Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/20 hover-lift">
                    <span className="font-medium text-primary">Gas Fees</span>
                    <Badge className="bg-accent/20 text-accent border-accent/30">FREE</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg border border-accent/20 hover-lift">
                    <span className="font-medium text-accent">Settlement Speed</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Instant</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/20 hover-lift">
                    <span className="font-medium text-primary">Security</span>
                    <Badge className="bg-accent/20 text-accent border-accent/30">ERC-7824</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg border border-accent/20 hover-lift">
                    <span className="font-medium text-accent">Cross-Chain</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Native</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Request Preview */}
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm card-hover stagger-item">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Request Preview</CardTitle>
                <p className="text-sm text-muted-foreground">This is what the payer will see</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-50 to-blue-50 rounded-xl p-6 border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      Pay {receiveAmount || "0"} {receiveToken}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      ≈ ${receiveAmount ? calculateUsdValue(receiveAmount, receiveToken, receiveChain) : "0.00"} USD
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      To: {selectedChain?.name} Network
                    </div>
                  </div>
                  {paymentDescription && (
                    <div className="mt-4 p-3 bg-white/50 rounded-lg">
                      <p className="text-sm text-gray-700">{paymentDescription}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protection:</span>
                    <span className="font-medium">{selectedEscrowType?.name}</span>
                  </div>
                  {escrowType === "timelock" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auto-release:</span>
                      <span className="font-medium">
                        {escrowHours === "custom" ? `${customHours}h` : `${escrowHours}h`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disputes:</span>
                    <span className={`font-medium ${disputeResolution ? "text-green-600" : "text-gray-400"}`}>
                      {disputeResolution ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          {isConnected ? (
            <Link href="/yellow-demo">
              <Button
                className="h-16 px-16 text-xl font-bold glow-primary smooth-transition hover-lift btn-animate bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!receiveAmount || Number.parseFloat(receiveAmount) <= 0}
              >
                <Zap />
                <span className="ml-3">Create Payment Request Link</span>
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleWalletClick}
              className="h-16 px-16 text-xl font-bold glow-primary smooth-transition hover-lift btn-animate bg-amber-600 hover:bg-amber-700 text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
              </svg>
              Connect Wallet to Continue
            </Button>
          )}
        </div>
      </div>

      {/* Escrow Info Modal */}
      <Dialog open={escrowModalOpen} onOpenChange={setEscrowModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              🛡️ ERC-7824 Escrow Protection
            </DialogTitle>
            <DialogDescription>
              Understanding programmable escrow contracts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">What are Custom Contracts?</h4>
              <p className="text-sm text-yellow-700">
                ERC-7824 allows you to add programmable conditions to your escrow. Think of them as "smart rules"
                that automatically control when and how payments are released.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {escrowTypes.map((type) => (
                <div key={type.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold">{type.name}</h5>
                        {type.gasless && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Gasless</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>

                      {/* Examples for each type */}
                      <div className="mt-2 text-xs text-gray-500">
                        {type.id === "timelock" && "Example: 'Release after 7 days automatically'"}
                        {type.id === "approval" && "Example: 'Release only when I approve completion'"}
                        {type.id === "milestone" && "Example: '50% on start, 50% on delivery'"}
                        {type.id === "multisig" && "Example: 'Requires 2 of 3 signatures'"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Token Selection Modal */}
      <Dialog open={tokenModalOpen} onOpenChange={setTokenModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Select Token & Chain</DialogTitle>
            <DialogDescription>
              Choose from EVM-compatible tokens supported by ERC-7824
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] mt-6">
            <div className="space-y-6">
              {evmChains.map((chain) => {
                const chainTokens = evmTokens.filter((token) => token.chain === chain.id)

                return (
                  <div key={chain.id}>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                      <span className="text-xl">{chain.icon}</span>
                      {chain.name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {chainTokens.map((token, index) => (
                        <Button
                          key={`${token.symbol}-${token.chain}-${index}`}
                          variant="outline"
                          onClick={() => handleTokenSelect(token)}
                          className="h-16 flex items-center gap-3 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 text-left justify-start"
                        >
                          <span className="text-2xl">{token.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">{token.symbol}</div>
                            <div className="text-xs text-gray-500 truncate">{token.name}</div>
                            <div className="text-xs text-blue-600">${token.price.toLocaleString()}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Contract Modal */}
      <Dialog open={contractModalOpen} onOpenChange={setContractModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">📄 Contract Requirements</DialogTitle>
            <DialogDescription>
              Attach work specifications, milestones, or delivery requirements
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div>
              <Label className="text-lg font-medium">Contract File (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="contract-upload"
                />
                <Label htmlFor="contract-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <div className="font-medium">
                    {contractFile ? contractFile.name : "Upload work contract or requirements"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, TXT files supported</div>
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="terms" className="text-lg font-medium">
                Work Requirements & Terms
              </Label>
              <Textarea
                id="terms"
                value={contractTerms}
                onChange={(e) => setContractTerms(e.target.value)}
                placeholder="Describe the work to be done, deliverables, deadlines, quality standards, etc..."
                className="mt-2 min-h-32"
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setContractModalOpen(false)
                  setCustomContract(false)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setContractModalOpen(false)}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              >
                Save Contract Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dispute Resolution Modal */}
      <Dialog open={disputeModalOpen} onOpenChange={setDisputeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">⚖️ Dispute Resolution</DialogTitle>
            <DialogDescription>
              Configure arbitration settings for payment disputes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="font-medium text-blue-800 mb-2">How it works:</div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• If work is disputed, either party can initiate arbitration</li>
                <li>• A neutral arbitrator reviews evidence and makes a binding decision</li>
                <li>• Funds are released according to the arbitration outcome</li>
                <li>• Built into ERC-7824 smart contract - fully trustless</li>
              </ul>
            </div>

            <div>
              <Label htmlFor="arbitrator" className="text-lg font-medium">
                Arbitrator Address (Optional)
              </Label>
              <Input
                id="arbitrator"
                value={arbitratorAddress}
                onChange={(e) => setArbitratorAddress(e.target.value)}
                placeholder="0x... (Leave empty for default Yellow Network arbitrator)"
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label htmlFor="arbitration-fee" className="text-lg font-medium">
                Arbitration Fee ({receiveToken})
              </Label>
              <Input
                id="arbitration-fee"
                type="number"
                step="0.001"
                value={arbitrationFee}
                onChange={(e) => setArbitrationFee(e.target.value)}
                className="mt-2 h-12"
              />
              <div className="text-sm text-gray-500 mt-1">
                Paid by the losing party to cover arbitration costs
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDisputeModalOpen(false)
                  setDisputeResolution(false)
                }}
                className="flex-1"
              >
                Disable
              </Button>
              <Button
                onClick={() => setDisputeModalOpen(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Enable Dispute Resolution
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                You'll need to reconnect your wallet to create payment request links.
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
