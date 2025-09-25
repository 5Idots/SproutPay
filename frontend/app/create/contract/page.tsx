"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function ContractPage() {
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [contractTerms, setContractTerms] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setContractFile(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Upload Custom Contract</h1>
            <p className="text-xl text-white">Add your employment contract terms</p>
          </div>

          {/* File Upload */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600 mb-8">
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
              <div className="text-6xl mb-4">📄</div>
              <div className="text-xl text-white mb-2">
                {contractFile ? contractFile.name : "Drop your contract here"}
              </div>
              <div className="text-white mb-4">Supports PDF, DOC, DOCX files</div>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="contract-upload"
              />
              <label
                htmlFor="contract-upload"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Choose File
              </label>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-600 mb-8">
            <label className="block text-white text-lg mb-4">Additional Terms (Optional)</label>
            <textarea
              value={contractTerms}
              onChange={(e) => setContractTerms(e.target.value)}
              placeholder="Enter any additional contract terms or conditions..."
              rows={6}
              className="w-full p-4 bg-gray-700/50 text-white placeholder-gray-500 border border-gray-600 rounded-xl outline-none focus:border-purple-400 transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/create/escrow"
              className="px-8 py-4 rounded-2xl text-lg font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Back to Escrow
            </Link>
            <Link
              href="/create/review"
              className={`px-12 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${
                contractFile
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-600 text-white cursor-not-allowed"
              }`}
            >
              Continue to Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
