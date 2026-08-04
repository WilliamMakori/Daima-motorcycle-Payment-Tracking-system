import React, { useState } from 'react';
import { CustomerCreditContract, CRDBTransaction } from '../types';
import { Search, Plus, Bike, Copy, Check, Filter, Calendar, MapPin, Shield, ChevronRight, FileText, X } from 'lucide-react';

interface CustomersViewProps {
  customers: CustomerCreditContract[];
  transactions: CRDBTransaction[];
  onAddCustomer: (data: Partial<CustomerCreditContract>) => Promise<void>;
  onSelectCustomer: (customer: CustomerCreditContract) => void;
  onOpenReceipt: (txn: CRDBTransaction) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  transactions,
  onAddCustomer,
  onSelectCustomer,
  onOpenReceipt
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    nidaId: '',
    region: 'Dar es Salaam',
    branch: 'Kinondoni Branch',
    motorcycleModel: 'TVS HLX 150 ES (Red)',
    chassisNumber: '',
    cashPrice: 3200000,
    downPayment: 600000,
    repaymentFrequency: 'DAILY' as 'DAILY' | 'WEEKLY' | 'MONTHLY',
    guarantorName: '',
    guarantorPhone: '',
    notes: ''
  });

  const formatTZS = (val: number) => `TZS ${val.toLocaleString()}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.crdbControlNumber.includes(searchTerm) ||
      c.phone.includes(searchTerm) ||
      c.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = selectedRegion === 'ALL' || c.region === selectedRegion;
    const matchesStatus = selectedStatus === 'ALL' || c.loanStatus === selectedStatus;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleSubmitNewCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onAddCustomer(formData);
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        phone: '',
        nidaId: '',
        region: 'Dar es Salaam',
        branch: 'Kinondoni Branch',
        motorcycleModel: 'TVS HLX 150 ES (Red)',
        chassisNumber: '',
        cashPrice: 3200000,
        downPayment: 600000,
        repaymentFrequency: 'DAILY',
        guarantorName: '',
        guarantorPhone: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error creating customer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Credit Customers & Agreements</h2>
          <p className="text-xs text-slate-500">
            Each rider is allocated a unique CRDB Control Number (`99200xxxx`) for automated repayment tracing.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Credit Contract</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Rider Name, Customer ID (DM-TZ-xxxx), CRDB Control No, Phone, or Chassis..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="ALL">All Regions</option>
            <option value="Dar es Salaam">Dar es Salaam</option>
            <option value="Arusha">Arusha</option>
            <option value="Dodoma">Dodoma</option>
            <option value="Mwanza">Mwanza</option>
            <option value="Mbeya">Mbeya</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="OVERDUE">Overdue</option>
            <option value="DEFAULT_RISK">Default Risk</option>
            <option value="PAID_OFF">Paid Off</option>
          </select>
        </div>
      </div>

      {/* Customer Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => {
          const progressPercent = Math.min(100, Math.round((cust.totalPaid / cust.totalLoanValue) * 100));

          return (
            <div
              key={cust.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/30">
                      {cust.id}
                    </span>
                    <span className="text-[10px] text-slate-400">{cust.region}</span>
                  </div>

                  {cust.loanStatus === 'ACTIVE' && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">
                      ACTIVE
                    </span>
                  )}
                  {cust.loanStatus === 'OVERDUE' && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full">
                      OVERDUE ({cust.overdueDays}d)
                    </span>
                  )}
                  {cust.loanStatus === 'DEFAULT_RISK' && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-full animate-pulse">
                      DEFAULT RISK
                    </span>
                  )}
                  {cust.loanStatus === 'PAID_OFF' && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full">
                      PAID OFF 🎓
                    </span>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{cust.fullName}</h3>
                    <p className="text-slate-500 text-[11px] font-mono">{cust.phone} | NIDA: {cust.nidaId}</p>
                  </div>

                  {/* CRDB Control Number Box */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-amber-800 uppercase tracking-wide">
                        CRDB Payment Control No.
                      </div>
                      <div className="text-lg font-black font-mono text-amber-900 tracking-wider">
                        {cust.crdbControlNumber}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(cust.crdbControlNumber, cust.id)}
                      className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors flex items-center space-x-1"
                      title="Copy CRDB Control Number"
                    >
                      {copiedId === cust.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Motorcycle Details */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center space-x-2 font-semibold text-slate-800">
                      <Bike className="w-3.5 h-3.5 text-slate-600" />
                      <span>{cust.motorcycleModel}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Plate / VIN: {cust.chassisNumber}
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-500">Paid: {formatTZS(cust.totalPaid)}</span>
                      <span className="text-slate-900 font-bold">{progressPercent}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          cust.loanStatus === 'PAID_OFF'
                            ? 'bg-blue-500'
                            : cust.loanStatus === 'OVERDUE' || cust.loanStatus === 'DEFAULT_RISK'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[11px] font-semibold pt-0.5">
                      <span className="text-slate-500">Total: {formatTZS(cust.totalLoanValue)}</span>
                      <span className="text-rose-600">Balance: {formatTZS(cust.remainingBalance)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                    <span>Rate: <strong>{formatTZS(cust.installmentAmount)}</strong> / {cust.repaymentFrequency.toLowerCase()}</span>
                    <span>Due: <strong>{cust.nextPaymentDueDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectCustomer(cust)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>View Passbook & Statement</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Bike className="w-5 h-5 text-amber-400" />
                  New Credit Contract Registration
                </h3>
                <p className="text-xs text-slate-300">
                  CRDB Control Number and Unique Customer ID will be allocated automatically.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewCustomer} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rider Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Hassan Ally Mbonde"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number (+255) *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+255 754 xxx xxx"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">National ID (NIDA) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nidaId}
                    onChange={(e) => setFormData({ ...formData, nidaId: e.target.value })}
                    placeholder="1990xxxx-xxxxx-xxxxx-xx"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Region / Branch *</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value, branch: `${e.target.value} Main Branch` })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Arusha">Arusha</option>
                    <option value="Dodoma">Dodoma</option>
                    <option value="Mwanza">Mwanza</option>
                    <option value="Mbeya">Mbeya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Motorcycle Model *</label>
                  <input
                    type="text"
                    required
                    value={formData.motorcycleModel}
                    onChange={(e) => setFormData({ ...formData, motorcycleModel: e.target.value })}
                    placeholder="TVS HLX 150 / Boxer BM150"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chassis / Plate Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.chassisNumber}
                    onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                    placeholder="MC 829 DXA"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cash Price (TZS)</label>
                  <input
                    type="number"
                    value={formData.cashPrice}
                    onChange={(e) => setFormData({ ...formData, cashPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Down Payment (TZS)</label>
                  <input
                    type="number"
                    value={formData.downPayment}
                    onChange={(e) => setFormData({ ...formData, downPayment: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Repayment Schedule</label>
                  <select
                    value={formData.repaymentFrequency}
                    onChange={(e) => setFormData({ ...formData, repaymentFrequency: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="DAILY">Daily Installment</option>
                    <option value="WEEKLY">Weekly Installment</option>
                    <option value="MONTHLY">Monthly Installment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guarantor Name & Phone</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Guarantor Name"
                      value={formData.guarantorName}
                      onChange={(e) => setFormData({ ...formData, guarantorName: e.target.value })}
                      className="p-2 border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={formData.guarantorPhone}
                      onChange={(e) => setFormData({ ...formData, guarantorPhone: e.target.value })}
                      className="p-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <strong>System Guarantee:</strong>
                <p>Financed Balance: {formatTZS(formData.cashPrice - formData.downPayment)} + 15% Interest. Automatic CRDB Control Number will be assigned instantly.</p>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2"
                >
                  {submitting ? 'Generating Contract...' : 'Activate Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
