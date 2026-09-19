'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-3xl font-extrabold text-white mb-2">Terms of Service & Deposit Account Agreement</h1>
        <p className="text-xs text-[#94a3b8] mb-8">Last Updated: September 2026</p>

        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 sm:p-10 shadow-xl space-y-6 text-sm text-[#94a3b8] leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Banking Services & Partner Relationship</h2>
            <p>
              Banking services provided by Crestline Capital Partner Bank, Member FDIC. The Crestline Capital Visa® Debit and Credit Cards are issued by our partner financial institutions pursuant to a license from Visa U.S.A. Inc. and may be used anywhere Visa debit cards are accepted.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Account Opening, Identity Verification, and BSA/AML</h2>
            <p>
              To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account. When you apply, we will ask for your legal name, address, date of birth, Social Security Number or Taxpayer Identification Number, and other identifying documents.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Double-Entry Settlement & Ledger Finality</h2>
            <p>
              All transfer authorizations, debit commitments, and settlement events executed within the Crestline Capital platform are immutably recorded via our double-entry ledger architecture. Funds transfer requests submitted past clearing cutoffs will settle on the subsequent Federal Reserve banking day.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. Electronic Fund Transfers (Regulation E Disclosures)</h2>
            <p>
              Under Regulation E, consumers have specific rights regarding unauthorized electronic fund transfers. If you believe your credentials, card, or account access has been compromised, you must notify Crestline Capital immediately via our 24/7 hotline at 1-800-555-0199.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
