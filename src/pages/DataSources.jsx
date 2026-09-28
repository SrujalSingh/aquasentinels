import React from 'react';
import { Database, CheckCircle2, RefreshCw, Server } from 'lucide-react';
import { MOCK_DATA_SOURCES } from '../data/mockData';

export function DataSources() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8EF]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Data Sources & Ingestion Pipeline Health</h1>
          <p className="text-xs text-[#667085] mt-0.5">Real-time status of satellite feeds, AIS stream gateways & environmental APIs</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
            All 8 Core Services Operational
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[850px] border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-[#E3E8EF] text-[#667085] font-semibold">
            <tr>
              <th className="py-3 px-4 whitespace-nowrap">Data Provider / Integration Source</th>
              <th className="py-3 px-4 whitespace-nowrap">Category</th>
              <th className="py-3 px-4 whitespace-nowrap">Ingestion Protocol</th>
              <th className="py-3 px-4 whitespace-nowrap">Last Sync</th>
              <th className="py-3 px-4 whitespace-nowrap">Uptime / Health</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E8EF] text-[#172033]">
            {MOCK_DATA_SOURCES.map((ds, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">{ds.name}</td>
                <td className="py-3 px-4 text-[#1976A8] font-medium whitespace-nowrap">{ds.category}</td>
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{ds.type}</td>
                <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap">{ds.lastSync}</td>
                <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">{ds.health}</td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
