"use client"

import Link from "next/link"

export default function ContractUploadedPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="floating-particles">
          <div className="particle" style={{ left: "10%", animationDelay: "0s" }}></div>
          <div className="particle" style={{ left: "20%", animationDelay: "1s" }}></div>
          <div className="particle" style={{ left: "30%", animationDelay: "2s" }}></div>
          <div className="particle" style={{ left: "40%", animationDelay: "3s" }}></div>
          <div className="particle" style={{ left: "50%", animationDelay: "4s" }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce glow-primary">
              <svg className="w-12 h-12 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Contract Uploaded Successfully!</h1>
            <p className="text-muted-foreground text-lg">
              Your employment contract has been securely uploaded and will be automatically executed upon escrow
              completion.
            </p>
          </div>

          {/* Contract Details */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">File Name:</span>
              <span className="text-foreground font-medium">employment_contract.pdf</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">File Size:</span>
              <span className="text-foreground font-medium">2.4 MB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Upload Time:</span>
              <span className="text-foreground font-medium">Just now</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link
              href="/create/contract-upload"
              className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              Upload Different File
            </Link>
            <Link
              href="/create/dispute-settings"
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-300 transform hover:scale-105 glow-primary"
            >
              Continue to Dispute Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
