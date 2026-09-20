"use client"

import Link from "next/link"

export default function ServicesPage() {
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Our <span className="crestline-text-gradient">Services</span></h1>
            <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">Complete financial services designed for modern life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏦", title: "Personal Banking", desc: "Checking, savings, and everyday banking with no hidden fees and competitive rates.", link: "/personal-banking" },
              { icon: "🏢", title: "Business Banking", desc: "Business accounts, payroll, invoicing, and multi-user access for growing companies.", link: "/business-banking" },
              { icon: "💰", title: "Savings & Investments", desc: "High-yield savings, investment portfolios, and retirement planning tools.", link: "/savings-investments" },
              { icon: "💳", title: "Cards", desc: "Debit, credit, and virtual cards with instant controls and rewards.", link: "/cards" },
              { icon: "💸", title: "Transfers & Payments", desc: "Send money instantly with wire, ACH, Zelle, and bill pay.", link: "/personal-banking" },
              { icon: "📋", title: "Loans", desc: "Personal, mortgage, auto, and business loans with transparent terms.", link: "/loans" },
              { icon: "🔐", title: "Security", desc: "Bank-grade encryption, 2FA, fraud detection, and real-time monitoring.", link: "/security" },
            ].map((service, i) => (
              <Link key={i} href={service.link} className="feature-card group cursor-pointer">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-[#f8fafc] mb-2 group-hover:text-[#38bdf8] transition-colors">{service.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{service.desc}</p>
              </Link>
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
