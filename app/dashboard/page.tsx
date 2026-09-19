'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CustomerLayout } from '@/components/customer/customer-layout'
import GmailClient from '@/components/gmail/gmail-client'
import { useBanking } from '@/hooks/use-banking'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Plus,
  CreditCard,
  PiggyBank,
  Receipt,
  FileText,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Mail,
  Columns,
  Sparkles,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react'

export default function DashboardPage() {
  const {
    accounts,
    transactions,
    creditCards,
    savingsGoals,
    formatCurrency,
    getTotalBalance,
    userProfile,
  } = useBanking()

  const [activeDashboardTab, setActiveDashboardTab] = useState<'overview' | 'gmail'>('overview')
  const [activeTimeframe, setActiveTimeframe] = useState<'WEEK' | 'MONTH' | 'YEAR'>('MONTH')

  const totalBalance = getTotalBalance()
  const checkingAccount = accounts.find((a) => a.type === 'checking') || accounts[0]
  const savingsAccount = accounts.find((a) => a.type === 'savings')
  const businessAccount = accounts.find((a) => a.type === 'investment' || a.name.toLowerCase().includes('business')) || accounts[1]

  const recentTransactions = transactions.slice(0, 6)

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Welcome Banner with Dual View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#161e2e] via-[#1a2337] to-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#38bdf8] uppercase tracking-wider">Verified Customer</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {userProfile?.name || 'Alex Morgan'}
            </h1>
            <p className="text-sm text-[#94a3b8] mt-1">
              Here is your financial overview, active ledger status, and Gmail communication hub.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveDashboardTab(activeDashboardTab === 'overview' ? 'gmail' : 'overview')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer border ${
                activeDashboardTab === 'gmail'
                  ? 'bg-[#38bdf8] text-[#0b0f19] border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-[#0b0f19] hover:bg-[#1e293b] text-white border-[#1e293b]'
              }`}
            >
              <Mail className="w-4 h-4 text-red-400" />
              <span>{activeDashboardTab === 'gmail' ? 'View Accounts' : 'Open Gmail Hub'}</span>
            </button>
            <Link
              href="/transfers"
              className="px-4 py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Send Funds</span>
            </Link>
          </div>
        </div>

        {/* Dashboard View Mode Selector Tabs */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveDashboardTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDashboardTab === 'overview'
                  ? 'bg-[#161e2e] text-[#38bdf8] border border-[#38bdf8]/30 shadow-md'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#161e2e]/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Financial Overview & Accounts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDashboardTab('gmail')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDashboardTab === 'gmail'
                  ? 'bg-[#161e2e] text-[#38bdf8] border border-[#38bdf8]/30 shadow-md'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#161e2e]/50'
              }`}
            >
              <Mail className="w-4 h-4 text-red-400" />
              <span>Gmail Hub (Split-Pane)</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30">
                Live
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#64748b]">
            <Columns className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Split-pane email reader enabled</span>
          </div>
        </div>

        {activeDashboardTab === 'gmail' ? (
          /* Direct Gmail Hub View on Dashboard with Split-Pane reading */
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#161e2e] border border-[#1e293b] rounded-xl px-4 py-3 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <Columns className="w-4 h-4 text-[#38bdf8]" />
                <span className="font-semibold">Dashboard Split-Pane Reader:</span>
                <span className="text-[#94a3b8]">Select any message on the left to read its full body and reply immediately.</span>
              </div>
              <Link
                href="/gmail"
                className="text-[#38bdf8] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Full Page View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <GmailClient embedded initialViewMode="split" defaultHeight="min-h-[720px]" />
          </div>
        ) : (
          /* Standard Financial Overview Content */
          <>
            {/* Financial KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#94a3b8] uppercase">Total Liquidity</span>
                  <Wallet className="w-4 h-4 text-[#38bdf8]" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mb-1">
                  {formatCurrency(totalBalance)}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Available across all accounts</span>
              </div>

              <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#94a3b8] uppercase">Checking Pool</span>
                  <span className="text-[10px] text-[#64748b] font-mono">{checkingAccount?.accountNumber || '•••• 4821'}</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white mb-1">
                  {formatCurrency(checkingAccount?.balance || 0)}
                </div>
                <span className="text-[11px] text-[#94a3b8]">Primary operating account</span>
              </div>

              <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#94a3b8] uppercase">High-Yield Savings</span>
                  <PiggyBank className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
                  {formatCurrency(savingsAccount?.balance || 0)}
                </div>
                <span className="text-[11px] text-[#94a3b8]">4.85% APY Compounding</span>
              </div>

              <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#94a3b8] uppercase">Active Cards</span>
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mb-1">
                  {creditCards.length} Cards
                </div>
                <span className="text-[11px] text-[#94a3b8]">All networks operational</span>
              </div>
            </div>

            {/* Quick Action Matrix with Gmail Split-Pane Hub shortcut */}
            <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-lg">
              <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Quick Financial Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                  { label: 'Send Money', href: '/transfers', icon: ArrowUpRight, color: 'text-sky-400' },
                  { label: 'Deposit', href: '/deposits', icon: ArrowDownLeft, color: 'text-emerald-400' },
                  { label: 'Withdraw', href: '/withdrawals', icon: ArrowLeftRight, color: 'text-amber-400' },
                  { label: 'Pay Bills', href: '/payments', icon: Receipt, color: 'text-violet-400' },
                  {
                    label: 'Gmail Hub',
                    action: () => setActiveDashboardTab('gmail'),
                    icon: Mail,
                    color: 'text-red-400',
                  },
                  { label: 'Manage Cards', href: '/cards', icon: CreditCard, color: 'text-pink-400' },
                  { label: 'Savings Goals', href: '/savings', icon: PiggyBank, color: 'text-teal-400' },
                  { label: 'Investments', href: '/investments', icon: TrendingUp, color: 'text-blue-400' },
                ].map((action) => {
                  const Icon = action.icon
                  if (action.action) {
                    return (
                      <button
                        key={action.label}
                        type="button"
                        onClick={action.action}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0b0f19] hover:bg-[#1e293b] border border-[#1e293b] transition-all hover:border-[#38bdf8]/40 group cursor-pointer"
                      >
                        <div className={`p-2.5 rounded-lg bg-[#161e2e] mb-2 group-hover:scale-110 transition-transform ${action.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-[#f8fafc] text-center">{action.label}</span>
                      </button>
                    )
                  }
                  return (
                    <Link
                      key={action.label}
                      href={action.href!}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0b0f19] hover:bg-[#1e293b] border border-[#1e293b] transition-all hover:border-[#38bdf8]/40 group"
                    >
                      <div className={`p-2.5 rounded-lg bg-[#161e2e] mb-2 group-hover:scale-110 transition-transform ${action.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-[#f8fafc] text-center">{action.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Account Cards & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Accounts Breakdown */}
              <div className="lg:col-span-1 bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-white">Your Accounts</h2>
                    <Link href="/accounts" className="text-xs text-[#38bdf8] hover:underline">
                      View All
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {accounts.map((acc) => (
                      <div
                        key={acc.id}
                        className="p-3.5 rounded-xl bg-[#0b0f19] border border-[#1e293b] flex items-center justify-between"
                      >
                        <div>
                          <h3 className="text-sm font-semibold text-white">{acc.name}</h3>
                          <p className="text-xs text-[#64748b] font-mono">{acc.accountNumber}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold font-mono text-white block">
                            {formatCurrency(acc.balance)}
                          </span>
                          <span className="text-[10px] text-emerald-400">Available</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1e293b]">
                  <Link
                    href="/accounts"
                    className="w-full py-2.5 bg-[#0b0f19] hover:bg-[#1e293b] text-white border border-[#1e293b] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Open New Account Product</span>
                  </Link>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="lg:col-span-2 bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-white">Recent Transactions</h2>
                    <p className="text-xs text-[#94a3b8]">Real-time ledger audit trail</p>
                  </div>
                  <Link href="/transactions" className="text-xs text-[#38bdf8] hover:underline">
                    Full History
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#1e293b] text-[#64748b] uppercase">
                        <th className="pb-3 font-semibold">Description</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]/50">
                      {recentTransactions.map((tx) => {
                        const isPositive = tx.amount > 0
                        return (
                          <tr key={tx.id} className="hover:bg-[#0b0f19]/40 transition-colors">
                            <td className="py-3 font-medium text-white flex items-center gap-2">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                }`}
                              >
                                {isPositive ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                              </div>
                              <span className="truncate max-w-[160px] sm:max-w-xs">{tx.description}</span>
                            </td>
                            <td className="py-3 text-[#94a3b8]">{tx.category || 'General'}</td>
                            <td className="py-3 text-[#64748b]">{tx.date}</td>
                            <td
                              className={`py-3 text-right font-mono font-bold ${
                                isPositive ? 'text-emerald-400' : 'text-white'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {formatCurrency(tx.amount)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Embedded Live Split-Pane Gmail Reader directly on the Dashboard */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-400" />
                    <span>Gmail Communications Hub (Split-Pane)</span>
                  </h3>
                  <p className="text-xs text-[#94a3b8]">
                    Read email bodies directly on this dashboard, inspect wire transfer execution advice, and reply instantly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('gmail')}
                  className="px-3 py-1.5 bg-[#161e2e] hover:bg-[#1e293b] text-[#38bdf8] border border-[#1e293b] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Expand Split View</span>
                </button>
              </div>

              <GmailClient embedded initialViewMode="split" defaultHeight="min-h-[560px]" />
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  )
}
