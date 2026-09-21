'use client'

import React, { useState } from 'react'
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  UserCheck,
  Shield,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  UserPlus,
} from 'lucide-react'
import { AdminUserRecord, AdminLead, AdminTask, AdminReferral } from '@/lib/admin/admin-store'

interface UsersModuleProps {
  users: AdminUserRecord[]
  leads: AdminLead[]
  tasks: AdminTask[]
  referrals: AdminReferral[]
  activeSubModule: 'users' | 'leads' | 'tasks' | 'referrals' | 'import'
  onToggleUserBlock: (userId: string) => void
  onAddUser: (user: Omit<AdminUserRecord, 'id' | 'joinedDate'>) => void
}

export default function UsersModule({
  users,
  leads,
  tasks,
  referrals,
  activeSubModule,
  onToggleUserBlock,
  onAddUser,
}: UsersModuleProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL')
  const [kycFilter, setKycFilter] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED'>('ALL')
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Add User Form State
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newBalance, setNewBalance] = useState('10000')
  const [newTier, setNewTier] = useState<AdminUserRecord['tier']>('STANDARD')

  // CSV Import State
  const [csvPreview, setCsvPreview] = useState<string[]>([])
  const [importSuccess, setImportSuccess] = useState<string | null>(null)

  // Filtered Users
  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.accountNumber.includes(searchQuery)

    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter
    const matchesKYC = kycFilter === 'ALL' || user.kycStatus === kycFilter

    return matchesQuery && matchesStatus && matchesKYC
  })

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || !newName) return

    onAddUser({
      name: newName,
      email: newEmail,
      phone: newPhone || '+1 (555) 000-0000',
      status: 'ACTIVE',
      kycStatus: 'UNVERIFIED',
      accountNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      routingNumber: '026009593',
      balance: parseFloat(newBalance) || 0,
      tier: newTier,
    })

    setShowAddModal(false)
    setNewName('')
    setNewEmail('')
    setNewPhone('')
  }

  const handleExportUsersCSV = () => {
    const headers = ['Email', 'Name', 'Phone', 'Status', 'KYC', 'Joined Date', 'Balance', 'Tier']
    const rows = filteredUsers.map((u) => [
      u.email,
      `"${u.name}"`,
      u.phone,
      u.status,
      u.kycStatus,
      u.joinedDate,
      u.balance,
      u.tier,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `chase_users_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSimulateCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvPreview([
        'email,name,phone,initial_balance,tier',
        'robert.langdon@harvard.edu,Robert Langdon,+15559871,50000,PLATINUM',
        'cynthia.ross@geneva.ch,Cynthia Ross,+41229001,120000,PRIVATE_WEALTH',
        'marcus.aurelius@rome.org,Marcus Aurelius,+39061001,25000,GOLD',
      ])
      setImportSuccess('CSV file parsed: 3 verified institutional accounts ready for ingestion.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs if rendered in unified module view */}
      {activeSubModule === 'users' && (
        <>
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0a4fa6]" />
                <span>Client Master Roster (?id=2)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Centralized customer identity, balance management, and account governance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportUsersCSV}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 text-gray-900"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or account number..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-[#64748b] text-xs focus:outline-none focus:border-[#0a4fa6]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-400 px-2 uppercase font-semibold">Status:</span>
                {(['ALL', 'ACTIVE', 'BLOCKED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      statusFilter === st ? 'bg-[#0a4fa6] text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-400 px-2 uppercase font-semibold">KYC:</span>
                {(['ALL', 'VERIFIED', 'UNVERIFIED'] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKycFilter(k)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      kycFilter === k ? 'bg-[#0a4fa6] text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#111827]/50 text-gray-400 uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Account / Routing</th>
                    <th className="py-3.5 px-4">Balance</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">KYC</th>
                    <th className="py-3.5 px-4">Tier</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-200/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-gray-900 block">{user.name}</span>
                          <span className="text-[11px] font-mono text-[#0a4fa6]">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-500">
                        <div>{user.accountNumber}</div>
                        <div className="text-[10px] text-gray-400">RT: {user.routingNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white border border-gray-200 text-gray-500">
                          {user.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-2.5 py-1 bg-gray-200 hover:bg-[#283548] text-gray-900 rounded-lg text-[11px] font-medium transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => onToggleUserBlock(user.id)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                              user.status === 'ACTIVE'
                                ? 'bg-red-100 text-red-600 hover:bg-red-500/20'
                                : 'bg-green-100 text-green-600 hover:bg-emerald-500/20'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Leads Sub-Module (?id=11) */}
      {activeSubModule === 'leads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0a4fa6]" />
                <span>Leads & Prospect Pipeline (?id=11)</span>
              </h2>
              <p className="text-xs text-gray-500">
                Institutional prospect management and incomplete registration onboarding.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-gray-100 border border-gray-200 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-base text-gray-900">{lead.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0a4fa6]/10 text-[#0a4fa6] border border-[#0a4fa6]/20">
                    {lead.stage}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                  <div>
                    Email: <span className="font-mono text-gray-900">{lead.email}</span>
                  </div>
                  <div>
                    Phone: <span className="font-mono text-gray-900">{lead.phone}</span>
                  </div>
                  <div>
                    Source: <span className="text-[#0a4fa6]">{lead.source}</span>
                  </div>
                  <div>
                    Assigned Agent: <span className="text-gray-900 font-semibold">{lead.assignedAgent}</span>
                  </div>
                </div>
                <p className="text-xs bg-white p-3 rounded-xl border border-gray-200 text-gray-600 italic">
                  &ldquo;{lead.notes}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Sub-Module (?id=12) */}
      {activeSubModule === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Staff Tasks & Workflows (?id=12)</span>
              </h2>
              <p className="text-xs text-gray-500">
                Operational risk, regulatory filing, and compliance workflows.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-100 border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-gray-900">{task.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-600 border border-red-500/20'
                          : 'bg-amber-100 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-gray-500">
                      {task.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
                <div className="text-right text-xs shrink-0">
                  <span className="text-gray-400 block">Assigned: {task.assignedTo}</span>
                  <span className="text-amber-600 font-mono block mt-1">Due: {task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referrals Sub-Module (?id=13) */}
      {activeSubModule === 'referrals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0a4fa6]" />
                <span>Referral & Affiliate Manager (?id=13)</span>
              </h2>
              <p className="text-xs text-gray-500">
                Affiliate commissions, upline/downline relationships, and payout audits.
              </p>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-[#111827]/50 text-gray-400 uppercase font-semibold">
                  <th className="py-3 px-4">Referrer</th>
                  <th className="py-3 px-4">Referee</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Reward</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-gray-200/30">
                    <td className="py-3 px-4 font-mono text-gray-900">{ref.referrerEmail}</td>
                    <td className="py-3 px-4 font-mono text-gray-500">{ref.refereeEmail}</td>
                    <td className="py-3 px-4 font-mono text-[#0a4fa6] font-bold">{ref.code}</td>
                    <td className="py-3 px-4 font-mono text-green-600 font-bold">${ref.rewardAmount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-600 border border-emerald-500/20">
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono">{ref.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Import Sub-Module (?id=14) */}
      {activeSubModule === 'import' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <span>Bulk CSV Ingestion Tool (?id=14)</span>
              </h2>
              <p className="text-xs text-gray-500">
                Transaction-safe bulk client data ingestion and database synchronization.
              </p>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6">
            <div className="border-2 border-dashed border-gray-200 hover:border-[#0a4fa6] rounded-2xl p-8 text-center transition-colors">
              <Upload className="w-10 h-10 text-[#0a4fa6] mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Select or drop institutional CSV</h3>
              <p className="text-xs text-gray-500 mb-4">
                Required columns: email, name, phone, initial_balance, tier
              </p>
              <label className="px-4 py-2 bg-[#0a4fa6] text-gray-900 font-bold text-xs rounded-xl cursor-pointer hover:bg-[#083d80] transition-colors inline-block">
                Choose CSV File
                <input type="file" accept=".csv" onChange={handleSimulateCSVUpload} className="hidden" />
              </label>
            </div>

            {importSuccess && (
              <div className="mt-4 p-4 bg-green-100 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>{importSuccess}</span>
              </div>
            )}

            {csvPreview.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Ingestion Preview</h4>
                <div className="bg-white p-4 rounded-xl font-mono text-[11px] text-gray-600 space-y-1">
                  {csvPreview.map((line, i) => (
                    <div key={i} className={i === 0 ? 'text-[#0a4fa6] font-bold' : ''}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Detail Drawer / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-100 border border-gray-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <span className="text-[10px] text-[#0a4fa6] uppercase tracking-wider font-bold">Client Profile Dossier</span>
                <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-900 p-2"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-400 block mb-1">Email</span>
                <span className="font-mono text-gray-900 font-bold">{selectedUser.email}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-400 block mb-1">Total Balance</span>
                <span className="font-mono text-green-600 font-bold text-sm">
                  ${selectedUser.balance.toLocaleString()}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-400 block mb-1">Account Number</span>
                <span className="font-mono text-gray-900">{selectedUser.accountNumber}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-400 block mb-1">Routing Number</span>
                <span className="font-mono text-gray-900">{selectedUser.routingNumber}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-400 block mb-1">Account Status</span>
                <span className="font-bold text-gray-900">{selectedUser.status}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-gray-400 block mb-1">KYC Tier</span>
                <span className="font-bold text-[#0a4fa6]">{selectedUser.kycStatus}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  onToggleUserBlock(selectedUser.id)
                  setSelectedUser(null)
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedUser.status === 'ACTIVE'
                    ? 'bg-red-100 text-red-600 border border-red-500/20 hover:bg-red-500/20'
                    : 'bg-green-100 text-green-600 border border-emerald-500/20 hover:bg-emerald-500/20'
                }`}
              >
                {selectedUser.status === 'ACTIVE' ? 'Block Account' : 'Unblock Account'}
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-xl text-xs font-semibold hover:bg-[#283548]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-100 border border-gray-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-gray-900">Create Client Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-500 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900"
                />
              </div>

              <div>
                <label className="text-gray-500 block mb-1">Client Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. eleanor@vancecapital.com"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="text-gray-500 block mb-1">Phone</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="text-gray-500 block mb-1">Initial Balance (USD)</label>
                <input
                  type="number"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="text-gray-500 block mb-1">Membership Tier</label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900"
                >
                  <option value="STANDARD">STANDARD</option>
                  <option value="GOLD">GOLD</option>
                  <option value="PLATINUM">PLATINUM</option>
                  <option value="PRIVATE_WEALTH">PRIVATE WEALTH</option>
                  <option value="SOVEREIGN">SOVEREIGN</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a4fa6] text-gray-900 font-bold rounded-xl"
                >
                  Create Client Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
