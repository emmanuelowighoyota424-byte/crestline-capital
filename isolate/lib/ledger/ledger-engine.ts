/**
 * Crestline Capital Double-Entry Ledger Engine
 *
 * Enforces fundamental accounting equation:
 * SUM(DEBITS) === SUM(CREDITS)
 *
 * Provides:
 * - Immutable Journal entries
 * - Multi-legged transaction support
 * - Idempotency key protection
 * - Balance validation (prevents unauthorized overdraft)
 * - Atomic journal commits & reversals
 */

export type LedgerAccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'
export type EntryType = 'DEBIT' | 'CREDIT'
export type JournalStatus = 'COMMITTED' | 'REVERSED' | 'FAILED'

export interface LedgerAccount {
  id: string
  code: string
  name: string
  type: LedgerAccountType
  currency: string
  balance: number // Current calculated balance in cents (integer to avoid floating-point errors)
  allowOverdraft: boolean
  customerId?: string
}

export interface LedgerEntryItem {
  id: string
  journalId: string
  accountId: string
  accountCode: string
  type: EntryType
  amountCents: number // Always positive integer in cents
  memo?: string
}

export interface JournalRecord {
  id: string
  idempotencyKey: string
  reference: string
  description: string
  status: JournalStatus
  createdAt: string
  entries: LedgerEntryItem[]
  reversedByJournalId?: string
  reversalOfJournalId?: string
  metadata?: Record<string, any>
}

// In-memory persistent state (synced with DB / localStorage where configured)
class LedgerStore {
  private accounts: Map<string, LedgerAccount> = new Map()
  private journals: Map<string, JournalRecord> = new Map()
  private idempotencyIndex: Map<string, string> = new Map() // idempotencyKey -> journalId

  constructor() {
    this.seedDefaultAccounts()
  }

  private seedDefaultAccounts() {
    const defaultAccounts: LedgerAccount[] = [
      // Assets
      { id: 'acc_vault', code: '1000-VAULT', name: 'Crestline Reserve Vault', type: 'ASSET', currency: 'USD', balance: 5000000000, allowOverdraft: true },
      { id: 'acc_fed_clearing', code: '1010-FED-CLEARING', name: 'Federal Reserve Clearing Account', type: 'ASSET', currency: 'USD', balance: 2500000000, allowOverdraft: true },
      { id: 'acc_card_clearing', code: '1020-CARD-CLEARING', name: 'Card Network Settlement', type: 'ASSET', currency: 'USD', balance: 1000000000, allowOverdraft: true },
      
      // Liabilities (Customer Deposits are liabilities to the bank)
      { id: 'acc_cust_checking_primary', code: '2001-CHK-PRIMARY', name: 'Customer Checking Pool', type: 'LIABILITY', currency: 'USD', balance: 345000000, allowOverdraft: false, customerId: 'usr_primary' },
      { id: 'acc_cust_savings_primary', code: '2002-SAV-PRIMARY', name: 'Customer High-Yield Savings Pool', type: 'LIABILITY', currency: 'USD', balance: 682500000, allowOverdraft: false, customerId: 'usr_primary' },
      { id: 'acc_cust_business_primary', code: '2003-BIZ-PRIMARY', name: 'Customer Business Treasury Pool', type: 'LIABILITY', currency: 'USD', balance: 1250000000, allowOverdraft: false, customerId: 'usr_primary' },
      
      // Revenues & Fees
      { id: 'acc_fee_income', code: '4001-FEE-INCOME', name: 'Wire & Transfer Fee Income', type: 'REVENUE', currency: 'USD', balance: 8450000, allowOverdraft: true },
      { id: 'acc_interest_income', code: '4002-INT-INCOME', name: 'Loan & Credit Interest Income', type: 'REVENUE', currency: 'USD', balance: 24500000, allowOverdraft: true },
      
      // Expenses
      { id: 'acc_interest_expense', code: '5001-INT-EXPENSE', name: 'Savings Interest Expense Paid', type: 'EXPENSE', currency: 'USD', balance: 12000000, allowOverdraft: true },
    ]

    for (const acc of defaultAccounts) {
      this.accounts.set(acc.id, acc)
    }
  }

