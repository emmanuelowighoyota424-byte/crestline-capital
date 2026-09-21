'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import {
  ArrowDownLeft,
  Camera,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react'

type DepositMethod = 'CHECK' | 'ACH' | 'WIRE'

export default function DepositsPage() {
  const { accounts, formatCurrency, depositCheck } = useBanking()
  const [method, setMethod] = useState<DepositMethod>('CHECK')
  const [amount, setAmount] = useState('')
  const [targetAccountId, setTargetAccountId] = useState(accounts[0]?.id || '')
  const [checkNumber, setCheckNumber] = useState('')
  const [frontImage, setFrontImage] = useState<string | null>(null)
  const [backImage, setBackImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const targetAccount = accounts.find((a) => a.id === targetAccountId) || accounts[0]

  const handleDepositCheck = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (!parsed || parsed <= 0) return
    setLoading(true)

    setTimeout(() => {
      depositCheck({
        amount: parsed,
        accountName: targetAccount.name,
        checkNumber: checkNumber || '99201',
      })
      setLoading(false)
      setSuccess(true)
    }, 800)
  }

  const handleCopyRouting = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deposit Funds</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fund your Chase accounts via Mobile Check Deposit, External Bank Transfer (ACH), or Fedwire.
          </p>
        </div>

        {/* Method Switcher */}
        <div className="flex gap-2 p-1.5 bg-gray-100 border border-gray-200 rounded-2xl">
          {[
            { id: 'CHECK', label: 'Mobile Check Deposit', icon: Camera },
            { id: 'ACH', label: 'External ACH Link', icon: ArrowDownLeft },
            { id: 'WIRE', label: 'Wire Instructions', icon: Building2 },
          ].map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMethod(m.id as DepositMethod)
                  setSuccess(false)
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  method === m.id
                    ? 'bg-[#0a4fa6] text-gray-900 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            )
          })}
        </div>

        {/* Mobile Check Deposit Form */}
        {method === 'CHECK' && (
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl">
            {!success ? (
              <form onSubmit={handleDepositCheck} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Deposit To Account</label>
                  <select
                    value={targetAccountId}
                    onChange={(e) => setTargetAccountId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#0a4fa6]"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.accountNumber}) — Current: {formatCurrency(acc.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Check Amount ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1.00"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono text-sm focus:outline-none focus:border-[#0a4fa6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Check Number</label>
                    <input
                      type="text"
                      required
                      value={checkNumber}
                      onChange={(e) => setCheckNumber(e.target.value)}
                      placeholder="e.g. 1042"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono text-sm focus:outline-none focus:border-[#0a4fa6]"
                    />
                  </div>
                </div>

                {/* Check Image Capture Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div
                    onClick={() => setFrontImage('front_check_sample.jpg')}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      frontImage ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-200 hover:border-[#0a4fa6]'
                    }`}
                  >
                    <Camera className={`w-8 h-8 mx-auto mb-2 ${frontImage ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-semibold text-gray-900 block">Front of Check</span>
                    <span className="text-[11px] text-gray-500">
                      {frontImage ? '✓ Image captured' : 'Tap to scan front'}
                    </span>
                  </div>

                  <div
                    onClick={() => setBackImage('back_check_sample.jpg')}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      backImage ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-200 hover:border-[#0a4fa6]'
                    }`}
                  >
                    <Camera className={`w-8 h-8 mx-auto mb-2 ${backImage ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-semibold text-gray-900 block">Back of Check (Endorsed)</span>
                    <span className="text-[11px] text-gray-500">
                      {backImage ? '✓ Image captured' : 'Endorse & tap to scan'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                  <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Checks up to $10,000 qualify for immediate partial release of funds.</span>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 font-semibold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] disabled:opacity-50"
                  >
                    {loading ? 'Analyzing Check OCR & Transmitting...' : 'Submit Check for Deposit'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-green-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Check Deposit Submitted</h2>
                <p className="text-sm text-gray-500">
                  Amount: <span className="text-gray-900 font-bold">${parseFloat(amount).toFixed(2)}</span> has been queued. Funds typically settle within 1 business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false)
                    setAmount('')
                    setCheckNumber('')
                    setFrontImage(null)
                    setBackImage(null)
                  }}
                  className="px-6 py-2.5 bg-white hover:bg-gray-200 border border-gray-200 text-gray-900 rounded-xl text-xs font-semibold"
                >
                  Deposit Another Check
                </button>
              </div>
            )}
          </div>
        )}

        {/* ACH Linking */}
        {method === 'ACH' && (
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Link External Checking Account</h2>
            <p className="text-xs text-gray-500">
              Connect an external bank via Plaid or micro-deposits to pull funds automatically into Chase.
            </p>
            <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-gray-900 block">Chase Personal Checking</span>
                <span className="text-xs text-gray-400 font-mono">•••• 8912 — Verified</span>
              </div>
              <button
                onClick={() => alert('Initiated $500 transfer from Chase Checking (ACH Settlement in 2 days)')}
                className="px-4 py-2 bg-[#0a4fa6] text-gray-900 font-semibold text-xs rounded-lg hover:bg-[#083d80]"
              >
                Pull Funds
              </button>
            </div>
            <button
              onClick={() => alert('Launching secure Plaid instant account link modal...')}
              className="w-full py-3 bg-white hover:bg-gray-200 border border-gray-200 text-gray-900 rounded-xl text-xs font-semibold"
            >
              + Link Another Bank Account
            </button>
          </div>
        )}

        {/* Wire Transfer Details */}
        {method === 'WIRE' && (
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Domestic & International Wire Instructions</h2>
            <p className="text-xs text-gray-500">
              Provide these exact details to the originating bank to receive domestic Fedwire or international SWIFT wires.
            </p>
            <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bank Name:</span>
                <span className="text-gray-900">Chase, N.A.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fedwire ABA Routing:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">021000089</span>
                  <button onClick={() => handleCopy('021000089')}>
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Beneficiary Name:</span>
                <span className="text-gray-900">{targetAccount.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Account Number:</span>
                <span className="text-gray-900">{targetAccount.accountNumber}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
