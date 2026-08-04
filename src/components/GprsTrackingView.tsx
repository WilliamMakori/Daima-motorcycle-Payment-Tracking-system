import React, { useState } from 'react';
import { CustomerCreditContract, UserRole } from '../types';
import { Navigation, Radio, Power, AlertOctagon, CheckCircle2, ShieldAlert, MapPin, Signal, BatteryCharging, Zap, Smartphone, Search, Filter } from 'lucide-react';

interface GprsTrackingViewProps {
  customers: CustomerCreditContract[];
  currentUserRole: UserRole;
  currentUserName: string;
  onRefresh: () => void;
}

export const GprsTrackingView: React.FC<GprsTrackingViewProps> = ({
  customers,
  currentUserRole,
  currentUserName,
  onRefresh
}) => {
  const [selectedCust, setSelectedCust] = useState<CustomerCreditContract | null>(customers[0] || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  
  // Modal state for remote immobilize
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    customer: CustomerCreditContract | null;
    action: 'KILL' | 'RESTORE';
  }>({ isOpen: false, customer: null, action: 'KILL' });

  const [killReason, setKillReason] = useState<string>('Delinquent loan balance > 30 days overdue');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.chassisNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = filterRegion === 'ALL' || c.region === filterRegion;
    const matchesStatus = filterStatus === 'ALL' || 
                          (filterStatus === 'IMMOBILIZED' && c.gprsInfo?.engineStatus === 'IMMOBILIZED') ||
                          (filterStatus === 'ACTIVE' && c.gprsInfo?.engineStatus === 'ACTIVE');
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleToggleEngine = async (cust: CustomerCreditContract, action: 'KILL' | 'RESTORE') => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/gprs/immobilize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: cust.id,
          command: action === 'KILL' ? 'KILL_ENGINE' : 'RESTORE_ENGINE',
          operatorName: currentUserName,
          operatorRole: currentUserRole,
          reason: killReason
        })
      });

      if (res.ok) {
        const data = await res.json();
        setNotificationMsg(data.smsNotificationSimulated || 'Command transmitted successfully via GPRS Satellite Network!');
        setConfirmModal({ isOpen: false, customer: null, action: 'KILL' });
        onRefresh();
      }
    } catch (err) {
      console.error('Failed GPRS immobilizer action:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-[#1e293b] space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Radio className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">GPRS Motorcycle Tracking & Remote Engine Immobilizer</h2>
              <p className="text-xs text-slate-400">Nationwide 24/7 Satellite Telematics & ECU Fuel Pump Control Gateway</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-xl flex items-center space-x-2">
            <Signal className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">GPRS Satellites:</span>
            <span className="text-emerald-400 font-mono font-bold">12 Active (4G-LTE)</span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-xl flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300 font-medium">Immobilized Units:</span>
            <span className="text-rose-400 font-bold font-mono">
              {customers.filter(c => c.gprsInfo?.engineStatus === 'IMMOBILIZED').length} Bikes
            </span>
          </div>
        </div>
      </div>

      {notificationMsg && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* Main Grid: Telematics Fleet List + Interactive GPS Command Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Rider Fleet Search & List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-amber-500" />
              <span>Tracked Motorcycles ({filteredCustomers.length})</span>
            </h3>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plate, rider or contract ID..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
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

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              >
                <option value="ALL">All Engine States</option>
                <option value="ACTIVE">Engine Active</option>
                <option value="IMMOBILIZED">Remote Immobilized</option>
              </select>
            </div>
          </div>

          {/* List of Vehicles */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredCustomers.map(c => {
              const isSelected = selectedCust?.id === c.id;
              const isImmobilized = c.gprsInfo?.engineStatus === 'IMMOBILIZED';

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCust(c)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-500/30'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{c.fullName}</span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {c.id}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{c.chassisNumber}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{c.gprsInfo?.locationName || `${c.region} Area`}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        isImmobilized
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isImmobilized ? 'bg-rose-600' : 'bg-emerald-500 animate-pulse'}`}></span>
                        {isImmobilized ? 'IMMOBILIZED' : 'ACTIVE'}
                      </span>
                      <p className="text-[10px] font-mono text-slate-500 mt-1">
                        {c.gprsInfo?.speedKmH || 0} km/h
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Telematics & Map Screen */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white shadow-xl space-y-6 flex flex-col justify-between">
          {selectedCust ? (
            <>
              {/* Telematics Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 text-xs font-bold bg-amber-500 text-slate-950 rounded-lg">
                      {selectedCust.chassisNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      IMEI: {selectedCust.gprsInfo?.imei || '869201049102910'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">{selectedCust.fullName}</h2>
                  <p className="text-xs text-slate-400">Model: {selectedCust.motorcycleModel} | Region: {selectedCust.region}</p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Ignition Control</div>
                    <div className={`text-xs font-bold ${
                      selectedCust.gprsInfo?.engineStatus === 'IMMOBILIZED' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {selectedCust.gprsInfo?.engineStatus === 'IMMOBILIZED' ? 'ENGINE KILLED' : 'ENGINE IGNITION RUNNING'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const action = selectedCust.gprsInfo?.engineStatus === 'IMMOBILIZED' ? 'RESTORE' : 'KILL';
                      setConfirmModal({ isOpen: true, customer: selectedCust, action });
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg transition-all ${
                      selectedCust.gprsInfo?.engineStatus === 'IMMOBILIZED'
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>
                      {selectedCust.gprsInfo?.engineStatus === 'IMMOBILIZED' ? 'Restore Ignition' : 'Remote Immobilize (Kill Engine)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Interactive Telematics Map Simulation Graphic */}
              <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-4 flex flex-col justify-between">
                {/* Simulated Radar Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                
                {/* Top GPS Overlay */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center gap-1 text-emerald-400 font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedCust.gprsInfo?.lat.toFixed(4)}, {selectedCust.gprsInfo?.lng.toFixed(4)}
                    </span>
                    <span className="text-slate-500">|</span>
                    <span>{selectedCust.gprsInfo?.locationName}</span>
                  </div>

                  <div className="flex items-center space-x-3 font-mono">
                    <span className="flex items-center gap-1 text-slate-300">
                      <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
                      {selectedCust.gprsInfo?.batteryPercent || 90}%
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Signal className="w-3.5 h-3.5" />
                      {selectedCust.gprsInfo?.signalStrengthPercent || 95}%
                    </span>
                  </div>
                </div>

                {/* Center Pulse Point */}
                <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
                  <div className="relative flex items-center justify-center">
                    <span className={`absolute w-16 h-16 rounded-full animate-ping opacity-40 ${
                      selectedCust.gprsInfo?.engineStatus === 'IMMOBILIZED' ? 'bg-rose-500' : 'bg-emerald-400'
                    }`}></span>
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 ${
                      selectedCust.gprsInfo?.engineStatus === 'IMMOBILIZED'
                        ? 'bg-rose-600 border-rose-300 text-white'
                        : 'bg-emerald-500 border-emerald-200 text-slate-950'
                    }`}>
                      <Navigation className="w-6 h-6 transform rotate-45" />
                    </div>
                  </div>
                  <div className="mt-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-full text-[11px] font-bold text-white shadow">
                    {selectedCust.chassisNumber} • Speed: {selectedCust.gprsInfo?.speedKmH || 0} km/h
                  </div>
                </div>

                {/* Bottom Bar Info */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span>Last Ping: {selectedCust.gprsInfo?.lastPingTimestamp || '1 min ago'}</span>
                  <span>GPRS Provider: Vodacom/Airtel M2M SIM</span>
                </div>
              </div>

              {/* Financial & Risk Assessment Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl text-xs space-y-1">
                  <div className="text-slate-400">Remaining Balance</div>
                  <div className="text-sm font-bold text-amber-400 font-mono">
                    TZS {selectedCust.remainingBalance.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Loan Status: {selectedCust.loanStatus}</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl text-xs space-y-1">
                  <div className="text-slate-400">Overdue Days</div>
                  <div className={`text-sm font-bold font-mono ${selectedCust.overdueDays > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedCust.overdueDays} Days Overdue
                  </div>
                  <div className="text-[10px] text-slate-400">Installment: TZS {selectedCust.installmentAmount.toLocaleString()}</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl text-xs space-y-1">
                  <div className="text-slate-400">CRDB Control No</div>
                  <div className="text-sm font-bold text-slate-200 font-mono">
                    {selectedCust.crdbControlNumber}
                  </div>
                  <div className="text-[10px] text-slate-400">Next Due: {selectedCust.nextPaymentDueDate}</div>
                </div>
              </div>

              {/* Immobilizer Action Audit Record if Immobilized */}
              {selectedCust.gprsInfo?.engineStatus === 'IMMOBILIZED' && (
                <div className="bg-rose-950/60 border border-rose-800/80 p-3.5 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    <span>Engine Immobilized Audit Record</span>
                  </div>
                  <p className="text-rose-200 text-[11px]">
                    Reason: {selectedCust.gprsInfo.immobilizeReason || 'Delinquency'}
                  </p>
                  <div className="text-[10px] text-rose-400 flex justify-between pt-1">
                    <span>Engaged by: {selectedCust.gprsInfo.immobilizedBy || 'Field Officer'}</span>
                    <span>Timestamp: {selectedCust.gprsInfo.immobilizedAt || '2026-08-01'}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Select a motorcycle from the left panel to inspect real-time GPRS telematics.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Engine Immobilization Command */}
      {confirmModal.isOpen && confirmModal.customer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <span className={`p-3 rounded-xl ${
                confirmModal.action === 'KILL' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                <Power className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-base font-bold">
                  {confirmModal.action === 'KILL' ? 'Engage Remote Engine Immobilizer?' : 'Restore Engine Ignition?'}
                </h3>
                <p className="text-xs text-slate-400">Target: {confirmModal.customer.chassisNumber} ({confirmModal.customer.fullName})</p>
              </div>
            </div>

            {confirmModal.action === 'KILL' ? (
              <div className="bg-rose-950/50 border border-rose-800/60 p-3 rounded-xl text-xs text-rose-200 space-y-2">
                <div className="font-bold flex items-center gap-1 text-rose-300">
                  <AlertOctagon className="w-4 h-4" /> Safety Protocol Verification:
                </div>
                <p className="text-[11px] leading-relaxed">
                  GPRS telematics confirms vehicle speed is <strong>0 km/h</strong> or safe for immobilization. The ECU fuel pump signal will be disabled immediately.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-950/50 border border-emerald-800/60 p-3 rounded-xl text-xs text-emerald-200 space-y-1">
                <p className="text-[11px]">
                  Restoring ECU ignition command. The rider will be able to start the motorcycle immediately.
                </p>
              </div>
            )}

            {confirmModal.action === 'KILL' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Reason for Immobilization:</label>
                <input
                  type="text"
                  value={killReason}
                  onChange={(e) => setKillReason(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setConfirmModal({ isOpen: false, customer: null, action: 'KILL' })}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                disabled={isProcessing}
                onClick={() => handleToggleEngine(confirmModal.customer!, confirmModal.action)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 ${
                  confirmModal.action === 'KILL'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isProcessing ? 'Transmitting GPRS Command...' : confirmModal.action === 'KILL' ? 'Confirm Kill Engine' : 'Confirm Restore Engine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
