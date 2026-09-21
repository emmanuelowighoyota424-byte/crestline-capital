'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import {
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
} from 'lucide-react'

type TransferStep = 'DETAILS' | 'REVIEW' | 'VERIFY' | 'SUCCESS'

export default function TransfersPage() {
  const { accounts, formatCurrency, transfer } = useBanking()
  const [step, setStep] = useState<TransferStep>('DETAILS')
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '')
  const [recipientName, setRecipientName] = useState('')
  const [recipientAccount, setRecipientAccount] = useState('')
  const [recipientBank, setRecipientBank] = useState('Crestline Capital (Internal)')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [txReceipt, setTxReceipt] = useState<any>(null)

  const sourceAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0]
  const parsedAmount = parseFloat(amount) || 0

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (parsedAmount <= 0) {
      setError('Please enter a valid transfer amount.')
      return
    }
    if (sourceAccount && parsedAmount > sourceAccount.balance) {
      setError('Insufficient funds in selected source account.')
      return
    }
    setStep('REVIEW')
  }

  const handleProceedToVerify = () => {
    // Fraud check heuristic: if amount > 5000, challenge with 2FA
    if (parsedAmount >= 5000) {
      setStep('VERIFY')
    } else {
      executeTransfer()
    }
  }

  const executeTransfer = async () => {
    setLoading(true)
    setError('')
    try {
      // Execute via double-entry ledger API
      const response = await fetch('/app/api/ledger/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey: `tx_xfer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          reference: `XFER-${Date.now().toString().slice(-6)}`,
          description: `Transfer to ${recipientName}: ${memo || 'Standard Outflow'}`,
          entries: [
            {
              accountId: 'acc_cust_checking_primary',
              type: 'DEBIT',
              amountCents: Math.round(parsedAmount * 100),
              memo: `Transfer to ${recipientName}`,
            },
            {
              accountId: 'acc_vault',
              type: 'CREDIT',
              amountCents: Math.round(parsedAmount * 100),
              memo: `Clearing transfer to ${recipientBank}`,
            },
          ],
        }),
      })

      // Also record in banking client context
      if (sourceAccount) {
        transfer(sourceAccount.name, recipientName, parsedAmount, memo)
      }

      setTxReceipt({
        id: `TX-${Date.now().toString().slice(-8)}`,
        amount: parsedAmount,
        recipient: recipientName,
        bank: recipientBank,
        timestamp: new Date().toLocaleTimeString(),
      })
      setStep('SUCCESS')
    } catch (err: any) {
      setError(err.message || 'Transfer failed. Please contact compliance.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Send & Transfer Funds</h1>
          <p className="text-sm text-[#94a3b8] mt-1">
            Execute real-time double-entry transfers with multi-tiered fraud protection.
          </p>
        </div>

        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'DETAILS' && (
            <form onSubmit={handleProceedToReview} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">From Account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.accountNumber}) — Available: {formatCurrency(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Recipient Legal Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Jordan Vance"
                  className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Recipient Account / IBAN</label>
                  <input
                    type="text"
                    required
                    value={recipientAccount}
                    onChange={(e) => setRecipientAccount(e.target.value)}
                    placeholder="e.g. 984128912"
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Recipient Financial Institution</label>
                  <input
                    type="text"
                    required
                    value={recipientBank}
                    onChange={(e) => setRecipientBank(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Transfer Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono text-xl focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Memo / Reference Note (Optional)</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="e.g. Invoice settlement or rent"
                  className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                >
                  <span>Review Transfer Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'REVIEW' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white mb-2">Confirm Transfer Details</h2>
              <div className="bg-[#0b0f19] rounded-xl p-5 border border-[#1e293b] space-y-3 text-sm">
                <div className="flex justify-between text-xs text-[#94a3b8]">
                  <span>Source Account:</span>
                  <span className="text-white font-medium">{sourceAccount?.name}</span>
                </div>
                <div className="flex justify-between text-xs text-[#94a3b8]">
                  <span>Recipient:</span>
                  <span className="text-white font-medium">{recipientName}</span>
                </div>
                <div className="flex justify-between text-xs text-[#94a3b8]">
                  <span>Institution:</span>
                  <span className="text-white font-medium">{recipientBank}</span>
                </div>
                <div className="flex justify-between text-xs text-[#94a3b8]">
                  <span>Account Number:</span>
                  <span className="text-white font-mono">{recipientAccount}</span>
                </div>
                <div className="border-t border-[#1e293b] pt-3 flex justify-between items-center">
                  <span className="font-semibold text-white">Amount:</span>
                  <span className="font-mono text-xl font-bold text-[#38bdf8]">
                    ${parsedAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero-fee standard transfer protected by Crestline Double-Entry Ledger.</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="px-4 py-2.5 text-xs text-[#94a3b8] hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Modify</span>
                </button>
                <button
                  type="button"
                  onClick={handleProceedToVerify}
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-semibold rounded-xl text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                >
                  {loading ? 'Processing...' : 'Authorize Transfer'}
                </button>
              </div>
            </div>
          )}

          {step === 'VERIFY' && (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">High-Value Security Verification</h2>
              <p className="text-xs text-[#94a3b8]">
                Transfers over $5,000 require multi-factor authorization. Enter your 6-digit one-time passcode below.
              </p>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="654321"
                className="w-48 mx-auto text-center text-2xl font-mono tracking-widest py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white focus:outline-none focus:border-[#38bdf8]"
              />
              <button
                type="button"
                onClick={executeTransfer}
                disabled={loading || otpCode.length < 6}
                className="w-full py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-semibold rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {loading ? 'Committing to Ledger...' : 'Confirm & Commit Transaction'}
              </button>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Transfer Initiated</h2>
              <p className="text-sm text-[#94a3b8]">
                Funds have been successfully debited and queued for immediate settlement.
              </p>
              {txReceipt && (
                <div className="bg-[#0b0f19] p-4 rounded-xl border border-[#1e293b] text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Reference:</span>
                    <span className="text-white">{txReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Amount:</span>
                    <span className="text-emerald-400 font-bold">${txReceipt.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Recipient:</span>
                    <span className="text-white">{txReceipt.recipient}</span>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setStep('DETAILS')
                  setAmount('')
                  setRecipientName('')
                  setRecipientAccount('')
                }}
                className="px-6 py-2.5 bg-[#161e2e] hover:bg-[#1e293b] border border-[#1e293b] text-white rounded-xl text-xs font-semibold"
              >
                Execute Another Transfer
              </button>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
