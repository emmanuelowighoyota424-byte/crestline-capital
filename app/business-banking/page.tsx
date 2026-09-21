"use client"

import Link from "next/link"

export default function BusinessBankingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="landing-nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></svg>
              </div>
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Business <span className="chase-text-gradient">Banking</span></h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Financial tools built for businesses of every size.</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{service.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((f, j) => (
                    <span key={j} className="text-xs px-2 py-1 rounded-md bg-[#0a4fa6]/10 text-[#0a4fa6]">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></svg>
            </div>
            <span className="font-semibold">Chase</span>
          </div>
          <p className="text-xs text-gray-500">© 2026 Chase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
