import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Double-entry ledger core.
 *
 * Every money movement writes a journal with balanced entries:
 *   sum(debits) === sum(credits)  per journal
 *
 * Conventions:
 *  - Customer ledger accounts are ASSET accounts (debit-normal): money in = debit (+),
 *    money out = credit (-). The `balance` field tracks debit-minus-credit.
 *  - Treasury/expense accounts are DEBIT-normal too in our simplified model, with
 *    positive balance meaning funds held/earned.
 *  - A customer deposit: DEBIT customer ledger (money they hold), CREDIT treasury clearing
 *  - A transfer A→B: CREDIT A's ledger, DEBIT B's ledger (balanced pair)
 *  - A fee: CREDIT customer ledger, DEBIT fee income ledger
 *
 * All writes happen inside the caller's transaction — Convex mutations are
 * serializable and atomic, so journals are written all-or-nothing.
 */

export const getOrCreateLedgerAccount = internalMutation({
  args: {
    code: v.string(),
    name: v.string(),
    kind: v.union(v.literal("customer"), v.literal("treasury"), v.literal("fee_income"), v.literal("interest_expense")),
    linkedAccountId: v.optional(v.id("accounts")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("ledgerAccounts")
      .withIndex("code", (q) => q.eq("code", args.code))
      .unique();
    if (existing) return existing._id;

    return ctx.db.insert("ledgerAccounts", {
      code: args.code,
      name: args.name,
      kind: args.kind,
      balance: 0,
      linkedAccountId: args.linkedAccountId,
    });
  },
});

export const getTreasuryAccounts = internalQuery({
  args: {},
  handler: async (ctx) => {
    const codes = ["treasury:checking_clearing", "treasury:savings_clearing", "treasury:fee_income", "treasury:interest_expense"];
    const accounts: { code: string; id: string }[] = [];
    for (const code of codes) {
      const acc = await ctx.db
        .query("ledgerAccounts")
        .withIndex("code", (q) => q.eq("code", code))
        .unique();
      if (acc) accounts.push({ code, id: acc._id });
    }
    return accounts;
  },
});

export const ensureTreasuryAccounts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const treasury = [
      { code: "treasury:checking_clearing", name: "Checking Clearing Treasury" },
      { code: "treasury:savings_clearing", name: "Savings Clearing Treasury" },
      { code: "treasury:fee_income", name: "Fee Income", kind: "fee_income" as const },
      { code: "treasury:interest_expense", name: "Interest Expense", kind: "interest_expense" as const },
    ];
    for (const t of treasury) {
      const existing = await ctx.db
        .query("ledgerAccounts")
        .withIndex("code", (q) => q.eq("code", t.code))
        .unique();
      if (!existing) {
        await ctx.db.insert("ledgerAccounts", {
          code: t.code,
          name: t.name,
          kind: ("kind" in t ? t.kind : "treasury") as "treasury" | "fee_income" | "interest_expense",
          balance: 0,
        });
      }
    }
  },
});

/**
 * Post a balanced journal. Throws if debits !== credits (this aborts the whole
 * mutation, guaranteeing no unbalanced money movement is ever persisted).
 */
