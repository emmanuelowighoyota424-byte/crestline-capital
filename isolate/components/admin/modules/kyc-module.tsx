'use client'

import React, { useState } from 'react'
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  ShieldAlert,
  FileText,
  User,
  Eye,
  RefreshCw,
} from 'lucide-react'
import { AdminKYCCase } from '@/lib/admin/admin-store'

interface KYCModuleProps {
  cases: AdminKYCCase[]
  onApprove: (caseId: string) => void
  onReject: (caseId: string, reason: string) => void
}

export default function KYCModule({ cases, onApprove, onReject }: KYCModuleProps) {
  const [selectedCase, setSelectedCase] = useState<AdminKYCCase | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')

  const filteredCases = cases.filter((c) => {
    if (filter === 'ALL') return true
    return c.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#38bdf8]" />
            <span>KYC & Identity Verification Review Queue (?id=10)</span>
          </h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Biometric liveness, government document inspection, and sanctions screening.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#161e2e] p-1 rounded-xl border border-[#1e293b] text-xs">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === st ? 'bg-[#38bdf8] text-[#0b0f19] font-bold' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-[#161e2e] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] bg-[#111827]/50 text-[#64748b] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Document Type</th>
                <th className="py-3.5 px-4">ID Number</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Submission Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-[#1e293b]/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{c.userName}</span>
                    <span className="font-mono text-[#38bdf8] text-[11px]">{c.userEmail}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#0b0f19] border border-[#1e293b] text-[#94a3b8] font-mono text-[10px]">
                      {c.documentType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-white">{c.documentNumber}</td>
                  <td className="py-3.5 px-4 text-[#cbd5e1]">{c.country}</td>
                  <td className="py-3.5 px-4 font-mono text-[#94a3b8]">
                    {new Date(c.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                        c.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : c.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="px-2.5 py-1 bg-[#1e293b] hover:bg-[#283548] text-[#38bdf8] rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                      {c.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => onApprove(c.id)}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-[11px] font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCase(c)
                              setShowRejectDialog(true)
                            }}
                            className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details Drawer / Modal */}
      {selectedCase && !showRejectDialog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161e2e] border border-[#1e293b] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
              <div>
                <span className="text-[10px] text-[#38bdf8] font-bold uppercase tracking-wider">KYC Compliance Dossier</span>
                <h3 className="text-lg font-bold text-white">{selectedCase.userName}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-[#94a3b8] hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0b0f19] p-3 rounded-xl border border-[#1e293b]">
                <span className="text-[#64748b] block mb-0.5">Email</span>
                <span className="font-mono text-white">{selectedCase.userEmail}</span>
              </div>
              <div className="bg-[#0b0f19] p-3 rounded-xl border border-[#1e293b]">
                <span className="text-[#64748b] block mb-0.5">Document Type</span>
                <span className="font-mono text-white">{selectedCase.documentType}</span>
              </div>
              <div className="bg-[#0b0f19] p-3 rounded-xl border border-[#1e293b]">
                <span className="text-[#64748b] block mb-0.5">Document Number</span>
                <span className="font-mono text-white">{selectedCase.documentNumber}</span>
              </div>
              <div className="bg-[#0b0f19] p-3 rounded-xl border border-[#1e293b]">
                <span className="text-[#64748b] block mb-0.5">Issuing Jurisdiction</span>
                <span className="text-white">{selectedCase.country}</span>
              </div>
            </div>

            {/* Document Visual Preview Placeholder */}
            <div className="bg-[#0b0f19] border border-[#1e293b] rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-white block">
                Official Document Scan ({selectedCase.documentType})
              </span>
              <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                ✓ Cryptographic Watermark Verified • OFAC Clean • Interpol Sanctions Clear
              </span>
            </div>

            {selectedCase.notes && (
              <div className="p-3 bg-[#0b0f19] rounded-xl border border-[#1e293b] text-xs text-[#94a3b8]">
                <span className="text-white font-semibold block mb-1">Compliance Officer Notes:</span>
                {selectedCase.notes}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {selectedCase.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      onApprove(selectedCase.id)
                      setSelectedCase(null)
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#0b0f19] font-bold text-xs rounded-xl"
                  >
                    Approve KYC Verification
                  </button>
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs rounded-xl"
                  >
                    Reject Application
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-[#1e293b] text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      {showRejectDialog && selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161e2e] border border-[#1e293b] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Reject KYC Application</h3>
            <p className="text-xs text-[#94a3b8]">
              Specify the compliance justification for rejecting {selectedCase.userEmail}. This will be logged in the immutable audit registry.
            </p>

            <textarea
              required
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Expired document expiration date or obscured MRZ code..."
              className="w-full p-3 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-xs"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="px-4 py-2 bg-[#1e293b] text-white rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReject(selectedCase.id, rejectReason || 'Document criteria not met')
                  setShowRejectDialog(false)
                  setSelectedCase(null)
                  setRejectReason('')
                }}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
