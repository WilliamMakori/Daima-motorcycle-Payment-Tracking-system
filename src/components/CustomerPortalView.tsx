import React, { useState } from 'react';
import { CustomerCreditContract, CRDBTransaction } from '../types';
import { Search, Bike, Copy, Check, ShieldCheck, Download, Smartphone, Calendar, FileText, ArrowRight } from 'lucide-react';

interface CustomerPortalViewProps {
  customers: CustomerCreditContract[];
  transactions: CRDBTransaction[];
  onOpenReceipt: (txn: CRDBTransaction) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  customers,
  transactions,
  onOpenReceipt
}) => {
  const [query, setQuery] = useState('0754812901');
  const [searchedCust, setSearchedCust] = useState<CustomerCreditContract | null>(
    customers.find(c => c.id === 'DM-TZ-8041') || customers[0] || null
  );
  const [copiedCode, setCopiedCode] = useState(false);

  const formatTZS = (val: number) => `TZS ${val.toLocaleString()}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQ = query.trim().toLowerCase();
    const found = customers.find(
      c =>
        c.id.toLowerCase().includes(cleanQ) ||
        c.phone.replace(/\s+/g, '').includes(cleanQ.replace(/\s+/g, '')) ||
        c.crdbControlNumber.includes(cleanQ) ||
        c.fullName.toLowerCase().includes(cleanQ)
    );
    if (found) {
      setSearchedCust(found);
    } else {
      alert('Rider profile not found. Please check your Customer ID or Phone Number.');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const riderTxns = searchedCust ? transactions.filter(t => t.matchedCustomerId === searchedCust.id) : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 rounded-2xl p-6 text-slate-950 shadow-xl">
        <div className="max-w-xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-slate-950 text-white px-3 py-1 rounded-full text-xs font-bold">
            <Bike className="w-4 h-4 text-amber-400" />
            <span>Daima Motorcycles Rider Self-Service Portal</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Check Loan Statement & Payment Code</h2>
          <p className="text-xs text-slate-900 font-medium">
            Ingiza Namba yako ya Simu au Namba ya Mteja (Customer ID) kuangalia Salio na Lipa Namba ya CRDB Bank.
          </p>

          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Phone (e.g. 0754812901) or ID (DM-TZ-8041)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-0 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-slate-950 outline-none shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Searched Customer Details */}
      {searchedCust && (
        <div className="space-y-6">
          {/* Main Summary Passbook Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                  Active Credit Passbook
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{searchedCust.fullName}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  Customer ID: <strong>{searchedCust.id}</strong> | Phone: {searchedCust.phone}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">Loan Status:</span>
                <div>
                  {searchedCust.loanStatus === 'ACTIVE' && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full inline-block">
                      CURRENT / GOOD STANDING 🟢
                    </span>
                  )}
                  {searchedCust.loanStatus === 'OVERDUE' && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full inline-block">
                      OVERDUE ({searchedCust.overdueDays} DAYS) ⚠️
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CRDB Control Number Payment Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  CRDB Official Control Number (Namba ya Malipo)
                </div>
                <div className="text-3xl font-black font-mono tracking-widest text-white">
                  {searchedCust.crdbControlNumber}
                </div>
                <div className="text-xs text-slate-400">
                  Tumia namba hii kulipia kupitia CRDB SimBanking, CRDB Wakala, M-Pesa, au TigoPesa.
                </div>
              </div>

              <button
                onClick={() => handleCopy(searchedCust.crdbControlNumber)}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Control Number'}</span>
              </button>
            </div>

            {/* Repayment Progress & Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-500">Total Motorcycle Value</span>
                <div className="text-lg font-bold font-mono text-slate-900">{formatTZS(searchedCust.totalLoanValue)}</div>
                <span className="text-[10px] text-slate-400">{searchedCust.motorcycleModel} ({searchedCust.chassisNumber})</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-1">
                <span className="text-emerald-800 font-medium">Total Paid to Date</span>
                <div className="text-lg font-bold font-mono text-emerald-700">{formatTZS(searchedCust.totalPaid)}</div>
                <span className="text-[10px] text-emerald-600 font-medium">Down payment + Installments</span>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-1">
                <span className="text-amber-800 font-medium">Remaining Loan Balance</span>
                <div className="text-lg font-bold font-mono text-amber-900">{formatTZS(searchedCust.remainingBalance)}</div>
                <span className="text-[10px] text-amber-700 font-medium">Next Due: {searchedCust.nextPaymentDueDate}</span>
              </div>
            </div>

            {/* Payment Guide Box (Kiswahili) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-600" />
                Jinsi ya Kulipia Kupitia CRDB Bank (Kiswahili & English Guide)
              </h4>
              <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 font-medium">
                <li>
                  <strong>Kupitia CRDB SimBanking USSD (*150*03#):</strong> Piga *150*03# -&gt; Chagua 4 (Lipa / Bill) -&gt; Chagua Namba ya Kumbukumbu -&gt; Weka Control Number: <strong className="font-mono text-amber-800">{searchedCust.crdbControlNumber}</strong>.
                </li>
                <li>
                  <strong>Kupitia CRDB Wakala:</strong> Mpe Wakala Namba yako ya Kumbukumbu: <strong className="font-mono text-amber-800">{searchedCust.crdbControlNumber}</strong>. Risiti itatumwa papo hapo kwa SMS.
                </li>
                <li>
                  <strong>Kupitia M-Pesa / TigoPesa / Airtel Money:</strong> Chagua Lipa kwa Simu / Lipa Namba -&gt; Chagua CRDB Bank Paybill Code <strong className="font-mono">550012</strong> -&gt; Namba ya Akaunti weka: <strong className="font-mono text-amber-800">{searchedCust.crdbControlNumber}</strong>.
                </li>
              </ol>
            </div>
          </div>

          {/* Payment Statement History Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              Verified CRDB Payment History & E-Receipts
            </h3>

            {riderTxns.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                No recent payment transactions recorded under this profile yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {riderTxns.map((t) => (
                  <div key={t.transactionId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900">{t.transactionId}</div>
                      <div className="text-[11px] text-slate-500">{t.bookingTimestamp} | Channel: {t.payerChannel}</div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-600 text-sm">+{formatTZS(t.amount)}</div>
                        <div className="text-[10px] text-emerald-700">Auto Reconciled</div>
                      </div>

                      {t.receiptNumber && (
                        <button
                          onClick={() => onOpenReceipt(t)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Receipt</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
