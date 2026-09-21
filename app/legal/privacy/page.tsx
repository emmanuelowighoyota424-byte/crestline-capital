'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gray-900" />
              </div>
              <span className="font-bold text-lg text-gray-900">Chase</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
                Home
              </Link>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#0a4fa6] px-4 py-2 text-sm font-semibold text-gray-900 transition-all hover:bg-[#083d80] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
              >
                Open account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Gramm-Leach-Bliley & Privacy Policy</h1>
        <p className="text-xs text-gray-500 mb-8">Effective Date: September 2026</p>

        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xl space-y-6 text-sm text-gray-500 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">1. Scope of Privacy Notice</h2>
            <p>
              This privacy notice outlines how Chase and its affiliates collect, safeguard, and share personal nonpublic financial information under Title V of the Gramm-Leach-Bliley Act (GLBA) and California Consumer Privacy Act (CCPA).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">2. Information We Collect</h2>
            <p>
              We collect information provided directly during onboarding: legal identification documents, Social Security Numbers, tax identifiers, financial transaction logs, device hardware telemetry, and biometric authentication credentials. Biometric data (FaceID, fingerprints) remains encrypted locally in hardware secure enclaves and is never transmitted to Chase servers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">3. Zero Selling of Personal Data</h2>
            <p>
              Chase does not sell, rent, or trade your personal or financial data to third-party data brokers or marketing networks under any circumstances. Information is exchanged exclusively with authorized payment processors, clearing banks, and regulatory oversight authorities for statutory compliance and settlement operations.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
