import React, { useState } from 'react';
import { CustomerCreditContract } from '../types';
import confetti from 'canvas-confetti';
import { Smartphone, Zap, CheckCircle2, AlertCircle, RefreshCw, Send, ArrowUpRight, Copy, Check } from 'lucide-react';

interface CrdbSandboxViewProps {
  customers: CustomerCreditContract[];
  onDepositSimulated: () => void;
}

export const CrdbSandboxView: React.FC<CrdbSandboxViewProps> = ({
  customers,
  onDepositSimulated
}) => {
  const [amount, setAmount] = useState<number>(12000);
  const [controlNumber, setControlNumber] = useState<string>('992008041');
  const [payerName, setPayerName] = useState<string>('JUMA RASHIDI BAKARI');
  const [payerPhone, setPayerPhone] = useState<string>('+255 754 812 901');
  const [payerChannel, setPayerChannel] = useState<any>('CRDB SimBanking');
  const [narrative, setNarrative] = useState<string>('CRDB SIMBANKING FT DEP 992008041 JUMA BAKARI MKOPO PIKIPIKI');
  
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<any>(null);

  const formatTZS = (val: number) => `TZS ${val.toLocaleString()}`;

  const applyPreset = (cust: CustomerCreditContract) => {
    setAmount(cust.installmentAmount);
    setControlNumber(cust.crdbControlNumber);
    setPayerName(cust.fullName.toUpperCase());
    setPayerPhone(cust.phone);
    setPayerChannel('CRDB SimBanking');
    setNarrative(`CRDB SIMBANKING FT DEP ${cust.crdbControlNumber} ${cust.fullName.toUpperCase()} MKOPO PIKIPIKI`);
  };

  const applyUnmatchedPreset = () => {
    setAmount(45000);
    setControlNumber('');
    setPayerName('UNKNOWN RIDER DAIMA');
    setPayerPhone('+255 719 000 999');
    setPayerChannel('CRDB Wakala');
    setNarrative('CRDB WAKALA CASH DEP NO REF DAIMA MOTORCYCLES');
  };

  const handleSimulateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResult(null);

    try {
      const res = await fetch('/api/crdb/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          controlNumber,
          payerName,
          payerPhone,
          payerChannel,
          narrative
        })
      });

      const data = await res.json();
      setApiResult(data);

      if (data.matchedCustomer) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      onDepositSimulated();
    } catch (err: any) {
      console.error('Error simulating deposit:', err);
      setApiResult({ error: err.message || 'Deposit simulation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase mb-1">
            <Zap className="w-4 h-4 animate-pulse" /> CRDB Bank Plc Live API Simulator
          </div>
          <h2 className="text-2xl font-black tracking-tight">Real-Time Deposit Webhook Tester</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Simulate incoming bank transfers from CRDB SimBanking, Wakala, or Mobile Money (M-Pesa/TigoPesa) directly to Daima Motorcycles' CRDB Collection Account (`0150284930100`).
          </p>
        </div>

        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs font-mono">
          <div className="text-slate-400">POST Endpoint:</div>
          <div className="text-amber-400 font-bold">/api/crdb/webhook</div>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Quick Rider Presets:</label>
        <div className="flex flex-wrap gap-2">
          {customers.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => applyPreset(c)}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded-xl text-xs font-medium text-slate-800 flex items-center space-x-2 transition-all shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-600" />
              <span>{c.fullName.split(' ')[0]} ({formatTZS(c.installmentAmount)} / Ref: {c.crdbControlNumber})</span>
            </button>
          ))}

          <button
            onClick={applyUnmatchedPreset}
            className="px-3 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold text-rose-800 transition-all shadow-sm"
          >
            ⚠️ Test Unmatched Deposit (No Control No)
          </button>
        </div>
      </div>

      {/* Simulator Form & Results split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            CRDB Bank Transaction Parameters
          </h3>

          <form onSubmit={handleSimulateDeposit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Channel</label>
              <select
                value={payerChannel}
                onChange={(e) => setPayerChannel(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
              >
                <option value="CRDB SimBanking">CRDB SimBanking (Mobile App / USSD *150*03#)</option>
                <option value="CRDB Wakala">CRDB Wakala Agent Deposit</option>
                <option value="M-Pesa to CRDB">M-Pesa Lipa Namba (CRDB Paybill 550012)</option>
                <option value="TigoPesa to CRDB">TigoPesa Paybill to CRDB</option>
                <option value="CRDB Internet Banking">CRDB Internet Banking</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">CRDB Control No. / Ref</label>
                <input
                  type="text"
                  value={controlNumber}
                  onChange={(e) => {
                    setControlNumber(e.target.value);
                    setNarrative(`CRDB DEP ${e.target.value} ${payerName} PIKIPIKI`);
                  }}
                  placeholder="e.g. 992008041"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-amber-900 bg-amber-50/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deposit Amount (TZS)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payer Full Name</label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payer Phone Number</label>
                <input
                  type="text"
                  required
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Raw Bank Settlement Narrative</label>
              <textarea
                rows={2}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Processing Bank Payload...' : 'Simulate CRDB Bank Deposit'}</span>
            </button>
          </form>
        </div>

        {/* Right API Response & SMS Preview */}
        <div className="space-y-4">
          {apiResult ? (
            <div className="space-y-4">
              {/* Match Result Banner */}
              {apiResult.matchedCustomer ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>INSTANT AUTOMATED MATCH (100% Confidence)</span>
                  </div>
                  <p className="text-xs text-emerald-900">
                    Funds allocated to <strong>{apiResult.matchedCustomer.fullName}</strong> ({apiResult.matchedCustomer.id}).
                  </p>
                  <div className="text-xs text-emerald-800 font-mono pt-1">
                    New Outstanding Balance: <strong>{formatTZS(apiResult.matchedCustomer.newRemainingBalance)}</strong>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>UNMATCHED TRANSACTION (Added to Exception Queue)</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Control number missing or unassigned. Staff can reconcile in 1 click under Exception Queue.
                  </p>
                </div>
              )}

              {/* Simulated Swahili SMS Notification */}
              {apiResult.smsNotificationSimulated && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5" /> Simulated SMS Alert to Rider
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed">
                    "{apiResult.smsNotificationSimulated}"
                  </div>
                </div>
              )}

              {/* JSON Payload View */}
              <div className="bg-slate-950 text-emerald-400 rounded-2xl p-4 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="text-slate-500 font-bold text-[10px] uppercase">CRDB API Response Payload (JSON)</div>
                <pre className="overflow-x-auto max-h-48 p-2">
                  {JSON.stringify(apiResult, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <Zap className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-600 text-sm">Ready for Bank Simulation</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click "Simulate CRDB Bank Deposit" to test real-time matching, customer balance updates, and automated SMS receipt alerts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
