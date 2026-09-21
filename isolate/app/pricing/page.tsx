'use client'

import Link from 'next/link'
import { ShieldCheck, Check, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  const tiers = [
    {
      name: 'Standard Personal',
      price: '$0',
      period: '/month',
      description: 'Transparent digital banking for individuals with zero hidden maintenance fees.',
      features: [
        'Free Checking & 4.85% APY High-Yield Savings',
        'Standard ACH & Mobile Check Deposits',
        'Virtual Visa Debit with Apple Pay / Google Pay',
        '65,000+ Fee-Free Allpoint Network ATMs',
        'Real-time transaction alerts & biometrics',
      ],
      cta: 'Open Free Account',
      href: '/register',
      popular: false,
    },
    {
      name: 'Private Client',
      price: '$25',
      period: '/month (or $50k min balance)',
      description: 'Concierge financial management, unlimited free domestic wires, and highest tier limits.',
      features: [
        'Everything in Standard',
        'Unlimited Free Domestic Fedwires & Same-Day ACH',
        'Dedicated 24/7 Private Banking Concierge',
        'Metal Visa Infinite Card with 3% Cash Back',
        'Higher daily transfer limits ($250,000/day)',
        'Comprehensive family sub-accounts & vaulting',
      ],
      cta: 'Upgrade to Private Client',
      href: '/register',
      popular: true,
    },
    {
      name: 'Commercial Enterprise',
      price: '$99',
      period: '/month',
      description: 'Multi-entity corporate treasury management, team cards, and developer API keys.',
      features: [
        'Multi-user RBAC & dual-signatory approvals',
        'Automated batch payroll & vendor disbursements',
        'Unlimited corporate virtual & physical cards',
        'Direct double-entry ledger programmatic API',
        'QuickBooks & NetSuite automated sync',
        'Dedicated treasury relationship executive',
      ],
      cta: 'Contact Commercial Banking',
      href: '/contact',
      popular: false,
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
              <Link
                href="/login"
                className="text-sm text-[#94a3b8] hover:text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#38bdf8] mb-2 block">
            Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            No Hidden Fees. Pure Financial Clarity.
          </h1>
          <p className="text-base text-[#94a3b8] leading-relaxed">
            Choose the plan that fits your personal wealth or institutional corporate treasury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl p-7 flex flex-col justify-between relative transition-all ${
                t.popular
                  ? 'bg-[#161e2e] border-2 border-[#38bdf8] shadow-[0_0_30px_rgba(56,189,248,0.15)]'
                  : 'bg-[#161e2e] border border-[#1e293b]'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#38bdf8] text-[#0b0f19] text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold text-white mb-2">{t.name}</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold font-mono text-white">{t.price}</span>
                  <span className="text-xs text-[#94a3b8]">{t.period}</span>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">{t.description}</p>

                <div className="space-y-3 pt-4 border-t border-[#1e293b]">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-xs text-[#f8fafc]">
                      <Check className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href={t.href}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    t.popular
                      ? 'bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'bg-[#0b0f19] hover:bg-[#1e293b] text-white border border-[#1e293b]'
                  }`}
                >
                  <span>{t.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
