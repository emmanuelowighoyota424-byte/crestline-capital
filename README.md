# Crestline Capital — Institutional Digital Banking Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://crestlinecapital.vercel.app)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015+-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Google Workspace](https://img.shields.io/badge/Google%20Workspace-OAuth%202.0-EA4335?style=for-the-badge&logo=gmail)](https://workspace.google.com)

**Crestline Capital** is a high-security digital banking and treasury management web application built with Next.js, TypeScript, and modern cryptographic authorization standards. It provides institutional accounts, liquidity management, double-entry ledger settlement, two-factor authentication, and an embedded **Institutional Gmail Hub** with split-pane email viewing.

---

## 🌟 Key Capabilities

### 1. Financial Overview & Real-Time Accounts
- **Multi-Account Operating Pools**: Treasury checking accounts, high-yield savings (compounding APY), investment sweep portfolios, and commercial credit cards.
- **Real-Time Ledger**: Double-entry transaction auditing, category breakdowns, and exportable ledger histories.
- **Funds Movement**: Instant peer transfers, domestic and international Fedwire executions, bill payments, and secure deposit processing.

### 2. Institutional Gmail Communications Hub (`/gmail` & Embedded Dashboard)
- **Split-Pane Reading Engine**:
  - Side-by-side mailbox view: browse message threads on the left while instantly reading message bodies on the right without page reloads or leaving the dashboard.
  - Quick-reply composer with pre-configured institutional banking templates (*Fedwire Execution Advice*, *Portfolio Audit Statements*, *KYC Diligence Submissions*, and *Security Sign-In Advisories*).
  - Star toggling, trash management, DKIM/TLS encryption verification, and thread navigation controls.
- **Google Workspace OAuth 2.0 Integration**:
  - Secure client-side token acquisition using Google Identity Services (GIS) / Firebase Auth.
  - Authorized Google Workspace scopes: `gmail.readonly`, `gmail.compose`, and `gmail.modify`.
  - In-memory token management with zero persistent disk or credential storage.
  - Explicit confirmation dialogs before sending emails or moving messages to Trash.

### 3. Security, Diligence & RBAC
- **Multi-Factor Authentication (2FA)**: Step-up TOTP verification, email token validation, and session inactivity timeouts.
- **Administrative & Compliance Console**: Role-based access control (RBAC), executive memos, audit logs, and fraud prevention monitoring.

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js 18.18+ or 20+
- npm or yarn

### 1. Clone & Install
```bash
git clone <repository-url>
cd crestline-capital
npm install
```

### 2. Configure Environment Variables
Copy the example environment file and provide any optional service credentials:
```bash
cp .env.example .env.local
```

Refer to `.env.example` for details:
```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://crestlinecapital.vercel.app

# Database & Supabase (Optional fallback)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email Services (Resend / SMTP)
RESEND_API_KEY=
ADMIN_SECURITY_EMAIL=

# Administration Credentials (Optional overrides)
ADMIN_MASTER_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=

# SMS & Telephony (Optional)
TWILIO_PHONE_NUMBER=

# Voice Liveness & ML (Optional)
ML_LIVENESS_API_URL=
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Vercel Deployment

The project is pre-configured for zero-friction Vercel deployment with `vercel.json` and optimized Next.js serverless build handling:

- **`vercel.json`**: Pre-configured build command, framework declaration (`nextjs`), clean URLs, and multi-region routing (`iad1`, `fra1`).
- **`next.config.mjs`**: Dynamically adjusts standalone output for Docker containers while utilizing Vercel's native serverless optimization during Vercel deployments.

To deploy using the Vercel CLI:
```bash
npm i -g vercel
vercel
```

---

## 🔒 Security & Privacy

- **Client-Side OAuth Handling**: Access tokens are kept strictly in-memory during active sessions.
- **Mutation Safeguards**: All mutating operations (sending emails, moving threads to trash, wire transfers) mandate explicit confirmation dialogs.
- **Audit Logging**: Sensitive actions and administrative transfers generate immutable audit records.
