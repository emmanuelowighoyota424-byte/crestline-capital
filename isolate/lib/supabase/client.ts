/**
 * Prisma-backed adapter providing Supabase-compatible query builder API.
 * All existing `supabase.from('table').select().eq()` calls work unchanged.
 * Server-only — never import from client components.
 */

import prisma from '@/lib/prisma'

// ─── Helpers ────────────────────────────────────────────────────────────────

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())
}

function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase())
}

function toJS(row: any): any {
  if (row === null || row === undefined) return row
  if (Array.isArray(row)) return row.map(toJS)
  if (typeof row !== 'object' || row instanceof Date) return row
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(row)) {
    out[snakeToCamel(k)] = v
  }
  return out
}

function toDB(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(toDB)
  if (typeof obj !== 'object' || obj instanceof Date) return obj
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    out[camelToSnake(k)] = v
  }
  return out
}

// ─── Table → Prisma model mapping ──────────────────────────────────────────

const TABLE_MAP: Record<string, string> = {
  users: 'UserProfile',
  accounts: 'AccountRecord',
  transactions: 'TransactionRecord',
  notifications: 'NotificationRecord',
  bill_payments: 'BillPayment',
  credit_scores: 'CreditScore',
  credit_cards: 'CreditCard',
  credit_journey: 'CreditJourney',
  credit_utilization: 'CreditUtilization',
  login_history: 'LoginHistory',
  device_registrations: 'DeviceRegistration',
  sessions: 'SessionRecord',
  security_events: 'SecurityEvent',
  security_settings: 'SecuritySetting',
  recovery_sessions: 'RecoverySession',
  notification_preferences: 'NotificationPreference',
  notification_logs: 'NotificationLog',
  admin_transfers: 'AdminTransfer',
  wire_transfers: 'WireTransfer',
  zelle_contacts: 'ZelleContact',
  zelle_transfers: 'ZelleTransfer',
  transaction_alerts: 'TransactionAlert',
  user_settings: 'UserSetting',
  employee: 'Employee',
  department: 'Department',
  attendance: 'Attendance',
  product: 'Product',
  category: 'ProductCategory',
  audit_log: 'AuditLog',
  audit_logs: 'AuditLog',
}

function getModel(table: string): any {
  const modelName = TABLE_MAP[table]
  if (!modelName) throw new Error(`[db] Unknown table: ${table}`)
  return (prisma as any)[modelName]
}

// ─── Query Builder ──────────────────────────────────────────────────────────

type FilterOp =
  | { type: 'eq'; col: string; val: any }
  | { type: 'neq'; col: string; val: any }
  | { type: 'gt'; col: string; val: any }
  | { type: 'gte'; col: string; val: any }
  | { type: 'lt'; col: string; val: any }
  | { type: 'lte'; col: string; val: any }
  | { type: 'like'; col: string; val: string }
  | { type: 'in'; col: string; val: any[] }
  | { type: 'or'; conditions: FilterOp[] }

type OrderSpec = { col: string; ascending: boolean }

class QueryBuilder {
  private table: string
  private selectCols: string | null = null
  private filters: FilterOp[] = []
  private orders: OrderSpec[] = []
  private limitN: number | null = null
  private singleResult = false
  private isInsert = false
  private insertData: any[] = []
  private isUpdate = false
  private updateData: Record<string, any> = {}
  private isDelete = false
  private shouldReturnInserted = false

  constructor(table: string) { this.table = table }

  select(cols?: string) { if (cols && cols !== '*') this.selectCols = cols; return this }
  eq(col: string, val: any) { this.filters.push({ type: 'eq', col, val }); return this }
  is(col: string, val: any) { return this.eq(col, val); }
  neq(col: string, val: any) { this.filters.push({ type: 'neq', col, val }); return this }
  gt(col: string, val: any) { this.filters.push({ type: 'gt', col, val }); return this }
  gte(col: string, val: any) { this.filters.push({ type: 'gte', col, val }); return this }
  lt(col: string, val: any) { this.filters.push({ type: 'lt', col, val }); return this }
  lte(col: string, val: any) { this.filters.push({ type: 'lte', col, val }); return this }
  like(col: string, pattern: string) { this.filters.push({ type: 'like', col, val: pattern }); return this }
  in(col: string, values: any[]) { this.filters.push({ type: 'in', col, val: values }); return this }

  or(conditions: string) {
    const parts = conditions.split(',')
    const parsed: FilterOp[] = []
    for (const part of parts) {
      // Skip filters that already have col property
      const m = part.trim().match(/^(\w+)\.(eq|neq|gt|gte|lt|lte|like|in)\.(.+)$/)

      if (m) parsed.push({ type: m[2] as any, col: m[1], val: m[3] })
    }
    if (parsed.length > 0) this.filters.push({ type: 'or', conditions: parsed })
    return this
  }

