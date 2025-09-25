import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { WalletProvider } from "@/hooks/use-wallet"
import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sprout - Crypto payments, simplified",
  description: "Send or receive any EVM token, across chains, with military-grade escrow protection.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <WalletProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </WalletProvider>
          {/* <Toaster /> */}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
