-- ============================================================
-- CRESTLINE CAPITAL - COMPLETE DATABASE SCHEMA
-- Production-grade digital banking platform
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CORE USER & AUTH TABLES
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  address TEXT,
  date_of_birth TEXT,
  ssn TEXT,
  profile_picture_url TEXT,
  member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tier TEXT DEFAULT 'Standard' CHECK (tier IN ('Standard', 'Premium', 'Crestline Premium', 'Crestline Elite')),
  ultimate_rewards_points INTEGER DEFAULT 0,
  preferred_language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'America/New_York',
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'support', 'compliance', 'fraud_analyst', 'loan_officer', 'bank_admin', 'super_admin', 'auditor')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'restricted', 'closed')),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  totp_secret TEXT,
  totp_backup_codes TEXT[],
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  device_info TEXT,
  ip_address TEXT,
  location TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE
);

-- Device registrations
CREATE TABLE IF NOT EXISTS public.device_registrations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT CHECK (device_type IN ('web', 'mobile', 'tablet')),
  platform TEXT CHECK (platform IN ('ios', 'android', 'web')),
  push_token TEXT,
  sms_number TEXT,
  notification_enabled BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT TRUE,
  last_active TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ACCOUNT TABLES
-- ============================================================

-- Accounts table
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'business', 'credit', 'investment')),
  balance NUMERIC(15, 2) DEFAULT 0,
  available_balance NUMERIC(15, 2) DEFAULT 0,
  account_number TEXT UNIQUE NOT NULL,
  routing_number TEXT,
  interest_rate NUMERIC(5, 3),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed', 'pending')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TRANSACTION & LEDGER SYSTEM (Double-Entry)
-- ============================================================

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type TEXT NOT NULL CHECK (type IN ('debit', 'credit')),
  category TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'processing', 'failed', 'cancelled', 'reversed')),
  reference TEXT,
  fee NUMERIC(10, 2),
  recipient_id UUID,
  recipient_bank TEXT,
  recipient_account TEXT,
  recipient_name TEXT,
  sender_name TEXT,
  account_from TEXT,
  account_to TEXT,
  bank_name TEXT,
  routing_number TEXT,
  idempotency_key TEXT UNIQUE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Double-entry ledger accounts
CREATE TABLE IF NOT EXISTS public.ledger_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  code TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES public.ledger_accounts(id),
  balance NUMERIC(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journal entries (balanced pairs)
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL,
  description TEXT,
  transaction_id UUID REFERENCES public.transactions(id),
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES public.users(id)
);

-- Ledger entries (debits and credits)
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  ledger_account_id UUID NOT NULL REFERENCES public.ledger_accounts(id),
  debit NUMERIC(15, 2) DEFAULT 0 CHECK (debit >= 0),
  credit NUMERIC(15, 2) DEFAULT 0 CHECK (credit >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (debit > 0 OR credit > 0),
  CHECK (NOT (debit > 0 AND credit > 0))
);

-- ============================================================
-- TRANSFER SYSTEM
-- ============================================================

-- Transfers
CREATE TABLE IF NOT EXISTS public.transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  from_account_id UUID REFERENCES public.accounts(id),
  to_account_id UUID REFERENCES public.accounts(id),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('internal', 'ach', 'wire', 'zelle', 'instant')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed')),
  recipient_name TEXT,
  recipient_email TEXT,
  recipient_phone TEXT,
  recipient_bank TEXT,
  recipient_routing_number TEXT,
  recipient_account_number TEXT,
  description TEXT,
  fee NUMERIC(10, 2) DEFAULT 0,
  idempotency_key TEXT UNIQUE,
  risk_score NUMERIC(5, 2),
  fraud_check_result TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beneficiaries
CREATE TABLE IF NOT EXISTS public.beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bank_name TEXT,
  routing_number TEXT,
  account_number TEXT,
  account_type TEXT,
  nickname TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CARD SYSTEM
-- ============================================================

