"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { useBanking } from "@/hooks/use-banking"

import dynamic from "next/dynamic"

const DashboardHeader = dynamic(() => import("@/components/dashboard-header").then(m => ({ default: m.DashboardHeader })), { ssr: false })
const QuickActions = dynamic(() => import("@/components/quick-actions").then(m => ({ default: m.QuickActions })), { ssr: false })
const AccountsSection = dynamic(() => import("@/components/accounts-section").then(m => ({ default: m.AccountsSection })), { ssr: false })
const CreditJourneyCard = dynamic(() => import("@/components/credit-journey-card").then(m => ({ default: m.CreditJourneyCard })), { ssr: false })
const BottomNavigation = dynamic(() => import("@/components/bottom-navigation").then(m => ({ default: m.BottomNavigation })), { ssr: false })
const SendMoneyDrawer = dynamic(() => import("@/components/send-money-drawer").then(m => ({ default: m.SendMoneyDrawer })), { ssr: false })
const DepositChecksDrawer = dynamic(() => import("@/components/deposit-checks-drawer").then(m => ({ default: m.DepositChecksDrawer })), { ssr: false })
const PayBillsDrawer = dynamic(() => import("@/components/pay-bills-drawer").then(m => ({ default: m.PayBillsDrawer })), { ssr: false })
const AddAccountDrawer = dynamic(() => import("@/components/add-account-drawer").then(m => ({ default: m.AddAccountDrawer })), { ssr: false })
const AccountDetailsDrawer = dynamic(() => import("@/components/account-details-drawer").then(m => ({ default: m.AccountDetailsDrawer })), { ssr: false })
const LinkExternalDrawer = dynamic(() => import("@/components/link-external-drawer").then(m => ({ default: m.LinkExternalDrawer })), { ssr: false })
const CreditScoreDrawer = dynamic(() => import("@/components/credit-score-drawer").then(m => ({ default: m.CreditScoreDrawer })), { ssr: false })
const PayTransferView = dynamic(() => import("@/components/pay-transfer-view").then(m => ({ default: m.PayTransferView })), { ssr: false })
const PlanTrackView = dynamic(() => import("@/components/plan-track-view").then(m => ({ default: m.PlanTrackView })), { ssr: false })
const OffersView = dynamic(() => import("@/components/offers-view").then(m => ({ default: m.OffersView })), { ssr: false })
const MoreView = dynamic(() => import("@/components/more-view").then(m => ({ default: m.MoreView })), { ssr: false })
const SavingsGoalsView = dynamic(() => import("@/components/savings-goals-view").then(m => ({ default: m.SavingsGoalsView })), { ssr: false })
const SpendingAnalysisView = dynamic(() => import("@/components/spending-analysis-view").then(m => ({ default: m.SpendingAnalysisView })), { ssr: false })
const TransferDrawer = dynamic(() => import("@/components/transfer-drawer").then(m => ({ default: m.TransferDrawer })), { ssr: false })
const WireDrawer = dynamic(() => import("@/components/wire-drawer").then(m => ({ default: m.WireDrawer })), { ssr: false })
const TransactionReceiptModal = dynamic(() => import("@/components/transaction-receipt-modal").then(m => ({ default: m.TransactionReceiptModal })), { ssr: false })
const TransactionsDrawer = dynamic(() => import("@/components/transactions-drawer").then(m => ({ default: m.TransactionsDrawer })), { ssr: false })
const LoginPage = dynamic(() => import("@/components/login-page").then(m => ({ default: m.LoginPage })), { ssr: false })
const DisputeTransactionDrawer = dynamic(() => import("@/components/dispute-transaction-drawer").then(m => ({ default: m.DisputeTransactionDrawer })), { ssr: false })
const ViewTransition = dynamic(() => import("@/components/view-transition").then(m => ({ default: m.ViewTransition })), { ssr: false })

type ViewId = "accounts" | "pay-transfer" | "plan-track" | "offers" | "savings-goals" | "spending-analysis" | "more"

/* ──────────────────────────── Landing Page ──────────────────────────── */

