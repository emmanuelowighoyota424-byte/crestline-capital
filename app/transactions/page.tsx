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
            <h1 className="text-2xl font-bold text-gray-900">Transactions History</h1>
            <p className="text-sm text-gray-500 mt-1">
              Search and filter all debits, credits, and ledger settlement events.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white hover:bg-gray-200 text-gray-900 border border-gray-200 font-medium text-xs rounded-xl transition-all flex items-center gap-2 self-start"
          >
            <Download className="w-4 h-4 text-[#D71E28]" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by merchant, counterparty, or memo..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-[#64748b] focus:outline-none focus:border-[#D71E28]"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs rounded-xl font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#D71E28] text-gray-900 font-semibold'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase bg-white/40">
                  <th className="py-3 px-4 font-semibold">Transaction</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((tx) => {
                  const isPositive = tx.amount > 0
                  return (
                    <tr key={tx.id} className="hover:bg-white/30 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-900 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-900">{tx.description}</span>
                          <span className="text-[10px] text-gray-400 font-mono">TX-{tx.id.substring(0, 8)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">{tx.category || 'General'}</td>
                      <td className="py-3.5 px-4 text-gray-400">{tx.date}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-600">
                          {tx.status || 'SETTLED'}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-bold ${
                          isPositive ? 'text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {disputedId === tx.id ? (
                          <span className="text-[10px] text-amber-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Disputed
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setDisputedId(tx.id)
                              alert(`Transaction dispute case filed for TX-${tx.id}. Compliance team notified.`)
                            }}
                            className="text-[11px] text-gray-400 hover:text-amber-600 transition-colors"
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
