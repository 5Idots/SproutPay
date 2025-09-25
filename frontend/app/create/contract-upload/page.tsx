"use client"

import { useState } from "react"
import Link from "next/link"

export default function ContractUploadPage() {
  const [dragActive, setDragActive] = useState(false)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "10%", animationDuration: "8s" }}></div>
        <div className="particle" style={{ left: "90%", animationDuration: "6s" }}></div>
        <div className="particle" style={{ left: "30%", animationDuration: "10s" }}></div>
        <div className="particle" style={{ left: "70%", animationDuration: "7s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/create"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Create Payment
          </Link>
          <div className="text-muted-foreground text-sm">Step 3 of 6</div>
        </div>

        {/* Contract Upload Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-primary rounded border-2 border-primary flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Upload custom contract (for employers)</h1>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/20 p-8 mb-8">
            <div className="flex items-center mb-6">
              <svg className="w-6 h-6 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-foreground">Contract Upload</h2>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive ? "border-accent bg-accent/10" : "border-primary/30 hover:border-accent hover:bg-accent/5"
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
              }}
            >
              <div className="mb-6">
                <svg
                  className="w-16 h-16 text-accent mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <h3 className="text-lg text-foreground mb-2">Upload your employment or service contract</h3>
              <p className="text-muted-foreground mb-6">Drag and drop your file here, or click to browse</p>

              <Link
                href="/create/file-browser"
                className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground rounded-lg transition-colors smooth-transition"
              >
                Choose File
              </Link>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              <p>
                <strong>Supported formats:</strong> PDF, DOC, DOCX. This contract will be linked to the payment and
                automatically executed upon escrow completion.
              </p>
            </div>
          </div>

          {/* Dispute Resolution Option */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/20 p-6 mb-8">
            <Link
              href="/create/dispute-settings"
              className="flex items-center justify-between hover:bg-primary/5 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary rounded border-2 border-primary flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground font-medium">Enable dispute resolution mechanism</span>
              </div>
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Link
              href="/create/escrow"
              className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              Previous: Escrow Date
            </Link>
            <Link
              href="/create/review"
              className="px-8 py-3 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg font-medium transition-all duration-300 transform hover:scale-105 glow-primary"
            >
              Continue to Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