  public getAccount(id: string): LedgerAccount | undefined {
    return this.accounts.get(id)
  }

  public getAllAccounts(): LedgerAccount[] {
    return Array.from(this.accounts.values())
  }

  public getAccountByCode(code: string): LedgerAccount | undefined {
    return Array.from(this.accounts.values()).find((a) => a.code === code)
  }

  public getJournal(id: string): JournalRecord | undefined {
    return this.journals.get(id)
  }

  public getAllJournals(): JournalRecord[] {
    return Array.from(this.journals.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  /**
   * Post a balanced journal entry with idempotency verification
   */
  public postJournal(params: {
    idempotencyKey: string
    reference: string
    description: string
    entries: Array<{
      accountId: string
      type: EntryType
      amountCents: number
      memo?: string
    }>
    metadata?: Record<string, any>
  }): { success: boolean; journal?: JournalRecord; error?: string } {
    // 1. Idempotency Check
    if (this.idempotencyIndex.has(params.idempotencyKey)) {
      const existingJournalId = this.idempotencyIndex.get(params.idempotencyKey)!
      return {
        success: true,
        journal: this.journals.get(existingJournalId),
      }
    }

    // 2. Validate at least 2 legs
    if (!params.entries || params.entries.length < 2) {
      return { success: false, error: 'A double-entry journal requires at least two entry legs.' }
    }

    // 3. Mathematical balance check: Total Debits must equal Total Credits
    let totalDebits = 0
    let totalCredits = 0

    for (const entry of params.entries) {
      if (entry.amountCents <= 0 || !Number.isInteger(entry.amountCents)) {
        return { success: false, error: `Invalid entry amount ${entry.amountCents}. Must be a positive integer in cents.` }
      }
      if (!this.accounts.has(entry.accountId)) {
        return { success: false, error: `Account ${entry.accountId} does not exist in the ledger.` }
      }

      if (entry.type === 'DEBIT') {
        totalDebits += entry.amountCents
      } else {
        totalCredits += entry.amountCents
      }
    }

    if (totalDebits !== totalCredits) {
      return {
        success: false,
        error: `Ledger invariant broken: Total Debits ($${(totalDebits / 100).toFixed(2)}) must equal Total Credits ($${(totalCredits / 100).toFixed(2)}). Delta: ${totalDebits - totalCredits} cents.`,
      }
    }

    // 4. Balance check on normal accounts (ensure sufficient funds)
    for (const entry of params.entries) {
      const acc = this.accounts.get(entry.accountId)!
      if (!acc.allowOverdraft) {
        // For LIABILITY accounts (e.g. Customer deposits), DEBIT reduces balance
        if (acc.type === 'LIABILITY' && entry.type === 'DEBIT') {
          if (acc.balance < entry.amountCents) {
            return {
              success: false,
              error: `Insufficient available funds in account ${acc.name}. Requested: $${(entry.amountCents / 100).toFixed(2)}, Available: $${(acc.balance / 100).toFixed(2)}.`,
            }
          }
        }
        // For ASSET accounts, CREDIT reduces balance
        if (acc.type === 'ASSET' && entry.type === 'CREDIT') {
          if (acc.balance < entry.amountCents) {
            return {
              success: false,
              error: `Insufficient reserve balance in asset account ${acc.name}.`,
            }
          }
        }
      }
    }

    // 5. Commit entries atomically
    const journalId = `jrnl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const ledgerEntries: LedgerEntryItem[] = []

    for (let i = 0; i < params.entries.length; i++) {
      const item = params.entries[i]
      const acc = this.accounts.get(item.accountId)!

      // Apply balance changes based on normal balance rules:
      // Assets & Expenses increase with DEBIT, decrease with CREDIT
      // Liabilities, Equity, Revenues increase with CREDIT, decrease with DEBIT
      if (acc.type === 'ASSET' || acc.type === 'EXPENSE') {
        acc.balance += item.type === 'DEBIT' ? item.amountCents : -item.amountCents
      } else {
        acc.balance += item.type === 'CREDIT' ? item.amountCents : -item.amountCents
      }

      ledgerEntries.push({
        id: `ent_${journalId}_${i + 1}`,
        journalId,
        accountId: item.accountId,
        accountCode: acc.code,
        type: item.type,
        amountCents: item.amountCents,
        memo: item.memo || params.description,
      })
    }

    const journal: JournalRecord = {
      id: journalId,
      idempotencyKey: params.idempotencyKey,
      reference: params.reference,
      description: params.description,
      status: 'COMMITTED',
      createdAt: new Date().toISOString(),
      entries: ledgerEntries,
      metadata: params.metadata,
    }

    this.journals.set(journalId, journal)
    this.idempotencyIndex.set(params.idempotencyKey, journalId)

    return { success: true, journal }
  }

  /**
   * Reverse an existing journal entry immutably by posting an inverse journal
   */
  public reverseJournal(journalId: string, reason: string): { success: boolean; reversalJournal?: JournalRecord; error?: string } {
    const original = this.journals.get(journalId)
    if (!original) {
      return { success: false, error: `Journal ${journalId} not found.` }
    }
    if (original.status === 'REVERSED') {
      return { success: false, error: `Journal ${journalId} has already been reversed.` }
    }

    const invertedEntries = original.entries.map((entry) => ({
      accountId: entry.accountId,
      type: (entry.type === 'DEBIT' ? 'CREDIT' : 'DEBIT') as EntryType,
      amountCents: entry.amountCents,
      memo: `Reversal of ${entry.id}: ${reason}`,
    }))

    const reversalResult = this.postJournal({
      idempotencyKey: `rev_${original.idempotencyKey}_${Date.now()}`,
      reference: `REV-${original.reference}`,
      description: `Reversal: ${original.description} (${reason})`,
      entries: invertedEntries,
      metadata: { originalJournalId: journalId, reversalReason: reason },
    })

    if (!reversalResult.success) {
      return reversalResult
    }

    original.status = 'REVERSED'
    original.reversedByJournalId = reversalResult.journal!.id
    reversalResult.journal!.reversalOfJournalId = journalId

    return { success: true, reversalJournal: reversalResult.journal }
  }

  /**
   * Alias for postJournal used by admin-store.
   * Maps accountCode-based entries to accountId-based entries.
   */
  public commitTransaction(params: {
    idempotencyKey: string
    reference: string
    description: string
    entries: Array<{
      accountCode: string
      type: EntryType
      amountCents: number
      memo?: string
    }>
    metadata?: Record<string, any>
  }): { id: string } {
    // Map account codes to account IDs
    const mappedEntries = params.entries.map((e) => {
      const account = this.getAccountByCode(e.accountCode)
      return {
        accountId: account?.id || e.accountCode,
        type: e.type,
        amountCents: e.amountCents,
        memo: e.memo,
      }
    })

    const result = this.postJournal({
      ...params,
      entries: mappedEntries,
    })

    if (!result.success) {
      throw new Error(`Ledger commit failed: ${result.error}`)
    }

    return { id: result.journal!.id }
  }

  /**
   * Health audit: Verifies all journals have balanced debits and credits
   */
  public auditLedgerIntegrity(): {
    isConsistent: boolean
    totalJournals: number
    totalEntries: number
    balancedJournalsCount: number
    mismatchedJournals: string[]
  } {
    const mismatched: string[] = []
    let totalEntries = 0

    for (const journal of this.journals.values()) {
      let debits = 0
      let credits = 0
      for (const entry of journal.entries) {
        totalEntries++
        if (entry.type === 'DEBIT') debits += entry.amountCents
        else credits += entry.amountCents
      }
      if (debits !== credits) {
        mismatched.push(journal.id)
      }
    }

    return {
      isConsistent: mismatched.length === 0,
      totalJournals: this.journals.size,
      totalEntries,
      balancedJournalsCount: this.journals.size - mismatched.length,
      mismatchedJournals: mismatched,
    }
  }
}

// Global Singleton instance
const globalForLedger = globalThis as unknown as { ledgerStore?: LedgerStore }
export const ledgerEngine = globalForLedger.ledgerStore || new LedgerStore()
if (process.env.NODE_ENV !== 'production') {
  globalForLedger.ledgerStore = ledgerEngine
}
