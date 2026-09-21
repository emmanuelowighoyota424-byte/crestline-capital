'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Verify2FAPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex flex-col justify-between">
      <header className="px-6 py-6 border-b border-[#1e293b] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Shield className="w-5 h-5 text-[#0b0f19]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Crestline Capital</span>
        </Link>
        <Link href="/login" className="text-sm text-[#38bdf8] hover:underline">
          Cancel & Sign Out
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#161e2e] border border-[#1e293b] rounded-2xl p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] mx-auto flex items-center justify-center mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h1>
            <p className="text-sm text-[#94a3b8]">
              Open your authenticator app (Google Authenticator, 1Password, or Authy) and provide the 6-digit security passkey.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center text-3xl font-mono tracking-widest py-3 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.25)] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0b0f19] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify Identity</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => alert('Backup verification code sent to your registered mobile device.')}
              className="text-xs text-[#94a3b8] hover:text-white transition-colors"
            >
              Having trouble? Send code via SMS instead
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[#64748b] border-t border-[#1e293b]">
        <p>© 2026 Crestline Capital. All rights reserved.</p>
      </footer>
    </div>
  )
}
