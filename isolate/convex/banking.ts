import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

/* ══════════════════════════ Helpers ══════════════════════════ */

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function generateReference(prefix: string): string {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${now}-${rand}`;
}

function generateAccountNumber(): string {
  // 10-digit account number derived from secure randomness (sandbox mechanism)
  const arr = new Uint32Array(2);
  crypto.getRandomValues(arr);
  const base = (arr[0] * 4294967296 + arr[1]) % 9000000000;
  return String(1000000000 + base);
}

/* ══════════════════════════ Accounts ══════════════════════════ */

export const listAccounts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("accounts")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getAccount = query({
  args: { accountId: v.id("accounts"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.accountId);
    // IDOR protection: only the owner sees the account
    if (!account || account.userId !== args.userId) return null;
    return account;
  },
});

export const openAccount = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    type: v.union(v.literal("checking"), v.literal("savings"), v.literal("business"), v.literal("money_market")),
    initialDeposit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const accountNumber = generateAccountNumber();
    const routingNumber = "084106768"; // Crestline sandbox routing number (not a real bank)

    const accountId = await ctx.db.insert("accounts", {
      userId: args.userId,
      name: args.name,
      type: args.type,
      accountNumber,
      routingNumber,
      balance: 0,
      availableBalance: 0,
      interestRate: args.type === "savings" ? 4.25 : args.type === "money_market" ? 5.0 : 0.01,
      status: "active",
      createdAt: Date.now(),
    });

    // Create the matching ledger account (debit-normal asset)
    const code = `cust:${accountNumber}`;
    await ctx.db.insert("ledgerAccounts", {
      code,
      name: `Customer ledger for ${args.name}`,
      kind: "customer",
      balance: 0,
      linkedAccountId: accountId,
    });

    // Initial deposit via proper double-entry if provided
    if (args.initialDeposit && args.initialDeposit > 0) {
      const amount = round2(args.initialDeposit);
      const treasuryCode = args.type === "savings" ? "treasury:savings_clearing" : "treasury:checking_clearing";

      await ctx.db.insert("ledgerJournals", {
        journalNumber: `JRN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        description: `Initial deposit to ${args.name}`,
        sourceType: "deposit",
        sourceId: accountId,
        createdAt: Date.now(),
        totalDebits: amount,
        totalCredits: amount,
      });

      // Update balances directly here (same transaction as inserts above)
      const custLedger = await ctx.db
        .query("ledgerAccounts")
        .withIndex("code", (q) => q.eq("code", code))
        .unique();
      if (custLedger) {
        await ctx.db.patch(custLedger._id, { balance: round2(custLedger.balance + amount) });
      }
      const treasury = await ctx.db
        .query("ledgerAccounts")
        .withIndex("code", (q) => q.eq("code", treasuryCode))
        .unique();
      if (treasury) {
        await ctx.db.patch(treasury._id, { balance: round2(treasury.balance - amount) });
      }

      await ctx.db.patch(accountId, {
        balance: amount,
        availableBalance: amount,
      });

      // Transaction record
      await ctx.db.insert("transactions", {
        userId: args.userId,
        accountId,
        type: "deposit",
        status: "completed",
        amount,
        currency: "USD",
        description: "Initial deposit",
        reference: generateReference("DEP"),
        category: "deposit",
        createdAt: Date.now(),
      });
    }

    return accountId;
  },
});

/* ══════════════════════════ Transfers (double-entry, idempotent) ══════════════════════════ */

