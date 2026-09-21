'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gray-900" />
              </div>
              <span className="font-bold text-lg text-gray-900">Crestline Capital</span>
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
                className="rounded-lg bg-[#D71E28] px-4 py-2 text-sm font-semibold text-gray-900 transition-all hover:bg-[#A31620] hover:shadow-[0_0_20px_rgba(215,30,40,0.3)]"
              >
                Open account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Service & Deposit Account Agreement</h1>
        <p className="text-xs text-gray-500 mb-8">Last Updated: September 2026</p>

        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xl space-y-6 text-sm text-gray-500 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">1. Banking Services & Partner Relationship</h2>
            <p>
              Banking services provided by Crestline Capital Partner Bank, Member FDIC. The Crestline Capital Visa® Debit and Credit Cards are issued by our partner financial institutions pursuant to a license from Visa U.S.A. Inc. and may be used anywhere Visa debit cards are accepted.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">2. Account Opening, Identity Verification, and BSA/AML</h2>
            <p>
              To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account. When you apply, we will ask for your legal name, address, date of birth, Social Security Number or Taxpayer Identification Number, and other identifying documents.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">3. Double-Entry Settlement & Ledger Finality</h2>
            <p>
              All transfer authorizations, debit commitments, and settlement events executed within the Crestline Capital platform are immutably recorded via our double-entry ledger architecture. Funds transfer requests submitted past clearing cutoffs will settle on the subsequent Federal Reserve banking day.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">4. Electronic Fund Transfers (Regulation E Disclosures)</h2>
            <p>
              Under Regulation E, consumers have specific rights regarding unauthorized electronic fund transfers. If you believe your credentials, card, or account access has been compromised, you must notify Crestline Capital immediately via our 24/7 hotline at 1-800-555-0199.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
