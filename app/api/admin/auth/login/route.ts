import { NextRequest, NextResponse } from 'next/server'
import { AdminAuthEngine } from '@/lib/admin/admin-auth'
import { auditLogger } from '@/lib/audit/audit-logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, masterKey } = body

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || 'Unknown Browser'

    let authResult: {
      success: boolean
      session?: any
      error?: string
      remainingAttempts?: number
    }

    if (email && password) {
      // Authenticate with Email & Password
      authResult = AdminAuthEngine.authenticateCredentials(email, password, ip, userAgent)
    } else if (masterKey && typeof masterKey === 'string') {
      // Authenticate with Master Key
      authResult = AdminAuthEngine.authenticateMasterKey(masterKey, ip, userAgent)
    } else {
      return NextResponse.json(
        { success: false, error: 'Administrative email and password (or Master Key) are required.' },
        { status: 400 }
      )
    }

    if (!authResult.success || !authResult.session) {
      auditLogger.log({
        actorId: email || 'anonymous_admin_gate',
        actorRole: 'UNAUTHENTICATED',
        action: 'ADMIN_GATEKEEPER_FAILURE',
        targetResource: 'ADMIN_GATEWAY',
        targetId: 'admin_login',
        status: 'BLOCKED',
        ipAddress: ip,
        userAgent,
        details: { error: authResult.error, remainingAttempts: authResult.remainingAttempts },
      })

      return NextResponse.json(
        {
          success: false,
          error: authResult.error,
          remainingAttempts: authResult.remainingAttempts,
        },
        { status: 401 }
      )
    }

    // Success audit log
    auditLogger.log({
      actorId: authResult.session.adminId,
      actorRole: authResult.session.role,
      action: 'ADMIN_GATEKEEPER_SUCCESS',
      targetResource: 'ADMIN_GATEWAY',
      targetId: authResult.session.sessionId,
      status: 'SUCCESS',
      ipAddress: ip,
      userAgent,
      details: { role: authResult.session.role, email: authResult.session.email },
    })

    const response = NextResponse.json({
      success: true,
      session: authResult.session,
    })

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'crestline_admin_session',
      value: authResult.session.sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin',
      maxAge: 8 * 3600,
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal authentication error.' },
      { status: 500 }
    )
  }
}
