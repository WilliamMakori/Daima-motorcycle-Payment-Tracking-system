import React from 'react';
import { CRDBTransaction, CustomerCreditContract } from '../types';
import { X, Printer, CheckCircle2, Bike, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  transaction: CRDBTransaction | null;
  customer?: CustomerCreditContract | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  customer,
  onClose
}) => {
  if (!transaction) return null;

  const formatTZS = (val: number) => `TZS ${val.toLocaleString()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Receipt Action Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">
              Verified Bank Payment Receipt
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 space-y-6 text-slate-800 text-xs font-sans">
          {/* Header Branding */}
          <div className="text-center space-y-1 border-b-2 border-dashed border-slate-200 pb-5">
            <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold shadow-md">
              <Bike className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">DAIMA MOTORCYCLES LTD</h1>
            <p className="text-[11px] text-slate-500 font-medium">Head Office: Azikiwe Street, Dar es Salaam, Tanzania</p>
            <p className="text-[10px] text-slate-400">TIN: 109-882-901 | CRDB Collection Account: 0150284930100</p>
          </div>

          {/* Receipt Meta Bar */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Receipt Number</span>
              <strong className="text-slate-900 font-bold">{transaction.receiptNumber || 'DM-RCT-VERIFIED'}</strong>
            </div>

            <div className="text-right">
              <span className="text-slate-400 block text-[9px] uppercase">Transaction Date</span>
              <strong className="text-slate-900 font-bold">{transaction.bookingTimestamp}</strong>
            </div>
          </div>

          {/* Payment Details Table */}
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="text-slate-500">Customer Name:</span>
              <span className="font-bold text-slate-900">{transaction.matchedCustomerName || transaction.payerName}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="text-slate-500">Customer ID:</span>
              <span className="font-mono font-bold text-slate-900">{transaction.matchedCustomerId || 'DM-TZ-WALKIN'}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="text-slate-500">CRDB Control Number:</span>
              <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {transaction.extractedControlNumber || '992008041'}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="text-slate-500">Payment Channel:</span>
              <span className="font-semibold text-slate-800">{transaction.payerChannel}</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span className="text-slate-500">CRDB Bank Reference:</span>
              <span className="font-mono text-slate-800">{transaction.transactionId}</span>
            </div>

            {customer && (
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <span className="text-slate-500">Motorcycle Chassis / Plate:</span>
                <span className="font-mono font-bold text-slate-900">{customer.chassisNumber}</span>
              </div>
            )}
          </div>

          {/* Amount Paid Box */}
          <div className="bg-emerald-50 border-2 border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
              Amount Paid & Reconciled
            </span>
            <div className="text-3xl font-black text-emerald-600 font-mono">
              {formatTZS(transaction.amount)}
            </div>
            {customer && (
              <div className="text-[11px] text-emerald-800 pt-1 font-semibold">
                Updated Loan Balance: <strong>{formatTZS(customer.remainingBalance)}</strong>
              </div>
            )}
          </div>

          {/* Bank Stamp & Footer */}
          <div className="pt-4 border-t-2 border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>CRDB Bank API Verified Stamp</span>
            </div>

            <div className="font-mono">
              Status: <strong>AUTO_MATCH_CONFIRMED</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
