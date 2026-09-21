'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/customer/client'
import {
  Shield,
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  PiggyBank,
  TrendingUp,
  Receipt,
  Bell,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Wallet,
  Building2,
  ExternalLink,
  Lock,
  CheckCircle2,
  Mail,
} from 'lucide-react'
import { useBanking } from '@/hooks/use-banking'

interface CustomerLayoutProps {
  children: React.ReactNode
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { unreadNotificationCount, formatCurrency, getTotalBalance, userProfile } = useBanking()

  // Ending the server session is what actually signs the customer out; the cached
  // local flag is cleared too so the shell cannot briefly render as signed in.
  const handleSignOut = async () => {
    setMobileNavOpen(false)
    // signOut ends the server session and forgets the cached identity, using the
    // token fallback when the browser withholds the cookie.
    await signOut()
    router.replace('/login')
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Accounts', href: '/accounts', icon: Wallet },
    { label: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
    { label: 'Transfers', href: '/transfers', icon: ArrowLeftRight },
    { label: 'Deposits', href: '/deposits', icon: ArrowDownToLine },
    { label: 'Withdrawals', href: '/withdrawals', icon: ArrowUpFromLine },
    { label: 'Cards', href: '/cards', icon: CreditCard },
    { label: 'Savings & Goals', href: '/savings', icon: PiggyBank },
    { label: 'Investments', href: '/investments', icon: TrendingUp },
    { label: 'Bill Payments', href: '/payments', icon: Receipt },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadNotificationCount },
    { label: 'Security & 2FA', href: '/security', icon: Shield },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Support', href: '/support', icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col md:flex-row selection:bg-[#0a4fa6] selection:text-gray-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-100/90 border-r border-gray-200 p-4 shrink-0 justify-between">
        <div>
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#0a4fa6] flex items-center justify-center">
              <Shield className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-gray-900 block">Chase</span>
              <span className="text-[10px] text-[#0a4fa6] font-semibold tracking-wider uppercase">Digital Banking</span>
            </div>
          </Link>

          {/* Account Status Pill */}
          <div className="mb-4 p-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-green-600 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Checking & Sweeps
            </span>
            <span className="text-gray-400 text-[10px] font-mono">Tier 3 Verified</span>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#0a4fa6] text-gray-900 font-semibold shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive ? 'bg-white text-[#0a4fa6]' : 'bg-[#0a4fa6] text-gray-900'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-200/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Total Liquidity</span>
              <span className="flex items-center gap-1 text-[10px] text-green-600 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ledger OK
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900 font-mono">{formatCurrency(getTotalBalance())}</span>
          </div>

          <div className="flex items-center justify-between px-2 text-xs">
            <Link href="/settings" className="text-[11px] text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
              <Settings className="w-3 h-3" />
              <span>Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
            <Shield className="w-4 h-4 text-gray-900" />
          </div>
          <span className="font-bold text-sm text-gray-900">Chase</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-gray-500 hover:text-gray-900"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="font-bold text-lg text-gray-900">Navigation</span>
            <button onClick={() => setMobileNavOpen(false)} className="p-2 text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-[#0a4fa6] text-gray-900' : 'text-gray-500 hover:text-gray-900 bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-[#0a4fa6] text-gray-900 font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </div>
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-100 rounded-xl text-xs font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top Institutional Notification Bar */}
        <div className="mb-6 p-3 bg-gray-100 border border-gray-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-gray-900">Institutional Production Environment</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 font-mono">Ledger State: Balanced & Immutable</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/features"
              className="px-3 py-1 bg-gray-200 hover:bg-[#283548] text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
            >
              Public Site
            </Link>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
