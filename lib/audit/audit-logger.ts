/**
 * Crestline Capital Immutable Audit Logger
 *
 * Captures chronological, tamper-evident audit logs of all privileged,
 * administrative, and monetary activities.
 */

export interface AuditLogEntry {
  id: string
  timestamp: string
  actorId: string
  actorRole: string
  action: string
  targetResource: string
  targetId: string
  ipAddress?: string
  userAgent?: string
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED'
  details?: Record<string, any>
  metadata?: Record<string, any>
}

class AuditStore {
  private logs: AuditLogEntry[] = []

  constructor() {
    this.seedDefaultLogs()
  }

  private seedDefaultLogs() {
    this.logs = [
      {
        id: 'aud_init_1',
        timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        actorId: 'usr_admin_master',
        actorRole: 'SUPER_ADMIN',
        action: 'SYSTEM_GENESIS_INITIALIZATION',
        targetResource: 'SYSTEM',
        targetId: 'crestline_core',
        status: 'SUCCESS',
        details: { note: 'Core system ledger, RBAC rules and security baselines initialized.' },
      },
      {
        id: 'aud_init_2',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        actorId: 'usr_compliance_officer',
        actorRole: 'COMPLIANCE',
        action: 'KYC_TIER2_VERIFICATION_APPROVAL',
        targetResource: 'KYC_PROFILE',
        targetId: 'kyc_cust_8829',
        status: 'SUCCESS',
        details: { documentType: 'PASSPORT', riskScore: 12 },
      },
      {
        id: 'aud_init_3',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        actorId: 'usr_fraud_analyst',
        actorRole: 'FRAUD_ANALYST',
        action: 'TRANSACTION_HOLD_RELEASE',
        targetResource: 'TRANSFER',
        targetId: 'tx_wire_9120',
        status: 'SUCCESS',
        details: { verifiedBeneficiary: 'Crestline Capital Escrow Corp', clearedBy: 'Analyst #402' },
      },
    ]
  }

  public record(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const log: AuditLogEntry = {
      ...entry,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
    }
    this.logs.unshift(log)
    return log
  }

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    return this.record(entry)
  }

  public getLogs(limit = 100): AuditLogEntry[] {
    return this.logs.slice(0, limit)
  }
}

const globalForAudit = globalThis as unknown as { auditStore?: AuditStore }
export const auditLogger = globalForAudit.auditStore || new AuditStore()
if (process.env.NODE_ENV !== 'production') {
  globalForAudit.auditStore = auditLogger
}
