import React, { useState } from 'react';
import { CRDBTransaction } from '../types';
import { Search, CheckCircle2, AlertTriangle, ShieldCheck, Download, FileText, Smartphone, RefreshCw } from 'lucide-react';

interface BankLedgerViewProps {
  transactions: CRDBTransaction[];
  onOpenReceipt: (txn: CRDBTransaction) => void;
  onRefresh: () => void;
}

export const BankLedgerView: React.FC<BankLedgerViewProps> = ({
  transactions,
  onOpenReceipt,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedChannel, setSelectedChannel] = useState('ALL');

  const formatTZS = (val: number) => `TZS ${val.toLocaleString()}`;

  const filteredTxns = transactions.filter(t => {
    const matchesSearch =
      t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.narrative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.matchedCustomerName && t.matchedCustomerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.extractedControlNumber && t.extractedControlNumber.includes(searchTerm));

    const matchesStatus = selectedStatus === 'ALL' || t.matchStatus === selectedStatus;
    const matchesChannel = selectedChannel === 'ALL' || t.payerChannel === selectedChannel;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            CRDB Bank Real-Time Ledger
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
              API Stream Live
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Raw incoming bank statements reconciled automatically in real time against customer credit profiles.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-xs flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Poll CRDB API</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search CRDB Ref, Payer Name, Control Number, or Narrative..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="ALL">All Match Statuses</option>
            <option value="AUTOMATICALLY_MATCHED">Auto Matched (100%)</option>
            <option value="MANUALLY_RECONCILED">Manually Reconciled</option>
            <option value="UNMATCHED_PENDING_REVIEW">Pending Review</option>
          </select>

          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="ALL">All Channels</option>
            <option value="CRDB SimBanking">CRDB SimBanking</option>
            <option value="CRDB Wakala">CRDB Wakala</option>
            <option value="M-Pesa to CRDB">M-Pesa to CRDB</option>
            <option value="CRDB Internet Banking">CRDB Internet Banking</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">CRDB Ref / Time</th>
                <th className="p-4">Payer & Channel</th>
                <th className="p-4">Narrative / Control No</th>
                <th className="p-4">Matched Rider</th>
                <th className="p-4 text-right">Amount (TZS)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTxns.map((t) => (
                <tr key={t.transactionId} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-900">{t.transactionId}</div>
                    <div className="text-[10px] text-slate-500">{t.bookingTimestamp}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{t.payerName}</div>
                    <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                      <Smartphone className="w-3 h-3 text-slate-400" />
                      <span>{t.payerChannel}</span> | <span>{t.payerPhone}</span>
                    </div>
                  </td>

                  <td className="p-4 max-w-xs">
                    <div className="text-[11px] font-mono text-slate-700 truncate" title={t.narrative}>
                      {t.narrative}
                    </div>
                    {t.extractedControlNumber ? (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-900 rounded border border-amber-200">
                        Ref: {t.extractedControlNumber}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No control code</span>
                    )}
                  </td>

                  <td className="p-4">
                    {t.matchedCustomerName ? (
                      <div>
                        <div className="font-bold text-slate-900">{t.matchedCustomerName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{t.matchedCustomerId}</div>
                      </div>
                    ) : (
                      <span className="text-amber-700 font-medium italic">Unmatched</span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="font-mono font-extrabold text-emerald-600 text-sm">
                      +{formatTZS(t.amount)}
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    {t.matchStatus === 'AUTOMATICALLY_MATCHED' && (
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-lg inline-flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        AUTO 100%
                      </span>
                    )}
                    {t.matchStatus === 'MANUALLY_RECONCILED' && (
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-lg inline-flex items-center gap-1">
                        MANUAL
                      </span>
                    )}
                    {t.matchStatus === 'UNMATCHED_PENDING_REVIEW' && (
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-lg inline-flex items-center gap-1 border border-amber-300 animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        PENDING
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    {t.receiptNumber ? (
                      <button
                        onClick={() => onOpenReceipt(t)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors inline-flex items-center space-x-1"
                        title="Open Receipt"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold font-mono">{t.receiptNumber}</span>
                      </button>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
