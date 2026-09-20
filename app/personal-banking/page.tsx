"use client"

import Link from "next/link"

export default function PersonalBankingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc]">
      <nav className="landing-nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></svg>
              </div>
              <span className="font-bold text-lg">Crestline Capital</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Home</Link>
              <Link href="/login" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Sign in</Link>
              <Link href="/register" className="rounded-lg bg-[#38bdf8] px-4 py-2 text-sm font-semibold text-[#0b0f19] transition-all hover:bg-[#0ea5e9] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]">Open account</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Personal <span className="crestline-text-gradient">Banking</span></h1>
            <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">Banking that works around your life, not the other way around.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Crestline Checking", rate: "No monthly fees", features: ["Free debit card", "Mobile check deposit", "Unlimited transactions", "Early direct deposit", "ATM fee reimbursement"], color: "#38bdf8" },
              { title: "Crestline Savings", rate: "Up to 4.50% APY", features: ["High-yield returns", "No minimum balance", "Automatic round-ups", "Savings goals", "FDIC insured"], color: "#10b981" },
              { title: "Crestline Premium Checking", rate: "Priority service", features: ["Dedicated relationship manager", "Priority customer support", "Enhanced rewards", "Fee-free wire transfers", "Concierge services"], color: "#f59e0b" },
              { title: "Crestline Youth Account", rate: "For ages 13-17", features: ["Parental controls", "Spending limits", "Savings tools", "Financial literacy", "No fees"], color: "#8b5cf6" },
            ].map((account, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#161e2e]/60 border border-[#1e293b] hover:border-[#38bdf8]/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#f8fafc]">{account.title}</h3>
                  <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${account.color}15`, color: account.color }}>{account.rate}</span>
                </div>
                <ul className="space-y-2">
                  {account.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={account.color} strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-2.5 rounded-xl border border-[#1e293b] text-[#f8fafc] text-sm font-semibold hover:border-[#38bdf8]/30 hover:bg-[#0b0f19]/50 transition-all">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1e293b] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></svg>
            </div>
            <span className="font-semibold">Crestline Capital</span>
          </div>
          <p className="text-xs text-[#94a3b8]">© 2026 Crestline Capital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
