import { createNeonAuth, type NeonAuth } from '@neondatabase/auth/next/server';

/**
 * Lazily-created Neon Auth instance.
 *
 * `createNeonAuth` validates its configuration eagerly and throws
 * ("Missing required config: cookies.secret.") when credentials are absent.
 * Next.js evaluates every route module while collecting page data during
 * `next build`, so constructing this at module scope failed the whole
 * production build on any deployment without Neon credentials.
 *
 * Call `getNeonAuth()`/`getNeonAuthHandler()` from inside a handler instead,
 * and report "not configured" when they return null.
 */

let instance: NeonAuth | null = null
let handler: ReturnType<NeonAuth['handler']> | null = null

/** Whether the Neon Auth credentials are present. */
export function isNeonAuthConfigured(): boolean {
  return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET)
}

/** The Neon Auth instance, or null when the deployment has no credentials. */
export function getNeonAuth(): NeonAuth | null {
  if (instance) return instance

  const baseUrl = process.env.NEON_AUTH_BASE_URL
  const secret = process.env.NEON_AUTH_COOKIE_SECRET
  if (!baseUrl || !secret) return null

  instance = createNeonAuth({
    baseUrl,
    cookies: {
      secret,
      sessionDataTtl: 300, // 5 minutes session cache
    },
  })
  return instance
}

/** The API route handler, or null when the deployment has no credentials. */
export function getNeonAuthHandler(): ReturnType<NeonAuth['handler']> | null {
  const auth = getNeonAuth()
  if (!auth) return null
  handler ??= auth.handler()
  return handler
}
