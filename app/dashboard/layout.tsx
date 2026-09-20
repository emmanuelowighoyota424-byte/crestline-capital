import { redirect } from 'next/navigation'
import type React from 'react'
import { getCustomerSession } from '@/lib/customer/session'

/**
 * Server-side gate for the signed-in customer app.
 *
 * The page itself stays a client component; this layout verifies the session on
 * the server, so a client-side flag cannot open the dashboard, and the requested
 * path is preserved for the sign-in redirect.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomerSession()

  if (!session) {
    redirect('/login?returnTo=/dashboard')
  }

  return <>{children}</>
}
