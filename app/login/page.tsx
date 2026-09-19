'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [requires2FA, setRequires2FA] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Simulate real auth handshake
      await new Promise((resolve) => setTimeout(resolve, 600))
      
      if (!requires2FA && (email.includes('2fa') || email === 'admin@crestlinecapital.com')) {
        setRequires2FA(true)
        setLoading(false)
        return
      }

      // Check admin redirection
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoUser = () => {
    setEmail('client@crestlinecapital.com')
    setPassword('Crestline2026!Secure')
    setError('')
  }

  const fillDemoAdmin = () => {
    setEmail('admin@crestlinecapital.com')
    setPassword('Admin2026!Master')
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex flex-col justify-between selection:bg-[#38bdf8] selection:text-[#0b0f19]">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[#1e293b] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Shield className="w-5 h-5 text-[#0b0f19]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Crestline Capital</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#94a3b8]">New to Crestline?</span>
          <Link
            href="/register"
            className="text-[#38bdf8] font-medium hover:underline hover:text-[#0ea5e9] transition-colors"
          >
            Open an Account
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#161e2e] border border-[#1e293b] rounded-2xl p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-sm text-[#94a3b8]">
              {requires2FA
                ? 'Enter your 6-digit Multi-Factor Authentication code'
                : 'Sign in to access your secure accounts & portfolio'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {!requires2FA ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@crestlinecapital.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-sm text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#38bdf8] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-sm text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider mb-2">
                  Two-Factor Authentication Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center text-2xl tracking-widest py-3 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono focus:outline-none focus:border-[#38bdf8] transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.25)] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0b0f19] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{requires2FA ? 'Verify & Sign In' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-6 border-t border-[#1e293b] space-y-2">
            <p className="text-xs text-center text-[#64748b] mb-3">Quick Sandbox Access:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoUser}
                className="px-3 py-2 text-xs bg-[#0b0f19] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="px-3 py-2 text-xs bg-[#0b0f19] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Bank Admin</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="py-6 text-center text-xs text-[#64748b] border-t border-[#1e293b]">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Financial Encryption Active</span>
        </div>
        <p>© 2026 Crestline Capital. All rights reserved. Member FDIC equivalent sandbox.</p>
      </footer>
    </div>
  )
}
