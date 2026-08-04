import React, { useState } from 'react';
import { CRDBTransaction, CustomerCreditContract } from '../types';
import { AlertTriangle, UserCheck, Search, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

interface ExceptionQueueViewProps {
  unmatchedTransactions: CRDBTransaction[];
  customers: CustomerCreditContract[];
  onManualReconcile: (txnId: string, custId: string) => Promise<void>;
}

export const ExceptionQueueView: React.FC<ExceptionQueueViewProps> = ({
  unmatchedTransactions,
  customers,
  onManualReconcile
}) => {
  const [selectedTxn, setSelectedTxn] = useState<CRDBTransaction | null>(null);
  const [selectedCustId, setSelectedCustId] = useState<string>('');
  const [searchRider, setSearchRider] = useState('');
  const [reconciling, setReconciling] = useState(false);

  const formatTZS = (val: number) => `TZS ${val.toLocaleString()}`;

  const handleReconcileSubmit = async () => {
    if (!selectedTxn || !selectedCustId) return;
    setReconciling(true);
    try {
      await onManualReconcile(selectedTxn.transactionId, selectedCustId);
      setSelectedTxn(null);
      setSelectedCustId('');
    } catch (err) {
      console.error('Error in manual reconciliation:', err);
    } finally {
      setReconciling(false);
    }
  };

  const filteredCandidates = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchRider.toLowerCase()) ||
    c.id.toLowerCase().includes(searchRider.toLowerCase()) ||
    c.phone.includes(searchRider) ||
    c.crdbControlNumber.includes(searchRider)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Unmatched Exception Queue
            <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 rounded-full border border-rose-300">
              {unmatchedTransactions.length} Pending
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Deposits made to CRDB Bank account where control number was omitted or typed with error. Manually trace & allocate with 1 click.
          </p>
        </div>
      </div>

      {unmatchedTransactions.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-emerald-900 text-base">All Incoming Bank Funds Reconciled!</h3>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            Every incoming CRDB Bank transfer has been matched automatically to a Daima Motorcycles customer credit contract.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Unmatched Transactions List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Unidentified Deposits</h3>

            {unmatchedTransactions.map((txn) => (
              <div
                key={txn.transactionId}
                onClick={() => {
                  setSelectedTxn(txn);
                  setSelectedCustId('');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTxn?.transactionId === txn.transactionId
                    ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{txn.transactionId}</span>
                  <span className="text-xs font-extrabold text-emerald-600 font-mono">{formatTZS(txn.amount)}</span>
                </div>

                <div className="text-xs text-slate-700 font-semibold mt-2">
                  Payer: {txn.payerName}
                </div>
                <div className="text-[11px] text-slate-500">Phone: {txn.payerPhone} | {txn.payerChannel}</div>

                <div className="mt-2 bg-slate-100 p-2 rounded-lg text-[10px] font-mono text-slate-600 truncate">
                  {txn.narrative}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                  <span>{txn.bookingTimestamp}</span>
                  <span className="text-amber-700 font-bold">Score: {txn.matchConfidenceScore}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Reconciliation Resolver Console */}
          <div className="lg:col-span-2">
            {selectedTxn ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-900 rounded-md">
                      Resolving Exception
                    </span>
                    <span className="text-xs font-mono text-slate-500">{selectedTxn.transactionId}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                    Deposit Amount: <span className="text-emerald-600 font-mono">{formatTZS(selectedTxn.amount)}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Payer Bank Narrative: <strong className="font-mono text-slate-800">{selectedTxn.narrative}</strong>
                  </p>
                </div>

                {/* Candidate Search */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    Search & Select Daima Credit Rider to Credit Funds:
                  </label>

                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchRider}
                      onChange={(e) => setSearchRider(e.target.value)}
                      placeholder="Type Rider name, phone number, or chassis number..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  {/* Rider Selection List */}
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                    {filteredCandidates.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCustId(c.id)}
                        className={`p-3 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          selectedCustId === c.id ? 'bg-amber-100/70 text-amber-950 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900">{c.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            ID: {c.id} | Control: <span className="font-bold text-amber-800">{c.crdbControlNumber}</span> | {c.phone}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-rose-600 font-mono">Rem: {formatTZS(c.remainingBalance)}</div>
                          <div className="text-[10px] text-slate-400">{c.motorcycleModel}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Reconciled by: <strong className="text-slate-900">Finance Officer (Audit Logged)</strong>
                  </span>

                  <button
                    onClick={handleReconcileSubmit}
                    disabled={!selectedCustId || reconciling}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{reconciling ? 'Reconciling...' : 'Confirm 1-Click Match'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 space-y-2">
                <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-medium">Select an unmatched deposit from the list on the left to start resolution.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
