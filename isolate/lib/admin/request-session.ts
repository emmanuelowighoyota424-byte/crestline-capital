/**
 * Admin session resolution for API route handlers.
 *
 * The session id is read from the httpOnly session cookie, falling back to the
 * session header the admin console sends. It is always verified against the
 * server-side session store - an admin identity or role is never taken from a
 * client-supplied header.
 */

import type { NextRequest } from 'next/server'
import {
  AdminAuthEngine,
  type AdminPermission,
  type AdminSession,
} from '@/lib/admin/admin-auth'

export const ADMIN_SESSION_COOKIE = 'crestline_admin_session'

/** Verified admin session for this request, or null when absent/invalid/expired. */
export function getAdminSession(request: NextRequest): AdminSession | null {
  const sessionId =
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value ||
    request.headers.get('x-admin-session-id') ||
    request.headers.get('x-admin-session')

  return AdminAuthEngine.verifySession(sessionId || '')
}

/** Verified admin session that also holds `permission`, or null. */
export function getAdminSessionWithPermission(
  request: NextRequest,
  permission: AdminPermission,
): AdminSession | null {
  const session = getAdminSession(request)
  if (!session) return null
  return AdminAuthEngine.hasPermission(session, permission) ? session : null
}