export const internalTransfer = mutation({
  args: {
    userId: v.id("users"),
    fromAccountId: v.id("accounts"),
    toAccountId: v.id("accounts"),
    amount: v.number(),
    memo: v.optional(v.string()),
    idempotencyKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const amount = round2(args.amount);
    if (amount <= 0) throw new Error("Amount must be positive");
    if (args.fromAccountId === args.toAccountId) throw new Error("Cannot transfer to the same account");

    // Idempotency: if this key already completed, return the existing result
    if (args.idempotencyKey) {
      const idemKey = args.idempotencyKey;
      const existing = await ctx.db
        .query("idempotencyKeys")
        .withIndex("key", (q) => q.eq("key", idemKey))
        .unique();
      if (existing) {
        return { duplicate: true, result: existing.resultPayload };
      }
    }

    // Ownership + IDOR protection
    const from = await ctx.db.get(args.fromAccountId);
    const to = await ctx.db.get(args.toAccountId);
    if (!from || from.userId !== args.userId) throw new Error("Source account not found or unauthorized");
    if (!to) throw new Error("Destination account not found");
    if (from.status !== "active" || to.status !== "active") throw new Error("Account not active");

    // Insufficient funds check
    if (from.availableBalance < amount) {
      throw new Error(`Insufficient funds: available ${from.availableBalance.toFixed(2)}, requested ${amount.toFixed(2)}`);
    }

    const now = Date.now();
    const reference = generateReference("TRF");

    // Debit source, credit destination (both customer ledger accounts are debit-normal)
    const fromLedgerCode = `cust:${from.accountNumber}`;
    const toLedgerCode = `cust:${to.accountNumber}`;

    const fromLedger = await ctx.db
      .query("ledgerAccounts")
      .withIndex("code", (q) => q.eq("code", fromLedgerCode))
      .unique();
    const toLedger = await ctx.db
      .query("ledgerAccounts")
      .withIndex("code", (q) => q.eq("code", toLedgerCode))
      .unique();
    if (!fromLedger || !toLedger) throw new Error("Ledger accounts missing — data integrity error");

    // Journal (balanced by construction: debit = credit = amount)
    const journalId = await ctx.db.insert("ledgerJournals", {
      journalNumber: `JRN-${now}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      description: `Transfer ${from.name} → ${to.name}: ${args.memo || "(no memo)"}`,
      sourceType: "transfer",
      sourceId: reference,
      createdAt: now,
      totalDebits: amount,
      totalCredits: amount,
    });

    await ctx.db.insert("ledgerEntries", {
      journalId,
      ledgerAccountId: fromLedger._id,
      debit: 0,
      credit: amount, // money leaves source
      memo: `Transfer to ${to.accountNumber.slice(-4)}`,
      createdAt: now,
    });
    await ctx.db.insert("ledgerEntries", {
      journalId,
      ledgerAccountId: toLedger._id,
      debit: amount, // money arrives at destination
      credit: 0,
      memo: `Transfer from ${from.accountNumber.slice(-4)}`,
      createdAt: now,
    });

    // Update ledger balances
    await ctx.db.patch(fromLedger._id, { balance: round2(fromLedger.balance - amount) });
    await ctx.db.patch(toLedger._id, { balance: round2(toLedger.balance + amount) });

    // Update customer-facing balances
    await ctx.db.patch(args.fromAccountId, {
      balance: round2(from.balance - amount),
      availableBalance: round2(from.availableBalance - amount),
    });
    await ctx.db.patch(args.toAccountId, {
      balance: round2(to.balance + amount),
      availableBalance: round2(to.availableBalance + amount),
    });

    // Transaction records for both sides
    const fromTxnId = await ctx.db.insert("transactions", {
      userId: args.userId,
      accountId: args.fromAccountId,
      journalId,
      type: "transfer",
      status: "completed",
      amount: -amount,
      currency: "USD",
      description: `Transfer to ${to.name}`,
      reference,
      recipientName: to.name,
      recipientAccount: to.accountNumber.slice(-4),
      createdAt: now,
    });
    await ctx.db.insert("transactions", {
      userId: to.userId,
      accountId: args.toAccountId,
      journalId,
      type: "transfer",
      status: "completed",
      amount,
      currency: "USD",
      description: `Transfer from ${from.name}`,
      reference,
      senderName: from.name,
      createdAt: now,
    });

    // Transfer record
    const transferId = await ctx.db.insert("transfers", {
      userId: args.userId,
      fromAccountId: args.fromAccountId,
      toAccountId: args.toAccountId,
      method: "internal",
      amount,
      fee: 0,
      currency: "USD",
      status: "completed",
      memo: args.memo,
      reference,
      idempotencyKey: args.idempotencyKey,
      createdAt: now,
    });

    // Store idempotency result
    if (args.idempotencyKey) {
      await ctx.db.insert("idempotencyKeys", {
        key: args.idempotencyKey,
        scope: "transfer",
        resultPayload: { transferId, reference },
        createdAt: now,
      });
    }

    // Notifications for both parties
    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: "Transfer completed",
      message: `You sent ${amount.toFixed(2)} USD to ${to.name}. Ref: ${reference}`,
      type: "success",
      category: "transfer",
      read: false,
      createdAt: now,
    });
    await ctx.db.insert("notifications", {
      userId: to.userId,
      title: "Money received",
      message: `You received ${amount.toFixed(2)} USD from ${from.name}. Ref: ${reference}`,
      type: "success",
      category: "transfer",
      read: false,
      createdAt: now,
    });

    return { duplicate: false, transferId, reference, fromTxnId };
  },
});

/* ══════════════════════════ Deposits ══════════════════════════ */

export const createDeposit = mutation({
  args: {
    userId: v.id("users"),
    accountId: v.id("accounts"),
    method: v.union(v.literal("bank_transfer"), v.literal("payment_processor"), v.literal("check"), v.literal("wire")),
    amount: v.number(),
    idempotencyKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const amount = round2(args.amount);
    if (amount <= 0) throw new Error("Amount must be positive");

    if (args.idempotencyKey) {
      const idemKey = args.idempotencyKey;
      const existing = await ctx.db
        .query("idempotencyKeys")
        .withIndex("key", (q) => q.eq("key", idemKey))
        .unique();
      if (existing) return { duplicate: true, result: existing.resultPayload };
    }

    const account = await ctx.db.get(args.accountId);
    if (!account || account.userId !== args.userId) throw new Error("Account not found or unauthorized");

    const now = Date.now();
    const reference = generateReference("DEP");
    const ledgerCode = `cust:${account.accountNumber}`;
    const treasuryCode = account.type === "savings" ? "treasury:savings_clearing" : "treasury:checking_clearing";

    // SANDBOX: instant settlement. Real providers would keep this PENDING until confirmed.
    const ledger = await ctx.db
      .query("ledgerAccounts")
      .withIndex("code", (q) => q.eq("code", ledgerCode))
      .unique();
    const treasury = await ctx.db
      .query("ledgerAccounts")
      .withIndex("code", (q) => q.eq("code", treasuryCode))
      .unique();
    if (!ledger || !treasury) throw new Error("Ledger accounts missing");

    const journalId = await ctx.db.insert("ledgerJournals", {
      journalNumber: `JRN-${now}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      description: `Deposit (${args.method}) to ${account.name}`,
      sourceType: "deposit",
      sourceId: reference,
      createdAt: now,
      totalDebits: amount,
      totalCredits: amount,
    });

    await ctx.db.insert("ledgerEntries", {
      journalId,
      ledgerAccountId: ledger._id,
      debit: amount,
      credit: 0,
      memo: `Deposit via ${args.method}`,
      createdAt: now,
    });
    await ctx.db.insert("ledgerEntries", {
      journalId,
      ledgerAccountId: treasury._id,
      debit: 0,
      credit: amount,
      memo: `Deposit clearing ${reference}`,
      createdAt: now,
    });

    await ctx.db.patch(ledger._id, { balance: round2(ledger.balance + amount) });
    await ctx.db.patch(treasury._id, { balance: round2(treasury.balance - amount) });
    await ctx.db.patch(args.accountId, {
      balance: round2(account.balance + amount),
      availableBalance: round2(account.availableBalance + amount),
    });

    const depositId = await ctx.db.insert("deposits", {
      userId: args.userId,
      accountId: args.accountId,
      method: args.method,
      amount,
      status: "settled",
      reference,
      sandboxNote: "SANDBOX: instantly settled by simulated provider",
      createdAt: now,
    });

    await ctx.db.insert("transactions", {
      userId: args.userId,
      accountId: args.accountId,
      journalId,
      type: "deposit",
      status: "completed",
      amount,
      currency: "USD",
      description: `Deposit via ${args.method}`,
      reference,
      createdAt: now,
    });

    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: "Deposit settled",
      message: `${amount.toFixed(2)} USD was deposited to ${account.name}. Ref: ${reference}`,
      type: "success",
      category: "deposit",
      read: false,
      createdAt: now,
    });

    if (args.idempotencyKey) {
      await ctx.db.insert("idempotencyKeys", {
        key: args.idempotencyKey,
        scope: "deposit",
        resultPayload: { depositId, reference },
        createdAt: now,
      });
    }

    return { duplicate: false, depositId, reference };
  },
});

