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
            <h1 className="text-2xl font-bold text-gray-900">Security & Account Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time transaction alerts, fraud alerts, and compliance status updates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => notifications.forEach((n) => markNotificationAsRead(n.id))}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 border border-gray-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-[#0a4fa6]" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={clearNotifications}
              className="px-3 py-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 border border-gray-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
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
                  ? 'bg-[#0a4fa6] text-gray-900 font-semibold'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200'
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
                    ? 'bg-gray-100 border-[#0a4fa6]/40 shadow-[0_0_15px_rgba(56,189,248,0.05)]'
                    : 'bg-gray-100/50 border-gray-200 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'alert'
                        ? 'bg-red-100 text-red-600'
                        : item.type === 'warning'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-[#0a4fa6]/10 text-[#0a4fa6]'
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
                      <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0a4fa6] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">{item.date}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-100 border border-gray-200 rounded-2xl">
              <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No notifications matching current filter.</p>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