function LandingPage({ onLogin }: { onLogin: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "landing-nav-glass" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M7 16l4-8 4 4 4-6" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">Crestline Capital</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Features</a>
              <a href="#accounts" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Accounts</a>
              <a href="#security" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Security</a>
              <a href="#about" className="text-sm text-[#94a3b8] hover:text-white transition-colors">About</a>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={onLogin} className="text-sm text-[#94a3b8] hover:text-white transition-colors px-4 py-2">
                Sign In
              </button>
              <button onClick={onLogin} className="text-sm bg-[#38bdf8] text-[#0b0f19] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#0ea5e9] transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                Open Account
              </button>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#94a3b8]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#161e2e] border-t border-[#1e293b] px-4 py-4 space-y-3">
            <a href="#features" className="block text-[#94a3b8] hover:text-white py-2">Features</a>
            <a href="#accounts" className="block text-[#94a3b8] hover:text-white py-2">Accounts</a>
            <a href="#security" className="block text-[#94a3b8] hover:text-white py-2">Security</a>
            <a href="#about" className="block text-[#94a3b8] hover:text-white py-2">About</a>
            <div className="pt-3 border-t border-[#1e293b] space-y-2">
              <button onClick={onLogin} className="block w-full text-left text-[#94a3b8] hover:text-white py-2">Sign In</button>
              <button onClick={onLogin} className="block w-full bg-[#38bdf8] text-[#0b0f19] py-3 rounded-lg font-semibold text-center">Open Account</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#818cf8]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#38bdf8]/3 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full animate-pulse" />
              Premium Digital Banking
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-[#f8fafc]">Banking</span>
            <br />
            <span className="crestline-text-gradient">Reimagined</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#94a3b8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the future of digital banking with Crestline Capital. Secure, intelligent, and beautifully designed for how you actually manage money.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={onLogin} className="px-8 py-4 bg-[#38bdf8] text-[#0b0f19] rounded-xl font-bold text-base hover:bg-[#0ea5e9] transition-all hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:scale-[1.02]">
              Get Started Free
            </button>
            <button onClick={onLogin} className="px-8 py-4 border border-[#1e293b] text-[#f8fafc] rounded-xl font-semibold text-base hover:border-[#38bdf8]/30 hover:bg-[#161e2e] transition-all">
              Sign In to Account
            </button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border border-[#1e293b] bg-[#161e2e]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                <span className="ml-3 text-xs text-[#94a3b8]">Crestline Capital Dashboard</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#0b0f19]/60 rounded-xl p-5 border border-[#1e293b]">
                  <p className="text-xs text-[#94a3b8] mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-[#f8fafc]">$206,050.75</p>
                  <p className="text-xs text-[#10b981] mt-1">+2.4% this month</p>
                </div>
                <div className="bg-[#0b0f19]/60 rounded-xl p-5 border border-[#1e293b]">
                  <p className="text-xs text-[#94a3b8] mb-1">Checking Account</p>
                  <p className="text-2xl font-bold text-[#f8fafc]">$28,450.75</p>
                  <p className="text-xs text-[#38bdf8] mt-1">Available</p>
                </div>
                <div className="bg-[#0b0f19]/60 rounded-xl p-5 border border-[#1e293b]">
                  <p className="text-xs text-[#94a3b8] mb-1">Savings</p>
                  <p className="text-2xl font-bold text-[#f8fafc]">$52,500.00</p>
                  <p className="text-xs text-[#10b981] mt-1">+4.25% APY</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { desc: "Wire Transfer Credit", amount: "+$5,000.00", type: "credit", time: "Today" },
                  { desc: "Electric Bill - Con Edison", amount: "-$187.45", type: "debit", time: "Yesterday" },
                  { desc: "Amazon Purchase", amount: "-$156.99", type: "debit", time: "2 days ago" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0b0f19]/40 rounded-lg p-4 border border-[#1e293b]/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-[#10b981]/10" : "bg-[#f43f5e]/10"}`}>
                        {tx.type === "credit" ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#f8fafc]">{tx.desc}</p>
                        <p className="text-xs text-[#94a3b8]">{tx.time}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${tx.type === "credit" ? "text-[#10b981]" : "text-[#f43f5e]"}`}>
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">
              A complete digital banking platform built for modern life. From everyday payments to long-term wealth building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏦", title: "Smart Accounts", desc: "Checking, savings, and business accounts with competitive rates and real-time balance tracking." },
              { icon: "💳", title: "Card Management", desc: "Debit and virtual cards with instant freeze/unfreeze, spending controls, and transaction alerts." },
              { icon: "💸", title: "Instant Transfers", desc: "Send money to anyone with wire, ACH, and instant transfers. Multi-step security verification." },
              { icon: "📊", title: "Spending Analytics", desc: "AI-powered insights into your spending patterns with category breakdowns and trends." },
              { icon: "🔐", title: "Bank-Grade Security", desc: "2FA, biometric login, fraud detection, and real-time monitoring protect every transaction." },
              { icon: "🎯", title: "Savings Goals", desc: "Set targets, track progress, and automate savings to reach your financial goals faster." },
            ].map((feature, i) => (
              <div key={i} className="feature-card group">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accounts Section */}
      <section id="accounts" className="py-24 relative bg-[#0f172a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Accounts Designed
                <br />
                <span className="crestline-text-gradient">For Your Life</span>
              </h2>
              <p className="text-[#94a3b8] mb-8 leading-relaxed">
                Whether you need a daily checking account, high-yield savings, or a business account for your company, Crestline Capital has the right solution with no hidden fees.
              </p>
              <div className="space-y-4">
                {[
                  { name: "Crestline Checking", rate: "No monthly fees", desc: "Free debit card, mobile deposits, and unlimited transactions" },
                  { name: "Crestline Savings", rate: "Up to 4.50% APY", desc: "High-yield savings with automatic round-ups and goal tracking" },
                  { name: "Crestline Business", rate: "Payroll-ready", desc: "Business accounts with invoicing, multi-user access, and analytics" },
                ].map((account, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[#161e2e]/50 border border-[#1e293b] hover:border-[#38bdf8]/20 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-[#38bdf8]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#38bdf8] text-lg">{["💳", "🏦", "🏢"][i]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-[#f8fafc]">{account.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8]">{account.rate}</span>
                      </div>
                      <p className="text-sm text-[#94a3b8] mt-1">{account.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-[#1e293b] bg-[#161e2e]/80 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Account Overview</h3>
                  <span className="text-xs text-[#10b981]">● All accounts active</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#0b0f19]/60 rounded-xl p-5 border border-[#1e293b]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-[#94a3b8]">Total Portfolio</span>
                      <span className="text-xs text-[#10b981]">+12.8% YTD</span>
                    </div>
                    <p className="text-3xl font-bold">$206,050.75</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0b0f19]/60 rounded-lg p-4 border border-[#1e293b]">
                      <p className="text-xs text-[#94a3b8] mb-1">Checking</p>
                      <p className="text-lg font-bold">$28,450</p>
                    </div>
                    <div className="bg-[#0b0f19]/60 rounded-lg p-4 border border-[#1e293b]">
                      <p className="text-xs text-[#94a3b8] mb-1">Savings</p>
                      <p className="text-lg font-bold">$52,500</p>
                    </div>
                    <div className="bg-[#0b0f19]/60 rounded-lg p-4 border border-[#1e293b]">
                      <p className="text-xs text-[#94a3b8] mb-1">Business</p>
                      <p className="text-lg font-bold">$125,000</p>
                    </div>
                    <div className="bg-[#0b0f19]/60 rounded-lg p-4 border border-[#1e293b]">
                      <p className="text-xs text-[#94a3b8] mb-1">Rewards</p>
                      <p className="text-lg font-bold text-[#38bdf8]">42,580 pts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Security You Can <span className="crestline-text-gradient">Trust</span>
          </h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto mb-16">
            Bank-grade security built into every layer. Your money and data are protected by industry-leading encryption and monitoring.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🔒", title: "256-bit Encryption", desc: "Military-grade encryption for all data in transit and at rest" },
              { icon: "🛡️", title: "Fraud Detection", desc: "Real-time AI-powered monitoring catches suspicious activity instantly" },
              { icon: "📱", title: "Biometric Auth", desc: "Face ID, fingerprint, and device recognition for secure access" },
              { icon: "⚡", title: "Instant Alerts", desc: "Get notified immediately of every transaction and security event" },
            ].map((item, i) => (
              <div key={i} className="feature-card text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[#f8fafc] mb-2">{item.title}</h3>
                <p className="text-sm text-[#94a3b8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-[#1e293b] bg-gradient-to-br from-[#161e2e] to-[#0f172a] p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#38bdf8]/3 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Banking?</h2>
              <p className="text-[#94a3b8] mb-8 max-w-lg mx-auto">
                Join thousands of customers who trust Crestline Capital with their financial future. Open an account in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={onLogin} className="px-8 py-4 bg-[#38bdf8] text-[#0b0f19] rounded-xl font-bold hover:bg-[#0ea5e9] transition-all hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                  Open Your Account
                </button>
                <button onClick={onLogin} className="px-8 py-4 border border-[#1e293b] text-[#f8fafc] rounded-xl font-semibold hover:border-[#38bdf8]/30 transition-all">
                  Sign In
                </button>
              </div>
              <p className="text-xs text-[#94a3b8] mt-6">No fees. No minimums. FDIC insured up to $250,000.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-[#f8fafc] mb-4">Accounts</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Checking</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Savings</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Business</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Credit Cards</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#f8fafc] mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Transfers</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Bill Pay</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Investments</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Loans</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#f8fafc] mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-sm text-[#94a3b8] hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Press</a></li>
                <li><a href="#security" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#f8fafc] mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1e293b]">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M7 16l4-8 4 4 4-6" />
                </svg>
              </div>
              <span className="font-semibold">Crestline Capital</span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              © 2026 Crestline Capital. All rights reserved. Banking services provided by Crestline Capital N.A., Member FDIC.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ──────────────────────────── Main Page ──────────────────────────── */

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false)
  const [activeView, setActiveView] = useState<ViewId>("accounts")

  const [sendMoneyOpen, setSendMoneyOpen] = useState(false)
  const [depositChecksOpen, setDepositChecksOpen] = useState(false)
  const [payBillsOpen, setPayBillsOpen] = useState(false)
  const [addAccountOpen, setAddAccountOpen] = useState(false)
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false)
  const [linkExternalOpen, setLinkExternalOpen] = useState(false)
  const [creditScoreOpen, setCreditScoreOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [wireOpen, setWireOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const [transactionsOpen, setTransactionsOpen] = useState(false)
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [disputeTransactionId, setDisputeTransactionId] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    userProfile,
    addNotification,
    addActivity,
    addLoginHistory,
    appSettings,
    settingsEnforcer,
    isLocked,
    unlockApp,
  } = useBanking()

  const getUserFirstName = useCallback(() => {
    if (!userProfile?.name) return "User"
    const parts = userProfile.name.split(" ")
    return parts[0] || "User"
  }, [userProfile?.name])

  useEffect(() => {
    const checkAuth = () => {
      try {
        const loggedIn = localStorage.getItem("crestline_logged_in") === "true"
        setIsLoggedIn(loggedIn)
      } catch {
        // localStorage may be unavailable
      }
      setIsCheckingAuth(false)
    }
    // Safety timeout: always show content after 2s even if something crashes
    const timeout = setTimeout(checkAuth, 2000)
    checkAuth() // try immediately too
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (isLocked && isLoggedIn) {
      setShowBiometricPrompt(true)
    }
  }, [isLocked, isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn) return

    const deviceInfo = navigator.userAgent.includes("Mobile") ? "Mobile Device" : "Desktop Browser"

    if (addActivity) {
      addActivity({
        action: "Signed in successfully",
        device: deviceInfo,
        location: "Current Session",
      })
    }

    if (addLoginHistory) {
      addLoginHistory({
        device: deviceInfo,
        location: "New York, NY",
        status: "success",
        ip: "192.168.1." + Math.floor(Math.random() * 255),
      })
    }

    const welcomeTimer = setTimeout(() => {
      toast({
        title: `Welcome back, ${getUserFirstName()}!`,
        description: "Your accounts are up to date.",
        duration: 3000,
      })
    }, 1500)

    return () => {
      clearTimeout(welcomeTimer)
    }
  }, [isLoggedIn, addActivity, addLoginHistory, toast, getUserFirstName])

  const handleLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem("crestline_logged_in", "true")
  }

  const handleLogout = () => {
    if (addActivity) {
      addActivity({
        action: "Signed out",
        device: navigator.userAgent.includes("Mobile") ? "Mobile Device" : "Desktop Browser",
        location: "Current Session",
      })
    }
    setIsLoggedIn(false)
    localStorage.removeItem("crestline_logged_in")
    localStorage.removeItem("crestline_user_id")
    localStorage.removeItem("crestline_user_data")
    localStorage.removeItem("crestline_user_role")
    localStorage.removeItem("crestline_user_name")
    localStorage.removeItem("crestline_user_email")
    localStorage.removeItem("crestline_user_accounts")
    localStorage.removeItem("crestline_session_token")
    localStorage.removeItem("crestline_last_login")
    setActiveView("accounts")
    toast({
      title: "Signed out successfully",
      description: "You have been securely signed out.",
    })
  }

  const handleOpenReceipt = (transactionId: string) => {
    setSelectedTransactionId(transactionId)
    setReceiptOpen(true)
  }

  const handleOpenDispute = (transactionId: string) => {
    setDisputeTransactionId(transactionId)
    setDisputeOpen(true)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const handleUnlock = async () => {
    if (!settingsEnforcer) return

    if (appSettings?.biometricLogin) {
      const biometricSuccess = await settingsEnforcer.checkBiometric()
      if (biometricSuccess) {
        unlockApp()
        setShowBiometricPrompt(false)
        toast({ title: "Unlocked", description: "Welcome back!" })
      } else {
        toast({ title: "Authentication Failed", description: "Biometric authentication failed", variant: "destructive" })
      }
    } else {
      unlockApp()
      setShowBiometricPrompt(false)
    }
  }

  const handleViewChange = useCallback((newView: string) => {
    setActiveView(newView as ViewId)
  }, [])

  const textSizeClass = settingsEnforcer?.getTextSizeClass(appSettings?.textSize || "medium") || "text-base"

  useEffect(() => {
    if (appSettings?.highContrast) {
      document.body.classList.add("high-contrast")
    } else {
      document.body.classList.remove("high-contrast")
    }
  }, [appSettings?.highContrast])

  useEffect(() => {
    if (appSettings?.reduceMotion) {
      document.body.classList.add("reduce-motion")
    } else {
      document.body.classList.remove("reduce-motion")
    }
  }, [appSettings?.reduceMotion])

  useEffect(() => {
    if (appSettings?.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [appSettings?.darkMode])

  const renderViewContent = () => {
    switch (activeView) {
      case "accounts":
        return (
          <div className="flex flex-col gap-5 pb-24">
            <QuickActions
              onSendMoney={() => setSendMoneyOpen(true)}
              onDepositChecks={() => setDepositChecksOpen(true)}
              onPayBills={() => setPayBillsOpen(true)}
              onAddAccount={() => setAddAccountOpen(true)}
              onTransfer={() => setTransferOpen(true)}
            />
            <AccountsSection
              onViewAccount={() => setAccountDetailsOpen(true)}
              onLinkExternal={() => setLinkExternalOpen(true)}
              onSeeAllTransactions={() => setTransactionsOpen(true)}
              onReceiptOpen={handleOpenReceipt}
            />
            <CreditJourneyCard onViewScore={() => setCreditScoreOpen(true)} />
          </div>
        )
      case "pay-transfer":
        return (
          <PayTransferView
            onSendMoney={() => setSendMoneyOpen(true)}
            onPayBills={() => setPayBillsOpen(true)}
            onTransfer={() => setTransferOpen(true)}
            onWire={() => setWireOpen(true)}
            onReceiptOpen={handleOpenReceipt}
          />
        )
      case "plan-track":
        return <PlanTrackView />
      case "offers":
        return <OffersView />
      case "savings-goals":
        return <SavingsGoalsView />
      case "spending-analysis":
        return <SpendingAnalysisView />
      case "more":
        return <MoreView onLogout={handleLogout} />
      default:
        return null
    }
  }

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#818cf8] flex items-center justify-center animate-pulse">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-8 4 4 4-6" />
            </svg>
          </div>
          <p className="text-[#f8fafc] font-medium">Crestline Capital</p>
          <p className="text-xs text-[#94a3b8]">Please wait while we prepare everything</p>
        </div>
      </div>
    )
  }

  // Show landing page when not logged in
  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />
  }

  // Biometric prompt
  if (showBiometricPrompt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19] p-4">
        <div className="max-w-sm w-full bg-[#161e2e] rounded-2xl p-8 shadow-2xl text-center border border-[#1e293b]">
          <div className="w-20 h-20 bg-[#38bdf8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#f8fafc] mb-2">App Locked</h2>
          <p className="text-[#94a3b8] mb-6">
            {appSettings?.biometricLogin ? "Use biometric authentication to unlock" : "Tap to unlock your app"}
          </p>
          <button onClick={handleUnlock} className="w-full bg-[#38bdf8] text-[#0b0f19] py-3 rounded-lg font-semibold hover:bg-[#0ea5e9] transition-colors">
            {appSettings?.biometricLogin ? "Unlock with Biometric" : "Unlock"}
          </button>
          <button onClick={handleLogout} className="w-full mt-3 text-[#94a3b8] py-2 text-sm hover:text-[#f8fafc] transition-colors">
            Sign out instead
          </button>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className={`min-h-screen min-h-dvh bg-[#0b0f19] overflow-x-hidden overscroll-none ${textSizeClass}`}>
      <DashboardHeader />

      <main className="px-4 pt-5 touch-pan-y">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[#f8fafc]">
            {getGreeting()}, {getUserFirstName()}
          </h1>
          <p className="text-sm text-[#94a3b8] mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <ViewTransition viewKey={activeView} loadingDuration={300} showSpinner>
          {renderViewContent()}
        </ViewTransition>
      </main>

      <BottomNavigation activeView={activeView} onViewChange={handleViewChange} />

      {/* Drawers */}
      <SendMoneyDrawer open={sendMoneyOpen} onOpenChange={setSendMoneyOpen} onReceiptOpen={handleOpenReceipt} />
      <TransferDrawer open={transferOpen} onOpenChange={setTransferOpen} onReceiptOpen={handleOpenReceipt} />
      <WireDrawer open={wireOpen} onOpenChange={setWireOpen} onReceiptOpen={handleOpenReceipt} />
      <DepositChecksDrawer open={depositChecksOpen} onOpenChange={setDepositChecksOpen} />
      <PayBillsDrawer open={payBillsOpen} onOpenChange={setPayBillsOpen} onReceiptOpen={handleOpenReceipt} />
      <AddAccountDrawer open={addAccountOpen} onOpenChange={setAddAccountOpen} />
      <AccountDetailsDrawer open={accountDetailsOpen} onOpenChange={setAccountDetailsOpen} onReceiptOpen={handleOpenReceipt} />
      <LinkExternalDrawer open={linkExternalOpen} onOpenChange={setLinkExternalOpen} />
      <CreditScoreDrawer open={creditScoreOpen} onOpenChange={setCreditScoreOpen} />
      <TransactionsDrawer open={transactionsOpen} onOpenChange={setTransactionsOpen} onReceiptOpen={handleOpenReceipt} />
      <TransactionReceiptModal open={receiptOpen} onOpenChange={setReceiptOpen} transactionId={selectedTransactionId} onDisputeOpen={handleOpenDispute} />
      <DisputeTransactionDrawer open={disputeOpen} onOpenChange={setDisputeOpen} transactionId={disputeTransactionId} />
    </div>
  )
}