/* ══════════════════════════ Withdrawals ══════════════════════════ */

export const createWithdrawal = mutation({
  args: {
    userId: v.id("users"),
    accountId: v.id("accounts"),
    method: v.union(v.literal("bank_transfer"), v.literal("wire"), v.literal("atm")),
    amount: v.number(),
    idempotencyKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const amount = round2(args.amount);
    if (amount <= 0) throw new Error("Amount must be positive");

    if (args.idempotencyKey) {
      const idemKey = args.idempotencyKey;
      const existing = await ctx.db
        .query("idempotencyKeys")
        .withIndex("key", (q) => q.eq("key", idemKey))
        .unique();
      if (existing) return { duplicate: true, result: existing.resultPayload };
    }

    const account = await ctx.db.get(args.accountId);
    if (!account || account.userId !== args.userId) throw new Error("Account not found or unauthorized");
    if (account.availableBalance < amount) throw new Error("Insufficient funds");

    const now = Date.now();
    const reference = generateReference("WDR");
    const ledgerCode = `cust:${account.accountNumber}`;
    const treasuryCode = account.type === "savings" ? "treasury:savings_clearing" : "treasury:checking_clearing";

    const ledger = await ctx.db
      .query("ledgerAccounts")
      .withIndex("code", (q) => q.eq("code", ledgerCode))
      .unique();
    const treasury = await ctx.db
      .query("ledgerAccounts")
      .withIndex("code", (q) => q.eq("code", treasuryCode))
      .unique();
    if (!ledger || !treasury) throw new Error("Ledger accounts missing");

    const journalId = await ctx.db.insert("ledgerJournals", {
      journalNumber: `JRN-${now}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      description: `Withdrawal (${args.method}) from ${account.name}`,
      sourceType: "withdrawal",
      sourceId: reference,
      createdAt: now,
      totalDebits: amount,
      totalCredits: amount,
    });

    await ctx.db.insert("ledgerEntries", {
      journalId,
      ledgerAccountId: treasury._id,
      debit: amount,
      credit: 0,
      memo: `Withdrawal clearing ${reference}`,
      createdAt: now,
    });
    await ctx.db.insert("ledgerEntries", {
      journalId,
      ledgerAccountId: ledger._id,
      debit: 0,
      credit: amount,
      memo: `Withdrawal via ${args.method}`,
      createdAt: now,
    });

    await ctx.db.patch(ledger._id, { balance: round2(ledger.balance - amount) });
    await ctx.db.patch(treasury._id, { balance: round2(treasury.balance + amount) });
    await ctx.db.patch(args.accountId, {
      balance: round2(account.balance - amount),
      availableBalance: round2(account.availableBalance - amount),
    });

    const withdrawalId = await ctx.db.insert("withdrawals", {
      userId: args.userId,
      accountId: args.accountId,
      method: args.method,
      amount,
      fee: 0,
      status: "completed",
      reference,
      createdAt: now,
    });

    await ctx.db.insert("transactions", {
      userId: args.userId,
      accountId: args.accountId,
      journalId,
      type: "withdrawal",
      status: "completed",
      amount: -amount,
      currency: "USD",
      description: `Withdrawal via ${args.method}`,
      reference,
      createdAt: now,
    });

    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: "Withdrawal completed",
      message: `${amount.toFixed(2)} USD was withdrawn from ${account.name}. Ref: ${reference}`,
      type: "info",
      category: "withdrawal",
      read: false,
      createdAt: now,
    });

    if (args.idempotencyKey) {
      await ctx.db.insert("idempotencyKeys", {
        key: args.idempotencyKey,
        scope: "withdrawal",
        resultPayload: { withdrawalId, reference },
        createdAt: now,
      });
    }

    return { duplicate: false, withdrawalId, reference };
  },
});

/* ══════════════════════════ Transactions ══════════════════════════ */

export const listTransactions = query({
  args: { userId: v.id("users"), accountId: v.optional(v.id("accounts")), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    if (args.accountId) {
      // IDOR: verify the account belongs to the caller
      const account = await ctx.db.get(args.accountId);
      if (!account || account.userId !== args.userId) return [];
      return ctx.db
        .query("transactions")
        .withIndex("accountId", (q) => q.eq("accountId", args.accountId!))
        .order("desc")
        .take(args.limit ?? 50);
    }
    return ctx.db
      .query("transactions")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

/* ══════════════════════════ Cards ══════════════════════════ */

export const listCards = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("cards")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const createCard = mutation({
  args: {
    userId: v.id("users"),
    accountId: v.id("accounts"),
    name: v.string(),
    cardType: v.union(v.literal("debit"), v.literal("virtual"), v.literal("credit")),
    creditLimit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.accountId);
    if (!account || account.userId !== args.userId) throw new Error("Account not found or unauthorized");

    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const lastFour = String(1000 + (arr[0] % 9000));
    const now = new Date();
    const expiry = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getFullYear() + 4).slice(-2)}`;

    const cardId = await ctx.db.insert("cards", {
      userId: args.userId,
      accountId: args.accountId,
      name: args.name,
      cardType: args.cardType,
      lastFour,
      expiryDate: expiry,
      status: "active",
      creditLimit: args.creditLimit,
      balance: args.cardType === "credit" ? 0 : undefined,
      spendingLimit: 5000,
      internationalEnabled: true,
      contactlessEnabled: true,
      createdAt: now.getTime(),
    });

    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: "Card issued",
      message: `Your ${args.cardType} card •••• ${lastFour} is ready.`,
      type: "success",
      category: "card",
      read: false,
      createdAt: now.getTime(),
    });

    return cardId;
  },
});

