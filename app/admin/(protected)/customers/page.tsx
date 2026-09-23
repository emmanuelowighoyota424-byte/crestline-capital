"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, Ban, CheckCircle2, RefreshCw, Search, Shield, Wallet } from "lucide-react"
import Link from "next/link"

type Account = { id:string; accountNumber:string; type:string; status:string; currency:string; balance:string|number; availableBalance:string|number }
type Customer = { id:string; email:string; firstName:string; lastName:string; phone:string|null; role:string; kycStatus:string; isActive:boolean; twoFactorEnabled:boolean; createdAt:string; lastLoginAt:string|null; accounts:Account[] }

export default function AdminCustomersPage(){
  const [customers,setCustomers]=useState<Customer[]>([]),[search,setSearch]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState(""),[busy,setBusy]=useState<string|null>(null),[amount,setAmount]=useState<Record<string,string>>({})
  const load=async()=>{setLoading(true);setError("");try{const r=await fetch('/api/admin/users',{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load customers');setCustomers(d.users||[])}catch(e:any){setError(e.message||'Unable to load customers')}finally{setLoading(false)}}
  useEffect(()=>{void load()},[])
  const filtered=useMemo(()=>customers.filter(c=>`${c.firstName} ${c.lastName} ${c.email} ${c.phone||''}`.toLowerCase().includes(search.toLowerCase())),[customers,search])
  async function action(userId:string,body:any){setBusy(userId);setError("");try{const r=await fetch('/api/admin/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId,...body})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Action failed');await load();return d}catch(e:any){setError(e.message||'Action failed')}finally{setBusy(null)}}
  return <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div><Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-3"><ArrowLeft className="h-4 w-4"/>Admin console</Link><h1 className="text-3xl font-bold">Customer Control Center</h1><p className="text-slate-400 mt-1">Manage the same customer identities and accounts used by the banking application.</p></div>
        <button onClick={()=>void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"><RefreshCw className="h-4 w-4"/>Refresh</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 mb-6"><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-400">Customers</p><p className="text-2xl font-bold mt-1">{customers.length}</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-400">Active</p><p className="text-2xl font-bold mt-1">{customers.filter(c=>c.isActive).length}</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="text-xs text-slate-400">Blocked</p><p className="text-2xl font-bold mt-1">{customers.filter(c=>!c.isActive).length}</p></div></div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 mb-6 flex items-center gap-3"><Search className="h-5 w-5 text-slate-500"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customer name, email or phone" className="w-full bg-transparent outline-none text-sm"/></div>
      {error&&<div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {loading?<div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">Loading customer accounts…</div>:<div className="space-y-4">{filtered.map(c=>{const account=c.accounts[0];const id=c.id;return <section key={id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h2 className="font-semibold">{c.firstName} {c.lastName}</h2>{c.isActive?<span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/>Active</span>:<span className="text-xs text-red-400 flex items-center gap-1"><Ban className="h-3 w-3"/>Blocked</span>}</div><p className="text-sm text-slate-400">{c.email}{c.phone?` · ${c.phone}`:''}</p><p className="text-xs text-slate-500 mt-1">Role: {c.role} · KYC: {c.kycStatus}</p></div><div className="text-right"><p className="text-xs text-slate-500">Available balance</p><p className="text-xl font-bold">{account?`${account.currency} ${account.availableBalance}`:'—'}</p></div></div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] items-end">
          <label className="text-xs text-slate-400">Balance adjustment<input value={amount[id]||''} onChange={e=>setAmount({...amount,[id]:e.target.value})} placeholder="e.g. 100 or -25" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none"/></label>
          <button disabled={!!busy||!amount[id]||!account} onClick={()=>void action(id,{action:'adjust-balance',accountId:account?.id,amount:amount[id],description:'Admin console adjustment'})} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold disabled:opacity-50"><Wallet className="h-4 w-4"/>{busy===id?'Saving…':'Adjust balance'}</button>
          <button disabled={!!busy} onClick={()=>void action(id,{action:c.isActive?'block':'unblock'})} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm disabled:opacity-50">{c.isActive?<><Ban className="h-4 w-4"/>Block</>:<><CheckCircle2 className="h-4 w-4"/>Unblock</>}</button>
          <button disabled={!!busy} onClick={()=>void action(id,{action:'set-role',role:c.role==='CUSTOMER'?'SUPPORT':'CUSTOMER'})} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm disabled:opacity-50"><Shield className="h-4 w-4"/>{c.role==='CUSTOMER'?'Grant support':'Set customer'}</button>
        </div>
      </section>})}</div>}
      {!loading&&filtered.length===0&&<div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">No customers match your search.</div>}
    </div>
  </main>
}
