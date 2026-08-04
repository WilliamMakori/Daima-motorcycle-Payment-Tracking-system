import React from 'react';
import { Bike, ShieldCheck, RefreshCw, Smartphone, CreditCard, AlertTriangle, Cpu, UserCheck, Building2, Radio, Lock, BarChart3, User } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unmatchedCount: number;
  pendingApprovalsCount?: number;
  crdbStatus: string;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unmatchedCount,
  pendingApprovalsCount = 0,
  crdbStatus,
  currentUserRole,
  setCurrentUserRole,
  onRefresh
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">DAIMA MOTORCYCLES</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Tanzania 🇹Z
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated CRDB Bank Real-Time Payment Reconciliation Engine</p>
          </div>
        </div>

        {/* Right Section: RBAC Switcher & Bank Connection */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Multi-Tier Role Switcher */}
          <div className="bg-slate-800/90 border border-slate-700/90 rounded-xl px-2.5 py-1 flex items-center space-x-2">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-medium">Role:</span>
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="bg-slate-900 text-amber-300 font-bold font-mono text-xs focus:outline-none cursor-pointer py-0.5 px-1 rounded"
            >
              <option value="DAR_HEAD_OFFICE">Dar HO Credit Mgr</option>
              <option value="REGIONAL_HQ">Regional HQ Manager</option>
              <option value="VENDOR">Dealership Vendor</option>
              <option value="FIELD_COLLECTIONS">GPRS / Recovery Officer</option>
              <option value="ADMINISTRATOR">System Security Admin</option>
            </select>
          </div>

          {/* Bank Integration Pill */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-slate-300 font-medium">CRDB:</span>
            <span className="text-amber-400 font-mono font-bold">0150284930100</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> API Connected
            </span>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center space-x-1"
            title="Refresh System Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex space-x-1 py-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'workflow'
                ? 'bg-indigo-600 text-white font-semibold shadow'
                : 'text-indigo-300 bg-indigo-950/30 hover:bg-indigo-900/40'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Loan Hierarchy & Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'customers'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Credit Customers</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'ledger'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CRDB Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('exceptions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'exceptions'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Exception Queue</span>
            {unmatchedCount > 0 && (
              <span className="bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {unmatchedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gprs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'gprs'
                ? 'bg-rose-600 text-white font-semibold shadow'
                : 'text-rose-300 bg-rose-950/30 hover:bg-rose-900/40'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>GPRS & Remote Immobilizer</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Nationwide Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Audit & Security Admin</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'simulator'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow animate-pulse'
                : 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>CRDB Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'portal'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Rider Self-Service</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'ai'
                ? 'bg-indigo-600 text-white font-semibold shadow'
                : 'text-indigo-300 bg-indigo-950/30 hover:bg-indigo-900/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Risk Audit</span>
          </button>
        </div>
      </div>
    </header>
  );
};

