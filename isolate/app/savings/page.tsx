'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import { PiggyBank, Plus, Target, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react'

export default function SavingsPage() {
  const { savingsGoals, accounts, formatCurrency, addSavingsGoal, updateSavingsGoal } = useBanking()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [goalName, setGoalName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState('')

  const savingsAccount = accounts.find((a) => a.type === 'savings') || accounts[1]

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalName || !targetAmount) return
    addSavingsGoal({
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      deadline: '2026-12-31',
      category: 'General',
      icon: 'Target',
    })
    setGoalName('')
    setTargetAmount('')
    setShowAddGoal(false)
  }

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGoalId || !depositAmount) return
    updateSavingsGoal(selectedGoalId, parseFloat(depositAmount))
    setSelectedGoalId(null)
    setDepositAmount('')
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Savings & Financial Goals</h1>
            <p className="text-sm text-[#94a3b8] mt-1">
              Earn 4.85% APY compounding daily with rule-based automated savings buffers.
            </p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-4 py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0b0f19] font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Goal</span>
          </button>
        </div>

        {/* APY Highlight Banner */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-[#161e2e] to-[#161e2e] border border-emerald-500/20 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">High-Yield Interest Active</span>
              <div className="text-2xl font-bold text-white font-mono">
                4.85% <span className="text-xs font-sans text-[#94a3b8]">Annual Percentage Yield (APY)</span>
              </div>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Current high-yield savings balance: <span className="text-white font-bold font-mono">{formatCurrency(savingsAccount?.balance || 0)}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#94a3b8] block">Estimated Annual Yield</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              +${(((savingsAccount?.balance || 0) * 0.0485)).toFixed(2)}/yr
            </span>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savingsGoals.map((goal) => {
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
            return (
              <div
                key={goal.id}
                className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#38bdf8] uppercase tracking-wider">{goal.category}</span>
                    <span className="text-xs font-mono text-[#94a3b8]">{progress}%</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{goal.name}</h3>

                  <div className="w-full bg-[#0b0f19] h-2.5 rounded-full overflow-hidden mb-4 border border-[#1e293b]">
                    <div
                      className="bg-gradient-to-r from-[#38bdf8] to-[#818cf8] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono mb-4">
                    <span className="text-white font-bold">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-[#64748b]">of {formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1e293b] flex items-center justify-between">
                  <span className="text-[11px] text-[#94a3b8]">Target: {goal.deadline}</span>
                  <button
                    onClick={() => setSelectedGoalId(goal.id)}
                    className="px-3 py-1.5 bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 text-[#38bdf8] text-xs font-semibold rounded-lg transition-colors"
                  >
                    + Add Funds
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-4">Create Savings Goal</h2>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g. Real Estate Down Payment"
                    className="w-full px-4 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Target Amount ($ USD)</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="25000"
                    className="w-full px-4 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="px-4 py-2 text-xs text-[#94a3b8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#38bdf8] text-[#0b0f19] font-semibold text-xs rounded-xl"
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contribute Modal */}
        {selectedGoalId && (
          <div className="fixed inset-0 z-50 bg-[#0b0f19]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#161e2e] border border-[#1e293b] rounded-2xl p-6 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-4">Contribute to Goal</h2>
              <form onSubmit={handleContribute} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] uppercase mb-2">Transfer Amount ($ USD)</label>
                  <input
                    type="number"
                    step="10"
                    min="1"
                    required
                    autoFocus
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="100.00"
                    className="w-full px-4 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => setSelectedGoalId(null)}
                    className="px-4 py-2 text-xs text-[#94a3b8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#38bdf8] text-[#0b0f19] font-semibold text-xs rounded-xl"
                  >
                    Transfer to Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  )
}
