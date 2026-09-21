"use client"

import Link from "next/link"
import { useState } from "react"

export default function LoansPage() {
  const [loanAmount, setLoanAmount] = useState(25000)
  const [loanTerm, setLoanTerm] = useState(60)
  const rate = 6.99
  const monthlyPayment = (loanAmount * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -loanTerm))

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="landing-nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></svg></div>
              <span className="font-bold text-lg">Chase</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
              <Link href="/register" className="rounded-lg bg-[#0a4fa6] px-4 py-2 text-sm font-semibold text-gray-900 transition-all hover:bg-[#083d80] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]">Open account</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Personal <span className="chase-text-gradient">Loans</span></h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Competitive rates, flexible terms, no hidden fees.</p>
          </div>

          {/* Calculator */}
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-gray-100/60 border border-gray-200 mb-16">
            <h3 className="text-xl font-bold mb-6">Loan Calculator</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-500">Loan Amount</label>
                  <span className="text-sm font-semibold text-[#0a4fa6]">${loanAmount.toLocaleString()}</span>
                </div>
                <input type="range" min="1000" max="100000" step="1000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full accent-[#0a4fa6]" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>$1,000</span><span>$100,000</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-500">Term</label>
                  <span className="text-sm font-semibold text-[#0a4fa6]">{loanTerm} months</span>
                </div>
                <input type="range" min="12" max="84" step="12" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="w-full accent-[#0a4fa6]" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>12 mo</span><span>84 mo</span></div>
              </div>
              <div className="p-4 rounded-xl bg-white/60 border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Estimated Monthly Payment</p>
                <p className="text-3xl font-bold text-gray-900">${monthlyPayment.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">APR: {rate}% • Total interest: ${(monthlyPayment * loanTerm - loanAmount).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Loan Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Personal Loan", rate: "6.99%", amount: "$1K - $100K", term: "12-84 months", icon: "💰" },
              { name: "Auto Loan", rate: "4.49%", amount: "$5K - $100K", term: "36-72 months", icon: "🚗" },
              { name: "Home Improvement", rate: "5.99%", amount: "$5K - $50K", term: "12-60 months", icon: "🏠" },
              { name: "Line of Credit", rate: "7.99%", amount: "$1K - $25K", term: "Revolving", icon: "💳" },
            ].map((product, i) => (
              <div key={i} className="feature-card text-center">
                <div className="text-3xl mb-3">{product.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-[#0a4fa6] mb-2">{product.rate} APR</p>
                <p className="text-xs text-gray-500">{product.amount}</p>
                <p className="text-xs text-gray-500">{product.term}</p>
                <button className="mt-4 w-full py-2 rounded-lg bg-[#0a4fa6]/10 text-[#0a4fa6] text-sm font-semibold hover:bg-[#0a4fa6]/20 transition-colors">Apply</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></svg></div><span className="font-semibold">Chase</span></div>
          <p className="text-xs text-gray-500">© 2026 Chase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
