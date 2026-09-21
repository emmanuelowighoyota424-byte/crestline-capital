/**
 * Customer auth API — sign in, register, sign out and session lookup.
 *
 * Security notes:
 *  - The session is an HMAC-signed, httpOnly cookie; the customer id in it is
 *    the only source of identity (never a header or a request body field).
 *  - Sign-in attempts are rate limited per (IP + identifier) with a sliding
 *    window, and the counter is cleared on success.
 *  - Responses are `no-store` so a signed-in state is never cached.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_HEADER,
  clearedCustomerSessionCookieOptions,
  customerSessionCookieOptions,
  getCustomerSessionFromRequest,
  issueCustomerSessionToken,
  registerCustomer,
  toPublicCustomer,
  verifyCustomer,
} from '@/lib/customer/session'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_ATTEMPTS = 5

interface AttemptWindow {
  count: number
  startedAt: number
}

const attempts = new Map<string, AttemptWindow>()

function attemptKey(request: NextRequest, identifier: string): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? ''
  const ip = forwarded.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
  return `${ip}:${identifier.trim().toLowerCase()}`
}

function retryAfterSeconds(key: string): number {
  const window = attempts.get(key)
  if (!window) return 0
  return Math.max(1, Math.ceil((window.startedAt + RATE_LIMIT_WINDOW_MS - Date.now()) / 1000))
}

function isRateLimited(key: string): boolean {
  const window = attempts.get(key)
  if (!window) return false
  if (Date.now() - window.startedAt > RATE_LIMIT_WINDOW_MS) {
    attempts.delete(key)
    return false
  }
  return window.count >= RATE_LIMIT_MAX_ATTEMPTS
}

function recordFailedAttempt(key: string): void {
  const window = attempts.get(key)
  if (!window || Date.now() - window.startedAt > RATE_LIMIT_WINDOW_MS) {
    attempts.set(key, { count: 1, startedAt: Date.now() })
    return
  }
  window.count += 1
}

function noStore(body: unknown, init?: ResponseInit): NextResponse {
  const response = NextResponse.json(body, init)
  response.headers.set('Cache-Control', 'no-store')
  return response
}

/**
 * Whether the request reached us over HTTPS.
 *
 * The app is proxied in the hosted preview, so the forwarded protocol is the only
 * reliable signal. It decides the cookie's SameSite/Secure attributes.
 */
function isSecureRequest(request: NextRequest): boolean {
  const forwarded = request.headers.get('x-forwarded-proto')?.split(',')[0].trim()
  if (forwarded) return forwarded === 'https'
  try {
    return new URL(request.url).protocol === 'https:'
  } catch {
    return false
  }
}

/** GET /api/customer/auth?action=session — who, if anyone, is signed in. */
export async function GET(request: NextRequest) {
  const session = getCustomerSessionFromRequest(request)

  if (!session) {
    return noStore({ authenticated: false, customer: null })
  }

  return noStore({
    authenticated: true,
    customer: { id: session.customerId, name: session.name, email: session.email },
    expiresAt: session.expiresAt,
  })
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return noStore({ error: 'Invalid request' }, { status: 400 })
  }

  const action = String(payload.action ?? '')

  if (action === 'logout') {
    const response = noStore({ authenticated: false })
    response.cookies.set(
      CUSTOMER_SESSION_COOKIE,
      '',
      clearedCustomerSessionCookieOptions(isSecureRequest(request)),
    )
    return response
  }

  if (action === 'login') {
    const identifier = String(payload.identifier ?? payload.email ?? '')
    const password = String(payload.password ?? '')
    const remember = payload.remember !== false

    if (!identifier || !password) {
      return noStore({ error: 'Enter your email and password' }, { status: 400 })
    }

    const key = attemptKey(request, identifier)
    if (isRateLimited(key)) {
      return noStore(
        { error: `Too many sign-in attempts. Try again in ${retryAfterSeconds(key)}s.` },
        { status: 429 },
      )
    }

    const customer = await verifyCustomer(identifier, password)
    if (!customer) {
      recordFailedAttempt(key)
      const remaining = RATE_LIMIT_MAX_ATTEMPTS - (attempts.get(key)?.count ?? 0)
      return noStore(
        {
          error: 'Invalid email or password',
          attemptsRemaining: Math.max(0, remaining),
        },
        { status: 401 },
      )
    }

    attempts.delete(key)

    const sessionToken = issueCustomerSessionToken(customer)
    const response = noStore({
      authenticated: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        sandbox: customer.sandbox,
      },
      // Returned so the client can fall back to the session header when a browser
      // withholds the cookie (cross-site iframe). The httpOnly cookie is still set.
      sessionToken,
    })
    response.cookies.set(
      CUSTOMER_SESSION_COOKIE,
      sessionToken,
      customerSessionCookieOptions(remember, isSecureRequest(request)),
    )
    return response
  }

  if (action === 'register') {
    const result = await registerCustomer({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    })

    if (!result.ok) {
      return noStore({ error: result.error, field: result.field }, { status: 400 })
    }

    // Sign the new customer straight in, matching the onboarding flow.
    const sessionToken = issueCustomerSessionToken({ ...result.customer, passwordHash: '' })
    const response = noStore(
      { authenticated: true, customer: result.customer, sessionToken },
      { status: 201 },
    )
    response.cookies.set(
      CUSTOMER_SESSION_COOKIE,
      sessionToken,
      customerSessionCookieOptions(true, isSecureRequest(request)),
    )
    return response
  }

  return noStore({ error: 'Unsupported action' }, { status: 400 })
}
