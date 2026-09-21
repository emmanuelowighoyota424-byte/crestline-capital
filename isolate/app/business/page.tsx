'use client'

import Link from 'next/link'
import { Building2, ShieldCheck, CreditCard, ArrowRight, CheckCircle2, Users, FileSpreadsheet } from 'lucide-react'

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#0b0f19]" />
              </div>
              <span className="font-bold text-lg text-white">Crestline Capital</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-bold text-xs rounded-xl"
              >
                Open Business Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#38bdf8] mb-2 block">
            Commercial & Treasury Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Next-Generation Corporate Banking
          </h1>
          <p className="text-base text-[#94a3b8] leading-relaxed">
            Manage startup operating cash, mid-market enterprise payroll, and corporate spend cards with granular controls and multi-user RBAC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-7 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Team Permissions & Dual Sign-Off</h2>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Define custom roles: View-Only, Bookkeeper, Operator, Treasury Manager, and Executive Signer. High-value wire transfers require dual executive approvals.
            </p>
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-7 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Unlimited Employee Spend Cards</h2>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Issue virtual and physical corporate charge cards with customizable daily, monthly, and merchant-category spending caps.
            </p>
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-7 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Real-Time ERP & Ledger Sync</h2>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Sync automatically into QuickBooks, Xero, and NetSuite. Direct programmatic API access with sandbox testing environments.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#161e2e] via-[#1a2337] to-[#161e2e] border border-[#1e293b] rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Upgrade your company’s treasury</h2>
          <p className="text-sm text-[#94a3b8] max-w-lg mx-auto mb-6">
            Accounts protected up to $5,000,000 via our FDIC Insured Sweep Network.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-bold text-sm rounded-xl"
          >
            <span>Apply for Business Banking</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
