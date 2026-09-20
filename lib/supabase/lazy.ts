import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * Lazily-created Supabase clients for route handlers. Server-only.
 *
 * Next.js evaluates every route module while collecting page data during
 * `next build`, so building a client at module scope throws
 * ("supabaseUrl is required.") on any deployment without Supabase credentials
 * and fails the entire build — even for routes nothing ever calls.
 *
 * Call `getSupabaseClient()` from inside a handler instead, and return
 * `supabaseNotConfigured()` when it yields null.
 */

export type SupabaseKeyKind = 'anon' | 'service'

const clients = new Map<SupabaseKeyKind, SupabaseClient>()

function readConfig(keyKind: SupabaseKeyKind): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    keyKind === 'service'
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return { url, key }
}

/** Whether the credentials for the given key kind are present. */
export function isSupabaseConfigured(keyKind: SupabaseKeyKind = 'anon'): boolean {
  return readConfig(keyKind) !== null
}

/** A cached Supabase client, or null when the deployment has no credentials. */
export function getSupabaseClient(keyKind: SupabaseKeyKind = 'anon'): SupabaseClient | null {
  const cached = clients.get(keyKind)
  if (cached) return cached

  const config = readConfig(keyKind)
  if (!config) return null

  const client = createClient(config.url, config.key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  clients.set(keyKind, client)
  return client
}

/**
 * A 503 for routes that need Supabase but have no credentials, so an
 * unconfigured deployment reads as "not configured" instead of an error.
 */
export function supabaseNotConfigured() {
  return NextResponse.json(
    {
      error: 'Database not configured',
      detail:
        'Set NEXT_PUBLIC_SUPABASE_URL plus NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) to enable this endpoint.',
      configured: false,
    },
    { status: 503 },
  )
}
