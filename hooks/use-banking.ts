'use client'

import { useBanking as useBaseBanking } from '@/lib/banking-context'
export { BankingProvider, BankingContext } from '@/lib/banking-context'

export function useBanking() {
  const context = useBaseBanking()

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const getTotalBalance = () => {
    if (!context?.accounts || !Array.isArray(context.accounts)) return 0
    return context.accounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0)
  }

  // Alias stubs for pages that reference properties not on the base context
  const depositCheck = (params: { amount: number; accountName: string; checkNumber?: string }) => {
    // Record a credit transaction for the deposit
    if (context.addTransaction) {
      context.addTransaction({
        description: `Check Deposit #${params.checkNumber || 'N/A'}`,
        amount: params.amount,
        type: 'credit',
        category: 'Deposits',
        status: 'pending',
      })
    }
  }

  const markNotificationAsRead = context.markNotificationRead
  const clearNotifications = context.clearAllNotifications

  const transfer = (from: string, to: string, amount: number, memo?: string) => {
    if (context.transferFunds) {
      return context.transferFunds(from, to, amount, memo || `Transfer to ${to}`)
    }
    return null as any
  }

  return {
    ...context,
    formatCurrency,
    getTotalBalance,
    depositCheck,
    markNotificationAsRead,
    clearNotifications,
    transfer,
  }
}

export function useBankingAccounts() {
  const context = useBanking()
  return { 
    accounts: context.accounts || [], 
    loading: false, 
    refresh: context.saveToStorage 
  }
}

export function useBankingTransactions() {
  const context = useBanking()
  return { 
    transactions: context.transactions || [], 
    loading: false, 
    refresh: context.saveToStorage 
  }
}

export function useBankingNotifications() {
  const context = useBanking()
  return { 
    notifications: context.notifications || [], 
    unreadNotifications: context.unreadNotificationCount || 0, 
    loading: false, 
    markAsRead: context.markNotificationRead, 
    refresh: context.saveToStorage 
  }
}

export function useBankingBills() {
  const context = useBanking()
  return { 
    bills: context.payees || [], 
    billsDueThisMonth: 0, 
    totalDueThisMonth: 0, 
    loading: false, 
    addBill: () => {}, 
    refresh: context.saveToStorage 
  }
}

export function useBankingCredit() {
  const context = useBanking()
  return { 
    credit: {}, 
    loading: false 
  }
}
