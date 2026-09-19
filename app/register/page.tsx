'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, ArrowRight, ArrowLeft, CheckCircle2, User, Mail, Phone, Lock, FileText, Sparkles } from 'lucide-react'

type Step = 1 | 2 | 3 | 4

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    accountType: 'CHECKING',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    agreedEsign: false,
  })

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step)
    } else {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        router.push('/dashboard')
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex flex-col justify-between selection:bg-[#38bdf8] selection:text-[#0b0f19]">
      <header className="px-6 py-6 border-b border-[#1e293b] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Shield className="w-5 h-5 text-[#0b0f19]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Crestline Capital</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#94a3b8]">Already have an account?</span>
          <Link href="/login" className="text-[#38bdf8] font-medium hover:underline">
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-xl bg-[#161e2e] border border-[#1e293b] rounded-2xl p-8 shadow-2xl">
          {/* Step Progress Indicators */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1e293b]">
            {[
              { num: 1, label: 'Personal' },
              { num: 2, label: 'Contact' },
              { num: 3, label: 'Account' },
              { num: 4, label: 'Security & Terms' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= s.num ? 'bg-[#38bdf8] text-[#0b0f19]' : 'bg-[#1e293b] text-[#64748b]'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-xs hidden sm:inline ${step >= s.num ? 'text-white' : 'text-[#64748b]'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleNext} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-2">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Jane"
                      className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-2">Contact Details & Residential Address</h2>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane.doe@example.com"
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="100 Financial Way, Suite 400"
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-2">Choose Initial Account Product</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'CHECKING', title: 'Premier Checking', desc: 'No monthly fees, instant debit card issuance & unlimited transfers.' },
                    { id: 'SAVINGS', title: 'High-Yield Savings', desc: '4.85% APY compounding daily with automated goal buffers.' },
                    { id: 'BUSINESS', title: 'Business Treasury', desc: 'Multi-entity management, corporate cards, and automated payroll.' },
                  ].map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => setFormData({ ...formData, accountType: acc.id })}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.accountType === acc.id
                          ? 'border-[#38bdf8] bg-[#38bdf8]/10 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'border-[#1e293b] bg-[#0b0f19] hover:border-[#334155]'
                      }`}
                    >
                      <h3 className="font-semibold text-white text-sm mb-1">{acc.title}</h3>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">{acc.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-2">Security Setup & Disclosure</h2>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Create Master Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 12 characters, mix of cases & symbols"
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Confirm Master Password</label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-type your password"
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div className="pt-2 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.acceptedTerms}
                      onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                      className="mt-1 rounded bg-[#0b0f19] border-[#1e293b] text-[#38bdf8] focus:ring-0"
                    />
                    <span className="text-xs text-[#94a3b8]">
                      I agree to the Crestline Capital Deposit Account Agreement and Privacy Policy.
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreedEsign}
                      onChange={(e) => setFormData({ ...formData, agreedEsign: e.target.checked })}
                      className="mt-1 rounded bg-[#0b0f19] border-[#1e293b] text-[#38bdf8] focus:ring-0"
                    />
                    <span className="text-xs text-[#94a3b8]">
                      I consent to electronic communications, document delivery, and disclosures (E-SIGN).
                    </span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-[#1e293b]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as Step)}
                  className="px-4 py-2.5 bg-[#0b0f19] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white rounded-xl text-sm transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-semibold rounded-xl text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#0b0f19] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{step === 4 ? 'Create Account & Proceed' : 'Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-[#64748b] border-t border-[#1e293b]">
        <p>© 2026 Crestline Capital. All rights reserved.</p>
      </footer>
    </div>
  )
}
