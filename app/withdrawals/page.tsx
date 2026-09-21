'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import {
  ArrowUpFromLine,
  Building2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Lock,
} from 'lucide-react'

export default function WithdrawalsPage() {
  const { accounts, formatCurrency } = useBanking()
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '')
  const [destinationType, setDestinationType] = useState<'EXTERNAL_BANK' | 'WIRE' | 'ATM'>('EXTERNAL_BANK')
  const [amount, setAmount] = useState('')
  const [externalAccount, setExternalAccount] = useState('Chase Checking (•••• 8912)')
  const [wireRouting, setWireRouting] = useState('')
  const [wireAccount, setWireAccount] = useState('')
  const [step, setStep] = useState<'FORM' | 'CONFIRM' | 'SUCCESS'>('FORM')
  const [loading, setLoading] = useState(false)

  const sourceAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0]
  const parsedAmount = parseFloat(amount) || 0

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    if (parsedAmount <= 0) return
    setStep('CONFIRM')
  }

  const handleConfirmWithdrawal = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('SUCCESS')
    }, 800)
  }

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
          <p className="text-sm text-gray-500 mt-1">
            Transfer capital out to verified external bank accounts, domestic wire recipients, or generate an ATM code.
          </p>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl">
          {step === 'FORM' && (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">From Chase Account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#0a4fa6]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.accountNumber}) — Available: {formatCurrency(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Withdrawal Destination</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'EXTERNAL_BANK', label: 'Linked Bank' },
                    { id: 'WIRE', label: 'Outgoing Wire' },
                    { id: 'ATM', label: 'Cardless ATM' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDestinationType(d.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        destinationType === d.id
                          ? 'bg-[#0a4fa6] text-gray-900 border-[#0a4fa6]'
                          : 'bg-white text-gray-500 border-gray-200 hover:text-gray-900'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {destinationType === 'EXTERNAL_BANK' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Select Linked Account</label>
                  <select
                    value={externalAccount}
                    onChange={(e) => setExternalAccount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#0a4fa6]"
                  >
                    <option value="Chase Checking (•••• 8912)">Chase Personal Checking (•••• 8912)</option>
                    <option value="Bank of America (•••• 3301)">Bank of America Savings (•••• 3301)</option>
                  </select>
                </div>
              )}

              {destinationType === 'WIRE' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Destination Routing Number</label>
                    <input
                      type="text"
                      required
                      value={wireRouting}
                      onChange={(e) => setWireRouting(e.target.value)}
                      placeholder="9-digit ABA Routing"
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono text-sm focus:outline-none focus:border-[#0a4fa6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Destination Account Number</label>
                    <input
                      type="text"
                      required
                      value={wireAccount}
                      onChange={(e) => setWireAccount(e.target.value)}
                      placeholder="Account Number"
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono text-sm focus:outline-none focus:border-[#0a4fa6]"
                    />
                  </div>
                </div>
              )}

              {destinationType === 'ATM' && (
                <div className="p-4 bg-white rounded-xl border border-gray-200 text-xs text-gray-500">
                  Generate a 6-digit one-time ATM withdrawal code redeemable at any of 65,000+ Allpoint & MoneyPass network ATMs without a physical card.
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Withdrawal Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="5.00"
                  max={sourceAccount?.balance || 10000}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono text-xl focus:outline-none focus:border-[#0a4fa6]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 font-semibold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)] flex items-center justify-center gap-2"
                >
                  <span>Review Withdrawal Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'CONFIRM' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Confirm Outgoing Withdrawal</h2>
              <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Source:</span>
                  <span className="text-gray-900 font-medium">{sourceAccount.name}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Destination:</span>
                  <span className="text-gray-900 font-medium">
                    {destinationType === 'EXTERNAL_BANK' ? externalAccount : destinationType}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Settlement SLA:</span>
                  <span className="text-green-600 font-medium">Same-Day ACH / Wire</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm">
                  <span className="text-gray-900">Total Outflow:</span>
                  <span className="font-mono text-[#0a4fa6]">${parsedAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="text-xs text-gray-500 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmWithdrawal}
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#0a4fa6] text-gray-900 font-semibold rounded-xl text-xs hover:bg-[#083d80]"
                >
                  {loading ? 'Transmitting to Fedwire / ACH...' : 'Authorize Withdrawal'}
                </button>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-green-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Withdrawal Scheduled</h2>
              <p className="text-sm text-gray-500">
                ${parsedAmount.toFixed(2)} has been queued for transmission. Reference: <span className="font-mono text-gray-900">WD-{Date.now().toString().slice(-6)}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep('FORM')
                  setAmount('')
                }}
                className="px-6 py-2.5 bg-white hover:bg-gray-200 text-gray-900 rounded-xl text-xs font-semibold border border-gray-200"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
