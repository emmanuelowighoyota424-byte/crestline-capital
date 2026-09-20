import { NextRequest, NextResponse } from 'next/server'
import { getAdminSessionWithPermission } from '@/lib/admin/request-session'
import { adminStore } from '@/lib/admin/admin-store'
import { auditLogger } from '@/lib/audit/audit-logger'

export async function GET(req: NextRequest) {
  try {
    const session = getAdminSessionWithPermission(req, 'settings.manage')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized - settings.manage permission required' }, { status: 401 })
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
    const session = getAdminSessionWithPermission(req, 'settings.manage')
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized - settings.manage permission required' }, { status: 401 })
    }
    const agent = session

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
      actorRole: agent.role,
      action: 'ADMIN_UPDATE_SYSTEM_SETTINGS',
      targetResource: 'CONFIG_MASTER_SETTINGS',
      targetId: 'master',
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
