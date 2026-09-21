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
      availableBalance: 1000,
      accountNumber: Math.floor(10000000 + Math.random() * 90000000).toString(),
      routingNumber: '021000089',
    })
    setNewAccName('')
    setShowAddModal(false)
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts & Balances</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your checking, high-yield savings, and commercial business accounts.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all flex items-center gap-2 self-start"
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
              className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0a4fa6]/5 rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0a4fa6] bg-[#0a4fa6]/10 px-2.5 py-1 rounded-full">
                    {acc.type}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-1">{acc.name}</h2>
                <div className="text-3xl font-bold font-mono text-gray-900 mb-6">
                  {formatCurrency(acc.balance)}
                </div>

                <div className="space-y-2 text-xs text-gray-500 bg-gray-50/60 p-3.5 rounded-xl border border-gray-200/60">
                  <div className="flex items-center justify-between">
                    <span>Account Number:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-gray-900">{acc.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(acc.accountNumber, `acc_${acc.id}`)}
                        className="text-gray-400 hover:text-gray-900"
                      >
                        {copiedId === `acc_${acc.id}` ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Routing (ACH / Wire):</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-gray-900">{acc.routingNumber || '021000089'}</span>
                      <button
                        onClick={() => handleCopy(acc.routingNumber || '021000089', `rout_${acc.id}`)}
                        className="text-gray-400 hover:text-gray-900"
                      >
                        {copiedId === `rout_${acc.id}` ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => alert(`Downloading monthly PDF statement for ${acc.name}...`)}
                  className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Statements (PDF)</span>
                </button>
                <span className="text-[10px] text-green-600 font-medium">Standard FDIC Insured</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Account Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Open New Account Product</h2>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Account Nickname</label>
                  <input
                    type="text"
                    required
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                    placeholder="e.g. Tax Reserve Account"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#0a4fa6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Account Type</label>
                  <select
                    value={newAccType}
                    onChange={(e) => setNewAccType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#0a4fa6]"
                  >
                    <option value="checking">Premier Checking (0.10% APY)</option>
                    <option value="savings">High-Yield Savings (4.85% APY)</option>
                    <option value="investment">Commercial Investment Treasury</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs text-gray-500 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0a4fa6] text-gray-900 font-semibold text-xs rounded-xl hover:bg-[#083d80]"
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
