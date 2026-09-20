"use client"

/**
 * Browser-side customer session helpers.
 *
 * The signed session cookie is the primary mechanism. When a browser withholds it
 * — most notably when the app is loaded inside a cross-site iframe, as the hosted
 * preview does — the same signed token is sent as a header instead, so sign-in
 * keeps working either way.
 */

export const CUSTOMER_TOKEN_KEY = "crestline_session_token"

export interface CustomerIdentity {
  id: string
  name: string
  email: string
  sandbox?: boolean
}

export function readCustomerToken(): string | null {
  try {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY)
  } catch {
    return null
  }
}

export function saveCustomerToken(token?: string | null): void {
  if (!token) return
  try {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token)
  } catch {
    // Storage unavailable (private browsing) — the cookie may still work.
  }
}

export function clearCustomerToken(): void {
  try {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY)
  } catch {
    // Nothing to clear.
  }
}

/** Headers for a customer auth request, including the token when we have one. */
export function customerSessionHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = readCustomerToken()
  return { ...(extra ?? {}), ...(token ? { "x-customer-session": token } : {}) }
}

/** Cache the identity where the signed-in shell reads it. */
export function persistIdentity(customer: CustomerIdentity): void {
  try {
    localStorage.setItem("crestline_logged_in", "true")
    localStorage.setItem("crestline_user_id", String(customer.id ?? ""))
    localStorage.setItem("crestline_user_name", String(customer.name ?? ""))
    localStorage.setItem("crestline_user_email", String(customer.email ?? ""))
    localStorage.setItem("crestline_last_login", new Date().toISOString())
  } catch {
    // Storage unavailable — the session itself is unaffected.
  }
}

interface AuthPayload {
  authenticated?: boolean
  customer?: CustomerIdentity
  sessionToken?: string
  error?: string
  field?: string
}

async function readPayload(response: Response): Promise<AuthPayload> {
  try {
    return (await response.json()) as AuthPayload
  } catch {
    return {}
  }
}

/** Who, if anyone, is signed in. Prefers the cookie and falls back to the token. */
export async function fetchCustomerSession(): Promise<CustomerIdentity | null> {
  try {
    const response = await fetch("/api/customer/auth?action=session", {
      cache: "no-store",
      headers: customerSessionHeaders(),
    })
    const data = await readPayload(response)
    if (data.authenticated && data.customer) return data.customer
    // An answered "no" means any stored token is stale.
    clearCustomerToken()
    return null
  } catch {
    // A failed probe is treated as signed out; the server still verifies.
    return null
  }
}

export type SignInResult =
  | { ok: true; customer: CustomerIdentity }
  | { ok: false; error: string }

export async function signIn(
  identifier: string,
  password: string,
  remember = true,
): Promise<SignInResult> {
  try {
    const response = await fetch("/api/customer/auth", {
      method: "POST",
      headers: customerSessionHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ action: "login", identifier, password, remember }),
    })
    const data = await readPayload(response)

    if (response.ok && data.authenticated && data.customer) {
      saveCustomerToken(data.sessionToken)
      persistIdentity(data.customer)
      return { ok: true, customer: data.customer }
    }

    return { ok: false, error: data.error || "We could not sign you in. Please try again." }
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." }
  }
}

export type RegisterResult = SignInResult

export async function registerAccount(input: {
  name: string
  email: string
  phone?: string
  password: string
}): Promise<RegisterResult> {
  try {
    const response = await fetch("/api/customer/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", ...input }),
    })
    const data = await readPayload(response)

    if (response.ok && data.authenticated && data.customer) {
      saveCustomerToken(data.sessionToken)
      persistIdentity(data.customer)
      return { ok: true, customer: data.customer }
    }

    return { ok: false, error: data.error || "We could not open your account. Please try again." }
  } catch {
    return { ok: false, error: "Network error. Check your connection and try again." }
  }
}

/** End the server session and forget the cached identity. */
export async function signOut(): Promise<void> {
  try {
    await fetch("/api/customer/auth", {
      method: "POST",
      headers: customerSessionHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ action: "logout" }),
    })
  } catch {
    // Signing out locally still stands if the request fails.
  }

  clearCustomerToken()
  try {
    localStorage.removeItem("crestline_logged_in")
    localStorage.removeItem("crestline_user_id")
    localStorage.removeItem("crestline_user_name")
    localStorage.removeItem("crestline_user_email")
  } catch {
    // Nothing to clear.
  }
}
