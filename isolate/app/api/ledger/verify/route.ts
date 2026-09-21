import { NextResponse } from 'next/server'
import { ledgerEngine } from '@/lib/ledger/ledger-engine'

export async function GET() {
  const audit = ledgerEngine.auditLedgerIntegrity()
  const accounts = ledgerEngine.getAllAccounts()

  return NextResponse.json({
    status: audit.isConsistent ? 'HEALTHY' : 'CORRUPTED',
    timestamp: new Date().toISOString(),
    audit,
    accountsSummary: {
      totalAccounts: accounts.length,
      assetAccounts: accounts.filter((a) => a.type === 'ASSET').length,
      liabilityAccounts: accounts.filter((a) => a.type === 'LIABILITY').length,
      revenueAccounts: accounts.filter((a) => a.type === 'REVENUE').length,
      expenseAccounts: accounts.filter((a) => a.type === 'EXPENSE').length,
    },
  })
}
