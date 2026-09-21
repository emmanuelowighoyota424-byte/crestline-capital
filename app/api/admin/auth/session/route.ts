import { NextRequest, NextResponse } from 'next/server'
import { AdminAuthEngine } from '@/lib/admin/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const cookieSessionId = request.cookies.get('chase_admin_session')?.value
    const headerSessionId = request.headers.get('x-admin-session-id')
    const sessionId = cookieSessionId || headerSessionId

    if (!sessionId) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    const session = AdminAuthEngine.verifySession(sessionId)
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    return NextResponse.json({
      authenticated: true,
      session,
    })
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    )
  }
}
