import React, { useState, useEffect } from 'react';
import { AuditLogEntry, SecurityConfig, UserRole } from '../types';
import { ShieldCheck, Lock, Key, Server, AlertTriangle, Eye, ShieldAlert, FileText, CheckCircle2, RefreshCw, Filter, Shield } from 'lucide-react';

interface AuditSecurityViewProps {
  currentUserRole: UserRole;
  currentUserName: string;
  onRefresh: () => void;
}

export const AuditSecurityView: React.FC<AuditSecurityViewProps> = ({
  currentUserRole,
  currentUserName,
  onRefresh
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchAuditData = async () => {
    try {
      const [logsRes, configRes] = await Promise.all([
        fetch('/api/audit-logs'),
        fetch('/api/security/config')
      ]);

      if (logsRes.ok && configRes.ok) {
        const logsData = await logsRes.json();
        const configData = await configRes.json();
        setLogs(logsData);
        setSecurityConfig(configData);
      }
    } catch (err) {
      console.error('Failed to load audit & security logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const handleToggle2FA = async () => {
    if (!securityConfig) return;
    try {
      const res = await fetch('/api/security/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          require2FAForDarHO: !securityConfig.require2FAForDarHO
        })
      });

      if (res.ok) {
        setToast('Updated 2FA Policy for Dar HO Approvers!');
        fetchAuditData();
      }
    } catch (err) {
      console.error('Failed updating security policy:', err);
    }
  };

  const handleToggleIpWhitelist = async () => {
    if (!securityConfig) return;
    try {
      const res = await fetch('/api/security/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ipWhitelistEnabled: !securityConfig.ipWhitelistEnabled
        })
      });

      if (res.ok) {
        setToast('Updated IP Whitelist Enforcement!');
        fetchAuditData();
      }
    } catch (err) {
      console.error('Failed updating security policy:', err);
    }
  };

  const filteredLogs = logs.filter(l => filterCategory === 'ALL' || l.actionCategory === filterCategory);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Audit Trail & Security Administration</h2>
            <p className="text-xs text-slate-400">Complete Department Action Ledger, Security Policies, and Access Logs</p>
          </div>
        </div>

        <button
          onClick={() => { fetchAuditData(); onRefresh(); }}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh System Logs</span>
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Security Administrator Panel */}
      {securityConfig && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Administrator Security Policy Matrix</span>
            </h3>
            <span className="text-xs text-slate-500">Security Officer: <strong>{currentUserName}</strong></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Policy 1: 2FA */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Dar HO 2FA Enforcement</div>
                <div className="text-[11px] text-slate-500">Require OTP for loan disbursements</div>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  securityConfig.require2FAForDarHO
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {securityConfig.require2FAForDarHO ? 'ENFORCED' : 'OFF'}
              </button>
            </div>

            {/* Policy 2: IP Whitelist */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Regional IP Whitelisting</div>
                <div className="text-[11px] text-slate-500">Restrict admin access to verified subnets</div>
              </div>
              <button
                onClick={handleToggleIpWhitelist}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  securityConfig.ipWhitelistEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {securityConfig.ipWhitelistEnabled ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {/* Policy 3: Session Timeout */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Inactivity Timeout</div>
                <div className="text-[11px] text-slate-500">Auto logout after 30 minutes</div>
              </div>
              <span className="font-mono font-bold text-slate-800 bg-slate-200 px-2 py-1 rounded">
                30 mins
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Transaction & Action Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Loan Department Complete Action Audit Log</span>
          </h3>

          {/* Filter Category */}
          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="LOAN_WORKFLOW">Loan Workflow</option>
              <option value="RECONCILIATION">Reconciliation</option>
              <option value="GPRS_IMMOBILIZER">GPRS Immobilizer</option>
              <option value="SECURITY_CONFIG">Security Config</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Action Details</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <span className="text-[10px] text-amber-700 bg-amber-50 font-bold px-1.5 py-0.2 rounded border border-amber-200">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{log.region}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.actionCategory === 'GPRS_IMMOBILIZER' ? 'bg-rose-100 text-rose-800' :
                      log.actionCategory === 'SECURITY_CONFIG' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {log.actionCategory}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 max-w-xs">{log.actionDetails}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
