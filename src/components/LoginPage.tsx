import React, { useState } from 'react';
import { Bike, Key, Mail, ShieldCheck, UserCheck, Lock, Building2, ArrowRight, CheckCircle2, User, HelpCircle, AlertCircle, Sparkles, Smartphone, CreditCard } from 'lucide-react';
import { UserRole } from '../types';

export interface StaffAccount {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  title: string;
  badgeColor: string;
  department: string;
}

export const MOCK_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    email: 'ho.manager@daima.co.tz',
    password: 'Daima@2026',
    name: 'F. Mwangi',
    role: 'DAR_HEAD_OFFICE',
    title: 'Dar HO Credit Manager',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    department: 'Dar es Salaam Head Office - Final Loan Approvals'
  },
  {
    email: 'regional.mgr@daima.co.tz',
    password: 'Daima@2026',
    name: 'S. Temba',
    role: 'REGIONAL_HQ',
    title: 'Regional HQ Credit Manager',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    department: 'Coast & Northern Region Branch Review'
  },
  {
    email: 'vendor.kinondoni@daima.co.tz',
    password: 'Daima@2026',
    name: 'Kinondoni TVS Dealer',
    role: 'VENDOR',
    title: 'Dealership Vendor Staff',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    department: 'Kinondoni Authorized TVS & Bajaj Showroom'
  },
  {
    email: 'field.recovery@daima.co.tz',
    password: 'Daima@2026',
    name: 'J. Mbwambo',
    role: 'FIELD_COLLECTIONS',
    title: 'Field Recovery Officer',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    department: 'Field Collections & Delinquent Account Recovery'
  },
  {
    email: 'admin@daima.co.tz',
    password: 'Daima@2026',
    name: 'System Security Admin',
    role: 'ADMINISTRATOR',
    title: 'System Security Administrator',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    department: 'Audit Logging & CRDB Webhook Engine Config'
  }
];

export const MOCK_RIDERS = [
  {
    name: 'Juma Rashidi Bakari',
    controlNumber: '992008041',
    phone: '+255 754 812 901',
    model: 'TVS HLX 150 ES',
    region: 'Dar es Salaam'
  },
  {
    name: 'Amina Hamisi Kibwana',
    controlNumber: '992008042',
    phone: '+255 784 329 104',
    model: 'Bajaj Boxer BM150',
    region: 'Dar es Salaam'
  },
  {
    name: 'Baraka Joseph Mchome',
    controlNumber: '992008043',
    phone: '+255 621 009 811',
    model: 'Feikon FK150-A',
    region: 'Arusha'
  },
  {
    name: 'Hussein Ally Salum',
    controlNumber: '992008044',
    phone: '+255 768 112 300',
    model: 'TVS HLX 125',
    region: 'Dodoma'
  }
];

interface LoginPageProps {
  onLoginSuccess: (user: { name: string; role: UserRole; isRider?: boolean; riderControlNum?: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'STAFF' | 'RIDER'>('STAFF');
  
  // Staff Form State
  const [email, setEmail] = useState('ho.manager@daima.co.tz');
  const [password, setPassword] = useState('Daima@2026');
  
  // Rider Form State
  const [controlNum, setControlNum] = useState('992008041');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentialsCheatSheet, setShowCredentialsCheatSheet] = useState(true);

  // Fill staff quick preset
  const handleSelectStaffAccount = (acc: StaffAccount) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMsg(null);
  };

  // Fill rider quick preset
  const handleSelectRider = (rider: typeof MOCK_RIDERS[0]) => {
    setControlNum(rider.controlNumber);
    setErrorMsg(null);
  };

  // Submit Staff Login
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const match = MOCK_STAFF_ACCOUNTS.find(
        acc => acc.email.toLowerCase().trim() === email.toLowerCase().trim() && acc.password === password
      );

