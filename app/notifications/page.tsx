'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import { Bell, Check, ShieldCheck, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react'

export default function NotificationsPage() {
  const { notifications, unreadNotificationCount, markNotificationAsRead, clearNotifications } = useBanking()
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'SECURITY'>('ALL')

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read
    if (filter === 'SECURITY') return n.type === 'alert' || n.category.toLowerCase().includes('security')
    return true
  })

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Security & Account Notifications</h1>
            <p className="text-sm text-[#94a3b8] mt-1">
              Real-time transaction alerts, fraud alerts, and compliance status updates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => notifications.forEach((n) => markNotificationAsRead(n.id))}
              className="px-3 py-2 bg-[#161e2e] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white border border-[#1e293b] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={clearNotifications}
              className="px-3 py-2 bg-[#161e2e] hover:bg-red-500/10 text-[#94a3b8] hover:text-red-400 border border-[#1e293b] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {[
            { id: 'ALL', label: 'All Notifications' },
            { id: 'UNREAD', label: `Unread (${unreadNotificationCount})` },
            { id: 'SECURITY', label: 'Security & Auth' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
                filter === f.id
                  ? 'bg-[#38bdf8] text-[#0b0f19] font-semibold'
                  : 'bg-[#161e2e] text-[#94a3b8] hover:text-white border border-[#1e293b]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  !item.read
                    ? 'bg-[#161e2e] border-[#38bdf8]/40 shadow-[0_0_15px_rgba(56,189,248,0.05)]'
                    : 'bg-[#161e2e]/50 border-[#1e293b] opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'alert'
                        ? 'bg-red-500/10 text-red-400'
                        : item.type === 'warning'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-[#38bdf8]/10 text-[#38bdf8]'
                    }`}
                  >
                    {item.type === 'alert' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : item.type === 'warning' ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#38bdf8] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-[#64748b] mt-2 block">{item.date}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[#161e2e] border border-[#1e293b] rounded-2xl">
              <Bell className="w-8 h-8 text-[#64748b] mx-auto mb-2" />
              <p className="text-sm text-[#94a3b8]">No notifications matching current filter.</p>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
