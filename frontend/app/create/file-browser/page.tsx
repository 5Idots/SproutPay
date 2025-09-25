"use client"

import { useState } from "react"
import Link from "next/link"

export default function FileBrowserPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const fileTypes = [
    { name: "PDF Documents", extension: ".pdf", icon: "📄" },
    { name: "Word Documents", extension: ".doc,.docx", icon: "📝" },
    { name: "All Supported", extension: ".pdf,.doc,.docx", icon: "📁" },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20"></div>
      <div className="floating-particles">
        <div className="particle" style={{ left: "15%", animationDuration: "9s" }}></div>
        <div className="particle" style={{ left: "85%", animationDuration: "7s" }}></div>
        <div className="particle" style={{ left: "50%", animationDuration: "11s" }}></div>
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
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Choose Contract File</h1>

          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/20 p-8">
            <div className="space-y-4 mb-8">
              {fileTypes.map((type, index) => (
                <label key={index} className="block">
                  <input
                    type="file"
                    accept={type.extension}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSelectedFile(e.target.files[0].name)
                      }
                    }}
                  />
                  <div className="flex items-center p-4 border border-primary/30 rounded-lg hover:border-accent hover:bg-accent/5 cursor-pointer transition-all smooth-transition">
                    <span className="text-2xl mr-4">{type.icon}</span>
                    <div>
                      <div className="text-foreground font-medium">{type.name}</div>
                      <div className="text-muted-foreground text-sm">{type.extension}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {selectedFile && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-accent">Selected: {selectedFile}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Link
                href="/create/contract-upload"
                className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </Link>
              <Link
                href="/create/contract-uploaded"
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedFile
                    ? "bg-primary hover:bg-primary/80 text-primary-foreground transform hover:scale-105 glow-primary"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Upload File
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
