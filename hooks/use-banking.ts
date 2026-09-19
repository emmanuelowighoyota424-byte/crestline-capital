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

  return {
    ...context,
    formatCurrency,
    getTotalBalance,
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
    bills: context.billPayees || [], 
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
