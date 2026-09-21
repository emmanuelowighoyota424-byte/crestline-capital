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
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
            TOTAL DEPOSIT
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#D71E28]">
            USD {totalDeposits}
          </div>
        </div>

        {/* PENDING DEPOSIT(S) */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
            PENDING DEPOSIT(S)
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600">
            USD {pendingDepositsCount}
          </div>
        </div>

        {/* TOTAL TRANSFERS */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
            TOTAL TRANSFERS
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#D71E28]">
            USD {totalTransfers}
          </div>
        </div>

        {/* PENDING TRANSFERS */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
            PENDING TRANSFERS
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600">
            USD {pendingTransfersCount}
          </div>
        </div>
      </div>

      {/* User Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              TOTAL USERS
            </span>
            <span className="text-2xl font-bold font-mono text-gray-900 mt-1 block">
              {users.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              ACTIVE USERS
            </span>
            <span className="text-2xl font-bold font-mono text-green-600 mt-1 block">
              {activeUsersCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              BLOCKED USERS
            </span>
            <span className="text-2xl font-bold font-mono text-red-600 mt-1 block">
              {blockedUsersCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. LIVE ROSTER SNAPSHOT (`/ADMIN`) matching Page 1 of Spec */}
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D71E28] animate-pulse"></span>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight uppercase">
                LIVE ROSTER SNAPSHOT (`/ADMIN`)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Active user records and identity verification states
            </p>
          </div>
          <button
            onClick={() => onNavigateModule('2')}
            className="px-4 py-2 bg-gray-200 hover:bg-[#283548] text-[#D71E28] text-xs font-semibold rounded-xl transition-all flex items-center gap-2 self-start"
          >
            <span>Open Master Users Roster (?id=2)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">User Email</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">KYC Verification</th>
                <th className="pb-3 px-3">Joined Date</th>
                <th className="pb-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-200/30 transition-colors">
                  <td className="py-3.5 px-3 font-mono text-gray-900 font-medium">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-600 border border-emerald-500/20'
                          : 'bg-red-100 text-red-600 border border-red-500/20'
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
                          : 'bg-amber-100 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-gray-500">
                    {user.joinedDate}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onToggleUserBlock(user.id)}
                      className={`px-3 py-1 text-[10px] font-semibold rounded-lg transition-all ${
                        user.status === 'ACTIVE'
                          ? 'bg-red-100 text-red-600 hover:bg-red-500/20'
                          : 'bg-green-100 text-green-600 hover:bg-emerald-500/20'
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
          className="p-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-2xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-gray-900 block">Deposits Queue</span>
          <span className="text-[11px] text-gray-500">Incoming wire & receipt checks (?id=0)</span>
        </button>

        <button
          onClick={() => onNavigateModule('1')}
          className="p-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-2xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-gray-900 block">Withdrawals Queue</span>
          <span className="text-[11px] text-gray-500">Payout holds & authorization (?id=1)</span>
        </button>

        <button
          onClick={() => onNavigateModule('10')}
          className="p-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-2xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-gray-900 block">KYC Review</span>
          <span className="text-[11px] text-gray-500">ID verification & sanctions (?id=10)</span>
        </button>

        <button
          onClick={() => onNavigateModule('42')}
          className="p-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-2xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-gray-900 block">Security Audit Log</span>
          <span className="text-[11px] text-gray-500">Immutable activity history (?id=42)</span>
        </button>
      </div>
    </div>
  )
}
