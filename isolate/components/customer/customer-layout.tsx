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
    { label: 'Gmail Hub', href: '/gmail', icon: Mail },
    { label: 'Security & 2FA', href: '/security', icon: Shield },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Support', href: '/support', icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex flex-col md:flex-row selection:bg-[#38bdf8] selection:text-[#0b0f19]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#161e2e]/90 border-r border-[#1e293b] p-4 shrink-0 justify-between">
        <div>
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <Shield className="w-5 h-5 text-[#0b0f19]" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">Crestline Capital</span>
              <span className="text-[10px] text-[#38bdf8] font-semibold tracking-wider uppercase">Digital Banking</span>
            </div>
          </Link>

          {/* Account Status Pill */}
          <div className="mb-4 p-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Checking & Sweeps
            </span>
            <span className="text-[#64748b] text-[10px] font-mono">Tier 3 Verified</span>
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
                      ? 'bg-[#38bdf8] text-[#0b0f19] font-semibold shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive ? 'bg-[#0b0f19] text-[#38bdf8]' : 'bg-[#38bdf8] text-[#0b0f19]'
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
        <div className="pt-4 border-t border-[#1e293b] space-y-2">
          <div className="p-3 bg-[#0b0f19]/60 rounded-xl border border-[#1e293b]/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider block">Total Liquidity</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ledger OK
              </span>
            </div>
            <span className="text-sm font-bold text-white font-mono">{formatCurrency(getTotalBalance())}</span>
          </div>

          <div className="flex items-center justify-between px-2 text-xs">
            <Link href="/settings" className="text-[11px] text-[#94a3b8] hover:text-white flex items-center gap-1 transition-colors">
              <Settings className="w-3 h-3" />
              <span>Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#161e2e] border-b border-[#1e293b] sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#0b0f19]" />
          </div>
          <span className="font-bold text-sm text-white">Crestline Capital</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-[#94a3b8] hover:text-white"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#0b0f19]/95 backdrop-blur-md flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="font-bold text-lg text-white">Navigation</span>
            <button onClick={() => setMobileNavOpen(false)} className="p-2 text-[#94a3b8]">
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
                    isActive ? 'bg-[#38bdf8] text-[#0b0f19]' : 'text-[#94a3b8] hover:text-white bg-[#161e2e]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-[#38bdf8] text-[#0b0f19] font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </div>
          <div className="pt-4 border-t border-[#1e293b] flex items-center justify-end">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-red-400 bg-red-500/10 rounded-xl text-xs font-medium"
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
        <div className="mb-6 p-3 bg-[#161e2e] border border-[#1e293b] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-white">Institutional Production Environment</span>
            <span className="text-[#64748b]">|</span>
            <span className="text-[#94a3b8] font-mono">Ledger State: Balanced & Immutable</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/features"
              className="px-3 py-1 bg-[#1e293b] hover:bg-[#283548] text-[#94a3b8] hover:text-white rounded-lg transition-colors"
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
