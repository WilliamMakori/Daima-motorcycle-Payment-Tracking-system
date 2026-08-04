import React from 'react';
import { CustomerCreditContract, CRDBTransaction } from '../types';
import { BarChart3, TrendingUp, PieChart, MapPin, Download, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

interface NationwideSalesViewProps {
  customers: CustomerCreditContract[];
  transactions: CRDBTransaction[];
}

export const NationwideSalesView: React.FC<NationwideSalesViewProps> = ({
  customers,
  transactions
}) => {
  const regions = ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Mbeya', 'Tanga', 'Zanzibar'];

  const regionalStats = regions.map(regionName => {
    const regionCusts = customers.filter(c => c.region === regionName);
    const count = regionCusts.length;
    const portfolioVal = regionCusts.reduce((sum, c) => sum + c.totalLoanValue, 0);
    const collectedVal = regionCusts.reduce((sum, c) => sum + c.totalPaid, 0);
    const collectionRate = portfolioVal > 0 ? Math.round((collectedVal / portfolioVal) * 100) : 100;
    const overdueCount = regionCusts.filter(c => c.loanStatus === 'OVERDUE' || c.loanStatus === 'DEFAULT_RISK').length;

    return {
      regionName,
      count,
      portfolioVal,
      collectedVal,
      collectionRate,
      overdueCount
    };
  });

  const totalPortfolio = customers.reduce((sum, c) => sum + c.totalLoanValue, 0);
  const totalCollected = customers.reduce((sum, c) => sum + c.totalPaid, 0);
  const overallCollectionRate = totalPortfolio > 0 ? Math.round((totalCollected / totalPortfolio) * 100) : 100;

  const handleDownloadReport = () => {
    const reportCsv = [
      ['Region', 'Active Contracts', 'Portfolio Value (TZS)', 'Collected Value (TZS)', 'Collection Efficiency %', 'Delinquent Count'].join(','),
      ...regionalStats.map(r => [
        r.regionName,
        r.count,
        r.portfolioVal,
        r.collectedVal,
        `${r.collectionRate}%`,
        r.overdueCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([reportCsv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Daima_Motorcycles_Nationwide_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <BarChart3 className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Nationwide Sales & Collection Analytics</h2>
            <p className="text-xs text-slate-400">1-Click Regional Analytics, Collection Efficiency, and Portfolio Breakdown</p>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-amber-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Export 1-Click Analytics Report (.CSV)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-semibold">Total Portfolio Financed</span>
          <div className="text-xl font-bold text-slate-900 font-mono">
            TZS {totalPortfolio.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Across all 7 regions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-semibold">Total Funds Reconciled</span>
          <div className="text-xl font-bold text-emerald-600 font-mono">
            TZS {totalCollected.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Via CRDB Bank Gateway</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-semibold">National Collection Efficiency</span>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {overallCollectionRate}%
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Repayment compliance rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-semibold">Active Riders Tracked</span>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {customers.length} Riders
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Motorcycle hire purchases</p>
        </div>
      </div>

      {/* Regional Breakdown Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span>Regional Sales & Collection Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {regionalStats.map(stat => (
            <div key={stat.regionName} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-900 text-sm">{stat.regionName}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-mono font-bold rounded">
                  {stat.count} Bikes
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Portfolio Value:</span>
                  <span className="font-bold font-mono text-slate-900">TZS {stat.portfolioVal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Collected:</span>
                  <span className="font-bold font-mono text-emerald-600">TZS {stat.collectedVal.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                  <span>Collection Efficiency</span>
                  <span>{stat.collectionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stat.collectionRate}%` }}
                  ></div>
                </div>
              </div>

              {stat.overdueCount > 0 && (
                <div className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-200 p-1.5 rounded text-center">
                  ⚠️ {stat.overdueCount} Delinquent account(s) under review
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
