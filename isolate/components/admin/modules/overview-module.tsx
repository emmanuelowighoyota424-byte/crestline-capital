'use client'

import React from 'react'
import Link from 'next/link'
import {
  Users,
  Wallet,
  ArrowLeftRight,
  Clock,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  FileCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Search,
} from 'lucide-react'
import { AdminUserRecord } from '@/lib/admin/admin-store'

interface OverviewModuleProps {
  users: AdminUserRecord[]
  totalDeposits: number
  pendingDepositsCount: number
  totalTransfers: number
  pendingTransfersCount: number
  onNavigateModule: (id: string) => void
  onToggleUserBlock: (userId: string) => void
}

export default function OverviewModule({
  users,
  totalDeposits,
  pendingDepositsCount,
  totalTransfers,
  pendingTransfersCount,
  onNavigateModule,
  onToggleUserBlock,
}: OverviewModuleProps) {
  const activeUsersCount = users.filter((u) => u.status === 'ACTIVE').length
  const blockedUsersCount = users.filter((u) => u.status === 'BLOCKED').length

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(cents)
  }

  return (
    <div className="space-y-8">
      {/* 1. Live Financial & Operational Meters as in PDF Spec */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* TOTAL DEPOSIT */}
        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-[#64748b] tracking-wider uppercase block mb-1">
            TOTAL DEPOSIT
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#38bdf8]">
            USD {totalDeposits}
          </div>
        </div>

        {/* PENDING DEPOSIT(S) */}
        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-[#64748b] tracking-wider uppercase block mb-1">
            PENDING DEPOSIT(S)
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
            USD {pendingDepositsCount}
          </div>
        </div>

        {/* TOTAL TRANSFERS */}
        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-[#64748b] tracking-wider uppercase block mb-1">
            TOTAL TRANSFERS
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#38bdf8]">
            USD {totalTransfers}
          </div>
        </div>

        {/* PENDING TRANSFERS */}
        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-[#64748b] tracking-wider uppercase block mb-1">
            PENDING TRANSFERS
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
            USD {pendingTransfersCount}
          </div>
        </div>
      </div>

      {/* User Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider block">
              TOTAL USERS
            </span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">
              {users.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider block">
              ACTIVE USERS
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {activeUsersCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider block">
              BLOCKED USERS
            </span>
            <span className="text-2xl font-bold font-mono text-red-400 mt-1 block">
              {blockedUsersCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. LIVE ROSTER SNAPSHOT (`/ADMIN`) matching Page 1 of Spec */}
      <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
              <h2 className="text-lg font-bold text-white tracking-tight uppercase">
                LIVE ROSTER SNAPSHOT (`/ADMIN`)
              </h2>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1">
              Active user records and identity verification states
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('2')}
            className="px-4 py-2 bg-[#1e293b] hover:bg-[#283548] text-[#38bdf8] text-xs font-semibold rounded-xl transition-all flex items-center gap-2 self-start"
          >
            <span>Open Master Users Roster (?id=2)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] text-[#64748b] uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">User Email</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">KYC Verification</th>
                <th className="pb-3 px-3">Joined Date</th>
                <th className="pb-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#1e293b]/30 transition-colors">
                  <td className="py-3.5 px-3 font-mono text-white font-medium">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                        user.kycStatus === 'VERIFIED'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#94a3b8]">
                    {user.joinedDate}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onToggleUserBlock(user.id)}
                      className={`px-3 py-1 text-[10px] font-semibold rounded-lg transition-all ${
                        user.status === 'ACTIVE'
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Quick Action Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateModule('0')}
          className="p-4 bg-[#161e2e] hover:bg-[#1e293b] border border-[#1e293b] rounded-2xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white block">Deposits Queue</span>
          <span className="text-[11px] text-[#94a3b8]">Incoming wire & receipt checks (?id=0)</span>
        </button>

        <button
          onClick={() => onNavigateModule('1')}
          className="p-4 bg-[#161e2e] hover:bg-[#1e293b] border border-[#1e293b] rounded-2xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white block">Withdrawals Queue</span>
          <span className="text-[11px] text-[#94a3b8]">Payout holds & authorization (?id=1)</span>
        </button>

        <button
          onClick={() => onNavigateModule('10')}
          className="p-4 bg-[#161e2e] hover:bg-[#1e293b] border border-[#1e293b] rounded-2xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white block">KYC Review</span>
          <span className="text-[11px] text-[#94a3b8]">ID verification & sanctions (?id=10)</span>
        </button>

        <button
          onClick={() => onNavigateModule('42')}
          className="p-4 bg-[#161e2e] hover:bg-[#1e293b] border border-[#1e293b] rounded-2xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white block">Security Audit Log</span>
          <span className="text-[11px] text-[#94a3b8]">Immutable activity history (?id=42)</span>
        </button>
      </div>
    </div>
  )
}
