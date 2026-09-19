'use client'

import React, { useState } from 'react'
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
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#38bdf8]" />
              <span>Internal Staff Memos & Executive Inbox (?id=30)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Air-gapped internal communications and compliance directives.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { from: 'Compliance Desk', title: 'Q3 Federal Reserve BSA/AML Dossier Finalized', time: '10:30 AM', body: 'All wire logs exceeding $50k have been checked with zero sanctions alerts.' },
              { from: 'Treasury Ops', title: 'Overnight Fed Funds Rate Parity Rebalancing Completed', time: '08:00 AM', body: 'Yield sweeps successfully executed with 4.85% net APY yield distributions.' },
            ].map((m, i) => (
              <div key={i} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#38bdf8] font-mono">{m.from}</span>
                  <span className="text-[#64748b]">{m.time}</span>
                </div>
                <h4 className="font-bold text-sm text-white">{m.title}</h4>
                <p className="text-xs text-[#94a3b8]">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 31. Tickets (?id=31) */}
      {activeModuleId === '31' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-emerald-400" />
              <span>Support Ticket Resolution Dashboard (?id=31)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
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
                      ? 'bg-[#1e293b] border-[#38bdf8]'
                      : 'bg-[#161e2e] border-[#1e293b] hover:bg-[#1a2333]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-[#38bdf8]">{t.ticketNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400">
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{t.subject}</h4>
                  <span className="text-[11px] text-[#94a3b8] font-mono block mt-1">{t.userEmail}</span>
                </div>
              ))}
            </div>

            {/* Active Thread */}
            {activeTicket && (
              <div className="md:col-span-2 bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 flex flex-col justify-between h-[500px]">
                <div>
                  <div className="border-b border-[#1e293b] pb-3 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#38bdf8]">{activeTicket.ticketNumber}</span>
                      <h3 className="font-bold text-sm text-white">{activeTicket.subject}</h3>
                      <span className="text-xs text-[#94a3b8]">{activeTicket.userEmail}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400">
                      {activeTicket.status}
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 text-xs">
                    {activeTicket.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl max-w-[85%] ${
                          msg.isStaff
                            ? 'bg-[#38bdf8]/10 border border-[#38bdf8]/20 ml-auto text-white'
                            : 'bg-[#0b0f19] border border-[#1e293b] text-[#cbd5e1]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[10px] text-[#94a3b8]">
                          <span className="font-bold">{msg.sender}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleTicketReply} className="mt-4 pt-4 border-t border-[#1e293b] flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official executive staff reply..."
                    className="flex-1 px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-bold text-xs rounded-xl"
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
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Real-Time Client Live Chat Console (?id=32)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Instant messaging desk for high-net-worth client inquiries and trade assistance.
            </p>
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 h-[480px] flex flex-col justify-between">
            <div className="space-y-3 overflow-y-auto pr-2 text-xs">
              {chatMessages.map((c, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[80%] ${
                    c.isStaff
                      ? 'bg-[#38bdf8]/15 border border-[#38bdf8]/30 ml-auto text-white'
                      : 'bg-[#0b0f19] border border-[#1e293b] text-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#94a3b8] mb-1">
                    <span className="font-bold">{c.sender}</span>
                    <span>{c.time}</span>
                  </div>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="mt-4 pt-4 border-t border-[#1e293b] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send instant response to client..."
                className="flex-1 px-4 py-2.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#38bdf8] text-[#0b0f19] font-bold text-xs rounded-xl hover:bg-[#0ea5e9]"
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
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              <span>Mass Broadcast & Notification Engine (?id=33)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Dispatch mass push alerts and emails to all or segmented institutional clients.
            </p>
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 space-y-4 text-xs">
            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="text-[#94a3b8] block mb-1">Target Audience</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white"
                >
                  <option value="ALL">ALL USERS (Active + Verified)</option>
                  <option value="VERIFIED_ONLY">VERIFIED INSTITUTIONAL CLIENTS ONLY</option>
                  <option value="VIP_ONLY">VIP & SOVEREIGN ACCOUNTS ONLY</option>
                  <option value="LEADS_ONLY">INCOMPLETE REGISTRATIONS / LEADS</option>
                </select>
              </div>

              <div>
                <label className="text-[#94a3b8] block mb-1">Broadcast Subject Header</label>
                <input
                  type="text"
                  required
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. Important Update: Q3 Treasury Yield Boost Activated"
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-medium"
                />
              </div>

              <div>
                <label className="text-[#94a3b8] block mb-1">Message Body</label>
                <textarea
                  required
                  rows={4}
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  placeholder="Enter message text that will be displayed in banners and sent via email..."
                  className="w-full p-3 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white"
                />
              </div>

              {broadcastSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{broadcastSuccess}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-[#0b0f19] font-bold rounded-xl"
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
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#38bdf8]" />
              <span>Inbound Contact & Partnership Inquiries (?id=34)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Public portal contact requests, institutional partnership bids, and media queries.
            </p>
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 space-y-4">
            <div className="p-4 bg-[#0b0f19] rounded-xl border border-[#1e293b] space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Sterling Family Office ($50M AUM allocation)</span>
                <span className="text-[#64748b] font-mono">Yesterday</span>
              </div>
              <p className="text-[#94a3b8]">
                Requesting intro call regarding automated Fedwire liquidity sweeps into Treasury 90-day notes.
              </p>
              <div className="text-[11px] text-[#38bdf8] font-mono mt-2">Contact: sterling@apexwealth.com</div>
            </div>
          </div>
        </div>
      )}

      {/* 35. Agents (?id=35) */}
      {activeModuleId === '35' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              <span>Staff Accounts & RBAC Matrix (?id=35)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Manage internal administrative personnel and role permissions.
            </p>
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e293b] bg-[#111827]/50 text-[#64748b] uppercase font-semibold">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {agents.map((ag) => (
                  <tr key={ag.id} className="hover:bg-[#1e293b]/30">
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{ag.name}</span>
                      <span className="text-[11px] font-mono text-[#38bdf8]">{ag.email}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-purple-400">{ag.role}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                        {ag.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#94a3b8] font-mono">{ag.lastActive}</td>
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
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              <span>Client Testimonials & Public Social Proof (?id=36)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Manage published reviews displayed on client landing pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{t.author}</span>
                    <span className="text-xs text-[#94a3b8]">{t.role} • {t.company}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#cbd5e1] italic">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-bold">✓ Published</span>
                  <span className="text-[#64748b] font-mono">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
