/**
 * Admin Transfer Alerts API - Send multi-channel alerts for fund transfers.
 *
 * Requires an authenticated admin session with withdrawals.review permission.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAdminSessionWithPermission } from '@/lib/admin/request-session'
import { auditLogger } from '@/lib/audit/audit-logger'
import { sendAdminTransferAlert } from '@/lib/admin-transfer-alert-service'

export async function POST(request: NextRequest) {
  const session = getAdminSessionWithPermission(request, 'withdrawals.review')
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - withdrawals.review permission required' },
      { status: 401 }
    )
  }

  try {
    const {
      userId,
      userPhone,
      userEmail,
      recipientName,
      amount,
      accountName,
      transferId,
      broadcastToAllDevices,
    } = await request.json()

    // Validate required fields
    if (!userId || !amount || !accountName || !transferId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('[v0] Processing transfer alerts:', {
      userId,
      amount,
      transferId,
    })

    // Send multi-channel alerts
    const { success, results } = await sendAdminTransferAlert({
      userId,
      userPhone,
      userEmail,
      recipientName: recipientName || 'Crestline Capital',
      amount,
      accountName,
      transferId,
      broadcastToAllDevices: broadcastToAllDevices !== false,
    })

    // Track alert delivery
    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    console.log('[v0] Transfer alerts processed:', {
      transferId,
      totalChannels: results.length,
      successCount,
      failureCount,
      channels: results.map((r) => r.channel),
    })

    // Audit the alert action
    auditLogger.log({
      actorId: session.email || session.sessionId,
      actorRole: session.role,
      action: 'TRANSFER_ALERT_SENT',
      targetResource: 'transfer',
      targetId: transferId,
      status: 'SUCCESS',
      details: {
        amount,
        accountName,
        successCount,
        failureCount,
        channels: results.map((r) => r.channel),
      },
    })

    return NextResponse.json({
      success,
      message: `Transfer alert sent via ${successCount} channel(s)`,
      transferId,
      amount,
      alerts: results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Transfer alerts API error:', error)
    return NextResponse.json(
      { error: 'Failed to send transfer alerts' },
      { status: 500 }
    )
  }
}
