import React from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  PlusCircle, 
  Satellite, 
  Layers, 
  Compass, 
  Radio, 
  GitCommit, 
  FileCheck, 
  FileText, 
  Database, 
  Sliders, 
  HelpCircle, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export function Sidebar({ activePage, setActivePage, collapsed, setCollapsed }) {
  const navSections = [
    {
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard }
      ]
    },
    {
      title: "INCIDENT MANAGEMENT",
      items: [
        { id: "incidents", label: "Incidents", icon: AlertTriangle },
        { id: "analysis-flow", label: "+ New Analysis", icon: PlusCircle, isHighlight: true }
      ]
    },
    {
      title: "SATELLITE ANALYSIS",
      items: [
        { id: "satellite-library", label: "Satellite Imagery", icon: Satellite },
        { id: "spill-detection", label: "Spill Detection", icon: Layers },
        { id: "drift-analysis", label: "Drift Analysis", icon: Compass }
      ]
    },
    {
      title: "VESSEL ANALYSIS",
      items: [
        { id: "ais-tracking", label: "AIS Vessel Tracking", icon: Radio },
        { id: "vessel-correlation", label: "Vessel Correlation", icon: GitCommit }
      ]
    },
    {
      title: "INVESTIGATION",
      items: [
        { id: "evidence", label: "Evidence", icon: FileCheck },
        { id: "reports", label: "Reports", icon: FileText }
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { id: "data-sources", label: "Data Sources", icon: Database },
        { id: "settings", label: "Settings", icon: Sliders }
      ]
    }
  ];

  return (
    <aside className={`bg-white border-r border-[#E3E8EF] flex flex-col justify-between transition-all duration-200 z-30 shrink-0 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Brand & Identity */}
      <div>
        <div className="h-16 px-4 border-b border-[#E3E8EF] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded bg-[#1976A8] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-[#172033] tracking-tight leading-none truncate">AquaSentinels</span>
                <span className="text-[11px] text-[#667085] truncate font-medium mt-1">Maritime Spill Platform</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <div className="py-4 px-2 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && !collapsed && (
                <div className="px-3 text-[11px] font-semibold text-[#98A2B3] tracking-wider uppercase mb-1.5">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EBF3F8] text-[#1976A8]'
                        : item.isHighlight
                        ? 'bg-sky-50 text-[#1976A8] hover:bg-sky-100 border border-sky-200'
                        : 'text-[#475467] hover:bg-gray-50 hover:text-[#172033]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1976A8]' : 'text-[#667085]'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / User Badge */}
      <div className="p-3 border-t border-[#E3E8EF] bg-[#F8FAFC]">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0 border border-slate-300">
                RS
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#172033] truncate">Cmdr. R. Sharma</span>
                <span className="text-[11px] text-[#667085] truncate">ICG Analyst</span>
              </div>
            </div>
            <button 
              onClick={() => setActivePage('data-sources')}
              className="text-[#667085] hover:text-[#172033] p-1 rounded hover:bg-gray-100" 
              title="System Documentation & Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center border border-slate-300">
              RS
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