export const setCardStatus = mutation({
  args: {
    userId: v.id("users"),
    cardId: v.id("cards"),
    status: v.union(
      v.literal("active"),
      v.literal("frozen"),
      v.literal("blocked"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    // IDOR: only the card owner can change status
    if (!card || card.userId !== args.userId) throw new Error("Card not found or unauthorized");

    await ctx.db.patch(args.cardId, { status: args.status });

    await ctx.db.insert("notifications", {
      userId: args.userId,
      title: args.status === "frozen" ? "Card frozen" : args.status === "active" ? "Card unfrozen" : `Card ${args.status}`,
      message: `Card •••• ${card.lastFour} is now ${args.status}.`,
      type: args.status === "active" ? "success" : "warning",
      category: "card",
      read: false,
      createdAt: Date.now(),
    });

    return { ok: true };
  },
});

/* ══════════════════════════ Notifications ══════════════════════════ */

export const listNotifications = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("notifications")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 30);
  },
});

export const markNotificationRead = mutation({
  args: { userId: v.id("users"), notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const n = await ctx.db.get(args.notificationId);
    if (!n || n.userId !== args.userId) throw new Error("Notification not found or unauthorized");
    await ctx.db.patch(args.notificationId, { read: true });
    return { ok: true };
  },
});

export const markAllNotificationsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .collect();
    for (const n of unread.filter((x) => !x.read)) {
      await ctx.db.patch(n._id, { read: true });
    }
    return { ok: true };
  },
});