      if (match) {
        onLoginSuccess({
          name: match.name,
          role: match.role,
          isRider: false
        });
      } else {
        setErrorMsg('Invalid email or password. Please use one of the mock credentials listed below.');
        setIsLoading(false);
      }
    }, 400);
  };

  // Submit Rider Login
  const handleRiderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const cleanInput = controlNum.replace(/\s+/g, '');
      const match = MOCK_RIDERS.find(
        r => r.controlNumber === cleanInput || r.phone.replace(/\s+/g, '').includes(cleanInput)
      );

      if (match) {
        onLoginSuccess({
          name: match.name,
          role: 'VENDOR', // Default view for rider
          isRider: true,
          riderControlNum: match.controlNumber
        });
      } else {
        setErrorMsg('CRDB Control Number or Phone not recognized. Please use one of the mock rider profiles.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Brand Nav */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10 py-2">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xl shadow-amber-500/20">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-white">DAIMA MOTORCYCLES</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                CREDIT PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400">CRDB Bank Payment Tracking & Loan Management System</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CRDB Direct Webhook Engine Active</span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="max-w-5xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-start">
        {/* Left Form Box */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Portal Switcher Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('STAFF'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'STAFF'
                  ? 'bg-amber-500 text-slate-950 shadow-lg font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Daima Staff Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('RIDER'); setErrorMsg(null); }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'RIDER'
                  ? 'bg-amber-500 text-slate-950 shadow-lg font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Rider Self-Service</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STAFF FORM */}
          {activeTab === 'STAFF' ? (
            <form onSubmit={handleStaffLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Work Email / User Handle</span>
                  <span className="text-[10px] text-amber-400">Mock Data Below</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ho.manager@daima.co.tz"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-slate-500">Default: Daima@2026</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating Staff Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Credit Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Staff Profile Switcher (Preset Test Accounts):</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MOCK_STAFF_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleSelectStaffAccount(acc)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        email === acc.email
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{acc.name}</p>
                        <p className="text-[10px] text-slate-400">{acc.title}</p>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${acc.badgeColor}`}>
                        {acc.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* RIDER FORM */
            <form onSubmit={handleRiderLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>CRDB Control Number or Phone Number</span>
                  <span className="text-[10px] text-amber-400">SimBanking / Wakala Control No.</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={controlNum}
                    onChange={(e) => setControlNum(e.target.value)}
                    placeholder="e.g. 992008041 or +255 754 812 901"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Control Number with CRDB...</span>
                    </>
                  ) : (
                    <>
                      <span>Access Rider Statement</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Rider Presets */}
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select Mock Rider Profile:</span>
                </p>
                <div className="space-y-2">
                  {MOCK_RIDERS.map((rider) => (
                    <button
                      key={rider.controlNumber}
                      type="button"
                      onClick={() => handleSelectRider(rider)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        controlNum === rider.controlNumber
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{rider.name} ({rider.model})</p>
                        <p className="text-[10px] text-slate-400">Phone: {rider.phone} | Region: {rider.region}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {rider.controlNumber}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Right Info & Credentials Cheat Sheet */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Mock Credentials Reference</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCredentialsCheatSheet(!showCredentialsCheatSheet)}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                {showCredentialsCheatSheet ? 'Hide' : 'Show All'}
              </button>
            </div>

            {showCredentialsCheatSheet && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between font-mono font-semibold text-amber-300">
                    <span>Password for ALL Staff:</span>
                    <span className="text-emerald-400">Daima@2026</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {MOCK_STAFF_ACCOUNTS.map((acc) => (
                    <div key={acc.email} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{acc.title}</span>
                        <span className="text-[9px] font-mono text-slate-400">{acc.role}</span>
                      </div>
                      <p className="text-[11px] font-mono text-amber-400/90 truncate">{acc.email}</p>
                      <p className="text-[10px] text-slate-400">{acc.department}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Prototype Feature Ready</span>
            </p>
            <p className="leading-relaxed text-[11px]">
              This prototype simulates Daima Motorcycles' automated hire-purchase loan lifecycle connected to CRDB Bank's payment webhook. You can log in with any role to experience role-based access control (RBAC).
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 py-4 border-t border-slate-900 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Daima Motorcycles Tanzania Ltd. All Rights Reserved.</p>
        <p className="font-mono text-[11px]">CRDB Direct Payment Gateway API v2.4 (SSL Encrypted)</p>
      </div>
    </div>
  );
};
