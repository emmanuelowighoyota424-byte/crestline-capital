/**
 * Customer authentication for the Crestline Capital online banking experience.
 *
 * Self-contained by design: the credential is compared against a salted PBKDF2
 * hash (lib/auth/password-utils) and the resulting session is an HMAC-signed,
 * httpOnly cookie. A customer identity is never read from a client-supplied
 * header or request body.
 *
 * SANDBOX: the seeded account below is demo data. No real customer money moves
 * through it, and self-registered accounts live in this server process's memory
 * only — a production deployment must replace this store with a durable one.
 *
 * Configuration (all optional — the defaults make customer sign-in work in this
 * sandbox out of the box):
 *
 *   CUSTOMER_DEMO_EMAIL          seeded customer email
 *   CUSTOMER_DEMO_USERNAME       seeded customer sign-in name
 *   CUSTOMER_DEMO_PASSWORD_HASH  `salt.hash` for the seeded password
 *   CUSTOMER_SESSION_SECRET      secret used to sign session cookies
 *
 * Set CUSTOMER_SESSION_SECRET in production. The fallback below lives in source,
 * so anyone with the repository could forge a session cookie until it is set.
 */

import crypto from 'crypto'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { hashPassword, validatePasswordStrength, verifyPassword } from '@/lib/auth/password-utils'

export const CUSTOMER_SESSION_COOKIE = 'crestline_customer_session'
export const CUSTOMER_ROLE = 'customer' as const
export const CUSTOMER_SESSION_TTL_SECONDS = 12 * 60 * 60

const DEFAULT_DEMO_EMAIL = 'owighoyotaemmanuel424@gmail.com'
const DEFAULT_DEMO_USERNAME = 'Emmanuel'
// PBKDF2 (`salt.hash`) of the seeded sandbox password, produced by hashPassword().
const DEFAULT_DEMO_PASSWORD_HASH =
  '552acd77e86888d8b34c10027ebfe32e.1a36a03d46016de0b01ad186da68291c950f7121e0ea75a1fc781ea5b89539c6'
const DEFAULT_SESSION_SECRET =
  '9c1f0d6b4a8e27c53f0b91d48a6c2e7305b8f1d29c4a6e83507f2b19d6c4a0e7813b5'

export interface Customer {
  id: string
  name: string
  email: string
  /** Sign-in alias, e.g. "Emmanuel". */
  username: string
  phone?: string
  createdAt: number
  /** Stored credential hash — never returned to a client. */
  passwordHash: string
  /** True for the seeded demo account. */
  sandbox: boolean
}

/** The customer shape that is safe to send to the browser. */
export type PublicCustomer = Omit<Customer, 'passwordHash'>

export interface CustomerSession {
  customerId: string
  name: string
  email: string
  role: typeof CUSTOMER_ROLE
  issuedAt: number
  expiresAt: number
}

export function toPublicCustomer(customer: Customer): PublicCustomer {
  const { passwordHash: _passwordHash, ...rest } = customer
  return rest
}

function demoEmail(): string {
  return (process.env.CUSTOMER_DEMO_EMAIL || DEFAULT_DEMO_EMAIL).trim().toLowerCase()
}

function demoUsername(): string {
  return (process.env.CUSTOMER_DEMO_USERNAME || DEFAULT_DEMO_USERNAME).trim()
}

function demoPasswordHash(): string {
  return process.env.CUSTOMER_DEMO_PASSWORD_HASH || DEFAULT_DEMO_PASSWORD_HASH
}

function sessionSecret(): string {
  return process.env.CUSTOMER_SESSION_SECRET || DEFAULT_SESSION_SECRET
}

/** Length-safe, constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, 'utf8')
  const bufferB = Buffer.from(b, 'utf8')
  if (bufferA.length !== bufferB.length) return false
  return crypto.timingSafeEqual(bufferA, bufferB)
}

/**
 * In-process customer store.
 *
 * Seeded lazily with the sandbox customer and extended by self-registration.
 * Keyed by lowercased email.
 */
const customers = new Map<string, Customer>()
let seeded = false

function seedSandboxCustomer(): void {
  if (seeded) return
  seeded = true

  const customer: Customer = {
    id: 'cust_emmanuel',
    name: 'Emmanuel',
    email: demoEmail(),
    username: demoUsername(),
    createdAt: Date.now(),
    passwordHash: demoPasswordHash(),
    sandbox: true,
  }

  customers.set(customer.email, customer)
}

