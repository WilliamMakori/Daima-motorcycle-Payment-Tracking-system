import React from 'react';
import { CustomerCreditContract, CRDBTransaction } from '../types';
import { X, Bike, Phone, MapPin, Shield, Calendar, CreditCard, FileText, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

interface CustomerDetailModalProps {
  customer: CustomerCreditContract | null;
  transactions: CRDBTransaction[];
  onClose: () => void;
  onOpenReceipt: (txn: CRDBTransaction) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  transactions,
  onClose,
  onOpenReceipt
}) => {
  if (!customer) return null;

  const formatTZS = (val: number) => `TZS ${val.toLocaleString()}`;

  const custTxns = transactions.filter(t => t.matchedCustomerId === customer.id);
  const progressPercent = Math.min(100, Math.round((customer.totalPaid / customer.totalLoanValue) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-500/30">
                {customer.id}
              </span>
              <span className="text-xs text-slate-300 font-medium">{customer.region} ({customer.branch})</span>
            </div>
            <h3 className="text-xl font-bold mt-1 text-white">{customer.fullName}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* CRDB Control Number Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                CRDB Official Payment Control Number
              </div>
              <div className="text-2xl font-black font-mono text-amber-950 tracking-wider">
                {customer.crdbControlNumber}
              </div>
              <div className="text-[11px] text-amber-900 mt-0.5">
                Pay via CRDB SimBanking USSD *150*03#, CRDB Wakala, or M-Pesa Paybill 550012
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">Loan Status:</div>
              {customer.loanStatus === 'ACTIVE' && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full inline-block">
                  ACTIVE / REGULAR 🟢
                </span>
              )}
              {customer.loanStatus === 'OVERDUE' && (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full inline-block">
                  OVERDUE ({customer.overdueDays} DAYS) ⚠️
                </span>
              )}
              {customer.loanStatus === 'PAID_OFF' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full inline-block">
                  FULLY PAID OFF 🎓
                </span>
              )}
            </div>
          </div>

          {/* Motorcycle & Guarantor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Motorcycle Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Bike className="w-4 h-4 text-amber-600" />
                <span>Motorcycle Details</span>
              </div>
              <div className="space-y-1">
                <div>Model: <strong className="text-slate-900">{customer.motorcycleModel}</strong></div>
                <div className="font-mono">Plate / VIN: <strong>{customer.chassisNumber}</strong></div>
                <div>Cash Value: <strong>{formatTZS(customer.cashPrice)}</strong></div>
                <div>Down Payment Paid: <strong>{formatTZS(customer.downPayment)}</strong></div>
              </div>
            </div>

            {/* Rider & Guarantor Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Rider & Guarantor Profile</span>
              </div>
              <div className="space-y-1">
                <div>NIDA ID: <strong className="font-mono">{customer.nidaId}</strong></div>
                <div>Phone: <strong className="font-mono">{customer.phone}</strong></div>
                <div>Guarantor Name: <strong>{customer.guarantorName}</strong></div>
                <div>Guarantor Phone: <strong className="font-mono">{customer.guarantorPhone}</strong></div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Progress */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span>Financial Repayment Summary</span>
              <span>{progressPercent}% Complete</span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px]">Total Contract Value</span>
                <strong className="font-mono text-slate-900">{formatTZS(customer.totalLoanValue)}</strong>
              </div>

              <div className="bg-emerald-50 p-2 rounded-lg">
                <span className="text-emerald-800 block text-[10px]">Total Paid to Date</span>
                <strong className="font-mono text-emerald-700">{formatTZS(customer.totalPaid)}</strong>
              </div>

              <div className="bg-amber-50 p-2 rounded-lg">
                <span className="text-amber-800 block text-[10px]">Outstanding Balance</span>
                <strong className="font-mono text-amber-900">{formatTZS(customer.remainingBalance)}</strong>
              </div>
            </div>
          </div>

          {/* Reconciled Transaction Passbook Log */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Verified Bank Payments Ledger ({custTxns.length})</span>
            </h4>

            {custTxns.length === 0 ? (
              <div className="p-6 bg-slate-50 text-slate-400 text-center rounded-xl text-xs">
                No bank deposits logged for this account yet.
              </div>
            ) : (
              <div className="space-y-2">
                {custTxns.map((t) => (
                  <div
                    key={t.transactionId}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono font-bold text-slate-900 text-xs">{t.transactionId}</div>
                      <div className="text-[10px] text-slate-500">{t.bookingTimestamp} | {t.payerChannel}</div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-600">+{formatTZS(t.amount)}</div>
                        <div className="text-[9px] text-slate-400">{t.receiptNumber}</div>
                      </div>

                      <button
                        onClick={() => onOpenReceipt(t)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-colors"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
