import React, { useState } from 'react';
import { FileCheck, Search, ShieldCheck, Download, ExternalLink, Lock } from 'lucide-react';
import { MOCK_EVIDENCE } from '../data/mockData';

export function EvidenceRepository() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvidence = MOCK_EVIDENCE.filter(ev =>
    ev.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8EF]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Evidence Management Repository</h1>
          <p className="text-xs text-[#667085] mt-0.5">Cryptographic SHA-256 Checksums & Chain of Custody Audit Log</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Chain of Custody Active & Verified</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-3 shadow-sm flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Evidence ID, type, or checksum..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1976A8]"
          />
        </div>
        <span className="text-xs text-[#667085]">Showing {filteredEvidence.length} items</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[900px] border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-[#E3E8EF] text-[#667085] font-semibold">
            <tr>
              <th className="py-3 px-4 whitespace-nowrap">Evidence ID</th>
              <th className="py-3 px-4 whitespace-nowrap">Type</th>
              <th className="py-3 px-4 whitespace-nowrap">Source System</th>
              <th className="py-3 px-4 whitespace-nowrap">Original Timestamp</th>
              <th className="py-3 px-4 whitespace-nowrap">SHA-256 Hash Checksum</th>
              <th className="py-3 px-4 whitespace-nowrap">Analyst / Authority</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Integrity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E8EF] text-[#172033]">
            {filteredEvidence.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-[#1976A8] whitespace-nowrap">{ev.id}</td>
                <td className="py-3 px-4 font-semibold whitespace-nowrap">{ev.type}</td>
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{ev.source}</td>
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{ev.originalTimestamp}</td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500 max-w-[180px] truncate whitespace-nowrap" title={ev.hash}>
                  {ev.hash}
                </td>
                <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">{ev.analyst}</td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Lock className="w-3 h-3" /> Verified
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
