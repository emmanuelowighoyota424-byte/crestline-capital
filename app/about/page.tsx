"use client"

import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="landing-nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M7 16l4-8 4 4 4-6" />
                </svg>
              </div>
              <span className="font-bold text-lg">Crestline Capital</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            About <span className="crest-text-gradient">Crestline Capital</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            We&apos;re building the future of digital banking — secure, intelligent, and designed for how people actually manage their money.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-gray-100/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Crestline Capital was founded with a singular vision: make premium banking accessible to everyone. We believe that financial tools should be powerful yet simple, secure yet effortless.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Our platform combines enterprise-grade security with consumer-friendly design, giving you complete control over your financial life.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <div className="space-y-4">
                {[
                  { title: "Security First", desc: "Every feature is designed with bank-grade security from the ground up." },
                  { title: "Transparency", desc: "No hidden fees. No surprises. What you see is what you get." },
                  { title: "Innovation", desc: "We continuously push the boundaries of what digital banking can be." },
                  { title: "Customer Obsession", desc: "Every decision we make starts with the question: how does this help our customers?" },
                ].map((value, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-100/50 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-1">{value.title}</h4>
                    <p className="text-sm text-gray-500">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "$2.5B+", label: "Assets Managed" },
              { number: "500K+", label: "Active Users" },
              { number: "99.99%", label: "Uptime SLA" },
              { number: "256-bit", label: "Encryption" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gray-100/50 border border-gray-200">
                <p className="text-2xl font-bold crest-text-gradient mb-2">{stat.number}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Crestline Capital Today</h2>
          <p className="text-gray-500 mb-8">Experience banking reimagined.</p>
          <Link href="/" className="inline-block px-8 py-4 bg-[#D71E28] text-gray-900 rounded-xl font-bold hover:bg-[#A31620] transition-all hover:shadow-[0_0_30px_rgba(215,30,40,0.3)]">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></svg>
            </div>
            <span className="font-semibold">Crestline Capital</span>
          </div>
          <p className="text-xs text-gray-500">© 2026 Crestline Capital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
