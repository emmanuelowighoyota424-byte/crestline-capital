'use client'

import React from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import GmailClient from '@/components/gmail/gmail-client'
import { Mail, ShieldCheck, Sparkles } from 'lucide-react'

export default function GmailPage() {
  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#161e2e] via-[#1a2337] to-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#38bdf8] uppercase tracking-wider">Google Workspace Integration</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-red-400" />
              <span>Institutional Gmail Hub</span>
            </h1>
            <p className="text-xs text-[#94a3b8] max-w-2xl">
              Access your personal or institutional Gmail mailbox to review bank statements, wire advices, and correspondence with full OAuth 2.0 security.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0b0f19] border border-[#1e293b] px-3 py-2 rounded-xl text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Authorized Gmail Scopes Active</span>
          </div>
        </div>

        {/* Embedded Gmail Workspace Client */}
        <GmailClient />
      </div>
    </CustomerLayout>
  )
}
