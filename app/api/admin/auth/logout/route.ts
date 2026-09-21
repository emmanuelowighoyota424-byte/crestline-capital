import { NextRequest, NextResponse } from 'next/server'
import { AdminAuthEngine } from '@/lib/admin/admin-auth'
import { auditLogger } from '@/lib/audit/audit-logger'

export async function POST(request: NextRequest) {
  const cookieSessionId = request.cookies.get('chase_admin_session')?.value
  const headerSessionId = request.headers.get('x-admin-session-id')
  const sessionId = cookieSessionId || headerSessionId

  if (sessionId) {
    AdminAuthEngine.invalidateSession(sessionId)
    auditLogger.log({
      actorId: 'admin_user',
      actorRole: 'SUPER_ADMIN',
      action: 'ADMIN_LOGOUT',
      targetResource: 'ADMIN_GATEWAY',
      targetId: sessionId,
      status: 'SUCCESS',
    })
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
  response.cookies.delete('chase_admin_session')
  return response
}