/* ══════════════════════════ Ledger integrity (admin) ══════════════════════════ */

export const ledgerIntegrity = query({
  args: {},
  handler: async (ctx) => {
    const journals = await ctx.db.query("ledgerJournals").collect();
    const entries = await ctx.db.query("ledgerEntries").collect();

    const byJournal = new Map<string, { debits: number; credits: number }>();
    for (const e of entries) {
      const cur = byJournal.get(e.journalId) || { debits: 0, credits: 0 };
      cur.debits += e.debit;
      cur.credits += e.credit;
      byJournal.set(e.journalId, cur);
    }

    const unbalanced: { journalNumber: string; debits: number; credits: number }[] = [];
    for (const j of journals) {
      const sums = byJournal.get(j._id) || { debits: 0, credits: 0 };
      if (Math.abs(sums.debits - sums.credits) > 0.004) {
        unbalanced.push({ journalNumber: j.journalNumber, debits: sums.debits, credits: sums.credits });
      }
    }

    const accounts = await ctx.db.query("ledgerAccounts").collect();
    const customerTotal = round2(accounts.filter((a) => a.kind === "customer").reduce((s, a) => s + a.balance, 0));
    const treasuryTotal = round2(accounts.filter((a) => a.kind !== "customer").reduce((s, a) => s + a.balance, 0));

    return {
      journals: journals.length,
      entries: entries.length,
      unbalancedCount: unbalanced.length,
      unbalanced,
      consistent: unbalanced.length === 0,
      customerTotal,
      treasuryTotal,
    };
  },
});
