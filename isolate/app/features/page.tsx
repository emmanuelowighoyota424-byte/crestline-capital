'use client'

import Link from 'next/link'
import {
  ShieldCheck,
  Zap,
  ArrowLeftRight,
  TrendingUp,
  CreditCard,
  Lock,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export default function FeaturesPage() {
  const featureList = [
    {
      title: 'Immutable Double-Entry Ledger',
      description: 'Every financial movement is backed by an auditable balanced journal entry where SUM(DEBITS) === SUM(CREDITS). Never worry about balance drift or reconciliation gaps.',
      icon: Layers,
      highlight: 'Institutional Core',
    },
    {
      title: 'Heuristic Fraud Engine',
      description: 'Real-time velocity tracking, geo-distance anomaly detection, and biometric step-up challenges block suspicious transfers before funds leave your vault.',
      icon: Lock,
      highlight: 'Sub-Millisecond Scoring',
    },
    {
      title: 'High-Yield Compounding',
      description: 'Earn 4.85% APY on high-yield cash reserves with automated daily accrual and automated target-date savings buckets.',
      icon: TrendingUp,
      highlight: '4.85% APY',
    },
    {
      title: 'Multi-Rail Payment Gateway',
      description: 'Seamless integration across ACH Same-Day, domestic Fedwire, real-time RTP, and card acquiring rails with unified status tracking.',
      icon: ArrowLeftRight,
      highlight: 'Universal Rails',
    },
    {
      title: 'Dynamic Virtual & Physical Cards',
      description: 'Instant digital card issuance to Apple Pay & Google Wallet, per-card spending limits, merchant lockouts, and one-tap freeze controls.',
      icon: CreditCard,
      highlight: 'Zero Fraud Liability',
    },
    {
      title: 'Role-Based Access & Auditability',
      description: 'Enterprise permission matrices, multi-signatory approvals for corporate accounts, and append-only cryptographic audit logs.',
      icon: ShieldCheck,
      highlight: 'SOC2 & Bank Ready',
    },
  ]

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
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-bold text-xs rounded-xl transition-all"
              >
                Open Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#38bdf8] mb-2 block">
            Platform Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Engineered for Precision & Modern Liquidity
          </h1>
          <p className="text-base text-[#94a3b8] leading-relaxed">
            Built from the ground up on modern double-entry financial primitives, intelligent security heuristics, and high-velocity payment rails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-7 shadow-xl hover:border-[#38bdf8]/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-1 rounded-full">
                      {f.highlight}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2">{f.title}</h2>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{f.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#161e2e] via-[#1a2337] to-[#161e2e] border border-[#1e293b] text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to experience Crestline Capital?</h2>
          <p className="text-sm text-[#94a3b8] max-w-xl mx-auto mb-6">
            Join thousands of individuals and high-growth institutions running their daily liquidity on Crestline.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all"
          >
            <span>Open Verified Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
