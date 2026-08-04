# Daima Motorcycles - CRDB Bank Real-Time Payment Tracker

An automated payment tracking and real-time bank reconciliation platform built for **Daima Motorcycles Ltd** in Tanzania. The platform generates unique CRDB Control Numbers (`99200xxxx`) for motorcycle credit customers, automatically matches incoming bank deposits from CRDB Bank Plc in real time, and eliminates manual payment reconciliation.

---

## 🚀 Key Features

- **Unique Customer ID & Control Number Allocation**: Generates unique identifiers (e.g., `DM-TZ-8041`) and official CRDB Bank Control Numbers (e.g., `992008041`) for every motorcycle credit contract.
- **CRDB Bank API Webhook Integration**: Real-time automated fund matching supporting deposits via CRDB SimBanking (USSD `*150*03#`), CRDB Wakala agents, M-Pesa to CRDB (Paybill `550012`), TigoPesa, and Internet Banking.
- **Automated Credit Passbook & Balance Updates**: Instantly credits customer accounts, recalculates remaining credit balances, advances due dates, and marks accounts as `PAID OFF` or `OVERDUE`.
- **Exception Queue for Unmatched Funds**: Provides a 1-click manual reconciliation interface for transfers missing a control number.
- **CRDB Webhook Simulator**: Integrated sandbox environment for testing incoming payments and observing automated SMS alerts and confidence scores.
- **Rider Self-Service Portal**: Mobile-optimized portal where riders can query their balance, view payment guides in Swahili, and download official e-receipts.
- **AI Portfolio Risk & Audit (Gemini API)**: Server-side integration with Google Gemini 2.5 Flash to generate executive loan portfolio audits and polite Swahili payment reminder messages.

---

## 🛠️ Project Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion animations.
- **Backend**: Node.js & Express server with TypeScript (`server.ts`).
- **Build System**: Vite for client assets, `esbuild` for bundling the server, and `tsx` for local execution.
- **AI Engine**: `@google/genai` TypeScript SDK for server-side Gemini portfolio risk analysis.

---

## 📋 Prerequisites & Local Setup

### 1. Requirements
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### 2. Installation
Clone or download the source code zip from AI Studio, then run:

```bash
# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
# Required for AI Portfolio Risk & Delinquency Audit
GEMINI_API_KEY="your_google_gemini_api_key_here"

# Application URL (Default for local development)
APP_URL="http://localhost:3000"
```

---

## 🏃 Running the Application

### Development Mode
Runs the backend Express server with Vite middleware on port `3000`:

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

### Production Build & Launch
To compile for production deployment:

```bash
# 1. Build the frontend and server bundle
npm run build

# 2. Start the production Node server
npm run start
```

---

## 🔌 CRDB Bank Webhook Specification

### Endpoint
`POST /api/crdb/webhook`

### Sample JSON Payload
```json
{
  "amount": 12000,
  "controlNumber": "992008041",
  "payerName": "JUMA RASHIDI BAKARI",
  "payerPhone": "+255 754 812 901",
  "payerChannel": "CRDB SimBanking",
  "narrative": "CRDB SIMBANKING FT DEP 992008041 JUMA BAKARI MKOPO PIKIPIKI"
}
```

### Success Response
```json
{
  "success": true,
  "transaction": {
    "transactionId": "CRDB-TXN-20260803-98201",
    "matchStatus": "AUTOMATICALLY_MATCHED",
    "receiptNumber": "DM-RCT-98201"
  },
  "matchedCustomer": {
    "id": "DM-TZ-8041",
    "fullName": "Juma Rashidi Bakari",
    "newRemainingBalance": 1828000
  }
}
```

---

## 📄 How to Export & Run on Your Local Machine

1. In the **AI Studio UI**, open the top menu or **Settings** panel.
2. Select **Export to GitHub** or **Download ZIP**.
3. Extract the folder on your local computer.
4. Run `npm install` and `npm run dev`.

---

© 2026 **Daima Motorcycles Ltd** — Head Office: Azikiwe Street, Dar es Salaam, Tanzania.
