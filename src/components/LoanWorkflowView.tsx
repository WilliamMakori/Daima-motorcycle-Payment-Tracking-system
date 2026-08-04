import React, { useState } from 'react';
import { CustomerCreditContract, UserRole } from '../types';
import { Building2, ShieldCheck, CheckCircle2, XCircle, Clock, ArrowRight, UserCheck, Sparkles, Filter, FileText, Award } from 'lucide-react';

interface LoanWorkflowViewProps {
  customers: CustomerCreditContract[];
  currentUserRole: UserRole;
  currentUserName: string;
  onRefresh: () => void;
}

export const LoanWorkflowView: React.FC<LoanWorkflowViewProps> = ({
  customers,
  currentUserRole,
  currentUserName,
  onRefresh
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [processingCustId, setProcessingCustId] = useState<string | null>(null);
  const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean; cust: CustomerCreditContract | null }>({ isOpen: false, cust: null });
  const [rejectionReasonText, setRejectionReasonText] = useState<string>('Incomplete guarantor NIDA verification');

  const filteredContracts = customers.filter(c => {
    const matchesStage = selectedStage === 'ALL' || c.approvalStage === selectedStage;
    const matchesRegion = selectedRegion === 'ALL' || c.region === selectedRegion;
    return matchesStage && matchesRegion;
  });

  const handleWorkflowAction = async (customerId: string, action: 'REGIONAL_APPROVE' | 'DAR_HO_APPROVE' | 'REJECT', notes?: string) => {
    setProcessingCustId(customerId);
    try {
      const res = await fetch('/api/loans/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          action,
          reviewerName: currentUserName,
          reviewerRole: currentUserRole,
          notes
        })
      });

      if (res.ok) {
        setRejectionModal({ isOpen: false, cust: null });
        onRefresh();
      }
    } catch (err) {
      console.error('Failed workflow decision:', err);
    } finally {
      setProcessingCustId(null);
    }
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'PENDING_REGIONAL_REVIEW':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Stage 1: Pending Regional Review
          </span>
        );
      case 'PENDING_DAR_HO_APPROVAL':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-full flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Stage 2: Pending Dar HO Sign-off
          </span>
        );
      case 'APPROVED_ACTIVE':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved & Disbursed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 rounded-full flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full">
            Draft Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Building2 className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Nationwide Branch Hierarchy & Loan Workflow</h2>
            <p className="text-xs text-slate-400">Multi-Tier Approval Pathway: Dealership Vendor → Regional HQ → Dar es Salaam Head Office</p>
          </div>
        </div>

        {/* Workflow Counts */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
            <div className="text-slate-400 font-medium">Pending Regional</div>
            <div className="text-amber-400 font-bold font-mono text-sm">
              {customers.filter(c => c.approvalStage === 'PENDING_REGIONAL_REVIEW').length}
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
            <div className="text-slate-400 font-medium">Pending Dar HO</div>
            <div className="text-indigo-400 font-bold font-mono text-sm">
              {customers.filter(c => c.approvalStage === 'PENDING_DAR_HO_APPROVAL').length}
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
            <div className="text-slate-400 font-medium">Active Portfolio</div>
            <div className="text-emerald-400 font-bold font-mono text-sm">
              {customers.filter(c => c.approvalStage === 'APPROVED_ACTIVE').length}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Hierarchy Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Credit Decision Hierarchy Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">1. Dealership Vendor</span>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono">Stage 1</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Dealer staff collect NIDA ID, Guarantor details, down payment, and initiate motorcycle hire purchase agreement.
            </p>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900">2. Regional HQ Review</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono">Stage 2</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Regional Credit Manager verifies physical residence, local guarantor credibility, and endorses application.
            </p>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900">3. Dar es Salaam HO Sign-off</span>
              <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-mono">Stage 3</span>
            </div>
            <p className="text-indigo-800 text-[11px] leading-relaxed">
              Dar HO Credit Manager performs final automated CRDB control number generation, disburses asset, and triggers SMS.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">Filter Applications:</span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Approval Stages</option>
            <option value="PENDING_REGIONAL_REVIEW">Pending Regional Review</option>
            <option value="PENDING_DAR_HO_APPROVAL">Pending Dar HO Approval</option>
            <option value="APPROVED_ACTIVE">Approved & Active</option>
            <option value="REJECTED">Rejected Applications</option>
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Regions</option>
            <option value="Dar es Salaam">Dar es Salaam</option>
            <option value="Arusha">Arusha</option>
            <option value="Dodoma">Dodoma</option>
            <option value="Mwanza">Mwanza</option>
            <option value="Mbeya">Mbeya</option>
            <option value="Tanga">Tanga</option>
            <option value="Zanzibar">Zanzibar</option>
          </select>
        </div>
      </div>

      {/* Applications Workflow List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Credit Applications Queue ({filteredContracts.length})</h3>
          <span className="text-xs text-slate-500">Logged Role: <strong>{currentUserRole}</strong> ({currentUserName})</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredContracts.map(c => {
            const isRegionalPending = c.approvalStage === 'PENDING_REGIONAL_REVIEW';
            const isDarPending = c.approvalStage === 'PENDING_DAR_HO_APPROVAL';

            const canRegionalApprove = (currentUserRole === 'REGIONAL_HQ' || currentUserRole === 'ADMINISTRATOR' || currentUserRole === 'DAR_HEAD_OFFICE') && isRegionalPending;
            const canDarHOApprove = (currentUserRole === 'DAR_HEAD_OFFICE' || currentUserRole === 'ADMINISTRATOR') && isDarPending;

            return (
              <div key={c.id} className="p-5 hover:bg-slate-50/80 transition-colors space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">{c.fullName}</span>
                      <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {c.id}
                      </span>
                      {getStageBadge(c.approvalStage)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span><strong>Phone:</strong> {c.phone}</span>
                      <span>•</span>
                      <span><strong>Region:</strong> {c.region} ({c.branch})</span>
                      <span>•</span>
                      <span><strong>Model:</strong> {c.motorcycleModel}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">Financed Loan Amount</div>
                    <div className="text-base font-bold text-slate-900 font-mono">
                      TZS {c.totalLoanValue.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">
                      Down Payment: TZS {c.downPayment.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Audit Trail Details for the Application */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400">Dealership Vendor:</span>
                    <p className="font-semibold text-slate-800">{c.submittedByVendor || 'Local Dealership'}</p>
                  </div>

                  <div>
                    <span className="text-slate-400">Regional Reviewer:</span>
                    <p className="font-semibold text-slate-800">{c.regionalApprovalBy || (isRegionalPending ? 'Awaiting Regional HQ' : 'N/A')}</p>
                  </div>

                  <div>
                    <span className="text-slate-400">Dar es Salaam HO Sign-off:</span>
                    <p className="font-semibold text-slate-800">{c.darHoApprovalBy || (isDarPending ? 'Awaiting Dar HO' : 'N/A')}</p>
                  </div>
                </div>

                {/* Interactive Decision Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-mono">
                    CRDB Control Number: <strong>{c.crdbControlNumber}</strong>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Regional HQ Approve Button */}
                    {isRegionalPending && (
                      <button
                        disabled={processingCustId === c.id}
                        onClick={() => handleWorkflowAction(c.id, 'REGIONAL_APPROVE')}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Regional HQ Endorse & Escalate</span>
                      </button>
                    )}

                    {/* Dar HO Final Sign-off Button */}
                    {isDarPending && (
                      <button
                        disabled={processingCustId === c.id}
                        onClick={() => handleWorkflowAction(c.id, 'DAR_HO_APPROVE')}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center space-x-1 shadow-md shadow-indigo-600/20"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Dar HO Final Sign-off & Disburse</span>
                      </button>
                    )}

                    {(isRegionalPending || isDarPending) && (
                      <button
                        onClick={() => setRejectionModal({ isOpen: true, cust: c })}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-xs flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModal.isOpen && rejectionModal.cust && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-rose-700 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Reject Application ({rejectionModal.cust.id})
            </h3>

            <p className="text-xs text-slate-600">
              Provide reason for rejecting credit contract for <strong>{rejectionModal.cust.fullName}</strong>:
            </p>

            <textarea
              value={rejectionReasonText}
              onChange={(e) => setRejectionReasonText(e.target.value)}
              rows={3}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRejectionModal({ isOpen: false, cust: null })}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleWorkflowAction(rejectionModal.cust!.id, 'REJECT', rejectionReasonText)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
