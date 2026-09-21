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
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gray-900" />
              </div>
              <span className="font-bold text-lg text-gray-900">Chase</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0a4fa6] mb-2 block">
            Careers at Chase
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Build the Future of Capital Infrastructure
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            We are looking for elite engineers, financial architects, and risk leaders to shape modern institutional banking.
          </p>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl hover:border-[#0a4fa6]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <span className="text-xs font-semibold text-[#0a4fa6] uppercase tracking-wider block mb-1">
                  {job.department}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {job.type}
                  </span>
                  <span className="text-green-600 font-mono font-medium">{job.comp}</span>
                </div>
              </div>
              <button
                onClick={() => alert(`Applying for ${job.title}. Please submit your CV to careers@chasecapital.com`)}
                className="px-5 py-2.5 bg-white hover:bg-[#0a4fa6] hover:text-gray-900 border border-gray-200 hover:border-transparent text-gray-900 font-bold text-xs rounded-xl transition-all self-start sm:self-center"
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