-- Cards
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id),
  name TEXT NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('debit', 'credit', 'virtual')),
  last_four TEXT NOT NULL,
  expiry_date TEXT,
  credit_limit NUMERIC(15, 2),
  current_balance NUMERIC(15, 2) DEFAULT 0,
  minimum_payment NUMERIC(15, 2),
  due_date TEXT,
  apr NUMERIC(5, 2),
  rewards_points INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'blocked', 'expired', 'cancelled')),
  is_international_enabled BOOLEAN DEFAULT TRUE,
  is_contactless_enabled BOOLEAN DEFAULT TRUE,
  spending_limit NUMERIC(15, 2),
  daily_limit NUMERIC(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DEPOSIT & WITHDRAWAL SYSTEM
-- ============================================================

-- Deposits
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  method TEXT NOT NULL CHECK (method IN ('bank_transfer', 'check', 'cash', 'wire', 'ach')),
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated', 'pending', 'processing', 'settled', 'failed', 'reversed')),
  reference TEXT,
  provider_reference TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settled_at TIMESTAMP
);

-- Withdrawals
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  method TEXT NOT NULL CHECK (method IN ('bank_transfer', 'check', 'wire', 'ach')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  destination_name TEXT,
  destination_bank TEXT,
  destination_account TEXT,
  destination_routing TEXT,
  reference TEXT,
  risk_score NUMERIC(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- ============================================================
-- SAVINGS GOALS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(15, 2) NOT NULL,
  current_amount NUMERIC(15, 2) DEFAULT 0,
  deadline TEXT,
  category TEXT,
  icon TEXT,
  auto_save BOOLEAN DEFAULT FALSE,
  auto_save_amount NUMERIC(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- LOAN SYSTEM
-- ============================================================

-- Loans
CREATE TABLE IF NOT EXISTS public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  product_name TEXT NOT NULL,
  loan_type TEXT NOT NULL CHECK (loan_type IN ('personal', 'mortgage', 'auto', 'business', 'student', 'line_of_credit')),
  principal_amount NUMERIC(15, 2) NOT NULL,
  interest_rate NUMERIC(5, 3) NOT NULL,
  term_months INTEGER NOT NULL,
  monthly_payment NUMERIC(15, 2),
  outstanding_principal NUMERIC(15, 2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'active', 'paid_off', 'defaulted')),
  application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approval_date TIMESTAMP,
  disbursement_date TIMESTAMP,
  maturity_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loan payments
CREATE TABLE IF NOT EXISTS public.loan_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID NOT NULL REFERENCES public.loans(id),
  amount NUMERIC(15, 2) NOT NULL,
  principal_portion NUMERIC(15, 2),
  interest_portion NUMERIC(15, 2),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  reference TEXT
);

-- ============================================================
-- KYC / AML / COMPLIANCE
-- ============================================================

-- KYC profiles
CREATE TABLE IF NOT EXISTS public.kyc_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) UNIQUE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'pending', 'in_review', 'verified', 'rejected', 'requires_action')),
  identity_verified BOOLEAN DEFAULT FALSE,
  address_verified BOOLEAN DEFAULT FALSE,
  income_verified BOOLEAN DEFAULT FALSE,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  verification_date TIMESTAMP,
  expiry_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KYC documents
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_profile_id UUID NOT NULL REFERENCES public.kyc_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement', 'proof_of_income', 'other')),
  file_name TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_notes TEXT,
  reviewed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

-- AML checks
CREATE TABLE IF NOT EXISTS public.aml_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  check_type TEXT NOT NULL CHECK (check_type IN ('sanctions', 'pep', 'adverse_media', 'identity_screening')),
  result TEXT NOT NULL CHECK (result IN ('clear', 'hit', 'potential_match', 'error')),
  risk_score NUMERIC(5, 2),
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- FRAUD DETECTION
-- ============================================================

-- Fraud alerts
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  transaction_id UUID REFERENCES public.transactions(id),
  transfer_id UUID REFERENCES public.transfers(id),
  alert_type TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_score NUMERIC(5, 2),
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  assigned_to UUID REFERENCES public.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Fraud cases
CREATE TABLE IF NOT EXISTS public.fraud_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES public.fraud_alerts(id),
  user_id UUID REFERENCES public.users(id),
  case_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'escalated', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to UUID REFERENCES public.users(id),
  description TEXT,
  resolution TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  closed_at TIMESTAMP
);

-- ============================================================
-- NOTIFICATION SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'alert')),
  category TEXT,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  transaction_alerts BOOLEAN DEFAULT TRUE,
  security_alerts BOOLEAN DEFAULT TRUE,
  balance_alerts BOOLEAN DEFAULT TRUE,
  balance_threshold NUMERIC(15, 2) DEFAULT 1000,
  login_alerts BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification log for delivery tracking
CREATE TABLE IF NOT EXISTS public.notification_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id),
  device_id TEXT,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('push', 'sms', 'in_app', 'email')),
  title TEXT,
  message TEXT NOT NULL,
  related_transfer_id UUID,
  related_account_id UUID,
  metadata JSONB,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
  delivery_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- BILL PAY
