import React from 'react';
import { CustomerCreditContract, CRDBTransaction, ReconcileStats } from '../types';
import { CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, ArrowUpRight, Zap, RefreshCw, FileText } from 'lucide-react';

interface DashboardViewProps {
  stats: ReconcileStats;
  customers: CustomerCreditContract[];
  transactions: CRDBTransaction[];
  onNavigateTab: (tab: string) => void;
  onOpenReceipt: (txn: CRDBTransaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  customers,
  transactions,
  onNavigateTab,
  onOpenReceipt
}) => {
  const formatTZS = (val: number) => {
    return `TZS ${val.toLocaleString()}`;
  };

  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" /> Real-time Banking Operations
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Daima Motorcycles Payment Dashboard</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Automated transaction matching & real-time fund reconciliation via CRDB Bank Tanzania API. Customers receive unique CRDB Control Numbers (`99200xxxx`) for 100% automated credit traceability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('simulator')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Launch CRDB Simulator</span>
            </button>
            <button
              onClick={() => onNavigateTab('customers')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium rounded-xl text-xs flex items-center space-x-2 transition-all"
            >
              <span>View All Contracts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>TOTAL LOAN PORTFOLIO</span>
            <span className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {formatTZS(stats.totalLoanPortfolioTZS)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
              <span className="text-slate-700 font-semibold">{stats.activeContractsCount}</span>
              <span>active credit contracts</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>TOTAL COLLECTED</span>
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">
              {formatTZS(stats.totalCollectedTZS)}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-1">
              Today: +{formatTZS(stats.todayCollectionTZS)}
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>OUTSTANDING BALANCE</span>
            <span className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {formatTZS(stats.totalOutstandingTZS)}
            </div>
            <div className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
              <span>{stats.overdueContractsCount} accounts overdue / risk</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>CRDB AUTO-RECONCILE RATE</span>
            <span className="p-2 bg-slate-800 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {stats.autoMatchedRate}%
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>Zero manual effort</span>
              {stats.unmatchedCount > 0 ? (
                <span className="text-rose-400 font-bold">{stats.unmatchedCount} pending review</span>
              ) : (
                <span className="text-emerald-400">All matched 🟢</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: CRDB Integration Breakdown & System Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CRDB Bank Account Technical Summary */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">CRDB Bank Gateway</h3>
              <p className="text-xs text-slate-500">Official Merchant Collection Details</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-lg border border-amber-200">
              CRDB Plc
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500">Account Name:</span>
              <span className="font-bold text-slate-900">Daima Motorcycles Ltd</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500">CRDB Account No:</span>
              <span className="font-mono font-bold text-slate-900">0150284930100</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500">Control Number Format:</span>
              <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                99200XXXX
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500">Paybill / Lipa Namba:</span>
              <span className="font-mono font-bold text-slate-900">550012</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="text-slate-500">Supported Channels:</span>
              <span className="font-semibold text-slate-800">SimBanking, Wakala, M-Pesa, TigoPesa</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('simulator')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all"
            >
              <span>Test Live Deposit In Simulator</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Bank Transaction Feed */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                Real-Time CRDB Settlement Feed
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h3>
              <p className="text-xs text-slate-500">Incoming payments matched against customer credit contracts</p>
            </div>

            <button
              onClick={() => onNavigateTab('ledger')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
            >
              <span>View Full Ledger ({transactions.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTxns.map((txn) => (
              <div
                key={txn.transactionId}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{txn.transactionId}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md font-medium">
                      {txn.payerChannel}
                    </span>
                    {txn.matchStatus === 'AUTOMATICALLY_MATCHED' && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        AUTO MATCH (100%)
                      </span>
                    )}
                    {txn.matchStatus === 'MANUALLY_RECONCILED' && (
                      <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-bold">
                        MANUAL MATCH
                      </span>
                    )}
                    {txn.matchStatus === 'UNMATCHED_PENDING_REVIEW' && (
                      <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md font-bold animate-pulse">
                        NEEDS REVIEW
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 font-medium">
                    {txn.matchedCustomerName ? (
                      <span>
                        Assigned to: <strong className="text-slate-900">{txn.matchedCustomerName}</strong> ({txn.extractedControlNumber})
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">Unidentified Payer: {txn.payerName} ({txn.payerPhone})</span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Narrative: {txn.narrative}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-600 font-mono">
                      +{formatTZS(txn.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400">{txn.bookingTimestamp}</div>
                  </div>

                  {txn.receiptNumber && (
                    <button
                      onClick={() => onOpenReceipt(txn)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View Official Receipt"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
