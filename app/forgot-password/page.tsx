'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between">
      <header className="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Shield className="w-5 h-5 text-gray-900" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Chase</span>
        </Link>
        <Link href="/login" className="text-sm text-[#0a4fa6] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-100 border border-gray-200 rounded-2xl p-8 shadow-2xl">
          {!submitted ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
                <p className="text-sm text-gray-500">
                  Enter your registered email address to receive password recovery instructions and a secure reset token.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@chasecapital.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-[#64748b] focus:outline-none focus:border-[#0a4fa6] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.25)] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#0b0f19] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Recovery Token</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-green-600 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Inbox</h2>
              <p className="text-sm text-gray-500 mb-6">
                If an account matches <span className="text-gray-900 font-medium">{email}</span>, we have dispatched a single-use verification link and token.
              </p>
              <Link
                href="/reset-password"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a4fa6] text-gray-900 font-semibold rounded-xl text-sm hover:bg-[#083d80] transition-all"
              >
                <span>Enter Reset Token</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-200">
        <p>© 2026 Chase. All rights reserved.</p>
      </footer>
    </div>
  )
}
