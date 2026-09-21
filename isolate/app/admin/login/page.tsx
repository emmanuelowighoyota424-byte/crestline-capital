'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  KeyRound,
  Lock,
  Mail,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck,
  Terminal,
  Sparkles,
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<'credentials' | 'master_key'>('credentials')

  // Email & Password credentials state
  const [email, setEmail] = useState('owighoyotaemmanuel424@gmail.com')
  const [password, setPassword] = useState('Owighoyota12345')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Master key state (fallback)
  const [masterKey, setMasterKey] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<string | null>(null)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessInfo(null)
    setLoading(true)

    try {
      const payload =
        authMode === 'credentials'
          ? { email: email.trim(), password }
          : { masterKey: masterKey.trim().toLowerCase() }

      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Administrative authentication failed.')
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts)
        }
        setLoading(false)
        return
      }

      // Successful authentication
      setSuccessInfo(`Access Authorized: Welcome, ${data.session.name} (${data.session.role})`)

      // Store session attributes in client session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('crestline_admin_session_id', data.session.sessionId)
        sessionStorage.setItem('crestline_admin_role', data.session.role)
        sessionStorage.setItem('crestline_admin_email', data.session.email)
        sessionStorage.setItem('crestline_admin_name', data.session.name)
      }

      setTimeout(() => {
        router.push('/admin')
      }, 600)
    } catch (err: any) {
      setError(err.message || 'Network communication error during authentication.')
      setLoading(false)
    }
  }

  const handleFillCredentials = () => {
    // Demo hint: check the admin-auth.ts file for default credentials
    // or use the master key authentication mode instead
    setAuthMode('master_key')
    setError(null)
  }

  const handleFillMasterKey = () => {
    // Enter your 48-character hex master key
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#070a11] text-[#f8fafc] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#38bdf8] selection:text-[#0b0f19]">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            <Shield className="w-5 h-5 text-[#0b0f19]" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight block">Crestline Capital</span>
            <span className="text-[10px] text-[#38bdf8] font-mono tracking-wider uppercase">
              Administrative Gatekeeper
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-[#94a3b8]">Air-Gapped Core Online</span>
        </div>
      </header>

      {/* Main Admin Gatekeeper Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-8">
        <div className="bg-[#111827]/90 border border-[#1e293b] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#818cf8]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] text-xs font-mono">
                <Shield className="w-3.5 h-3.5" />
                <span>SUPER ADMIN ACCESS PORTAL</span>
              </div>
              <span className="text-[11px] font-mono text-[#64748b]">v2.4 Production</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              System Administration Access
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8] mb-6 leading-relaxed">
              Authenticate with authorized administrative credentials to manage institutional ledger reserves, treasury sweeps, and member compliance.
            </p>

            {/* Auth Mode Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#070a11] border border-[#1e293b] rounded-2xl mb-6 text-xs font-medium">
              <button
                type="button"
                id="btn-tab-credentials"
                onClick={() => {
                  setAuthMode('credentials')
                  setError(null)
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  authMode === 'credentials'
                    ? 'bg-[#161e2e] text-white font-semibold shadow-sm border border-[#1e293b]'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Email & Password</span>
              </button>
              <button
                type="button"
                id="btn-tab-masterkey"
                onClick={() => {
                  setAuthMode('master_key')
                  setError(null)
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  authMode === 'master_key'
                    ? 'bg-[#161e2e] text-white font-semibold shadow-sm border border-[#1e293b]'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                <span>Master Hex Key</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div
                id="admin-login-error"
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-xs text-red-300"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-200">{error}</p>
                  {remainingAttempts !== null && (
                    <p className="mt-1 text-[11px] text-red-400">
                      Remaining attempts before security lockout:{' '}
                      <span className="font-bold font-mono">{remainingAttempts}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Success Message Alert */}
            {successInfo && (
              <div
                id="admin-login-success"
                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-xs text-emerald-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-200">{successInfo}</p>
                  <p className="text-[11px] text-emerald-400/80">
                    Redirecting to institutional risk console...
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {authMode === 'credentials' ? (
                <>
                  {/* Admin Email Input */}
                  <div>
                    <label
                      htmlFor="admin-email-input"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2"
                    >
                      Admin Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="admin-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="owighoyotaemmanuel424@gmail.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#070a11] border border-[#1e293b] rounded-2xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all"
                      />
                    </div>
                  </div>

                  {/* Admin Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="admin-password-input"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]"
                      >
                        Admin Password
                      </label>
                      <button
                        type="button"
                        id="btn-quick-fill-creds"
                        onClick={handleFillCredentials}
                        className="text-[11px] text-[#38bdf8] hover:underline flex items-center gap-1 font-mono"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Fill Credentials</span>
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="admin-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-[#070a11] border border-[#1e293b] rounded-2xl text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all tracking-wider"
                      />
                      <button
                        type="button"
                        id="btn-toggle-password-visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748b] hover:text-[#94a3b8] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Authorized User Profile Badge */}
                  <div className="p-3 bg-[#070a11]/80 rounded-2xl border border-[#1e293b] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-white font-medium block">Emmanuel Owighoyota</span>
                        <span className="text-[10px] text-[#64748b] font-mono">
                          Role: SUPER_ADMIN (Full Clearance)
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-[#070a11] border-[#1e293b] text-[#38bdf8] focus:ring-0"
                      />
                      <span>Keep administrative session active for 12 hours</span>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* Master Key Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="admin-masterkey-input"
                        className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5"
                      >
                        <Terminal className="w-3.5 h-3.5 text-purple-400" />
                        <span>Master Hexadecimal Key (48 characters)</span>
                      </label>
                      <span className="text-[11px] font-mono text-[#64748b]">
                        {masterKey.length}/48
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        id="admin-masterkey-input"
                        type="password"
                        required
                        maxLength={64}
                        value={masterKey}
                        onChange={(e) =>
                          setMasterKey(e.target.value.replace(/[^0-9a-fA-F]/g, '').toLowerCase())
                        }
                        placeholder="e.g. 4a8f9b2c3d4e5f60718293a4b5c6d7e8f90123456789abcd"
                        className="w-full px-4 py-3 bg-[#070a11] border border-[#1e293b] rounded-2xl text-white font-mono text-xs sm:text-sm tracking-widest focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all"
                      />
                      <div className="absolute right-3 top-3 flex items-center gap-1 text-[11px] font-mono text-[#64748b]">
                        {masterKey.length === 48 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-[#64748b]" />
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748b]">
                      <span>192-Bit Cryptographic Ledger Authority</span>
                      <button
                        type="button"
                        id="btn-fill-masterkey"
                        onClick={handleFillMasterKey}
                        className="text-[#38bdf8] hover:underline font-mono"
                      >
                        Load Master Key
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-admin-submit"
                  disabled={
                    loading ||
                    (authMode === 'credentials'
                      ? !email || !password
                      : masterKey.length < 10)
                  }
                  className="w-full py-3.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-bold text-sm rounded-2xl shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.45)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as Super Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security & Access Info Footer */}
            <div className="mt-8 pt-6 border-t border-[#1e293b]/60 flex items-center justify-between text-xs text-[#64748b]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#38bdf8]" />
                <span>TLS 1.3 / AES-256 Audit Logged</span>
              </div>
              <Link href="/dashboard" className="text-[#94a3b8] hover:text-white transition-colors">
                Customer Banking Portal →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full py-4 text-center text-xs text-[#64748b]">
        Crestline Capital Institutional Administration Portal • Authorized Access Only
      </footer>
    </div>
  )
}

