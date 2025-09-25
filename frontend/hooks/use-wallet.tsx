"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  chainId: number | null
  balance: string | null
  connectWallet: (walletType: "metamask" | "walletconnect" | "coinbase") => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      // Check if user explicitly disconnected
      const wasDisconnected = localStorage.getItem('wallet_disconnected')
      if (wasDisconnected === 'true') {
        return // Don't auto-reconnect if user explicitly disconnected
      }

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          // Clear the disconnected flag since we're connecting
          localStorage.removeItem('wallet_disconnected')

          // Get chain ID
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setChainId(Number.parseInt(chainId, 16))

          // Get balance
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })
          const balanceInEth = (Number.parseInt(balance, 16) / 1e18).toFixed(4)
          setBalance(balanceInEth)
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const connectWallet = async (walletType: "metamask" | "walletconnect" | "coinbase") => {
    try {
      if (walletType === "metamask") {
        if (!window.ethereum) {
          alert("MetaMask is not installed. Please install MetaMask to continue.")
          return
        }

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          // Clear the disconnected flag since user is manually connecting
          localStorage.removeItem('wallet_disconnected')

          // Get chain ID
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setChainId(Number.parseInt(chainId, 16))

          // Get balance
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })
          const balanceInEth = (Number.parseInt(balance, 16) / 1e18).toFixed(4)
          setBalance(balanceInEth)

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts: string[]) => {
            if (accounts.length === 0) {
              disconnectWallet()
            } else {
              setAddress(accounts[0])
            }
          })

          // Listen for chain changes
          window.ethereum.on("chainChanged", (chainId: string) => {
            setChainId(Number.parseInt(chainId, 16))
          })
        }
      } else if (walletType === "walletconnect") {
        // WalletConnect implementation would go here
        alert("WalletConnect integration coming soon!")
      } else if (walletType === "coinbase") {
        // Coinbase Wallet implementation would go here
        alert("Coinbase Wallet integration coming soon!")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect wallet. Please try again.")
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setChainId(null)
    setBalance(null)
    // Set flag to remember user explicitly disconnected
    localStorage.setItem('wallet_disconnected', 'true')
  }

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (error.code === 4902) {
        const networkConfigs: Record<number, any> = {
          1: { chainName: "Ethereum Mainnet", rpcUrls: ["https://mainnet.infura.io/v3/"] },
          137: { chainName: "Polygon", rpcUrls: ["https://polygon-rpc.com/"] },
          42161: { chainName: "Arbitrum One", rpcUrls: ["https://arb1.arbitrum.io/rpc"] },
          10: { chainName: "Optimism", rpcUrls: ["https://mainnet.optimism.io"] },
        }

        const config = networkConfigs[targetChainId]
        if (config) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{ chainId: `0x${targetChainId.toString(16)}`, ...config }],
          })
        }
      }
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        chainId,
        balance,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
