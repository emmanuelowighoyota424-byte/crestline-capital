'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function DisclosuresPage() {
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
        <h1 className="text-3xl font-extrabold text-white mb-2">Regulatory Disclosures & FDIC Insurance</h1>
        <p className="text-xs text-[#94a3b8] mb-8">Official Disclosures & Statutory Notices</p>

        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 sm:p-10 shadow-xl space-y-6 text-sm text-[#94a3b8] leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. FDIC Deposit Insurance Coverage</h2>
            <p>
              Crestline Capital is a financial technology company, not an FDIC-insured bank. Banking services and deposit accounts are provided by partner banks, Members FDIC. The standard FDIC deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category. Through our Insured Cash Sweep (ICS) program, eligible deposits can be insured up to $5,000,000 across our partner network.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Equal Housing Lender & Fair Lending</h2>
            <p>
              We conduct all credit evaluations and lending activities in strict accordance with the Equal Credit Opportunity Act (ECOA) and the Fair Housing Act. Crestline Capital does not discriminate based on race, color, religion, national origin, sex, marital status, or age.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Truth in Lending & Annual Percentage Yields (APY)</h2>
            <p>
              Annual Percentage Yields (APY) advertised for High-Yield Savings Accounts (current rate 4.85% APY) are variable and subject to change at any time without prior notice based on prevailing Federal Reserve benchmark rate environments. No minimum opening deposit required.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
