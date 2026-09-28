import React from 'react';
import { PlusCircle, ArrowRight, ShieldCheck, Activity, RefreshCw, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MOCK_INCIDENTS } from '../data/mockData';

export function Overview({ setActivePage, setSelectedIncidentId }) {
  const recentActivity = [
    { time: "10:42 UTC", text: "Satellite scene processed for INC-2026-0087 (Sentinel-1 SAR)", icon: Activity },
    { time: "10:38 UTC", text: "4 candidate vessels identified in release origin zone", icon: CheckCircle2 },
    { time: "10:22 UTC", text: "GNOME drift model completed 24-hr backtrack simulation", icon: ShieldCheck },
    { time: "09:58 UTC", text: "Analyst Cmdr. R. Sharma initialized investigation INC-2026-0087", icon: FileText }
  ];

  const summaryCards = [
    { title: "Active Incidents", count: "04", badge: "+1 today", badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { title: "Spills Under Analysis", count: "02", badge: "In Progress", badgeColor: "text-sky-700 bg-sky-50 border-sky-200" },
    { title: "Suspect Vessels", count: "07", badge: "Shortlisted", badgeColor: "text-amber-700 bg-amber-50 border-amber-200" },
    { title: "Reports Generated", count: "14", badge: "Verified", badgeColor: "text-slate-700 bg-slate-50 border-slate-200" }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8EF]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Executive Dashboard & Operational Overview</h1>
          <p className="text-xs text-[#667085] mt-0.5">Maritime Oil Spill Detection & AIS Vessel Correlation Command</p>
        </div>
        <button
          onClick={() => setActivePage('analysis-flow')}
          className="inline-flex items-center gap-2 bg-[#1976A8] hover:bg-[#166794] text-white px-4 py-2 rounded-md text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ New Analysis</span>
        </button>
      </div>

      {/* 4 Compact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-medium text-[#667085]">{card.title}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-[#172033] tracking-tight">{card.count}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Major Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 1: Recent Incidents Table (approx 70% width = 8 cols on lg) */}
        <div className="lg:col-span-8 bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172033]">Recent Incident Surveillance</h2>
              <p className="text-[11px] text-[#667085]">Active geospatial oil slick tracking & correlation status</p>
            </div>
            <button
              onClick={() => setActivePage('incidents')}
              className="text-xs font-semibold text-[#1976A8] hover:underline flex items-center gap-1"
            >
              View All Registry <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto border border-[#E3E8EF] rounded-md">
            <table className="w-full text-left text-xs min-w-[680px] border-collapse">
              <thead className="bg-[#F8FAFC] border-b border-[#E3E8EF] text-[#667085] font-semibold">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">Incident ID</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Detected Date</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Region</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Estimated Area</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Priority</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8EF] text-[#172033]">
                {MOCK_INCIDENTS.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#1976A8] whitespace-nowrap">{inc.id}</td>
                    <td className="py-2.5 px-3 text-[#667085] whitespace-nowrap">{inc.date}</td>
                    <td className="py-2.5 px-3 font-medium whitespace-nowrap">{inc.region}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{inc.estimatedArea}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={inc.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={inc.priority} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedIncidentId(inc.id);
                          setActivePage('incident-detail');
                        }}
                        className="text-[#1976A8] font-semibold hover:underline"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: System Status Panel (approx 30% width = 4 cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E3E8EF] pb-2">
              <h2 className="text-sm font-bold text-[#172033]">System Status & Feeds</h2>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-[#F8FAFC] rounded border border-slate-100">
                <span className="text-[#667085] font-medium">Satellite feed</span>
                <span className="font-semibold text-emerald-700">Operational (99.8%)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#F8FAFC] rounded border border-slate-100">
                <span className="text-[#667085] font-medium">AIS feed</span>
                <span className="font-semibold text-emerald-700">Operational (100.0%)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#F8FAFC] rounded border border-slate-100">
                <span className="text-[#667085] font-medium">Weather data</span>
                <span className="font-semibold text-emerald-700">Operational (99.5%)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#F8FAFC] rounded border border-slate-100">
                <span className="text-[#667085] font-medium">Ocean current data</span>
                <span className="font-semibold text-emerald-700">Operational (99.1%)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E3E8EF] flex items-center justify-between text-[11px] text-[#667085]">
            <span>Last synchronization:</span>
            <span className="font-medium text-[#172033]">2 min ago</span>
          </div>
        </div>
      </div>

      {/* Under Sections: Recent Activity Feed */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-[#172033]">Recent System Activity Log</h2>
        <div className="space-y-2">
          {recentActivity.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 transition-colors border-l-2 border-[#1976A8]">
                <span className="text-xs font-mono font-medium text-[#667085] shrink-0">{act.time}</span>
                <Icon className="w-3.5 h-3.5 text-[#1976A8] shrink-0" />
                <span className="text-xs text-[#172033] font-medium">{act.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
