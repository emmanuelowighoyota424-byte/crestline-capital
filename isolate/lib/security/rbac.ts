/**
 * Crestline Capital Server-Side RBAC (Role-Based Access Control)
 *
 * Enforces least-privilege administrative access and prevents privilege escalation.
 */

export type Role =
  | 'CUSTOMER'
  | 'SUPPORT'
  | 'COMPLIANCE'
  | 'FRAUD_ANALYST'
  | 'LOAN_OFFICER'
  | 'BANK_ADMIN'
  | 'SUPER_ADMIN'
  | 'AUDITOR'

export type Permission =
  | 'users.read'
  | 'users.manage'
  | 'accounts.read'
  | 'accounts.manage'
  | 'transactions.read'
  | 'transactions.review'
  | 'transfers.read'
  | 'transfers.review'
  | 'kyc.read'
  | 'kyc.review'
  | 'aml.read'
  | 'fraud.read'
  | 'fraud.manage'
  | 'loans.read'
  | 'loans.review'
  | 'audit.read'
  | 'system.manage'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  CUSTOMER: [
    'users.read',
    'accounts.read',
    'transactions.read',
    'transfers.read',
    'loans.read',
  ],
  SUPPORT: [
    'users.read',
    'accounts.read',
    'transactions.read',
    'transfers.read',
    'audit.read',
  ],
  COMPLIANCE: [
    'users.read',
    'accounts.read',
    'kyc.read',
    'kyc.review',
    'aml.read',
    'audit.read',
  ],
  FRAUD_ANALYST: [
    'users.read',
    'accounts.read',
    'transactions.read',
    'transactions.review',
    'transfers.read',
    'transfers.review',
    'fraud.read',
    'fraud.manage',
    'audit.read',
  ],
  LOAN_OFFICER: [
    'users.read',
    'accounts.read',
    'loans.read',
    'loans.review',
    'audit.read',
  ],
  BANK_ADMIN: [
    'users.read',
    'users.manage',
    'accounts.read',
    'accounts.manage',
    'transactions.read',
    'transactions.review',
    'transfers.read',
    'transfers.review',
    'kyc.read',
    'fraud.read',
    'loans.read',
    'audit.read',
  ],
  SUPER_ADMIN: [
    'users.read',
    'users.manage',
    'accounts.read',
    'accounts.manage',
    'transactions.read',
    'transactions.review',
    'transfers.read',
    'transfers.review',
    'kyc.read',
    'kyc.review',
    'aml.read',
    'fraud.read',
    'fraud.manage',
    'loans.read',
    'loans.review',
    'audit.read',
    'system.manage',
  ],
  AUDITOR: [
    'users.read',
    'accounts.read',
    'transactions.read',
    'transfers.read',
    'kyc.read',
    'aml.read',
    'fraud.read',
    'loans.read',
    'audit.read',
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(permission)
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: Role '${role}' lacks required permission '${permission}'`)
  }
}
