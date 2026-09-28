import React, { useState } from 'react';
import { Search, Filter, PlusCircle, ArrowRight, Eye, Calendar, MapPin } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MOCK_INCIDENTS } from '../data/mockData';

export function Incidents({ setActivePage, setSelectedIncidentId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredIncidents = MOCK_INCIDENTS.filter(inc => {
    const matchesSearch = inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8EF]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Active Incident Registry</h1>
          <p className="text-xs text-[#667085] mt-0.5">Comprehensive history and active tracking of maritime oil spill incidents</p>
        </div>
        <button
          onClick={() => setActivePage('analysis-flow')}
          className="inline-flex items-center gap-2 bg-[#1976A8] hover:bg-[#166794] text-white px-4 py-2 rounded-md text-xs font-semibold shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ New Spill Analysis</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, region, or vessel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1976A8]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#667085]" />
          <span className="text-xs font-medium text-[#667085]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F6F8FB] border border-[#E3E8EF] rounded-md px-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1976A8]"
          >
            <option value="All">All Statuses</option>
            <option value="Detected">Detected</option>
            <option value="Under Analysis">Under Analysis</option>
            <option value="Drift Calculated">Drift Calculated</option>
            <option value="AIS Correlation">AIS Correlation</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Incidents Data Table */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[850px] border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-[#E3E8EF] text-[#667085] font-semibold">
            <tr>
              <th className="py-3 px-4 whitespace-nowrap">Incident ID</th>
              <th className="py-3 px-4 whitespace-nowrap">Incident Name</th>
              <th className="py-3 px-4 whitespace-nowrap">Detected Date</th>
              <th className="py-3 px-4 whitespace-nowrap">Region</th>
              <th className="py-3 px-4 whitespace-nowrap">Estimated Area</th>
              <th className="py-3 px-4 whitespace-nowrap">Status</th>
              <th className="py-3 px-4 whitespace-nowrap">Priority</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E8EF] text-[#172033]">
            {filteredIncidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-[#1976A8] whitespace-nowrap">{inc.id}</td>
                <td className="py-3 px-4 font-medium whitespace-nowrap">{inc.name}</td>
                <td className="py-3 px-4 text-[#667085] whitespace-nowrap">{inc.date} · {inc.time}</td>
                <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">{inc.region}</td>
                <td className="py-3 px-4 whitespace-nowrap">{inc.estimatedArea}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <StatusBadge status={inc.status} size="sm" />
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <StatusBadge status={inc.priority} size="sm" />
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedIncidentId(inc.id);
                      setActivePage('incident-detail');
                    }}
                    className="inline-flex items-center gap-1 text-[#1976A8] font-semibold hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Analysis
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
