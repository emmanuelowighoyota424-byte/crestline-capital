// Demo credentials for development and testing
// NEVER use these in production - for development/demo only
// SANDBOX MODE: This is a demo environment

export const DEMO_CREDENTIALS = {
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@crestline.demo",
  username: "Alex Morgan",
  // This is a bcrypt hash - replace with actual hash in production
  passwordHash: "$2b$10$YourHashedPasswordHere",
  // Plain text ONLY for reference - NEVER store this
  passwordPlain: "Crestline2024!",
}

export const DEMO_ACCOUNTS = [
  {
    accountType: "Checking",
    accountNumber: "****4501",
    balance: 28450.75,
    currency: "USD",
  },
  {
    accountType: "Savings",
    accountNumber: "****4502",
    balance: 52500.00,
    currency: "USD",
  },
  {
    accountType: "Business",
    accountNumber: "****4503",
    balance: 125000.50,
    currency: "USD",
  },
]

export const DEMO_TRANSACTIONS = [
  {
    type: "transfer",
    amount: 500.00,
    description: "Transfer to Savings",
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    type: "payment",
    amount: 150.00,
    description: "Utilities Bill Payment",
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    type: "deposit",
    amount: 5000.00,
    description: "Direct Deposit - Payroll",
    timestamp: new Date(Date.now() - 259200000),
  },
]
