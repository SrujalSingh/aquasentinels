import React, { useState } from 'react';
import { Search, Filter, Radio, X, ExternalLink, ShieldAlert, GitCommit } from 'lucide-react';
import { AISMap } from '../components/maps/AISMap';
import { MOCK_CANDIDATE_VESSELS } from '../data/mockData';

export function AISTracking({ setActivePage, setSelectedVessel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeVesselDrawer, setActiveVesselDrawer] = useState(MOCK_CANDIDATE_VESSELS[0]);

  const filteredVessels = MOCK_CANDIDATE_VESSELS.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.mmsi.includes(searchTerm) ||
    v.imo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-[#F6F8FB]">
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-[#E3E8EF] px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Radio className="w-5 h-5 text-[#1976A8]" />
          <div>
            <h1 className="text-sm font-bold text-[#172033]">AIS Historical Vessel Tracking System</h1>
            <p className="text-[11px] text-[#667085]">Terrestrial & Satellite AIS Stream Query</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Vessel / IMO / MMSI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1976A8]"
            />
          </div>

          <div className="text-xs flex items-center gap-2 border-l border-slate-200 pl-3">
            <span className="text-slate-500 font-medium">Time Window:</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded">Past 48 Hours</span>
          </div>
        </div>
      </div>

      {/* Main Map Workspace with Side Drawer */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Leaflet Map Workspace */}
        <div className="flex-1 h-full">
          <AISMap
            candidateVessels={filteredVessels}
            selectedVessel={activeVesselDrawer}
            setSelectedVessel={setActiveVesselDrawer}
          />
        </div>

        {/* Side Drawer for Selected Vessel */}
        {activeVesselDrawer && (
          <div className="w-80 bg-white border-l border-[#E3E8EF] shadow-lg flex flex-col justify-between p-4 z-20 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#172033] uppercase tracking-wider">Vessel Profile Drawer</span>
                <button onClick={() => setActiveVesselDrawer(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h2 className="text-base font-bold text-[#172033]">{activeVesselDrawer.name}</h2>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{activeVesselDrawer.vesselType} · {activeVesselDrawer.flag}</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">MMSI:</span>
                  <span className="font-mono font-semibold text-slate-800">{activeVesselDrawer.mmsi}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">IMO Number:</span>
                  <span className="font-mono font-semibold text-slate-800">{activeVesselDrawer.imo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Owner / Operator:</span>
                  <span className="font-medium text-slate-800">{activeVesselDrawer.owner}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Destination Port:</span>
                  <span className="font-medium text-slate-800">{activeVesselDrawer.destination}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Gross Tonnage / DWT:</span>
                  <span className="font-medium text-slate-800">{activeVesselDrawer.grossTonnage} / {activeVesselDrawer.dwt}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Average Speed / Heading:</span>
                  <span className="font-medium text-slate-800">{activeVesselDrawer.speedAvg} @ {activeVesselDrawer.heading}</span>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-red-900">
                  <span>Incident Correlation Score</span>
                  <span className="text-sm">{activeVesselDrawer.correlationScore}%</span>
                </div>
                <p className="text-[11px] text-red-800">
                  Closest Approach: {activeVesselDrawer.closestDistance} at {activeVesselDrawer.passedZoneTime}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setSelectedVessel(activeVesselDrawer);
                  setActivePage('step-vessel-correlation');
                }}
                className="w-full bg-[#1976A8] text-white py-2 px-3 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Compare with Spill Incident</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
