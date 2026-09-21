'use client'

import Link from 'next/link'
import { ShieldCheck, Briefcase, MapPin, DollarSign, ArrowRight } from 'lucide-react'

export default function CareersPage() {
  const jobs = [
    {
      title: 'Principal Financial Systems Architect',
      department: 'Core Banking Engineering',
      location: 'New York, NY / Remote',
      type: 'Full-Time',
      comp: '$240k - $290k + Equity',
    },
    {
      title: 'Senior Double-Entry Ledger Engineer',
      department: 'Infrastructure & Ledger',
      location: 'San Francisco, CA / Remote',
      type: 'Full-Time',
      comp: '$190k - $240k + Equity',
    },
    {
      title: 'Staff Compliance & BSA/AML Officer',
      department: 'Legal & Risk',
      location: 'Washington, D.C. / Remote',
      type: 'Full-Time',
      comp: '$180k - $230k + Equity',
    },
    {
      title: 'Senior Frontend Product Designer (FinTech)',
      department: 'Design Systems',
      location: 'Remote',
      type: 'Full-Time',
      comp: '$160k - $210k + Equity',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#0b0f19]" />
              </div>
              <span className="font-bold text-lg text-white">Crestline Capital</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-[#94a3b8] hover:text-white transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#38bdf8] mb-2 block">
            Careers at Crestline
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Build the Future of Capital Infrastructure
          </h1>
          <p className="text-base text-[#94a3b8] leading-relaxed">
            We are looking for elite engineers, financial architects, and risk leaders to shape modern institutional banking.
          </p>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-xl hover:border-[#38bdf8]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <span className="text-xs font-semibold text-[#38bdf8] uppercase tracking-wider block mb-1">
                  {job.department}
                </span>
                <h2 className="text-lg font-bold text-white mb-2">{job.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#94a3b8]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {job.type}
                  </span>
                  <span className="text-emerald-400 font-mono font-medium">{job.comp}</span>
                </div>
              </div>
              <button
                onClick={() => alert(`Applying for ${job.title}. Please submit your CV to careers@crestlinecapital.com`)}
                className="px-5 py-2.5 bg-[#0b0f19] hover:bg-[#38bdf8] hover:text-[#0b0f19] border border-[#1e293b] hover:border-transparent text-white font-bold text-xs rounded-xl transition-all self-start sm:self-center"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
