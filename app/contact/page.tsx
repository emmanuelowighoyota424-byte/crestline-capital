"use client"

import Link from "next/link"
import { useState } from "react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Contact <span className="crestline-text-gradient">Us</span></h1>
            <p className="text-lg text-[#94a3b8]">We&apos;re here to help. Reach out anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: "📞", title: "Phone", detail: "1-888-CREST-01", sub: "24/7 Support" },
              { icon: "✉️", title: "Email", detail: "support@crestlinecapital.com", sub: "Response within 24h" },
              { icon: "💬", title: "Live Chat", detail: "Available in-app", sub: "Mon-Fri 8am-8pm ET" },
            ].map((contact, i) => (
              <div key={i} className="feature-card text-center">
                <div className="text-3xl mb-3">{contact.icon}</div>
                <h3 className="font-semibold text-[#f8fafc] mb-1">{contact.title}</h3>
                <p className="text-sm text-[#38bdf8]">{contact.detail}</p>
                <p className="text-xs text-[#94a3b8] mt-1">{contact.sub}</p>
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="max-w-lg mx-auto text-center p-8 rounded-2xl bg-[#161e2e] border border-[#10b981]/30">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
              <p className="text-[#94a3b8]">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="max-w-lg mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Name</label>
                <input type="text" required className="w-full px-4 py-3 rounded-xl bg-[#161e2e] border border-[#1e293b] text-[#f8fafc] focus:border-[#38bdf8] focus:outline-none transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Email</label>
                <input type="email" required className="w-full px-4 py-3 rounded-xl bg-[#161e2e] border border-[#1e293b] text-[#f8fafc] focus:border-[#38bdf8] focus:outline-none transition-colors" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Subject</label>
                <select className="w-full px-4 py-3 rounded-xl bg-[#161e2e] border border-[#1e293b] text-[#f8fafc] focus:border-[#38bdf8] focus:outline-none transition-colors">
                  <option>General Inquiry</option>
                  <option>Account Support</option>
                  <option>Technical Issue</option>
                  <option>Security Concern</option>
                  <option>Business Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Message</label>
                <textarea required rows={5} className="w-full px-4 py-3 rounded-xl bg-[#161e2e] border border-[#1e293b] text-[#f8fafc] focus:border-[#38bdf8] focus:outline-none transition-colors resize-none" placeholder="How can we help?" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#38bdf8] text-[#0b0f19] rounded-xl font-bold hover:bg-[#0ea5e9] transition-all">
                Send Message
              </button>
            </form>
          )}
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
