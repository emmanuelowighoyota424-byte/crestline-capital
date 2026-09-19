'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function TransactionsPage() {
  const { transactions, formatCurrency } = useBanking()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [disputedId, setDisputedId] = useState<string | null>(null)

  const categories = ['ALL', 'Transfer', 'Food & Dining', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Income']

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || tx.category?.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Category', 'Amount', 'Status']
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.date,
      `"${tx.description}"`,
      tx.category || '',
      tx.amount,
      tx.status || 'COMPLETED',
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `crestline_transactions_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Transactions History</h1>
            <p className="text-sm text-[#94a3b8] mt-1">
              Search and filter all debits, credits, and ledger settlement events.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#0b0f19] hover:bg-[#1e293b] text-white border border-[#1e293b] font-medium text-xs rounded-xl transition-all flex items-center gap-2 self-start"
          >
            <Download className="w-4 h-4 text-[#38bdf8]" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by merchant, counterparty, or memo..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#161e2e] border border-[#1e293b] rounded-xl text-sm text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs rounded-xl font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#38bdf8] text-[#0b0f19] font-semibold'
                    : 'bg-[#161e2e] text-[#94a3b8] hover:text-white border border-[#1e293b]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e293b] text-[#64748b] uppercase bg-[#0b0f19]/40">
                  <th className="py-3 px-4 font-semibold">Transaction</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/50">
                {filteredTransactions.map((tx) => {
                  const isPositive = tx.amount > 0
                  return (
                    <tr key={tx.id} className="hover:bg-[#0b0f19]/30 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="block font-semibold text-white">{tx.description}</span>
                          <span className="text-[10px] text-[#64748b] font-mono">TX-{tx.id.substring(0, 8)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#94a3b8]">{tx.category || 'General'}</td>
                      <td className="py-3.5 px-4 text-[#64748b]">{tx.date}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                          {tx.status || 'SETTLED'}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-bold ${
                          isPositive ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {disputedId === tx.id ? (
                          <span className="text-[10px] text-amber-400 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Disputed
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setDisputedId(tx.id)
                              alert(`Transaction dispute case filed for TX-${tx.id}. Compliance team notified.`)
                            }}
                            className="text-[11px] text-[#64748b] hover:text-amber-400 transition-colors"
                          >
                            Dispute
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
