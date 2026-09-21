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
              <Link
                href="/login"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0a4fa6] mb-2 block">
            Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            No Hidden Fees. Pure Financial Clarity.
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            Choose the plan that fits your personal wealth or institutional corporate treasury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl p-7 flex flex-col justify-between relative transition-all ${
                t.popular
                  ? 'bg-gray-100 border-2 border-[#0a4fa6] shadow-[0_0_30px_rgba(56,189,248,0.15)]'
                  : 'bg-gray-100 border border-gray-200'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0a4fa6] text-gray-900 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t.name}</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold font-mono text-gray-900">{t.price}</span>
                  <span className="text-xs text-gray-500">{t.period}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">{t.description}</p>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-xs text-gray-900">
                      <Check className="w-4 h-4 text-[#0a4fa6] shrink-0 mt-0.5" />
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
                      ? 'bg-[#0a4fa6] hover:bg-[#083d80] text-gray-900 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'bg-white hover:bg-gray-200 text-gray-900 border border-gray-200'
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
