"use client"

import Link from "next/link"

export default function BusinessBankingPage() {
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
            <Link href="/" className="text-sm text-[#94a3b8] hover:text-white transition-colors">← Home</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Business <span className="crestline-text-gradient">Banking</span></h1>
            <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">Financial tools built for businesses of every size.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "💳", title: "Business Checking", desc: "Unlimited transactions, multi-user access, and integrated invoicing.", features: ["No monthly fee", "Multi-user", "Invoicing", "API access"] },
              { icon: "🏢", title: "Business Savings", desc: "Earn up to 3.50% APY on your business reserves.", features: ["3.50% APY", "No minimum", "Auto-sweep", "FDIC insured"] },
              { icon: "📊", title: "Treasury Management", desc: "Cash flow forecasting, payments automation, and reporting.", features: ["Forecasting", "Automation", "Reporting", "Integrations"] },
              { icon: "💼", title: "Payroll", desc: "Run payroll in minutes with tax filing and compliance.", features: ["Auto payroll", "Tax filing", "Direct deposit", "1099/W-2"] },
              { icon: "🌐", title: "International", desc: "Multi-currency accounts and international wire transfers.", features: ["Multi-currency", "FX rates", "Global wires", "Compliance"] },
              { icon: "🔗", title: "Integrations", desc: "Connect to QuickBooks, Xero, Stripe, and 100+ tools.", features: ["QuickBooks", "Xero", "Stripe", "APIs"] },
            ].map((service, i) => (
              <div key={i} className="feature-card">
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">{service.title}</h3>
                <p className="text-sm text-[#94a3b8] mb-4">{service.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((f, j) => (
                    <span key={j} className="text-xs px-2 py-1 rounded-md bg-[#38bdf8]/10 text-[#38bdf8]">{f}</span>
                  ))}
                </div>
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
