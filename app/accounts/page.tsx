'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import { Wallet, Copy, Check, Download, Plus, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export default function AccountsPage() {
  const { accounts, formatCurrency, addAccount } = useBanking()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAccName, setNewAccName] = useState('')
  const [newAccType, setNewAccType] = useState<'checking' | 'savings' | 'investment'>('checking')

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAccName.trim()) return
    addAccount({
      name: newAccName,
      type: newAccType,
      balance: 1000,
      routingNumber: '021000089',
      category: newAccType,
    })
    setNewAccName('')
    setShowAddModal(false)
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Accounts & Balances</h1>
            <p className="text-sm text-[#94a3b8] mt-1">
              Manage your checking, high-yield savings, and commercial business accounts.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Open New Account</span>
          </button>
        </div>

        {/* Account Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/5 rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-1 rounded-full">
                    {acc.type}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                <h2 className="text-lg font-bold text-white mb-1">{acc.name}</h2>
                <div className="text-3xl font-bold font-mono text-white mb-6">
                  {formatCurrency(acc.balance)}
                </div>

                <div className="space-y-2 text-xs text-[#94a3b8] bg-[#0b0f19]/60 p-3.5 rounded-xl border border-[#1e293b]/60">
                  <div className="flex items-center justify-between">
                    <span>Account Number:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-white">{acc.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(acc.accountNumber, `acc_${acc.id}`)}
                        className="text-[#64748b] hover:text-white"
                      >
                        {copiedId === `acc_${acc.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Routing (ACH / Wire):</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-white">{acc.routingNumber || '021000089'}</span>
                      <button
                        onClick={() => handleCopy(acc.routingNumber || '021000089', `rout_${acc.id}`)}
                        className="text-[#64748b] hover:text-white"
                      >
                        {copiedId === `rout_${acc.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1e293b] flex items-center justify-between">
                <button
                  onClick={() => alert(`Downloading monthly PDF statement for ${acc.name}...`)}
                  className="text-xs text-[#94a3b8] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Statements (PDF)</span>
                </button>
                <span className="text-[10px] text-emerald-400 font-medium">Standard FDIC Insured</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Account Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Open New Account Product</h2>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Account Nickname</label>
                  <input
                    type="text"
                    required
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                    placeholder="e.g. Tax Reserve Account"
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Account Type</label>
                  <select
                    value={newAccType}
                    onChange={(e) => setNewAccType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  >
                    <option value="checking">Premier Checking (0.10% APY)</option>
                    <option value="savings">High-Yield Savings (4.85% APY)</option>
                    <option value="investment">Commercial Investment Treasury</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs text-[#94a3b8] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#38bdf8] text-[#0b0f19] font-semibold text-xs rounded-xl hover:bg-[#0ea5e9]"
                  >
                    Confirm & Open
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
