/**
 * Convex integration helpers (server-safe).
 *
 * `NEXT_PUBLIC_CONVEX_URL` is the deployment URL the app talks to.
 *
 * The HTTP client is created lazily so a missing URL can never break a route, and
 * `convexStatus()` runs a real query rather than only checking that config is
 * present - a configured-but-unreachable deployment is reported as such instead of
 * looking healthy.
 */

import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const PROBE_TIMEOUT_MS = 3000

export function convexUrl(): string {
  return process.env.NEXT_PUBLIC_CONVEX_URL?.trim() || ''
}

export function isConvexConfigured(): boolean {
  return Boolean(convexUrl())
}

let client: ConvexHttpClient | null = null

/** The shared server-side Convex HTTP client, created on first use. */
export function getConvexClient(): ConvexHttpClient {
  const url = convexUrl()
  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured')
  }
  if (!client) {
    client = new ConvexHttpClient(url)
  }
  return client
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Convex probe timed out after ${ms}ms`)), ms),
    ),
  ])
}

export interface ConvexLedgerSummary {
  journals: number
  entries: number
  consistent: boolean
  unbalancedCount: number
}

export interface ConvexStatus {
  provider: 'convex'
  /** NEXT_PUBLIC_CONVEX_URL is present. */
  configured: boolean
  /** A real query round-tripped successfully. */
  reachable: boolean
  mode: 'live' | 'not_configured' | 'unreachable'
  deployment?: string
  ledger?: ConvexLedgerSummary
  error?: string
}

/**
 * Probe the deployment with a real query.
 *
 * `ledgerIntegrity` is used because it exercises the database and the deployed
 * functions, and its result also tells us the double-entry ledger is balanced.
 */
export async function convexStatus(): Promise<ConvexStatus> {
  if (!isConvexConfigured()) {
    return {
      provider: 'convex',
      configured: false,
      reachable: false,
      mode: 'not_configured',
    }
  }

  const deployment = convexUrl()

  try {
    const ledger = await withTimeout(
      getConvexClient().query(api.banking.ledgerIntegrity, {}),
      PROBE_TIMEOUT_MS,
    )

    return {
      provider: 'convex',
      configured: true,
      reachable: true,
      mode: 'live',
      deployment,
      ledger: {
        journals: ledger.journals,
        entries: ledger.entries,
        consistent: ledger.consistent,
        unbalancedCount: ledger.unbalancedCount,
      },
    }
  } catch (error) {
    return {
      provider: 'convex',
      configured: true,
      reachable: false,
      mode: 'unreachable',
      deployment,
      error: error instanceof Error ? error.message : 'Convex probe failed',
    }
  }
}
