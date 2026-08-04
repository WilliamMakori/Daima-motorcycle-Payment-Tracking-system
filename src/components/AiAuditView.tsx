import React, { useState } from 'react';
import { CustomerCreditContract, AIAnalysisResult } from '../types';
import { Cpu, RefreshCw, AlertTriangle, MessageSquare, Check, Copy, Send, ShieldCheck, Sparkles } from 'lucide-react';

interface AiAuditViewProps {
  customers: CustomerCreditContract[];
}

export const AiAuditView: React.FC<AiAuditViewProps> = ({ customers }) => {
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AIAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const formatTZS = (val: number) => `TZS ${val.toLocaleString()}`;

  const handleRunAudit = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch AI audit');
      }

      setAuditResult(data);
    } catch (err: any) {
      console.error('AI Audit Error:', err);
      setErrorMsg(err.message || 'Error connecting to Gemini API');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border border-indigo-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> Powered by Gemini 2.5 Flash API
          </div>
          <h2 className="text-2xl font-black tracking-tight">AI Credit Portfolio & Risk Audit</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Automated intelligence model analyzes Daima Motorcycles' active loan portfolio, predicts delinquency risks, and drafts polite Swahili repayment reminder SMS messages with CRDB control codes.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={loading}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-indigo-500/30 transition-all"
        >
          <Cpu className="w-4 h-4" />
          <span>{loading ? 'Running Gemini Audit...' : 'Run AI Credit Audit'}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 space-y-1">
          <strong className="font-bold flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> AI Audit Error
          </strong>
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Audit Output View */}
      {auditResult ? (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Portfolio Executive Health Summary
            </h3>

            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
              "{auditResult.summary}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                <div className="font-bold text-amber-900 uppercase text-[11px] tracking-wider">
                  Risk Level & Delinquency Assessment
                </div>
                <div className="text-2xl font-black text-amber-800 font-mono">
                  {auditResult.riskAssessment.highRiskCount} Accounts Flagged
                </div>
                <p className="text-[11px] text-amber-900">
                  CRDB Bank automated reconciliation health: <strong>{auditResult.reconciliationHealth}</strong>
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl space-y-2">
                <div className="font-bold text-indigo-900 uppercase text-[11px] tracking-wider">
                  Recommended Portfolio Actions
                </div>
                <ul className="list-disc pl-4 text-[11px] text-indigo-900 space-y-1 font-medium">
                  {auditResult.riskAssessment.recommendedActions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Suggested Customer Reminders (Kiswahili) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              AI-Generated Swahili SMS Payment Reminders
            </h3>

            <div className="space-y-3">
              {auditResult.suggestedCustomerReminders.map((rem, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white space-y-3 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs">
                    <div>
                      <strong className="text-slate-900">{rem.customerName}</strong> ({rem.customerId})
                      <span className="text-slate-500 text-[11px] ml-2">Phone: {rem.phone}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded">
                        {rem.overdueDays > 0 ? `${rem.overdueDays} Days Late` : 'Upcoming Installment'}
                      </span>
                      <span className="font-mono font-bold text-emerald-700">
                        Due: {formatTZS(rem.amountDue)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-amber-200 p-3 rounded-xl font-sans text-xs leading-relaxed font-medium">
                    "{rem.suggestedMessageSwahili}"
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      onClick={() => handleCopyMessage(rem.suggestedMessageSwahili, idx)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{copiedIndex === idx ? 'Copied' : 'Copy Message'}</span>
                    </button>

                    <a
                      href={`https://wa.me/${rem.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(rem.suggestedMessageSwahili)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <Cpu className="w-10 h-10 text-indigo-400 mx-auto" />
          <h4 className="font-bold text-slate-800 text-base">Gemini Portfolio Intelligence Ready</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Run AI Credit Audit" to generate real-time portfolio risk diagnostics and Kiswahili payment reminder templates.
          </p>
        </div>
      )}
    </div>
  );
};