-- ============================================================

CREATE TABLE IF NOT EXISTS public.billers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  account_number TEXT,
  is_autopay BOOLEAN DEFAULT FALSE,
  next_due_date TEXT,
  amount NUMERIC(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.bill_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  biller_id UUID REFERENCES public.billers(id),
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  amount NUMERIC(15, 2) NOT NULL,
  payee TEXT NOT NULL,
  category TEXT,
  frequency TEXT DEFAULT 'once' CHECK (frequency IN ('once', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  scheduled_date TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  reference TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- ============================================================
-- PAYMENTS (external)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  amount NUMERIC(15, 2) NOT NULL,
  payee TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  reference TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INVESTMENTS (sandbox)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  account_id UUID REFERENCES public.accounts(id),
  name TEXT NOT NULL,
  symbol TEXT,
  type TEXT CHECK (type IN ('stock', 'etf', 'bond', 'mutual_fund', 'crypto', 'other')),
  quantity NUMERIC(15, 6),
  purchase_price NUMERIC(15, 2),
  current_price NUMERIC(15, 2),
  purchase_date TIMESTAMP,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ADMIN & AUDIT
-- ============================================================

-- Admin transfers
CREATE TABLE IF NOT EXISTS public.admin_transfers (
  id BIGSERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.users(id),
  recipient_id UUID NOT NULL REFERENCES public.users(id),
  account_id UUID REFERENCES public.accounts(id),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'otp_sent', 'confirmed', 'completed', 'failed', 'cancelled')),
  otp_code TEXT,
  otp_expires_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  reference_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  actor_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  subject TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- IDEMPOTENCY KEYS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.idempotency_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  response JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider events (webhook tracking)
CREATE TABLE IF NOT EXISTS public.provider_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_id TEXT UNIQUE,
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_number ON public.accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON public.transactions(reference);
CREATE INDEX IF NOT EXISTS idx_transactions_idempotency ON public.transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_journal ON public.ledger_entries(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account ON public.ledger_entries(ledger_account_id);
CREATE INDEX IF NOT EXISTS idx_transfers_user_id ON public.transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON public.transfers(status);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON public.savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON public.loans(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_profiles_user_id ON public.kyc_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_user_id ON public.fraud_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON public.fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_billers_user_id ON public.billers(user_id);
CREATE INDEX IF NOT EXISTS idx_bill_payments_user_id ON public.bill_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON public.audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_key ON public.idempotency_keys(key);
CREATE INDEX IF NOT EXISTS idx_notification_log_user ON public.notification_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_status ON public.notification_log(delivery_status);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Service role bypass policies (the app uses service role)
-- RLS is enabled but bypassed via service role key in server-side code

-- ============================================================
-- SEED LEDGER ACCOUNTS
-- ============================================================

INSERT INTO public.ledger_accounts (name, type, code) VALUES
  ('Customer Checking Assets', 'asset', '1000'),
  ('Customer Savings Assets', 'asset', '1010'),
  ('Business Account Assets', 'asset', '1020'),
  ('Cash in Transit', 'asset', '1100'),
  ('Interbank Settlement', 'asset', '1200'),
  ('Customer Deposits', 'liability', '2000'),
  ('Float Balance', 'liability', '2100'),
  ('Interest Payable', 'liability', '2200'),
  ('Equity Capital', 'equity', '3000'),
  ('Retained Earnings', 'equity', '3100'),
  ('Interest Income', 'revenue', '4000'),
  ('Fee Income', 'revenue', '4100'),
  ('Processing Fees', 'expense', '5000'),
  ('Compliance Costs', 'expense', '5100')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- SEED DEMO DATA
-- ============================================================

-- Demo user (password: Crestline2024!)
-- Note: In production, password_hash should be generated server-side with bcrypt
INSERT INTO public.users (id, email, username, password_hash, name, phone, address, tier, role, two_factor_enabled)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'demo@crestlinecapital.com',
  'demo_user',
  '$2b$10$placeholder_hash',
  'Alex Morgan',
  '+1 (212) 555-0199',
  '125 Park Avenue, New York, NY 10017',
  'Crestline Premium',
  'customer',
  FALSE
) ON CONFLICT (email) DO NOTHING;

-- Demo accounts
INSERT INTO public.accounts (user_id, name, type, balance, available_balance, account_number, routing_number, interest_rate)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Crestline Checking', 'checking', 28450.75, 28450.75, 'CC45012200001', '021000021', 0.01),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Crestline Savings', 'savings', 52500.00, 52500.00, 'CC45022200002', '021000021', 4.5),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Crestline Business', 'business', 125000.50, 125000.50, 'CC45032200003', '021000021', 2.0)
ON CONFLICT (account_number) DO NOTHING;

-- Demo cards
INSERT INTO public.cards (user_id, account_id, name, card_type, last_four, expiry_date, credit_limit, current_balance, minimum_payment, due_date, apr, status)
SELECT
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  a.id,
  'Crestline Platinum Card',
  'credit',
  '4501',
  '12/28',
  25000.00,
  3245.67,
  250.00,
  '15',
  19.99,
  'active'
FROM public.accounts a WHERE a.account_number = 'CC45012200001'
ON CONFLICT DO NOTHING;

INSERT INTO public.cards (user_id, account_id, name, card_type, last_four, expiry_date, credit_limit, current_balance, minimum_payment, due_date, apr, status)
SELECT
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  a.id,
  'Crestline Rewards Card',
  'debit',
  '4502',
  '06/27',
  NULL,
  0,
  NULL,
  NULL,
  NULL,
  'active'
FROM public.accounts a WHERE a.account_number = 'CC45022200002'
ON CONFLICT DO NOTHING;

-- Demo transactions
INSERT INTO public.transactions (account_id, description, amount, date, type, category, status, reference)
SELECT
  a.id,
  'Wire Transfer Credit - Premium Services Corp',
  5000.00,
  NOW() - INTERVAL '1 hour',
  'credit',
  'Income',
  'completed',
  'WIRE-PSC-' || EXTRACT(EPOCH FROM NOW())::TEXT
FROM public.accounts a WHERE a.account_number = 'CC45012200001'
ON CONFLICT DO NOTHING;

INSERT INTO public.transactions (account_id, description, amount, date, type, category, status, reference)
SELECT
  a.id,
  'Payroll Direct Deposit',
  8750.00,
  NOW() - INTERVAL '1 day',
  'credit',
  'Income',
  'completed',
  'PAYROLL-' || EXTRACT(EPOCH FROM NOW())::TEXT
FROM public.accounts a WHERE a.account_number = 'CC45012200001'
ON CONFLICT DO NOTHING;

INSERT INTO public.transactions (account_id, description, amount, date, type, category, status, reference)
SELECT
  a.id,
  'Electric Bill - Con Edison',
  187.45,
  NOW() - INTERVAL '2 days',
  'debit',
  'Bills & Utilities',
  'completed',
  'UTIL-CE-' || EXTRACT(EPOCH FROM NOW())::TEXT
FROM public.accounts a WHERE a.account_number = 'CC45012200001'
ON CONFLICT DO NOTHING;

INSERT INTO public.transactions (account_id, description, amount, date, type, category, status, reference)
SELECT
  a.id,
  'Amazon Purchase',
  156.99,
  NOW() - INTERVAL '3 days',
  'debit',
  'Shopping',
  'completed',
  'AMZ-' || EXTRACT(EPOCH FROM NOW())::TEXT
FROM public.accounts a WHERE a.account_number = 'CC45012200001'
ON CONFLICT DO NOTHING;

INSERT INTO public.transactions (account_id, description, amount, date, type, category, status, reference)
SELECT
  a.id,
  'Grocery Store - Whole Foods',
  234.87,
  NOW() - INTERVAL '4 days',
  'debit',
  'Food & Drink',
  'completed',
  'WF-' || EXTRACT(EPOCH FROM NOW())::TEXT
FROM public.accounts a WHERE a.account_number = 'CC45012200001'
ON CONFLICT DO NOTHING;

-- Demo notifications
INSERT INTO public.notifications (user_id, title, message, type, category, read)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Welcome to Crestline Capital', 'Your account is ready. Start exploring your new digital banking experience.', 'success', 'account', FALSE),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Security Alert', 'A new device signed into your account from New York, NY.', 'alert', 'security', FALSE),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Deposit Confirmed', 'Your direct deposit of $8,750.00 has been processed.', 'success', 'transactions', TRUE);

-- Demo KYC profile
INSERT INTO public.kyc_profiles (user_id, status, identity_verified, address_verified, risk_level)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'verified', TRUE, TRUE, 'low')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- DONE
-- ============================================================
