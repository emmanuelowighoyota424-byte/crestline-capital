import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/* ══════════════════════════ Password hashing (Node crypto, no deps) ══════════════════════════ */
// Convex mutations run in a deterministic environment without Node crypto by default,
// so we use a simple salted hash via SubtleCrypto-free approach.
// NOTE: This is a sandbox-grade hash. Production should use bcrypt/argon2 in an action.

async function hashPassword(password: string, salt: string): Promise<string> {
  // FNV-based iterated hash — deterministic in Convex runtime
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  const input = salt + ":" + password;
  for (let round = 0; round < 5000; round++) {
    for (let i = 0; i < input.length; i++) {
      h1 = (h1 ^ input.charCodeAt(i)) >>> 0;
      h1 = (h1 * 16777619) >>> 0;
      h2 = (h2 + ((h1 ^ (h2 << 5)) >>> 0)) >>> 0;
    }
    // Mix round number to prevent identical rounds
    h1 = (h1 ^ round) >>> 0;
  }
  return `${salt}$${h1.toString(16)}${h2.toString(16)}`;
}

function generateSalt(): string {
  const arr = new Uint32Array(4);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => n.toString(16)).join("");
}

/* ══════════════════════════ Demo user seeding ══════════════════════════ */

export const seedDemoData = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Ensure treasury ledger accounts exist
    const treasuryCodes = [
      { code: "treasury:checking_clearing", name: "Checking Clearing Treasury", kind: "treasury" as const },
      { code: "treasury:savings_clearing", name: "Savings Clearing Treasury", kind: "treasury" as const },
      { code: "treasury:fee_income", name: "Fee Income", kind: "fee_income" as const },
      { code: "treasury:interest_expense", name: "Interest Expense", kind: "interest_expense" as const },
    ];
    for (const t of treasuryCodes) {
      const existing = await ctx.db
        .query("ledgerAccounts")
        .withIndex("code", (q) => q.eq("code", t.code))
        .unique();
      if (!existing) {
        await ctx.db.insert("ledgerAccounts", { code: t.code, name: t.name, kind: t.kind, balance: 1000000 });
      }
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    if (existingUser) {
      // Return existing user's accounts
      const accounts = await ctx.db
        .query("accounts")
        .withIndex("userId", (q) => q.eq("userId", existingUser._id))
        .collect();
      return { userId: existingUser._id, accounts, created: false };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(args.password, salt);

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      passwordHash,
      role: "customer",
      status: "active",
      memberSince: Date.now(),
      tier: "Crestline Premium",
      emailVerified: true,
      twoFactorEnabled: false,
      kycStatus: "verified",
    });

    // Create default accounts with opening balances via proper double-entry
    const defaults = [
      { name: "Crestline Checking", type: "checking" as const, balance: 12450.0 },
      { name: "Crestline Savings", type: "savings" as const, balance: 48220.5 },
      { name: "Crestline Business", type: "business" as const, balance: 95780.25 },
    ];

    const accountIds = [];
    for (const d of defaults) {
      const arr = new Uint32Array(2);
      crypto.getRandomValues(arr);
      const accountNumber = String(1000000000 + ((arr[0] * 4294967296 + arr[1]) % 9000000000));
      const ledgerCode = `cust:${accountNumber}`;
      const treasuryCode = d.type === "savings" ? "treasury:savings_clearing" : "treasury:checking_clearing";

      const accountId = await ctx.db.insert("accounts", {
        userId,
        name: d.name,
        type: d.type,
        accountNumber,
        routingNumber: "084106768",
        balance: d.balance,
        availableBalance: d.balance,
        interestRate: d.type === "savings" ? 4.25 : 0.01,
        status: "active",
        createdAt: Date.now(),
      });

      await ctx.db.insert("ledgerAccounts", {
        code: ledgerCode,
        name: `Customer ledger for ${d.name}`,
        kind: "customer",
        balance: d.balance,
        linkedAccountId: accountId,
      });

      // Balanced opening journal: DEBIT customer ledger, CREDIT treasury
      const now = Date.now();
      const journalId = await ctx.db.insert("ledgerJournals", {
        journalNumber: `JRN-${now}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        description: `Opening balance for ${d.name} (SANDBOX SEED)`,
        sourceType: "deposit",
        sourceId: accountId,
        createdAt: now,
        totalDebits: d.balance,
        totalCredits: d.balance,
      });

      const custLedgerId = (
        await ctx.db.query("ledgerAccounts").withIndex("code", (q) => q.eq("code", ledgerCode)).unique()
      )?._id;
      const treasuryId = (
        await ctx.db.query("ledgerAccounts").withIndex("code", (q) => q.eq("code", treasuryCode)).unique()
      )?._id;

      if (custLedgerId && treasuryId) {
        await ctx.db.insert("ledgerEntries", {
          journalId,
          ledgerAccountId: custLedgerId,
          debit: d.balance,
          credit: 0,
          memo: "Opening balance (sandbox seed)",
          createdAt: now,
        });
        await ctx.db.insert("ledgerEntries", {
          journalId,
          ledgerAccountId: treasuryId,
          debit: 0,
          credit: d.balance,
          memo: "Opening balance funding (sandbox seed)",
          createdAt: now,
        });

        // Decrement treasury by the seeded amount
        const treasury = await ctx.db.get(treasuryId);
        if (treasury) {
          await ctx.db.patch(treasuryId, { balance: Math.round((treasury.balance - d.balance) * 100) / 100 });
        }
      }

      // Seed a few sample transactions
      const samples = [
        { desc: "Direct Deposit — Payroll", amount: 3200, type: "deposit" as const, category: "income" },
        { desc: "Whole Foods Market", amount: -142.5, type: "payment" as const, category: "groceries" },
        { desc: "Electric Bill", amount: -89.99, type: "payment" as const, category: "utilities" },
      ];
      for (const s of samples) {
        await ctx.db.insert("transactions", {
          userId,
          accountId,
          type: s.type,
          status: "completed",
          amount: s.amount,
          currency: "USD",
          description: s.desc,
          reference: `TXN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
          category: s.category,
          createdAt: Date.now() - Math.floor(Math.random() * 14) * 86400000,
        });
      }

      accountIds.push(accountId);
    }

    // Seed a debit card
    if (accountIds.length > 0) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const now = new Date();
      await ctx.db.insert("cards", {
        userId,
        accountId: accountIds[0],
        name: "Crestline Platinum Debit",
        cardType: "debit",
        lastFour: String(1000 + (arr[0] % 9000)),
        expiryDate: `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getFullYear() + 4).slice(-2)}`,
        status: "active",
        spendingLimit: 5000,
        internationalEnabled: true,
        contactlessEnabled: true,
        createdAt: Date.now(),
      });
    }

    // Seed notifications
    await ctx.db.insert("notifications", {
      userId,
      title: "Welcome to Crestline Capital",
      message: "Your accounts are ready. Experience premium digital banking.",
      type: "success",
      category: "account",
      read: false,
      createdAt: Date.now(),
    });

    const accounts = await ctx.db
      .query("accounts")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();

    return { userId, accounts, created: true };
  },
});

/* ══════════════════════════ Auth queries ══════════════════════════ */

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    // Never expose the password hash to the client
    const { passwordHash, twoFactorSecret, ...safe } = user;
    return safe;
  },
});
