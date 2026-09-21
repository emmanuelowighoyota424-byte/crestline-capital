"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Account, Transaction } from "@/lib/banking-context";

/**
 * Convex banking bridge.
 *
 * - Seeds a demo customer with double-entry opening balances on first run
 * - Exposes reactive queries over Convex (accounts, transactions, notifications, cards)
 * - Money movements (transfer/deposit/withdraw) go through Convex mutations that
 *   write balanced ledger journals — never direct balance edits from the client.
 */

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

const DEMO_EMAIL = "demo@crestlinecapital.com";
const DEMO_NAME = "Demo Customer";
const DEMO_PASSWORD = "CrestlineDemo2026!";

function idempotencyKey(scope: string): string {
  return `${scope}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useConvexBanking() {
  const convexEnabled = Boolean(CONVEX_URL);

  const [demoUserId, setDemoUserId] = useState<Id<"users"> | null>(null);
  const [seedAttempted, setSeedAttempted] = useState(false);

  const seedDemoData = useMutation(api.users.seedDemoData);

  // Seed once on mount (idempotent — returns the existing user if already seeded)
  useEffect(() => {
    if (!convexEnabled || seedAttempted) return;
    let cancelled = false;
    setSeedAttempted(true);
    seedDemoData({ email: DEMO_EMAIL, name: DEMO_NAME, password: DEMO_PASSWORD })
      .then((result) => {
        if (!cancelled && result) setDemoUserId(result.userId);
      })
      .catch((err) => {
        console.error("[crestline] Convex seed failed:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [convexEnabled, seedAttempted, seedDemoData]);

  // Reactive queries
  const accountsRaw = useQuery(
    api.banking.listAccounts,
    demoUserId ? { userId: demoUserId } : "skip",
  );
  const transactionsRaw = useQuery(
    api.banking.listTransactions,
    demoUserId ? { userId: demoUserId, limit: 50 } : "skip",
  );
  const notificationsRaw = useQuery(
    api.banking.listNotifications,
    demoUserId ? { userId: demoUserId, limit: 30 } : "skip",
  );
  const cardsRaw = useQuery(api.banking.listCards, demoUserId ? { userId: demoUserId } : "skip");

  // Mutations
  const transferMutation = useMutation(api.banking.internalTransfer);
  const depositMutation = useMutation(api.banking.createDeposit);
  const withdrawMutation = useMutation(api.banking.createWithdrawal);
  const createCardMutation = useMutation(api.banking.createCard);
  const setCardStatusMutation = useMutation(api.banking.setCardStatus);
  const openAccountMutation = useMutation(api.banking.openAccount);

  // Map Convex account docs → app Account shape
  const accounts: Account[] | null = accountsRaw
    ? accountsRaw.map((a) => ({
        id: a._id as unknown as string,
        name: a.name,
        type: a.type,
        balance: a.balance,
        availableBalance: a.availableBalance,
        accountNumber: a.accountNumber,
        routingNumber: a.routingNumber,
        interestRate: a.interestRate,
      }))
    : null;

  const transactions: Transaction[] | null = transactionsRaw
    ? transactionsRaw.map((t) => ({
        id: t._id as unknown as string,
        description: t.description,
        amount: t.amount,
        date: new Date(t.createdAt).toISOString(),
        type: t.amount >= 0 ? ("credit" as const) : ("debit" as const),
        category: t.category ?? "other",
        status: t.status as Transaction["status"],
        reference: t.reference,
        recipientName: t.recipientName,
        senderName: t.senderName,
        accountId: t.accountId as unknown as string,
      }))
    : null;

  return {
    convexEnabled,
    demoUserId,
    accounts,
    transactions,
    notificationsRaw,
    cardsRaw,
    mutations: {
      transfer: async (args: { fromAccountId: string; toAccountId: string; amount: number; memo?: string }) => {
        if (!demoUserId) throw new Error("Not initialized");
        return transferMutation({
          userId: demoUserId,
          fromAccountId: args.fromAccountId as Id<"accounts">,
          toAccountId: args.toAccountId as Id<"accounts">,
          amount: args.amount,
          memo: args.memo,
          idempotencyKey: idempotencyKey("trf"),
        });
      },
      deposit: async (args: { accountId: string; amount: number }) => {
        if (!demoUserId) throw new Error("Not initialized");
        return depositMutation({
          userId: demoUserId,
          accountId: args.accountId as Id<"accounts">,
          method: "bank_transfer",
          amount: args.amount,
          idempotencyKey: idempotencyKey("dep"),
        });
      },
      withdraw: async (args: { accountId: string; amount: number }) => {
        if (!demoUserId) throw new Error("Not initialized");
        return withdrawMutation({
          userId: demoUserId,
          accountId: args.accountId as Id<"accounts">,
          method: "bank_transfer",
          amount: args.amount,
          idempotencyKey: idempotencyKey("wdr"),
        });
      },
      createCard: async (args: { accountId: string; name: string; cardType: "debit" | "virtual" | "credit"; creditLimit?: number }) => {
        if (!demoUserId) throw new Error("Not initialized");
        return createCardMutation({
          userId: demoUserId,
          accountId: args.accountId as Id<"accounts">,
          name: args.name,
          cardType: args.cardType,
          creditLimit: args.creditLimit,
        });
      },
      setCardStatus: async (args: { cardId: string; status: "active" | "frozen" | "blocked" | "cancelled" }) => {
        if (!demoUserId) throw new Error("Not initialized");
        return setCardStatusMutation({
          userId: demoUserId,
          cardId: args.cardId as Id<"cards">,
          status: args.status,
        });
      },
      openAccount: async (args: { name: string; type: "checking" | "savings" | "business" | "money_market"; initialDeposit?: number }) => {
        if (!demoUserId) throw new Error("Not initialized");
        return openAccountMutation({
          userId: demoUserId,
          name: args.name,
          type: args.type,
          initialDeposit: args.initialDeposit,
        });
      },
    },
  };
}
