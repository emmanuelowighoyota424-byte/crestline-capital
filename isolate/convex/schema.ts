import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ───────────────────────── Users & Auth ─────────────────────────
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    role: v.union(
      v.literal("customer"),
      v.literal("support"),
      v.literal("compliance"),
      v.literal("fraud_analyst"),
      v.literal("loan_officer"),
      v.literal("bank_admin"),
      v.literal("super_admin"),
      v.literal("auditor"),
    ),
    status: v.union(v.literal("active"), v.literal("suspended"), v.literal("closed")),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    memberSince: v.number(),
    tier: v.string(),
    emailVerified: v.boolean(),
    twoFactorEnabled: v.boolean(),
    twoFactorSecret: v.optional(v.string()),
    kycStatus: v.union(
      v.literal("not_started"),
      v.literal("pending"),
      v.literal("in_review"),
      v.literal("verified"),
      v.literal("rejected"),
      v.literal("requires_action"),
    ),
  })
    .index("email", ["email"])
    .index("role", ["role"])
    .index("status", ["status"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    revoked: v.boolean(),
    deviceInfo: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  })
    .index("token", ["token"])
    .index("userId", ["userId"]),

  // ───────────────────────── Accounts ─────────────────────────
  accounts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.union(
      v.literal("checking"),
      v.literal("savings"),
      v.literal("business"),
      v.literal("money_market"),
    ),
    accountNumber: v.string(), // masked in UI, full stored server-side
    routingNumber: v.string(),
    balance: v.number(), // cents to avoid float issues? Keep number (dollars) for simplicity with 2-decimal rounding helpers
    availableBalance: v.number(),
    interestRate: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("frozen"), v.literal("closed")),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("accountNumber", ["accountNumber"]),

  // ───────────────────────── Transactions (display records) ─────────────────────────
  transactions: defineTable({
    userId: v.id("users"),
    accountId: v.id("accounts"),
    // Reference to the ledger journal that guarantees atomicity
    journalId: v.optional(v.id("ledgerJournals")),
    type: v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("transfer"),
      v.literal("payment"),
      v.literal("fee"),
      v.literal("interest"),
      v.literal("refund"),
      v.literal("reversal"),
      v.literal("adjustment"),
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled"),
      v.literal("reversed"),
    ),
    amount: v.number(),
    currency: v.string(),
    description: v.string(),
    reference: v.string(), // unique human-readable reference e.g. TXN-XXXXXX
    category: v.optional(v.string()),
    recipientName: v.optional(v.string()),
    recipientAccount: v.optional(v.string()),
    senderName: v.optional(v.string()),
    createdAt: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("userId", ["userId"])
    .index("accountId", ["accountId"])
    .index("reference", ["reference"])
    .index("createdAt", ["createdAt"]),

  // ───────────────────────── Double-Entry Ledger ─────────────────────────
  // Ledger accounts: every real account has one; treasury accounts hold system funds
  ledgerAccounts: defineTable({
    code: v.string(), // unique code e.g. "treasury:checking_clearing"
    name: v.string(),
    kind: v.union(
      v.literal("customer"), // mirrors a customer account
      v.literal("treasury"), // system money
      v.literal("fee_income"),
      v.literal("interest_expense"),
    ),
    // Debit-normal balance tracking (asset accounts are debit-normal)
    balance: v.number(),
    // For customer ledger accounts this equals the customer-facing balance
    linkedAccountId: v.optional(v.id("accounts")),
  })
    .index("code", ["code"])
    .index("linkedAccountId", ["linkedAccountId"]),

  // Journal: an atomic group of ledger entries that must sum to zero
  ledgerJournals: defineTable({
    journalNumber: v.string(),
    description: v.string(),
    sourceType: v.union(
      v.literal("transfer"),
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("payment"),
      v.literal("fee"),
      v.literal("interest"),
      v.literal("reversal"),
      v.literal("adjustment"),
    ),
    sourceId: v.optional(v.string()),
    createdAt: v.number(),
    // Denormalized sum for quick consistency checks (always 0)
    totalDebits: v.number(),
    totalCredits: v.number(),
  })
    .index("journalNumber", ["journalNumber"]),

  // Individual double-entry lines. Immutable once written.
  ledgerEntries: defineTable({
    journalId: v.id("ledgerJournals"),
    ledgerAccountId: v.id("ledgerAccounts"),
    // + = debit, - = credit (from the ledger account's perspective)
    debit: v.number(),
    credit: v.number(),
    memo: v.string(),
    createdAt: v.number(),
  })
    .index("journalId", ["journalId"])
    .index("ledgerAccountId", ["ledgerAccountId"]),

  // ───────────────────────── Transfers ─────────────────────────
  transfers: defineTable({
    userId: v.id("users"),
    fromAccountId: v.id("accounts"),
    // Internal transfers target an own account; external transfers store details
    toAccountId: v.optional(v.id("accounts")),
    toExternalName: v.optional(v.string()),
    toExternalAccount: v.optional(v.string()),
    toExternalBank: v.optional(v.string()),
    method: v.union(
      v.literal("internal"),
      v.literal("zelle"),
      v.literal("wire"),
      v.literal("ach"),
    ),
    amount: v.number(),
    fee: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled"),
    ),
    memo: v.optional(v.string()),
    reference: v.string(),
    idempotencyKey: v.optional(v.string()),
    fraudRisk: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical"),
    )),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("fromAccountId", ["fromAccountId"])
    .index("idempotencyKey", ["idempotencyKey"])
    .index("reference", ["reference"]),

  // Idempotency keys for money movement
  idempotencyKeys: defineTable({
    key: v.string(),
    scope: v.string(), // e.g. "transfer", "deposit"
    resultPayload: v.any(),
    createdAt: v.number(),
  }).index("key", ["key"]),

  // ───────────────────────── Cards ─────────────────────────
  cards: defineTable({
    userId: v.id("users"),
    accountId: v.id("accounts"),
    name: v.string(),
    cardType: v.union(v.literal("debit"), v.literal("virtual"), v.literal("credit")),
    lastFour: v.string(),
    expiryDate: v.string(), // MM/YY
    status: v.union(
      v.literal("active"),
      v.literal("frozen"),
      v.literal("blocked"),
      v.literal("expired"),
      v.literal("cancelled"),
    ),
    creditLimit: v.optional(v.number()),
    balance: v.optional(v.number()),
    spendingLimit: v.optional(v.number()),
    internationalEnabled: v.boolean(),
    contactlessEnabled: v.boolean(),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("accountId", ["accountId"]),

  // ───────────────────────── Deposits / Withdrawals ─────────────────────────
  deposits: defineTable({
    userId: v.id("users"),
    accountId: v.id("accounts"),
    method: v.union(
      v.literal("bank_transfer"),
      v.literal("payment_processor"),
      v.literal("check"),
      v.literal("wire"),
    ),
    amount: v.number(),
    status: v.union(
      v.literal("initiated"),
      v.literal("pending"),
      v.literal("settled"),
      v.literal("failed"),
      v.literal("reversed"),
    ),
    reference: v.string(),
    sandboxNote: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("accountId", ["accountId"]),

  withdrawals: defineTable({
    userId: v.id("users"),
    accountId: v.id("accounts"),
    method: v.union(v.literal("bank_transfer"), v.literal("wire"), v.literal("atm")),
    amount: v.number(),
    fee: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled"),
    ),
    reference: v.string(),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("accountId", ["accountId"]),

  // ───────────────────────── Savings Goals ─────────────────────────
  savingsGoals: defineTable({
    userId: v.id("users"),
    accountId: v.id("accounts"),
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    deadline: v.optional(v.number()),
    category: v.string(),
    createdAt: v.number(),
  }).index("userId", ["userId"]),

  // ───────────────────────── Loans ─────────────────────────
  loans: defineTable({
    userId: v.id("users"),
    productName: v.string(),
    principal: v.number(),
    interestRate: v.number(), // annual percent
    termMonths: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("active"),
      v.literal("paid_off"),
      v.literal("defaulted"),
    ),
    outstandingPrincipal: v.number(),
    monthlyPayment: v.number(),
    disbursedAccountId: v.optional(v.id("accounts")),
    createdAt: v.number(),
  }).index("userId", ["userId"]),

  loanPayments: defineTable({
    loanId: v.id("loans"),
    amount: v.number(),
    principalPortion: v.number(),
    interestPortion: v.number(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("loanId", ["loanId"]),

  // ───────────────────────── KYC / AML ─────────────────────────
  kycProfiles: defineTable({
    userId: v.id("users"),
    status: v.union(
      v.literal("not_started"),
      v.literal("pending"),
      v.literal("in_review"),
      v.literal("verified"),
      v.literal("rejected"),
      v.literal("requires_action"),
    ),
    riskLevel: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    notes: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    submittedAt: v.optional(v.number()),
    reviewedAt: v.optional(v.number()),
  }).index("userId", ["userId"]),

  // ───────────────────────── Fraud ─────────────────────────
  fraudAlerts: defineTable({
    userId: v.id("users"),
    transactionId: v.optional(v.id("transactions")),
    transferId: v.optional(v.id("transfers")),
    riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    action: v.union(
      v.literal("allow"),
      v.literal("challenge"),
      v.literal("hold"),
      v.literal("review"),
      v.literal("block"),
    ),
    reason: v.string(),
    resolved: v.boolean(),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("resolved", ["resolved"]),

  // ───────────────────────── Notifications ─────────────────────────
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(v.literal("info"), v.literal("warning"), v.literal("success"), v.literal("alert")),
    category: v.string(),
    read: v.boolean(),
    actionUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("read", ["read"]),

  // ───────────────────────── Audit Log ─────────────────────────
  auditLogs: defineTable({
    actorId: v.optional(v.id("users")),
    action: v.string(),
    resourceType: v.string(),
    resourceId: v.optional(v.string()),
    details: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    createdAt: v.number(),
  }).index("createdAt", ["createdAt"]),
});
