import React, { useState, useEffect } from 'react';
import { CustomerCreditContract, CRDBTransaction, ReconcileStats, UserRole } from './types';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { BankLedgerView } from './components/BankLedgerView';
import { ExceptionQueueView } from './components/ExceptionQueueView';
import { CrdbSandboxView } from './components/CrdbSandboxView';
import { CustomerPortalView } from './components/CustomerPortalView';
import { AiAuditView } from './components/AiAuditView';
import { LoanWorkflowView } from './components/LoanWorkflowView';
import { GprsTrackingView } from './components/GprsTrackingView';
import { AuditSecurityView } from './components/AuditSecurityView';
import { NationwideSalesView } from './components/NationwideSalesView';
import { ReceiptModal } from './components/ReceiptModal';
import { CustomerDetailModal } from './components/CustomerDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('DAR_HEAD_OFFICE');
  const [currentUserName, setCurrentUserName] = useState<string>('F. Mwangi (Dar HO)');
  const [customers, setCustomers] = useState<CustomerCreditContract[]>([]);
  const [transactions, setTransactions] = useState<CRDBTransaction[]>([]);
  const [stats, setStats] = useState<ReconcileStats>({
    totalLoanPortfolioTZS: 0,
    totalCollectedTZS: 0,
    totalOutstandingTZS: 0,
    activeContractsCount: 0,
    overdueContractsCount: 0,
    autoMatchedRate: 100,
    unmatchedCount: 0,
    todayCollectionTZS: 0,
    pendingApprovalsCount: 0,
    immobilizedBikesCount: 0
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [activeReceiptTxn, setActiveReceiptTxn] = useState<CRDBTransaction | null>(null);
  const [activeDetailCust, setActiveDetailCust] = useState<CustomerCreditContract | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch state from server
  const fetchAllData = async () => {
    try {
      const [configRes, custRes, txnRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/customers'),
        fetch('/api/transactions')
      ]);

      if (configRes.ok && custRes.ok && txnRes.ok) {
        const configData = await configRes.json();
        const custData = await custRes.json();
        const txnData = await txnRes.json();

        setStats(configData.stats);
        setCustomers(custData);
        setTransactions(txnData);
      }
    } catch (err) {
      console.error('Error fetching Daima Motorcycles data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handler to register new customer
  const handleAddCustomer = async (formData: Partial<CustomerCreditContract>) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newCust = await res.json();
        showToast(`Registered Rider ${newCust.fullName} with CRDB Control No: ${newCust.crdbControlNumber}`);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to add customer:', err);
    }
  };

  // Handler for manual 1-click reconciliation
  const handleManualReconcile = async (txnId: string, custId: string) => {
    try {
      const res = await fetch('/api/reconcile/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: txnId,
          customerId: custId,
          staffName: 'Finance Officer'
        })
      });

      if (res.ok) {
        const data = await res.json();
        showToast(`Successfully reconciled transaction ${txnId} to ${data.customer.fullName}!`);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed manual reconciliation:', err);
    }
  };

  const selectedCustomerForReceipt = activeReceiptTxn
    ? customers.find(c => c.id === activeReceiptTxn.matchedCustomerId)
    : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-amber-400 px-4 py-3 rounded-xl shadow-2xl border border-amber-500/40 text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unmatchedCount={stats.unmatchedCount}
        pendingApprovalsCount={stats.pendingApprovalsCount}
        crdbStatus="ONLINE"
        currentUserRole={currentUserRole}
        setCurrentUserRole={(role) => {
          setCurrentUserRole(role);
          const nameMap: Record<UserRole, string> = {
            DAR_HEAD_OFFICE: 'F. Mwangi (Dar HO)',
            REGIONAL_HQ: 'S. Temba (Regional Mgr)',
            VENDOR: 'Kinondoni TVS Dealer',
            FIELD_COLLECTIONS: 'J. Mbwambo (Recovery)',
            ADMINISTRATOR: 'System Admin'
          };
          setCurrentUserName(nameMap[role] || 'Staff User');
        }}
        onRefresh={fetchAllData}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold">Connecting to Daima Motorcycles & CRDB Bank API...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                customers={customers}
                transactions={transactions}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenReceipt={(txn) => setActiveReceiptTxn(txn)}
              />
            )}

            {activeTab === 'workflow' && (
              <LoanWorkflowView
                customers={customers}
                currentUserRole={currentUserRole}
                currentUserName={currentUserName}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersView
                customers={customers}
                transactions={transactions}
                onAddCustomer={handleAddCustomer}
                onSelectCustomer={(cust) => setActiveDetailCust(cust)}
                onOpenReceipt={(txn) => setActiveReceiptTxn(txn)}
              />
            )}

            {activeTab === 'ledger' && (
              <BankLedgerView
                transactions={transactions}
                onOpenReceipt={(txn) => setActiveReceiptTxn(txn)}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'exceptions' && (
              <ExceptionQueueView
                unmatchedTransactions={transactions.filter(t => t.matchStatus === 'UNMATCHED_PENDING_REVIEW')}
                customers={customers}
                onManualReconcile={handleManualReconcile}
              />
            )}

            {activeTab === 'gprs' && (
              <GprsTrackingView
                customers={customers}
                currentUserRole={currentUserRole}
                currentUserName={currentUserName}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'analytics' && (
              <NationwideSalesView
                customers={customers}
                transactions={transactions}
              />
            )}

            {activeTab === 'audit' && (
              <AuditSecurityView
                currentUserRole={currentUserRole}
                currentUserName={currentUserName}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'simulator' && (
              <CrdbSandboxView
                customers={customers}
                onDepositSimulated={fetchAllData}
              />
            )}

            {activeTab === 'portal' && (
              <CustomerPortalView
                customers={customers}
                transactions={transactions}
                onOpenReceipt={(txn) => setActiveReceiptTxn(txn)}
              />
            )}

            {activeTab === 'ai' && (
              <AiAuditView customers={customers} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-center py-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 <strong>Daima Motorcycles Ltd</strong> | CRDB Bank Plc Official API Gateway Integration
          </div>
          <div className="text-[11px] text-slate-500">
            Azikiwe Branch, Dar es Salaam, Tanzania 🇹🇿
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeReceiptTxn && (
        <ReceiptModal
          transaction={activeReceiptTxn}
          customer={selectedCustomerForReceipt}
          onClose={() => setActiveReceiptTxn(null)}
        />
      )}

      {activeDetailCust && (
        <CustomerDetailModal
          customer={activeDetailCust}
          transactions={transactions}
          onClose={() => setActiveDetailCust(null)}
          onOpenReceipt={(txn) => setActiveReceiptTxn(txn)}
        />
      )}
    </div>
  );
}
