"use client"

import { useState } from "react"
import Link from "next/link"

export default function DisputeSettingsPage() {
  const [disputeEnabled, setDisputeEnabled] = useState(true)
  const [arbitrator, setArbitrator] = useState("automatic")

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="floating-particles">
          <div className="particle" style={{ left: "15%", animationDelay: "0s" }}></div>
          <div className="particle" style={{ left: "25%", animationDelay: "1s" }}></div>
          <div className="particle" style={{ left: "35%", animationDelay: "2s" }}></div>
          <div className="particle" style={{ left: "45%", animationDelay: "3s" }}></div>
          <div className="particle" style={{ left: "55%", animationDelay: "4s" }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/create/contract-upload"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Contract Upload
          </Link>
          <div className="text-muted-foreground text-sm">Step 4 of 6</div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-primary rounded border-2 border-primary flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Enable dispute resolution mechanism</h1>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8 mb-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Dispute Resolution Options</h2>
              <p className="text-muted-foreground mb-6">
                Choose how disputes will be handled if they arise during the escrow period.
              </p>

              <div className="space-y-4">
                <label className="flex items-center p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="arbitrator"
                    value="automatic"
                    checked={arbitrator === "automatic"}
                    onChange={(e) => setArbitrator(e.target.value)}
                    className="mr-4 accent-primary"
                  />
                  <div>
                    <div className="text-foreground font-medium">Automatic Resolution</div>
                    <div className="text-muted-foreground text-sm">
                      AI-powered dispute resolution based on contract terms
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="arbitrator"
                    value="human"
                    checked={arbitrator === "human"}
                    onChange={(e) => setArbitrator(e.target.value)}
                    className="mr-4 accent-primary"
                  />
                  <div>
                    <div className="text-foreground font-medium">Human Arbitrator</div>
                    <div className="text-muted-foreground text-sm">
                      Professional arbitrator reviews and decides disputes
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="arbitrator"
                    value="mutual"
                    checked={arbitrator === "mutual"}
                    onChange={(e) => setArbitrator(e.target.value)}
                    className="mr-4 accent-primary"
                  />
                  <div>
                    <div className="text-foreground font-medium">Mutual Agreement</div>
                    <div className="text-muted-foreground text-sm">Both parties must agree to resolve the dispute</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Dispute Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="text-primary font-medium">Filing Period</div>
                  <div className="text-muted-foreground text-sm">7 days after escrow release</div>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="text-primary font-medium">Resolution Time</div>
                  <div className="text-muted-foreground text-sm">3-5 business days</div>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="text-primary font-medium">Appeal Window</div>
                  <div className="text-muted-foreground text-sm">48 hours after decision</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link
              href="/create/contract-upload"
              className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              Previous: Contract Upload
            </Link>
            <Link
              href="/create/review"
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-300 transform hover:scale-105 glow-primary"
            >
              Continue to Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
