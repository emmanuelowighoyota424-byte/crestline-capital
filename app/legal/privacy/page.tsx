'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#0b0f19]" />
              </div>
              <span className="font-bold text-lg text-white">Crestline Capital</span>
            </Link>
            <Link href="/" className="text-sm text-[#94a3b8] hover:text-white">
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-2">Gramm-Leach-Bliley & Privacy Policy</h1>
        <p className="text-xs text-[#94a3b8] mb-8">Effective Date: September 2026</p>

        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 sm:p-10 shadow-xl space-y-6 text-sm text-[#94a3b8] leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Scope of Privacy Notice</h2>
            <p>
              This privacy notice outlines how Crestline Capital and its affiliates collect, safeguard, and share personal nonpublic financial information under Title V of the Gramm-Leach-Bliley Act (GLBA) and California Consumer Privacy Act (CCPA).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Information We Collect</h2>
            <p>
              We collect information provided directly during onboarding: legal identification documents, Social Security Numbers, tax identifiers, financial transaction logs, device hardware telemetry, and biometric authentication credentials. Biometric data (FaceID, fingerprints) remains encrypted locally in hardware secure enclaves and is never transmitted to Crestline servers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Zero Selling of Personal Data</h2>
            <p>
              Crestline Capital does not sell, rent, or trade your personal or financial data to third-party data brokers or marketing networks under any circumstances. Information is exchanged exclusively with authorized payment processors, clearing banks, and regulatory oversight authorities for statutory compliance and settlement operations.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
