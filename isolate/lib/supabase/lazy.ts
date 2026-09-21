/**
 * Lazily-created database clients for route handlers (server-only).
 * Prisma is always available — this preserves the existing API surface.
 */
import { NextResponse } from 'next/server'
import { createDbClient } from './client'

export type SupabaseKeyKind = 'anon' | 'service'

export function getSupabaseClient(_keyKind: SupabaseKeyKind = 'anon') {
  return createDbClient()
}

export function isSupabaseConfigured(_keyKind: SupabaseKeyKind = 'anon'): boolean {
  return true
}

export function supabaseNotConfigured() {
  return NextResponse.json(
    { error: 'Database not configured', detail: 'Set DATABASE_URL to enable this endpoint.', configured: false },
    { status: 503 },
  )
}
