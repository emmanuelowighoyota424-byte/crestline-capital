'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { HelpCircle, Phone, MessageSquare, ShieldAlert, CheckCircle2, Send } from 'lucide-react'

export default function SupportPage() {
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const [category, setCategory] = useState('Transaction Issue')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject || !ticketMessage) return
    setSubmitted(true)
  }

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Concierge & Support</h1>
          <p className="text-sm text-gray-500 mt-1">
            24/7 dedicated private banking support, fraud reporting, and priority ticket resolution.
          </p>
        </div>

        {/* Emergency Fraud Callout */}
        <div className="bg-red-100 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                Urgent Fraud / Card Compromise
              </span>
              <span className="text-xs text-gray-900">
                Immediate 24/7 hotline to freeze all accounts and stop unauthorized wires:
              </span>
            </div>
          </div>
          <a
            href="tel:+18005550199"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-gray-900 font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
          >
            1-800-555-0199
          </a>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Encrypted Live Chat</h3>
            <p className="text-xs text-gray-500 mb-4">
              Connect directly with a dedicated private banker within 60 seconds.
            </p>
            <button
              onClick={() => alert('Starting secure encrypted chat session with Crestline Capital Private Client team...')}
              className="w-full py-2.5 bg-white hover:bg-gray-200 border border-gray-200 text-gray-900 text-xs font-semibold rounded-xl"
            >
              Start Secure Chat
            </button>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#818cf8]/10 text-[#818cf8] flex items-center justify-center mb-4">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Telephone Banking</h3>
            <p className="text-xs text-gray-500 mb-4">
              Available 24/7 for international wires, check verification, and high-value approvals.
            </p>
            <a
              href="tel:+18005550123"
              className="w-full py-2.5 bg-white hover:bg-gray-200 border border-gray-200 text-gray-900 text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <span>Call +1 (800) 555-0123</span>
            </a>
          </div>
        </div>

        {/* Submit Ticket Form */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-base font-bold text-gray-900 mb-4">Open a Priority Support Case</h2>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#D71E28]"
                  >
                    <option value="Transaction Issue">Transaction Issue / Dispute</option>
                    <option value="Wire Transfer">Wire Transfer Verification</option>
                    <option value="Card Service">Card Replacement / Travel Notice</option>
                    <option value="Tax & Statements">Tax 1099 & PDF Statements</option>
                    <option value="General Question">General Account Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Subject / Reference</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Wire transfer settlement timeline"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#D71E28]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Provide all relevant details, transaction dates, or beneficiary info..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#D71E28]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D71E28] hover:bg-[#A31620] text-gray-900 font-semibold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(215,30,40,0.25)] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Priority Case</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-green-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Support Case Submitted</h3>
              <p className="text-xs text-gray-500">
                Case ID: <span className="font-mono text-gray-900">CASE-{Date.now().toString().slice(-6)}</span>. A senior banking specialist will respond within 30 minutes via secure message and registered email.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setTicketSubject('')
                  setTicketMessage('')
                }}
                className="px-5 py-2 bg-white hover:bg-gray-200 border border-gray-200 text-gray-900 rounded-xl text-xs font-semibold"
              >
                Submit Another Case
              </button>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
