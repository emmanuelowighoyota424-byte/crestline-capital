'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  Coins,
  Radio,
  Server,
  Users,
  GraduationCap,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Play,
  Share2,
} from 'lucide-react'
import {
  AdminPlan,
  AdminCryptoAsset,
  AdminSignal,
} from '@/lib/admin/admin-store'

interface TradingModulesProps {
  activeModuleId: string
  plans: AdminPlan[]
  cryptoAssets: AdminCryptoAsset[]
  signals: AdminSignal[]
}

export default function TradingModules({
  activeModuleId,
  plans,
  cryptoAssets,
  signals,
}: TradingModulesProps) {
  // New Signal State
  const [showSignalModal, setShowSignalModal] = useState(false)
  const [sigAsset, setSigAsset] = useState('BTC/USD')
  const [sigType, setSigType] = useState<'BUY' | 'SELL'>('BUY')
  const [sigEntry, setSigEntry] = useState('65000')
  const [sigStop, setSigStop] = useState('63500')
  const [sigTarget, setSigTarget] = useState('69000')

  const handleBroadcastSignal = (e: React.FormEvent) => {
    e.preventDefault()
    signals.unshift({
      id: `sig_${Date.now()}`,
      asset: sigAsset,
      type: sigType,
      entryPrice: parseFloat(sigEntry),
      stopLoss: parseFloat(sigStop),
      targetPrice: parseFloat(sigTarget),
      timeframe: '4H Institutional',
      status: 'ACTIVE',
      publishedAt: 'Just now',
    })
    setShowSignalModal(false)
  }

  return (
    <div className="space-y-6">
      {/* 24. Plans (?id=24) */}
      {activeModuleId === '24' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Yield Plans & Fixed Return Vaults (?id=24)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Manage fixed income plans, daily compounding liquidity sweeps, and APY rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => (
              <div key={p.id} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{p.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8]">{p.description}</p>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {p.apyPercent}% APY
                </div>
                <div className="text-xs text-[#64748b] space-y-1">
                  <div>Term: <span className="text-white font-mono">{p.termDays === 0 ? 'Liquid (Daily)' : `${p.termDays} Days`}</span></div>
                  <div>Min: <span className="text-white font-mono">${p.minDeposit.toLocaleString()}</span></div>
                  <div>Subscribers: <span className="text-white font-mono">{p.activeSubscribers}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 25. Crypto (?id=25) */}
      {activeModuleId === '25' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>Digital Asset & Custody Reserves (?id=25)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Hot wallet settlement balances and Fireblocks institutional cold storage reserves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cryptoAssets.map((c) => (
              <div key={c.symbol} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-base text-white">{c.name}</span>
                    <span className="text-xs font-mono text-amber-400 ml-2">({c.symbol})</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                    {c.status}
                  </span>
                </div>
                <div className="bg-[#0b0f19] p-3 rounded-xl border border-[#1e293b] space-y-2 text-xs">
                  <div>
                    <span className="text-[#64748b] block">Hot Wallet (Operational)</span>
                    <span className="font-mono text-white font-bold">{c.hotWalletBalance} {c.symbol}</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block">Cold Storage (Institutional Reserve)</span>
                    <span className="font-mono text-emerald-400 font-bold">{c.coldWalletReserve} {c.symbol}</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block">Deposit Address</span>
                    <span className="font-mono text-[10px] text-[#38bdf8] break-all">{c.depositAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 26. Signals (?id=26) */}
      {activeModuleId === '26' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-400" />
                <span>Trading Signal Broadcast Engine (?id=26)</span>
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Publish institutional trade signals directly to connected client dashboards and telegram alerts.
              </p>
            </div>
            <button
              onClick={() => setShowSignalModal(true)}
              className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast New Signal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signals.map((sig) => (
              <div key={sig.id} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-white">{sig.asset}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      sig.type === 'BUY'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {sig.type}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 bg-[#0b0f19] p-3 rounded-xl border border-[#1e293b] text-center text-xs">
                  <div>
                    <span className="text-[#64748b] block text-[10px]">ENTRY</span>
                    <span className="font-mono text-white font-bold">{sig.entryPrice}</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[10px]">STOP LOSS</span>
                    <span className="font-mono text-red-400 font-bold">{sig.stopLoss}</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[10px]">TARGET</span>
                    <span className="font-mono text-emerald-400 font-bold">{sig.targetPrice}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                  <span>Timeframe: {sig.timeframe}</span>
                  <span className="font-mono">Published: {sig.publishedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 27. Providers (?id=27) */}
      {activeModuleId === '27' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Server className="w-5 h-5 text-[#38bdf8]" />
              <span>External Liquidity & Data Providers (?id=27)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Market data feeds, core banking gateways, and crypto liquidity pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Bloomberg B-PIPE Feed', type: 'Market Data', status: 'ONLINE', ping: '12ms' },
              { name: 'Refinitiv Forex Interbank', type: 'FX Liquidity', status: 'ONLINE', ping: '18ms' },
              { name: 'Plaid Core Banking API', type: 'Bank Verification', status: 'ONLINE', ping: '44ms' },
              { name: 'Fireblocks Vault Gateway', type: 'MPC Custody', status: 'ONLINE', ping: '29ms' },
            ].map((p) => (
              <div key={p.name} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">{p.name}</span>
                  <span className="text-xs text-[#94a3b8]">{p.type}</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {p.status}
                  </span>
                  <div className="text-[11px] font-mono text-[#64748b] mt-1">Latency: {p.ping}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 28. Copy Trading (?id=28) */}
      {activeModuleId === '28' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Copy Trading & Master Strategy Allocation (?id=28)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Monitor verified portfolio managers and retail follower allocations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { manager: 'Crestline Macro Quant Alpha', aum: '$48.5M', winRate: '78.4%', leverage: '1:5', followers: 412 },
              { manager: 'Sovereign Treasury Arbitrage', aum: '$120.2M', winRate: '94.1%', leverage: '1:2', followers: 890 },
            ].map((m) => (
              <div key={m.manager} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 space-y-3">
                <span className="font-bold text-base text-white block">{m.manager}</span>
                <div className="grid grid-cols-3 gap-2 text-xs text-center bg-[#0b0f19] p-3 rounded-xl border border-[#1e293b]">
                  <div>
                    <span className="text-[#64748b] block text-[10px]">AUM</span>
                    <span className="font-mono text-emerald-400 font-bold">{m.aum}</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[10px]">WIN RATE</span>
                    <span className="font-mono text-white font-bold">{m.winRate}</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[10px]">FOLLOWERS</span>
                    <span className="font-mono text-[#38bdf8] font-bold">{m.followers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 29. Courses (?id=29) */}
      {activeModuleId === '29' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#38bdf8]" />
              <span>Client Educational Portal & Academy (?id=29)</span>
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Institutional research briefs, market analysis videos, and trading masterclasses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Global Macro Currency Hedging', modules: '6 Modules', duration: '3.5 Hours', enrolled: 184 },
              { title: 'Fixed Income & Treasury Yield Vaults', modules: '4 Modules', duration: '2 Hours', enrolled: 290 },
              { title: 'Private Wealth & Asset Protection', modules: '8 Modules', duration: '5 Hours', enrolled: 95 },
            ].map((c) => (
              <div key={c.title} className="bg-[#161e2e] border border-[#1e293b] rounded-2xl p-5 space-y-2">
                <span className="font-bold text-sm text-white block">{c.title}</span>
                <div className="text-xs text-[#94a3b8] space-y-1">
                  <div>Modules: <span className="text-white">{c.modules}</span></div>
                  <div>Runtime: <span className="text-white">{c.duration}</span></div>
                  <div>Enrolled Clients: <span className="text-[#38bdf8] font-mono">{c.enrolled}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Signal Modal */}
      {showSignalModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161e2e] border border-[#1e293b] rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Broadcast Trading Signal</h3>
            <form onSubmit={handleBroadcastSignal} className="space-y-3 text-xs">
              <div>
                <label className="text-[#94a3b8] block mb-1">Asset Pair</label>
                <input
                  type="text"
                  required
                  value={sigAsset}
                  onChange={(e) => setSigAsset(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[#94a3b8] block mb-1">Direction</label>
                <select
                  value={sigType}
                  onChange={(e) => setSigType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white"
                >
                  <option value="BUY">BUY / LONG</option>
                  <option value="SELL">SELL / SHORT</option>
                </select>
              </div>
              <div>
                <label className="text-[#94a3b8] block mb-1">Entry Price</label>
                <input
                  type="number"
                  required
                  value={sigEntry}
                  onChange={(e) => setSigEntry(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[#94a3b8] block mb-1">Stop Loss</label>
                <input
                  type="number"
                  required
                  value={sigStop}
                  onChange={(e) => setSigStop(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[#94a3b8] block mb-1">Target Price</label>
                <input
                  type="number"
                  required
                  value={sigTarget}
                  onChange={(e) => setSigTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b0f19] border border-[#1e293b] rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setShowSignalModal(false)}
                  className="px-4 py-2 bg-[#1e293b] text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl"
                >
                  Broadcast to Clients
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
