'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Inbox,
  LifeBuoy,
  MessageSquare,
  Megaphone,
  Mail,
  ShieldAlert,
  Star,
  Send,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import {
  AdminTicket,
  AdminAgent,
  AdminTestimonial,
} from '@/lib/admin/admin-store'

interface EngagementModulesProps {
  activeModuleId: string
  tickets: AdminTicket[]
  agents: AdminAgent[]
  testimonials: AdminTestimonial[]
}

export default function EngagementModules({
  activeModuleId,
  tickets,
  agents,
  testimonials,
}: EngagementModulesProps) {
  // Ticket Reply State
  const [activeTicket, setActiveTicket] = useState<AdminTicket | null>(tickets[0] || null)
  const [replyText, setReplyText] = useState('')

  // Live Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isStaff: boolean }>>([
    { sender: 'Paulo Gla (Client)', text: 'Good day, can you verify if my Fedwire inbound arrived at the clearing desk?', time: '14:20', isStaff: false },
    { sender: 'Staff Marcus Vance', text: 'Checking the Federal Reserve Fedline gateway now, Mr. Gla.', time: '14:22', isStaff: true },
  ])
  const [chatInput, setChatInput] = useState('')

  // Broadcast State
  const [broadcastTarget, setBroadcastTarget] = useState('ALL')
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastBody, setBroadcastBody] = useState('')
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null)

  const handleTicketReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText || !activeTicket) return

    activeTicket.messages.push({
      sender: 'Super Admin',
      isStaff: true,
      message: replyText,
      timestamp: 'Just now',
    })
    activeTicket.lastUpdate = 'Just now'
    setReplyText('')
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput) return

    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'Executive Desk (Admin)',
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStaff: true,
      },
    ])
    setChatInput('')
  }

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastSubject || !broadcastBody) return
    setBroadcastSuccess(`Broadcast successfully dispatched to target audience (${broadcastTarget}). Push notifications & email dispatches queued.`)
    setTimeout(() => setBroadcastSuccess(null), 5000)
    setBroadcastSubject('')
    setBroadcastBody('')
  }

  return (
    <div className="space-y-6">
      {/* 30. Inbox (?id=30) */}
      {activeModuleId === '30' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#0a4fa6]" />
              <span>Internal Staff Memos & Executive Inbox (?id=30)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Air-gapped internal communications, compliance directives, and Google Workspace integration.
            </p>
          </div>



          <div className="space-y-3">
            {[
              { from: 'Compliance Desk', title: 'Q3 Federal Reserve BSA/AML Dossier Finalized', time: '10:30 AM', body: 'All wire logs exceeding $50k have been checked with zero sanctions alerts.' },
              { from: 'Treasury Ops', title: 'Overnight Fed Funds Rate Parity Rebalancing Completed', time: '08:00 AM', body: 'Yield sweeps successfully executed with 4.85% net APY yield distributions.' },
            ].map((m, i) => (
              <div key={i} className="bg-gray-100 border border-gray-200 rounded-2xl p-5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0a4fa6] font-mono">{m.from}</span>
                  <span className="text-gray-400">{m.time}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900">{m.title}</h4>
                <p className="text-xs text-gray-500">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 31. Tickets (?id=31) */}
      {activeModuleId === '31' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-green-600" />
              <span>Support Ticket Resolution Dashboard (?id=31)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Threaded customer ticket management, priority routing, and resolution status.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ticket List */}
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeTicket?.id === t.id
                      ? 'bg-gray-200 border-[#0a4fa6]'
                      : 'bg-gray-100 border-gray-200 hover:bg-[#1a2333]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-[#0a4fa6]">{t.ticketNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-green-100 text-green-600">
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{t.subject}</h4>
                  <span className="text-[11px] text-gray-500 font-mono block mt-1">{t.userEmail}</span>
                </div>
              ))}
            </div>

            {/* Active Thread */}
            {activeTicket && (
              <div className="md:col-span-2 bg-gray-100 border border-gray-200 rounded-2xl p-6 flex flex-col justify-between h-[500px]">
                <div>
                  <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#0a4fa6]">{activeTicket.ticketNumber}</span>
                      <h3 className="font-bold text-sm text-gray-900">{activeTicket.subject}</h3>
                      <span className="text-xs text-gray-500">{activeTicket.userEmail}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                      {activeTicket.status}
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 text-xs">
                    {activeTicket.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl max-w-[85%] ${
                          msg.isStaff
                            ? 'bg-[#0a4fa6]/10 border border-[#0a4fa6]/20 ml-auto text-gray-900'
                            : 'bg-white border border-gray-200 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[10px] text-gray-500">
                          <span className="font-bold">{msg.sender}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleTicketReply} className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official executive staff reply..."
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 font-bold text-xs rounded-xl"
                  >
                    Reply
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 32. Live Chat (?id=32) */}
      {activeModuleId === '32' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span>Real-Time Client Live Chat Console (?id=32)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Instant messaging desk for high-net-worth client inquiries and trade assistance.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 h-[480px] flex flex-col justify-between">
            <div className="space-y-3 overflow-y-auto pr-2 text-xs">
              {chatMessages.map((c, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[80%] ${
                    c.isStaff
                      ? 'bg-[#0a4fa6]/15 border border-[#0a4fa6]/30 ml-auto text-gray-900'
                      : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                    <span className="font-bold">{c.sender}</span>
                    <span>{c.time}</span>
                  </div>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send instant response to client..."
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0a4fa6] text-gray-900 font-bold text-xs rounded-xl hover:bg-[#083d80]"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 33. Broadcast (?id=33) */}
      {activeModuleId === '33' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-600" />
              <span>Mass Broadcast & Notification Engine (?id=33)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Dispatch mass push alerts and emails to all or segmented institutional clients.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4 text-xs">
            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="text-gray-500 block mb-1">Target Audience</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900"
                >
                  <option value="ALL">ALL USERS (Active + Verified)</option>
                  <option value="VERIFIED_ONLY">VERIFIED INSTITUTIONAL CLIENTS ONLY</option>
                  <option value="VIP_ONLY">VIP & SOVEREIGN ACCOUNTS ONLY</option>
                  <option value="LEADS_ONLY">INCOMPLETE REGISTRATIONS / LEADS</option>
                </select>
              </div>

              <div>
                <label className="text-gray-500 block mb-1">Broadcast Subject Header</label>
                <input
                  type="text"
                  required
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. Important Update: Q3 Treasury Yield Boost Activated"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="text-gray-500 block mb-1">Message Body</label>
                <textarea
                  required
                  rows={4}
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  placeholder="Enter message text that will be displayed in banners and sent via email..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900"
                />
              </div>

              {broadcastSuccess && (
                <div className="p-3 bg-green-100 border border-emerald-500/20 text-green-600 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{broadcastSuccess}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-xl"
                >
                  Dispatch Broadcast Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 34. Contact (?id=34) */}
      {activeModuleId === '34' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#0a4fa6]" />
              <span>Inbound Contact & Partnership Inquiries (?id=34)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Public portal contact requests, institutional partnership bids, and media queries.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Sterling Family Office ($50M AUM allocation)</span>
                <span className="text-gray-400 font-mono">Yesterday</span>
              </div>
              <p className="text-gray-500">
                Requesting intro call regarding automated Fedwire liquidity sweeps into Treasury 90-day notes.
              </p>
              <div className="text-[11px] text-[#0a4fa6] font-mono mt-2">Contact: sterling@apexwealth.com</div>
            </div>
          </div>
        </div>
      )}

      {/* 35. Agents (?id=35) */}
      {activeModuleId === '35' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-600" />
              <span>Staff Accounts & RBAC Matrix (?id=35)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Manage internal administrative personnel and role permissions.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-[#111827]/50 text-gray-400 uppercase font-semibold">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {agents.map((ag) => (
                  <tr key={ag.id} className="hover:bg-gray-200/30">
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900 block">{ag.name}</span>
                      <span className="text-[11px] font-mono text-[#0a4fa6]">{ag.email}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-purple-600">{ag.role}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-600">
                        {ag.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono">{ag.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 36. Testimonials (?id=36) */}
      {activeModuleId === '36' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600" />
              <span>Client Testimonials & Public Social Proof (?id=36)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Manage published reviews displayed on client landing pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-gray-100 border border-gray-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">{t.author}</span>
                    <span className="text-xs text-gray-500">{t.role} • {t.company}</span>
                  </div>
                  <div className="flex text-amber-600">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 italic">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-green-600 font-bold">✓ Published</span>
                  <span className="text-gray-400 font-mono">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