function findByIdentifier(identifier: string): Customer | undefined {
  if (!identifier) return undefined
  const byEmail = customers.get(identifier)
  if (byEmail) return byEmail
  for (const customer of customers.values()) {
    if (customer.username.toLowerCase() === identifier) return customer
  }
  return undefined
}

/**
 * Verify an identifier (email or sign-in name) and password.
 *
 * The password is hashed even when the identifier is unknown, so a wrong
 * identifier and a wrong password take a comparable amount of time.
 */
export async function verifyCustomer(
  identifier: unknown,
  password: unknown,
): Promise<Customer | null> {
  seedSandboxCustomer()

  const customer = findByIdentifier(String(identifier ?? '').trim().toLowerCase())
  const passwordMatches = await verifyPassword(
    String(password ?? ''),
    customer?.passwordHash ?? demoPasswordHash(),
  )

  return customer && passwordMatches ? customer : null
}

export interface RegistrationInput {
  name?: unknown
  email?: unknown
  phone?: unknown
  password?: unknown
}

export type RegistrationResult =
  | { ok: true; customer: PublicCustomer }
  | { ok: false; error: string; field?: 'name' | 'email' | 'password' }

/** Create a customer account. Returns a field-level error when input is invalid. */
export async function registerCustomer(input: RegistrationInput): Promise<RegistrationResult> {
  seedSandboxCustomer()

  const name = String(input.name ?? '').trim()
  const email = String(input.email ?? '').trim().toLowerCase()
  const phone = String(input.phone ?? '').trim()
  const password = String(input.password ?? '')

  if (name.length < 2) {
    return { ok: false, error: 'Enter your full name', field: 'name' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: 'Enter a valid email address', field: 'email' }
  }
  if (customers.has(email)) {
    return {
      ok: false,
      error: 'An account with this email already exists. Sign in instead.',
      field: 'email',
    }
  }

  const strength = validatePasswordStrength(password)
  if (!strength.isStrong) {
    return { ok: false, error: strength.errors[0], field: 'password' }
  }

  const customer: Customer = {
    id: `cust_${crypto.randomBytes(12).toString('hex')}`,
    name,
    email,
    username: name.split(/\s+/)[0] || email.split('@')[0],
    phone: phone || undefined,
    createdAt: Date.now(),
    passwordHash: await hashPassword(password),
    sandbox: false,
  }

  customers.set(customer.email, customer)
  return { ok: true, customer: toPublicCustomer(customer) }
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
}

/** Create a signed session token for a signed-in customer. */
export function issueCustomerSessionToken(customer: Customer): string {
  const issuedAt = Date.now()
  const payload = Buffer.from(
    JSON.stringify({
      sub: customer.id,
      email: customer.email,
      name: customer.name,
      role: CUSTOMER_ROLE,
      iat: issuedAt,
      exp: issuedAt + CUSTOMER_SESSION_TTL_SECONDS * 1000,
    }),
  ).toString('base64url')

  return `${payload}.${sign(payload)}`
}

/** Verify a session token's signature and expiry. Returns null when invalid. */
export function readCustomerSessionToken(token: unknown): CustomerSession | null {
  if (typeof token !== 'string') return null

  const separator = token.lastIndexOf('.')
  if (separator <= 0) return null

  const payload = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  if (!safeEqual(signature, sign(payload))) return null

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof claims?.exp !== 'number' || claims.exp <= Date.now()) return null
    if (claims?.role !== CUSTOMER_ROLE) return null
    if (typeof claims?.sub !== 'string' || !claims.sub) return null

    return {
      customerId: claims.sub,
      name: typeof claims.name === 'string' ? claims.name : '',
      email: typeof claims.email === 'string' ? claims.email : '',
      role: CUSTOMER_ROLE,
      issuedAt: typeof claims.iat === 'number' ? claims.iat : 0,
      expiresAt: claims.exp,
    }
  } catch {
    return null
  }
}

/**
 * Cookie attributes for a freshly issued customer session.
 *
 * With `remember` false the cookie has no maxAge and is dropped when the browser
 * closes; the signed token still expires on its own after the session TTL.
 */
export function customerSessionCookieOptions(remember = true) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    ...(remember ? { maxAge: CUSTOMER_SESSION_TTL_SECONDS } : {}),
  }
}

/** Cookie attributes that clear a customer session. */
export function clearedCustomerSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  }
}

/** Read + verify the customer session from a route handler's request cookies. */
export function getCustomerSessionFromRequest(request: NextRequest): CustomerSession | null {
  return readCustomerSessionToken(request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value)
}

/** Read + verify the customer session from server components, layouts and actions. */
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies()
  return readCustomerSessionToken(cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value)
}
