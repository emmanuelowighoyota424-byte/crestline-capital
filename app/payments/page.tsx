'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import { Receipt, Plus, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react'

interface BillPayee {
  id: string
  name: string
  category: string
  accountNumber: string
  amount?: number
  nextDueDate?: string
  autopay?: boolean
}

const DEFAULT_PAYEES: BillPayee[] = [
  { id: 'bp-1', name: 'Con Edison Electric', category: 'Utilities', accountNumber: '•••• 8419', amount: 142.50, nextDueDate: '2026-10-01', autopay: true },
  { id: 'bp-2', name: 'Verizon FiOS Internet', category: 'Telecom', accountNumber: '•••• 3192', amount: 89.99, nextDueDate: '2026-10-05', autopay: true },
  { id: 'bp-3', name: 'Chase Visa Card', category: 'Credit Card', accountNumber: '•••• 4018', amount: 485.20, nextDueDate: '2026-10-12', autopay: false },
]

export default function PaymentsPage() {
  const { formatCurrency } = useBanking()
  const [payees, setPayees] = useState<BillPayee[]>(DEFAULT_PAYEES)
  const [selectedPayeeId, setSelectedPayeeId] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [payDate, setPayDate] = useState('2026-09-25')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const selectedPayee = payees.find((b) => b.id === selectedPayeeId)

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPayeeId || !amount) return
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 700)
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bill Pay & Scheduled Payments</h1>
            <p className="text-sm text-gray-500 mt-1">
              Send electronic payments to utilities, mortgages, credit cards, and vendors.
            </p>
          </div>
          <button
            onClick={() => alert('Search over 10,000 national electronic billers or enter remittance address.')}
            className="px-4 py-2.5 bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Biller</span>
          </button>
        </div>

        {/* Saved Billers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {payees.map((payee) => (
            <div
              key={payee.id}
              className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#0a4fa6] uppercase tracking-wider bg-[#0a4fa6]/10 px-2 py-0.5 rounded">
                    {payee.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Acc: {payee.accountNumber}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{payee.name}</h3>

                {payee.amount && (
                  <div className="text-xl font-bold font-mono text-gray-900 mb-2">
                    {formatCurrency(payee.amount)}
                  </div>
                )}

                {payee.nextDueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due on {payee.nextDueDate}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {payee.autopay ? 'Autopay ON' : 'Manual Pay'}
                </span>
                <button
                  onClick={() => {
                    setSelectedPayeeId(payee.id)
                    setAmount(payee.amount ? payee.amount.toString() : '150.00')
                    setSuccess(false)
                  }}
                  className="px-4 py-2 bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 text-xs font-semibold rounded-xl transition-all"
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pay Modal */}
        {selectedPayeeId && (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-100 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xl">
              {!success ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Pay Bill: {selectedPayee?.name}</h2>
                  <p className="text-xs text-gray-500 mb-4">Electronic remittance to account {selectedPayee?.accountNumber}</p>

                  <form onSubmit={handlePay} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Payment Amount ($ USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono text-sm focus:outline-none focus:border-[#0a4fa6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Send Date</label>
                      <input
                        type="date"
                        required
                        value={payDate}
                        onChange={(e) => setPayDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#0a4fa6]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setSelectedPayeeId(null)}
                        className="text-xs text-gray-500 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 bg-[#0a4fa6] text-gray-900 font-semibold text-xs rounded-xl hover:bg-[#083d80]"
                      >
                        {loading ? 'Transmitting Electronic Check...' : 'Send Bill Payment'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-green-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Payment Dispatched</h3>
                  <p className="text-xs text-gray-500">
                    ${parseFloat(amount).toFixed(2)} sent to {selectedPayee?.name}. Confirmation: <span className="font-mono text-gray-900">BP-{Date.now().toString().slice(-6)}</span>
                  </p>
                  <button
                    onClick={() => setSelectedPayeeId(null)}
                    className="px-5 py-2 bg-white hover:bg-gray-200 border border-gray-200 text-gray-900 rounded-xl text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
