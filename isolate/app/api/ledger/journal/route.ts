import { NextRequest, NextResponse } from 'next/server'
import { ledgerEngine } from '@/lib/ledger/ledger-engine'

export async function GET(req: NextRequest) {
  const journals = ledgerEngine.getAllJournals()
  return NextResponse.json({
    count: journals.length,
    journals,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, journalId, reason, idempotencyKey, reference, description, entries, metadata } = body

    if (action === 'REVERSE') {
      if (!journalId || !reason) {
        return NextResponse.json({ error: 'journalId and reason are required for reversal' }, { status: 400 })
      }
      const result = ledgerEngine.reverseJournal(journalId, reason)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
      return NextResponse.json({ success: true, reversalJournal: result.reversalJournal })
    }

    // Standard journal post
    if (!idempotencyKey || !entries || entries.length < 2) {
      return NextResponse.json(
        { error: 'idempotencyKey and at least two balanced entries are required' },
        { status: 400 }
      )
    }

    const result = ledgerEngine.postJournal({
      idempotencyKey,
      reference: reference || `REF-${Date.now()}`,
      description: description || 'Transfer transaction',
      entries,
      metadata,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, journal: result.journal })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal ledger error' }, { status: 500 })
  }
}