export const postJournal = internalMutation({
  args: {
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
    // Each line: ledger account code (existing), debit amount, credit amount
    lines: v.array(
      v.object({
        ledgerAccountCode: v.string(),
        debit: v.number(),
        credit: v.number(),
        memo: v.string(),
      }),
    ),
  },
  handler: async (ctx, args): Promise<string> => {
    // Validate balance BEFORE writing anything
    const totalDebits = args.lines.reduce((s, l) => s + l.debit, 0);
    const totalCredits = args.lines.reduce((s, l) => s + l.credit, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.004) {
      throw new Error(
        `JOURNAL UNBALANCED: debits=${totalDebits.toFixed(2)} credits=${totalCredits.toFixed(2)} — ${args.description}`,
      );
    }

    if (totalDebits <= 0) {
      throw new Error(`JOURNAL EMPTY: no value movement in ${args.description}`);
    }

    // Resolve ledger accounts
    const resolved: { ledgerAccountId: string; debit: number; credit: number; memo: string }[] = [];
    for (const line of args.lines) {
      const acc = await ctx.db
        .query("ledgerAccounts")
        .withIndex("code", (q) => q.eq("code", line.ledgerAccountCode))
        .unique();
      if (!acc) {
        throw new Error(`LEDGER ACCOUNT NOT FOUND: ${line.ledgerAccountCode}`);
      }
      resolved.push({
        ledgerAccountId: acc._id,
        debit: Math.round(line.debit * 100) / 100,
        credit: Math.round(line.credit * 100) / 100,
        memo: line.memo,
      });
    }

    const now = Date.now();
    const journalNumber = `JRN-${now}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const journalId = await ctx.db.insert("ledgerJournals", {
      journalNumber,
      description: args.description,
      sourceType: args.sourceType,
      sourceId: args.sourceId,
      createdAt: now,
      totalDebits: Math.round(totalDebits * 100) / 100,
      totalCredits: Math.round(totalCredits * 100) / 100,
    });

    for (const line of resolved) {
      const ledgerAccId = line.ledgerAccountId as Id<"ledgerAccounts">;
      await ctx.db.insert("ledgerEntries", {
        journalId,
        ledgerAccountId: ledgerAccId,
        debit: line.debit,
        credit: line.credit,
        memo: line.memo,
        createdAt: now,
      });

      // Update ledger account balance: debit increases, credit decreases (debit-normal)
      const acc = await ctx.db.get(ledgerAccId);
      if (acc) {
        await ctx.db.patch(ledgerAccId, {
          balance: Math.round((acc.balance + line.debit - line.credit) * 100) / 100,
        });
      }
    }

    return journalId;
  },
});

/** Reverse an existing journal (used for reversals/refunds). Creates a balanced mirror journal. */
export const reverseJournal = internalMutation({
  args: { journalId: v.id("ledgerJournals"), reason: v.string() },
  handler: async (ctx, args) => {
    const journal = await ctx.db.get(args.journalId);
    if (!journal) throw new Error("Journal not found");

    const entries = await ctx.db
      .query("ledgerEntries")
      .withIndex("journalId", (q) => q.eq("journalId", args.journalId))
      .collect();

    const lines = entries.map((e) => {
      return { ledgerAccountId: e.ledgerAccountId, debit: e.credit, credit: e.debit, memo: e.memo };
    });

    const now = Date.now();
    const reversalNumber = `JRN-REV-${now}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const totalDebits = lines.reduce((s, l) => s + l.debit, 0);
    const totalCredits = lines.reduce((s, l) => s + l.credit, 0);

    const reversalId = await ctx.db.insert("ledgerJournals", {
      journalNumber: reversalNumber,
      description: `Reversal of ${journal.journalNumber}: ${args.reason}`,
      sourceType: "reversal",
      sourceId: args.journalId,
      createdAt: now,
      totalDebits: Math.round(totalDebits * 100) / 100,
      totalCredits: Math.round(totalCredits * 100) / 100,
    });

    for (const line of lines) {
      await ctx.db.insert("ledgerEntries", {
        journalId: reversalId,
        ledgerAccountId: line.ledgerAccountId,
        debit: line.debit,
        credit: line.credit,
        memo: line.memo,
        createdAt: now,
      });
      const acc = await ctx.db.get(line.ledgerAccountId);
      if (acc) {
        await ctx.db.patch(line.ledgerAccountId, {
          balance: Math.round((acc.balance + line.debit - line.credit) * 100) / 100,
        });
      }
    }

    return reversalId;
  },
});

/** Ledger consistency check: every journal must have debits === credits. */
export const verifyLedgerConsistency = internalQuery({
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

    return {
      journals: journals.length,
      entries: entries.length,
      unbalanced,
      consistent: unbalanced.length === 0,
    };
  },
});

/** Global trial balance: sum of all ledger account balances must be meaningful (all customer + treasury = 0). */
export const trialBalance = internalQuery({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("ledgerAccounts").collect();
    const customerTotal = accounts
      .filter((a) => a.kind === "customer")
      .reduce((s, a) => s + a.balance, 0);
    const treasuryTotal = accounts
      .filter((a) => a.kind !== "customer")
      .reduce((s, a) => s + a.balance, 0);
    return { customerTotal, treasuryTotal, accounts: accounts.length };
  },
});
