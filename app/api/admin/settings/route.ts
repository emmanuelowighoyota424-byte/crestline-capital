import { NextRequest, NextResponse } from 'next/server'
import { AdminAuthEngine } from '@/lib/admin/admin-auth'
import { adminStore } from '@/lib/admin/admin-store'
import { auditLogger } from '@/lib/audit/audit-logger'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('crestline_admin_session')?.value || req.headers.get('x-admin-session')
    const agent = AdminAuthEngine.verifySession(sessionId || '')
    if (!agent) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mask sensitive credentials
    const settings = {
      ...adminStore.siteSettings,
      smtpPassword: adminStore.siteSettings.smtpPassword ? '••••••••••••••••' : '',
    }

    return NextResponse.json({ settings })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('crestline_admin_session')?.value || req.headers.get('x-admin-session')
    const agent = AdminAuthEngine.verifySession(sessionId || '')
    if (!agent) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await req.json()
    
    // Merge settings into adminStore
    adminStore.siteSettings = {
      ...adminStore.siteSettings,
      ...updates,
      theme: {
        ...adminStore.siteSettings.theme,
        ...(updates.theme || {}),
      },
      emailTriggers: {
        ...adminStore.siteSettings.emailTriggers,
        ...(updates.emailTriggers || {}),
      },
    }

    auditLogger.record({
      actorId: agent.email,
      action: 'ADMIN_UPDATE_SYSTEM_SETTINGS',
      targetResource: 'CONFIG_MASTER_SETTINGS',
      metadata: {
        smtpHost: adminStore.siteSettings.smtpHost,
        smtpProvider: adminStore.siteSettings.smtpProvider,
        smtpPort: adminStore.siteSettings.smtpPort,
        smtpFrom: adminStore.siteSettings.smtpFrom,
      },
      status: 'SUCCESS',
    })

    return NextResponse.json({
      success: true,
      message: 'System settings successfully updated in store and logged.',
      settings: {
        ...adminStore.siteSettings,
        smtpPassword: '••••••••••••••••',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
