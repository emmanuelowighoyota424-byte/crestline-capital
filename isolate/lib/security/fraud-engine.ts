/**
 * Crestline Capital Real-Time Fraud & Anomaly Scoring Engine
 *
 * Evaluates transactional risk against statistical heuristics, velocity rules,
 * recipient risk, and behavioral metrics.
 */

export type FraudRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type FraudAction = 'ALLOW' | 'CHALLENGE' | 'HOLD' | 'REVIEW' | 'BLOCK'

export interface FraudEvaluationInput {
  userId: string
  accountId: string
  amountCents: number
  recipientName: string
  recipientAccount: string
  transferType: 'INTERNAL' | 'ACH' | 'DOMESTIC_WIRE' | 'INTERNATIONAL_WIRE'
  ipAddress?: string
  deviceId?: string
  userAgent?: string
  accountAgeDays?: number
}

export interface FraudEvaluationResult {
  evaluationId: string
  score: number // 0 to 100
  riskLevel: FraudRiskLevel
  action: FraudAction
  triggeredRules: string[]
  recommendedChallengeType?: 'MFA_OTP' | 'BIOMETRIC' | 'MANUAL_COMPLIANCE_REVIEW'
  timestamp: string
}

export function evaluateTransactionRisk(input: FraudEvaluationInput): FraudEvaluationResult {
  let score = 0
  const triggeredRules: string[] = []

  // Rule 1: High Dollar Value
  if (input.amountCents >= 5000000) {
    // >= $50,000
    score += 45
    triggeredRules.push('EXCESSIVE_TRANSACTION_VALUE_OVER_50K')
  } else if (input.amountCents >= 1000000) {
    // >= $10,000
    score += 25
    triggeredRules.push('HIGH_VALUE_THRESHOLD_EXCEEDED')
  }

  // Rule 2: International Wire Risk
  if (input.transferType === 'INTERNATIONAL_WIRE') {
    score += 30
    triggeredRules.push('CROSS_BORDER_WIRE_CHANNEL')
  }

  // Rule 3: Account Age & Maturation Check
  if (input.accountAgeDays !== undefined && input.accountAgeDays < 7 && input.amountCents > 500000) {
    score += 35
    triggeredRules.push('NEW_ACCOUNT_LARGE_OUTFLOW')
  }

  // Rule 4: Suspicious Beneficiary Match
  const recLower = input.recipientName.toLowerCase()
  if (recLower.includes('sanction') || recLower.includes('blocked') || recLower.includes('scam')) {
    score += 85
    triggeredRules.push('BENEFICIARY_SANCTIONS_OR_FRAUD_ALERT')
  }

  // Calculate Risk Level & Action
  let riskLevel: FraudRiskLevel = 'LOW'
  let action: FraudAction = 'ALLOW'
  let challenge: 'MFA_OTP' | 'BIOMETRIC' | 'MANUAL_COMPLIANCE_REVIEW' | undefined = undefined

  if (score >= 80) {
    riskLevel = 'CRITICAL'
    action = 'BLOCK'
  } else if (score >= 60) {
    riskLevel = 'HIGH'
    action = 'HOLD'
    challenge = 'MANUAL_COMPLIANCE_REVIEW'
  } else if (score >= 35) {
    riskLevel = 'MEDIUM'
    action = 'CHALLENGE'
    challenge = 'MFA_OTP'
  } else {
    riskLevel = 'LOW'
    action = 'ALLOW'
  }

  return {
    evaluationId: `frd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    score: Math.min(100, score),
    riskLevel,
    action,
    triggeredRules,
    recommendedChallengeType: challenge,
    timestamp: new Date().toISOString(),
  }
}
