import React, { useState } from 'react';
import { Search, Bell, RefreshCw, ChevronRight, User, CheckCircle2, ShieldAlert, Play } from 'lucide-react';
import { MOCK_INCIDENTS, MOCK_CANDIDATE_VESSELS } from '../../data/mockData';
import { useIncident } from '../../context/IncidentContext';

export function TopHeader({ activePage, setActivePage, selectedIncidentId, setSelectedIncidentId, setSelectedVessel }) {
  const { runDemoSimulation, isDemoRunning, toast } = useIncident();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate breadcrumb text
  const getBreadcrumb = () => {
    switch (activePage) {
      case 'overview':
        return <span className="font-semibold text-slate-800 text-sm">Overview</span>;
      case 'incidents':
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Incidents</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800 text-sm">Active Incident Registry</span>
          </div>
        );
      case 'incident-detail':
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <button onClick={() => setActivePage('incidents')} className="hover:text-slate-800 underline">Incidents</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800 text-sm">{selectedIncidentId}</span>
          </div>
        );
      case 'analysis-flow':
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Investigation</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800 text-sm">New Spill Analysis Workflow</span>
          </div>
        );
      case 'step-spill-detection':
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Satellite Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800 text-sm">AI Oil Spill Detection</span>
          </div>
        );
      case 'step-drift-analysis':
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Satellite Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800 text-sm">Hydrodynamic Drift Analysis</span>
          </div>
        );
      case 'step-vessel-correlation':
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Vessel Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800 text-sm">Vessel Correlation & Suspect Candidate</span>
          </div>
        );
      case 'satellite-library':
        return <span className="font-semibold text-slate-800 text-sm">Satellite Imagery Catalog</span>;
      case 'ais-tracking':
        return <span className="font-semibold text-slate-800 text-sm">AIS Vessel Tracking System</span>;
      case 'evidence':
        return <span className="font-semibold text-slate-800 text-sm">Evidence Management Repository</span>;
      case 'reports':
        return <span className="font-semibold text-slate-800 text-sm">Investigation Reports</span>;
      case 'data-sources':
        return <span className="font-semibold text-slate-800 text-sm">Data Sources & System Health</span>;
      case 'settings':
        return <span className="font-semibold text-slate-800 text-sm">System Parameters & Configuration</span>;
      default:
        return <span className="font-semibold text-slate-800 text-sm">Maritime Analysis Platform</span>;
    }
  };

  // Search logic
  const filteredIncidents = searchQuery.trim()
    ? MOCK_INCIDENTS.filter(inc => 
        inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredVessels = searchQuery.trim()
    ? MOCK_CANDIDATE_VESSELS.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.mmsi.includes(searchQuery) ||
        v.imo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="h-[64px] bg-white border-b border-[#E3E8EF] px-6 flex items-center justify-between shrink-0 z-20">
      {/* Left: Breadcrumb */}
      <div className="flex items-center min-w-0 pr-4">
        {getBreadcrumb()}
      </div>

      {/* Middle: Universal Search */}
      <div className="relative max-w-md w-full hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incidents, vessels, MMSI, IMO..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#172033] placeholder-[#98A2B3] focus:outline-none focus:border-[#1976A8] focus:bg-white transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E3E8EF] rounded-md shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
            <div className="px-3 py-1 text-[11px] font-semibold text-[#98A2B3] uppercase">
              Incidents ({filteredIncidents.length})
            </div>
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map(inc => (
                <button
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    setActivePage('incident-detail');
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-[#1976A8]">{inc.id}</span>
                  <span className="text-slate-500 truncate max-w-[200px]">{inc.region}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-1 text-xs text-slate-400">No incidents match</div>
            )}

            <div className="px-3 py-1 text-[11px] font-semibold text-[#98A2B3] uppercase border-t border-slate-100 mt-1 pt-1.5">
              Vessels ({filteredVessels.length})
            </div>
            {filteredVessels.length > 0 ? (
              filteredVessels.map(v => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVessel(v);
                    setActivePage('step-vessel-correlation');
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-medium text-slate-800">{v.name}</span>
                    <span className="text-[11px] text-slate-500 ml-2">MMSI: {v.mmsi}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {v.correlationScore}% corr
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-1 text-xs text-slate-400">No vessels match</div>
            )}
          </div>
        )}
      </div>

        {/* Run Demo Simulation Button */}
        <button
          disabled={isDemoRunning}
          onClick={() => runDemoSimulation(setActivePage)}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          title="Simulate complete automated investigation sequence"
        >
          <Play className="w-3.5 h-3.5 fill-emerald-700 text-emerald-700" />
          <span>{isDemoRunning ? 'Simulating...' : 'Run Demo'}</span>
        </button>

        {/* Data Sync Status */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F8FAFC] px-2.5 py-1 rounded border border-[#E3E8EF] text-xs text-[#667085]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-700">Data Feed: Synchronized</span>
          <span className="text-slate-400 text-[11px]">(2 min ago)</span>
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 relative"
            title="System Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E3E8EF] rounded-md shadow-lg p-3 z-50 text-xs">
              <div className="flex items-center justify-between font-medium text-slate-800 pb-2 border-b border-slate-100">
                <span>Recent System Alerts</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">2 New</span>
              </div>
              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                  <div className="flex items-center gap-1.5 font-medium text-amber-900">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>New Detection: INC-2026-0087</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">Sentinel-1 SAR detected 3.82 km² slick in MH Offshore Basin.</p>
                  <span className="text-[10px] text-amber-600 mt-1 block">10:42 UTC</span>
                </div>
                <div className="p-2 bg-sky-50 border border-sky-200 rounded">
                  <div className="flex items-center gap-1.5 font-medium text-sky-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>AIS Correlation Complete</span>
                  </div>
                  <p className="text-[11px] text-sky-800 mt-0.5">MV OCEAN CREST flagged with 89% correlation match.</p>
                  <span className="text-[10px] text-sky-600 mt-1 block">10:38 UTC</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-[#1976A8] text-white flex items-center justify-center font-semibold text-xs">
            RS
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">Cmdr. R. Sharma</span>
            <span className="text-[10px] text-slate-500 leading-tight">Indian Coast Guard</span>
        </div>
      </div>

      {/* Floating System Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3 max-w-md animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toast.message}</span>
        </div>
      )}
    </header>
  );
}