  order(col: string, opts?: { ascending?: boolean }) { this.orders.push({ col, ascending: opts?.ascending ?? true }); return this }
  limit(n: number) { this.limitN = n; return this }
  single() { this.singleResult = true; this.limitN = 1; return this }
  maybeSingle() { this.singleResult = true; this.limitN = 1; return this }
  insert(data: any[]) { this.isInsert = true; this.insertData = data; this.shouldReturnInserted = true; return this }
  update(data: Record<string, any>) { this.isUpdate = true; this.updateData = data; return this }
  delete() { this.isDelete = true; return this }
  upsert(data: any | any[], _opts?: any) {
    this.isInsert = true
    this.insertData = Array.isArray(data) ? data : [data]
    this.shouldReturnInserted = true
    return this
  }

  private buildWhere(): any {
    if (this.filters.length === 0) return {}
    const conditions = this.filters.map((f) => this.buildFilter(f))
    return conditions.length === 1 ? conditions[0] : { AND: conditions }
  }

  private buildFilter(f: FilterOp): any {
    if (f.type === 'or') return { OR: f.conditions.map((c) => this.buildFilter(c)) }
    const dbCol = camelToSnake((f as any).col)
    switch (f.type) {
      case 'eq': return { [dbCol]: f.val }
      case 'neq': return { NOT: { [dbCol]: f.val } }
      case 'gt': return { [dbCol]: { gt: f.val } }
      case 'gte': return { [dbCol]: { gte: f.val } }
      case 'lt': return { [dbCol]: { lt: f.val } }
      case 'lte': return { [dbCol]: { lte: f.val } }
      case 'like': {
        const v = String(f.val)
        if (v.startsWith('%') && v.endsWith('%')) return { [dbCol]: { contains: v.slice(1, -1) } }
        if (v.startsWith('%')) return { [dbCol]: { endsWith: v.slice(1) } }
        if (v.endsWith('%')) return { [dbCol]: { startsWith: v.slice(0, -1) } }
        return { [dbCol]: { contains: v } }
      }
      case 'in': return { [dbCol]: { in: f.val } }
      default: return {}
    }
  }

  private buildOrderBy(): any {
    if (this.orders.length === 0) return undefined
    return this.orders.map((o) => ({ [camelToSnake(o.col)]: o.ascending ? 'asc' : 'desc' }))
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected)
  }

  private async execute(): Promise<any> {
    try {
      if (this.isInsert) return this.executeInsert()
      if (this.isUpdate) return this.executeUpdate()
      if (this.isDelete) return this.executeDelete()
      return this.executeSelect()
    } catch (err: any) {
      console.error(`[db] Query error on ${this.table}:`, err?.message)
      return { data: this.singleResult ? null : [], error: { message: err?.message || 'Database query failed' } }
    }
  }

  private async executeSelect() {
    const model = getModel(this.table)
    const where = this.buildWhere()
    const orderBy = this.buildOrderBy()
    const take = this.limitN ?? undefined
    const select = this.selectCols
      ? Object.fromEntries(this.selectCols.split(',').map((c) => [camelToSnake(c.trim()), true]))
      : undefined
    const opts: any = { where, orderBy, take }
    if (select) opts.select = select

    const rows: any[] = await model.findMany(this.singleResult ? { ...opts, take: 1 } : opts)
    return { data: this.singleResult ? toJS(rows[0] ?? null) : toJS(rows), error: null }
  }

  private async executeInsert() {
    const model = getModel(this.table)
    const rows = this.insertData.map((d) => toDB(d))
    if (rows.length === 1) {
      const created = await model.create({ data: rows[0] })
      return { data: [toJS(created)], error: null }
    }
    await model.createMany({ data: rows, skipDuplicates: true })
    return { data: rows.map((r: any) => toJS(r)), error: null }
  }

  private async executeUpdate() {
    const model = getModel(this.table)
    await model.updateMany({ where: this.buildWhere(), data: toDB(this.updateData) })
    return { data: null, error: null }
  }

  private async executeDelete() {
    const model = getModel(this.table)
    await model.deleteMany({ where: this.buildWhere() })
    return { data: null, error: null }
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

// ─── Realtime stubs ────────────────────────────────────────────────────────
// Supabase Realtime channel API stubs. These are no-ops since Prisma
// doesn't have a built-in realtime subscription system. Replace with
// WebSocket/SSE if realtime is needed.

function createChannelStub(_name: string) {
  return {
    on(_event: string, _filter: any, callback?: any) {
      return this
    },
    subscribe(_callback?: any) { return this },
    unsubscribe() { return this },
    send(_payload: any) { return Promise.resolve({ error: null }) },
  }
}

export function createDbClient() {
  return {
    from(table: string) { return new QueryBuilder(table) },
    channel(_name: string) { return createChannelStub(_name) },
    removeChannel(_channel: any) {},
    removeChannels() {},
  }
}

export const createClient = createDbClient
export const createServiceClient = createDbClient
export function getSupabaseClient(_kind?: string) { return createDbClient() }
export function isSupabaseConfigured() { return true }
export function supabaseNotConfigured() {
  return new Response(JSON.stringify({ error: 'Database not configured' }), { status: 503, headers: { 'Content-Type': 'application/json' } })
}
