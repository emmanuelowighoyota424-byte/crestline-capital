'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Mail, CheckCircle2, ArrowRight } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setVerified(true)
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
        <Link href="/login" className="text-sm text-[#0a4fa6] hover:underline">
          Back to Sign In
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-100 border border-gray-200 rounded-2xl p-8 shadow-2xl">
          {!verified ? (
            <>
              <div className="mb-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#0a4fa6]/10 text-[#0a4fa6] mx-auto flex items-center justify-center mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                <p className="text-sm text-gray-500">
                  We have dispatched a 6-digit confirmation code to your inbox. Please enter it below to confirm email ownership.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center text-3xl font-mono tracking-widest py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#0a4fa6]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || code.length < 6}
                  className="w-full py-3 bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.25)] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirm Email</span>
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">Email Confirmed</h2>
              <p className="text-sm text-gray-500 mb-6">
                Your email address has been verified. You now have full access to your digital banking services.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0a4fa6] text-gray-900 font-semibold rounded-xl text-sm hover:bg-[#083d80] transition-all"
              >
                <span>Enter Banking Dashboard</span>
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
