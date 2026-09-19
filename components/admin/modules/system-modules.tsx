'use client'

import React, { useState } from 'react'
import {
  Palette,
  Sun,
  Moon,
  FolderOpen,
  FileEdit,
  HelpCircle,
  ShieldCheck,
  Settings as SettingsIcon,
  CheckCircle2,
  Download,
  Search,
  Filter,
  RefreshCw,
  Lock,
} from 'lucide-react'
import { auditLogger } from '@/lib/audit/audit-logger'

interface SystemModulesProps {
  activeModuleId: string
  siteSettings: any
  onUpdateSettings: (newSettings: any) => void
}

export default function SystemModules({
  activeModuleId,
  siteSettings,
  onUpdateSettings,
}: SystemModulesProps) {
  // Appearance state
  const [density, setDensity] = useState(siteSettings.theme.density)
  const [accentColor, setAccentColor] = useState(siteSettings.theme.accentColor)
  const [mode, setMode] = useState(siteSettings.theme.mode)

  // Settings State
  const [siteName, setSiteName] = useState(siteSettings.siteName)
  const [smtpHost, setSmtpHost] = useState(siteSettings.smtpHost)
  const [smtpPort, setSmtpPort] = useState(siteSettings.smtpPort.toString())
  const [smtpFrom, setSmtpFrom] = useState(siteSettings.smtpFrom)
  const [mfaEnforced, setMfaEnforced] = useState(siteSettings.mfaEnforced)
  const [maintenanceMode, setMaintenanceMode] = useState(siteSettings.maintenanceMode)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Content Editor State
  const [heroHeadline, setHeroHeadline] = useState('Institutional Wealth Management & Double-Entry Treasury Yields')
  const [heroSubheadline, setHeroSubheadline] = useState('Air-gapped financial infrastructure, high-yield cash sweeps, and sovereign credit facilities.')

  // Audit Log State
  const [auditQuery, setAuditQuery] = useState('')
  const auditEntries = auditLogger.getRecentLogs(30)
  const filteredAudits = auditEntries.filter((a) =>
    a.action.toLowerCase().includes(auditQuery.toLowerCase()) ||
    a.actorId.toLowerCase().includes(auditQuery.toLowerCase()) ||
    a.targetResource.toLowerCase().includes(auditQuery.toLowerCase())
  )

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateSettings({
      ...siteSettings,
      siteName,
      smtpHost,
      smtpPort: parseInt(smtpPort, 10) || 587,
      smtpFrom,
      mfaEnforced,
      maintenanceMode,
      theme: {
        ...siteSettings.theme,
        density,
        accentColor,
        mode,
      },
    })
    setSaveMessage('System settings and security policies successfully saved.')
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleExportAuditLogs = () => {
    const jsonStr = JSON.stringify(auditEntries, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `crestline_audit_log_${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* 37. Appearance (?id=37) */}
      {activeModuleId === '37' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#38bdf8]" />
              <span>Visual Appearance & Density Controls (?id=37)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Configure interface density, typography scale, and layout responsiveness.
            </p>
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 space-y-4 text-xs">
            <div>
              <label className="text-[#94a3b8] block mb-2 font-semibold">Layout Density</label>
              <div className="grid grid-cols-3 gap-3">
                {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDensity(d)}
                    className={`p-3 rounded-xl border text-center capitalize transition-all ${
                      density === d
                        ? 'bg-[#38bdf8]/10 border-[#38bdf8] text-[#38bdf8] font-bold'
                        : 'bg-[#0b0f19] border-[#1e293b] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('Appearance presets applied.')}
                className="px-4 py-2 bg-[#38bdf8] text-[#0b0f19] font-bold rounded-xl"
              >
                Apply Density Setting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 38. Themes (?id=38) */}
      {activeModuleId === '38' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <span>Theme Engine & Accent Colors (?id=38)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Toggle dark/light mode and select institutional palette accents.
            </p>
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 space-y-4 text-xs">
            <div>
              <label className="text-[#94a3b8] block mb-2 font-semibold">Base Mode</label>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button
                  type="button"
                  onClick={() => setMode('dark')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${
                    mode === 'dark'
                      ? 'bg-[#0b0f19] border-[#38bdf8] text-[#38bdf8] font-bold'
                      : 'bg-[#0b0f19] border-[#1e293b] text-[#94a3b8]'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark Slate (Institutional)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('light')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${
                    mode === 'light'
                      ? 'bg-[#0b0f19] border-[#38bdf8] text-[#38bdf8] font-bold'
                      : 'bg-[#0b0f19] border-[#1e293b] text-[#94a3b8]'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-[#94a3b8] block mb-2 font-semibold">Accent Color</label>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Sky Blue', hex: '#38bdf8' },
                  { name: 'Emerald', hex: '#10b981' },
                  { name: 'Indigo', hex: '#6366f1' },
                  { name: 'Amber Gold', hex: '#f59e0b' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setAccentColor(c.hex)}
                    style={{ borderColor: accentColor === c.hex ? c.hex : 'transparent' }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 bg-[#0b0f19] text-white"
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }}></span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 39. Assets (?id=39) */}
      {activeModuleId === '39' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#38bdf8]" />
              <span>Asset Library & Brand Kit (?id=39)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Manage vector logos, official watermarks, and cryptographic certificate stamps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Crestline Shield Emblem (SVG)', type: 'Vector Brandmark', size: '14 KB' },
              { name: 'Official Institutional Seal', type: 'High-Res Stamp', size: '142 KB' },
              { name: 'Audit Certificate Template', type: 'PDF Spec', size: '280 KB' },
            ].map((a, i) => (
              <div key={i} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 space-y-2">
                <span className="font-bold text-sm text-white block">{a.name}</span>
                <span className="text-xs text-[#94a3b8] block">{a.type} • {a.size}</span>
                <button
                  onClick={() => alert(`Downloading asset: ${a.name}`)}
                  className="text-xs text-[#38bdf8] hover:underline font-mono"
                >
                  Download Asset
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 40. Content (?id=40) */}
      {activeModuleId === '40' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-emerald-400" />
              <span>Landing Page Content & Copy Editor (?id=40)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Edit public portal headlines, hero copy, and regulatory disclaimers.
            </p>
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 space-y-4 text-xs">
            <div>
              <label className="text-[#94a3b8] block mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-medium"
              />
            </div>
            <div>
              <label className="text-[#94a3b8] block mb-1">Hero Sub-Headline</label>
              <textarea
                rows={2}
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="w-full p-3 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => alert('Content modifications published to client-facing portal.')}
                className="px-4 py-2 bg-[#38bdf8] text-[#0b0f19] font-bold rounded-xl"
              >
                Publish Copy Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 41. FAQ (?id=41) */}
      {activeModuleId === '41' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#38bdf8]" />
              <span>Knowledge Base & FAQ Management (?id=41)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Maintain answers for institutional wire clearing, tax withholding, and yield rates.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { q: 'How does Crestline execute double-entry ledger settlement?', a: 'Every financial movement posts atomic balancing debit and credit entries to vault cash, customer liabilities, and interest equity.' },
              { q: 'What is the daily cutoff time for same-day Fedwire transactions?', a: 'Domestic Fedwire entries clear same day when initiated before 16:30 Eastern Standard Time.' },
            ].map((f, i) => (
              <div key={i} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 space-y-1">
                <span className="font-bold text-sm text-white block">{f.q}</span>
                <p className="text-xs text-[#94a3b8]">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 42. Audit Log (?id=42) */}
      {activeModuleId === '42' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Security & Ledger Audit Trail (?id=42)</span>
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Append-only, SHA-256 chained audit events tracking all administrative operations.
              </p>
            </div>

            <button
              onClick={handleExportAuditLogs}
              className="px-3.5 py-2 bg-[#1e293b] hover:bg-[#283548] text-white text-xs font-semibold rounded-xl flex items-center gap-2 self-start"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Dossier (JSON)</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-2.5" />
            <input
              type="text"
              value={auditQuery}
              onChange={(e) => setAuditQuery(e.target.value)}
              placeholder="Search audit actions, actors, or resources..."
              className="w-full pl-9 pr-4 py-2 bg-[#161e2e] border border-[#1e293b] rounded-xl text-white text-xs placeholder-[#64748b]"
            />
          </div>

          <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1e293b] bg-[#111827]/50 text-[#64748b] uppercase font-semibold">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Resource</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]/60">
                  {filteredAudits.map((a) => (
                    <tr key={a.id} className="hover:bg-[#1e293b]/30">
                      <td className="py-3 px-4 font-mono text-[#94a3b8]">
                        {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#38bdf8]">{a.action}</td>
                      <td className="py-3 px-4 font-mono text-white">{a.actorId}</td>
                      <td className="py-3 px-4 text-[#cbd5e1]">{a.targetResource}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.status === 'SUCCESS'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-[#64748b] text-right">
                        {a.hash.substring(0, 10)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 43. Settings (?id=43) */}
      {activeModuleId === '43' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-[#38bdf8]" />
              <span>Master System Settings & Environment Configuration (?id=43)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              General platform parameters, SMTP email dispatcher, session timeouts, and maintenance mode.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 space-y-6 text-xs">
            {/* General */}
            <div>
              <h3 className="font-bold text-white text-sm border-b border-[#1e293b] pb-2 mb-3">
                General Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#94a3b8] block mb-1">Platform Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#94a3b8] block mb-1">System Environment</label>
                  <input
                    type="text"
                    disabled
                    value={siteSettings.environment}
                    className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-[#94a3b8] font-mono cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Email / SMTP */}
            <div>
              <h3 className="font-bold text-white text-sm border-b border-[#1e293b] pb-2 mb-3">
                SMTP Communications Dispatcher
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[#94a3b8] block mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#94a3b8] block mb-1">SMTP Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#94a3b8] block mb-1">From Sender Address</label>
                  <input
                    type="email"
                    value={smtpFrom}
                    onChange={(e) => setSmtpFrom(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Security Toggles */}
            <div>
              <h3 className="font-bold text-white text-sm border-b border-[#1e293b] pb-2 mb-3">
                Security & Maintenance Toggles
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-[#0b0f19] border border-[#1e293b] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mfaEnforced}
                    onChange={(e) => setMfaEnforced(e.target.checked)}
                    className="w-4 h-4 rounded text-[#38bdf8]"
                  />
                  <div>
                    <span className="font-bold text-white block">Enforce Universal Multi-Factor Authentication (MFA)</span>
                    <span className="text-[#64748b]">Mandate TOTP hardware tokens or email OTP for all administrative access.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#0b0f19] border border-[#1e293b] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-400"
                  />
                  <div>
                    <span className="font-bold text-amber-400 block">Maintenance Mode (Air-Gap Protection)</span>
                    <span className="text-[#64748b]">Suspend public API endpoints and queue external client transfers.</span>
                  </div>
                </label>
              </div>
            </div>

            {saveMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveMessage}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#38bdf8] text-[#0b0f19] font-bold rounded-xl hover:bg-[#0ea5e9]"
              >
                Commit System Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
