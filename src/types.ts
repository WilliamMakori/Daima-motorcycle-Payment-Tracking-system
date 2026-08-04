export type RepaymentFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type LoanStatus = 'ACTIVE' | 'PAID_OFF' | 'OVERDUE' | 'DEFAULT_RISK';
export type MatchStatus = 'AUTOMATICALLY_MATCHED' | 'MANUALLY_RECONCILED' | 'UNMATCHED_PENDING_REVIEW' | 'REJECTED';

export interface CustomerCreditContract {
  id: string; // e.g. "DM-TZ-1001"
  crdbControlNumber: string; // e.g. "992001001"
  fullName: string;
  phone: string; // +255 format
  nidaId: string;
  region: string; // e.g. "Dar es Salaam", "Arusha", "Dodoma", "Mwanza"
  branch: string;
  guarantorName: string;
  guarantorPhone: string;
  motorcycleModel: string;
  chassisNumber: string; // Plate / VIN e.g. "MC 482 DXA"
  cashPrice: number; // in TZS
  downPayment: number; // in TZS
  financedAmount: number; // in TZS
  totalInterest: number; // in TZS
  totalLoanValue: number; // in TZS
  repaymentFrequency: RepaymentFrequency;
  installmentAmount: number; // in TZS
  startDate: string;
  maturityDate: string;
  totalPaid: number; // in TZS
  remainingBalance: number; // in TZS
  loanStatus: LoanStatus;
  lastPaymentDate?: string;
  nextPaymentDueDate: string;
  overdueDays: number;
  notes?: string;
}

export interface CRDBTransaction {
  transactionId: string; // CRDB Ref e.g. "CRDB-TXN-20260803-011"
  bookingTimestamp: string;
  valueDate: string;
  amount: number; // in TZS
  currency: 'TZS';
  payerName: string;
  payerPhone: string;
  payerChannel: 'CRDB SimBanking' | 'CRDB Wakala' | 'M-Pesa to CRDB' | 'TigoPesa to CRDB' | 'Airtel Money' | 'CRDB Internet Banking' | 'Branch Counter';
  narrative: string; // Raw bank reference narrative
  extractedControlNumber: string | null;
  matchedCustomerId: string | null;
  matchedCustomerName: string | null;
  matchStatus: MatchStatus;
  reconciledBy: string; // "CRDB Realtime Webhook Engine" or staff user name
  reconciledAt: string;
  matchConfidenceScore: number; // 0 - 100
  receiptNumber?: string;
}

export interface ReconcileStats {
  totalLoanPortfolioTZS: number;
  totalCollectedTZS: number;
  totalOutstandingTZS: number;
  activeContractsCount: number;
  overdueContractsCount: number;
  autoMatchedRate: number; // Percentage, e.g. 96.8%
  unmatchedCount: number;
  todayCollectionTZS: number;
}

export interface AIAnalysisResult {
  summary: string;
  riskAssessment: {
    highRiskCount: number;
    recommendedActions: string[];
  };
  reconciliationHealth: string;
  suggestedCustomerReminders: Array<{
    customerId: string;
    customerName: string;
    phone: string;
    overdueDays: number;
    amountDue: number;
    suggestedMessageSwahili: string;
  }>;
}
