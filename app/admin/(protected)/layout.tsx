/**
 * Server-side gate for the admin console.
 *
 * The admin session is verified before any console markup renders, so an
 * unauthenticated visitor is redirected to the login page instead of being shown
 * the console. The admin API routes independently authorize with the same session.
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { AdminAuthEngine } from '@/lib/admin/admin-auth'
import { ADMIN_SESSION_COOKIE } from '@/lib/admin/request-session'

export const dynamic = 'force-dynamic'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const session = AdminAuthEngine.verifySession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || '',
  )

  if (!session) {
    redirect('/admin/login')
  }

  return <>{children}</>
}
