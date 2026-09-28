import React, { useState } from 'react';
import { 
  FileText, 
  Satellite, 
  Compass, 
  Radio, 
  FileCheck, 
  Clock, 
  Download, 
  ChevronRight, 
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { SatelliteMap } from '../components/maps/SatelliteMap';
import { DriftMap } from '../components/maps/DriftMap';
import { AISMap } from '../components/maps/AISMap';
import { 
  MOCK_INCIDENTS, 
  MOCK_CANDIDATE_VESSELS, 
  MOCK_EVIDENCE, 
  MOCK_TIMELINE 
} from '../data/mockData';

export function IncidentDetail({ incidentId, setActivePage, setSelectedVessel }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [hoursBack, setHoursBack] = useState(0);

  const incident = MOCK_INCIDENTS.find(i => i.id === incidentId) || MOCK_INCIDENTS[0];
  const candidateVessels = MOCK_CANDIDATE_VESSELS;

  const tabs = [
    { id: 'Overview', label: 'Overview', icon: FileText },
    { id: 'Satellite Evidence', label: 'Satellite Evidence', icon: Satellite },
    { id: 'Drift Analysis', label: 'Drift Analysis', icon: Compass },
    { id: 'AIS Correlation', label: 'AIS Correlation', icon: Radio },
    { id: 'Evidence', label: 'Evidence Repository', icon: FileCheck },
    { id: 'Timeline', label: 'Investigation Timeline', icon: Clock },
    { id: 'Report', label: 'Report Generator', icon: FileText }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Incident Summary Banner */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E8EF] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[#172033] tracking-tight">{incident.id}</h1>
              <StatusBadge status={incident.status} size="sm" />
              <StatusBadge status={incident.priority} size="sm" />
            </div>
            <p className="text-xs text-[#667085] mt-1 font-medium">{incident.name} — {incident.region}</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActivePage('reports')}
              className="inline-flex items-center gap-1.5 bg-[#1976A8] hover:bg-[#166794] text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Official Report</span>
            </button>
          </div>
        </div>

        {/* Quick Data Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#667085] block text-[11px]">Detected Timestamp</span>
            <span className="font-semibold text-[#172033]">{incident.date} · {incident.time}</span>
          </div>
          <div>
            <span className="text-[#667085] block text-[11px]">Slick Footprint Area</span>
            <span className="font-semibold text-red-600">{incident.estimatedArea}</span>
          </div>
          <div>
            <span className="text-[#667085] block text-[11px]">Estimated Release Window</span>
            <span className="font-semibold text-amber-700">{incident.driftModel.releaseWindow}</span>
          </div>
          <div>
            <span className="text-[#667085] block text-[11px]">Top Candidate Vessel</span>
            <span className="font-semibold text-[#1976A8]">{incident.topCandidate} ({incident.highestCorrelation})</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#E3E8EF] flex items-center gap-1 overflow-x-auto bg-white rounded-t-lg px-2 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-[#1976A8] text-[#1976A8] bg-[#F6F8FB]'
                  : 'border-transparent text-[#667085] hover:text-[#172033] hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#1976A8]' : 'text-[#98A2B3]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Detection Summary Card */}
            <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Detection Summary</h3>
                <Satellite className="w-4 h-4 text-[#1976A8]" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Satellite Source:</span>
                  <span className="font-semibold text-slate-800">{incident.satelliteSource}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Slick Area:</span>
                  <span className="font-semibold text-red-600">{incident.estimatedArea}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Estimated Volume:</span>
                  <span className="font-medium text-slate-800">{incident.estimatedVolume}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Detection Confidence:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {incident.confidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Drift Summary Card */}
            <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Drift Summary</h3>
                <Compass className="w-4 h-4 text-[#0F9D8A]" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Estimated Release:</span>
                  <span className="font-medium text-amber-800">{incident.driftModel.releaseWindow}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Origin Uncertainty:</span>
                  <span className="font-semibold text-slate-800">{incident.driftModel.uncertaintyRadius}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Origin Coordinates:</span>
                  <span className="font-mono text-slate-800">{incident.driftModel.probableOrigin}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Model Confidence:</span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    {incident.driftModel.modelConfidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Vessel Summary Card */}
            <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Vessel AIS Summary</h3>
                <Radio className="w-4 h-4 text-[#E85D68]" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Candidates Evaluated:</span>
                  <span className="font-semibold text-slate-800">{incident.candidateCount} Vessels</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Highest Correlation:</span>
                  <span className="font-bold text-[#1976A8]">{incident.topCandidate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Correlation Score:</span>
                  <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                    {incident.highestCorrelation}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">AIS Anomaly Status:</span>
                  <span className="font-semibold text-amber-700">Gap Detected (16m)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Map Workspace */}
          <div className="bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#172033]">Incident Geospatial Overview</h3>
              <span className="text-xs text-[#667085]">Observed Slick & Vessel Intersection Zone</span>
            </div>
            <div className="h-[420px] rounded border border-slate-200 overflow-hidden">
              <AISMap 
                candidateVessels={candidateVessels}
                selectedVessel={candidateVessels[0]}
                setSelectedVessel={(v) => {
                  setSelectedVessel(v);
                  setActivePage('step-vessel-correlation');
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SATELLITE EVIDENCE */}
      {activeTab === 'Satellite Evidence' && (
        <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Satellite Scenefootprint & Oil Spill Mask</h3>
              <p className="text-xs text-slate-500">{incident.sceneId}</p>
            </div>
            <button
              onClick={() => setActivePage('spill-detection')}
              className="text-xs font-bold bg-[#1976A8] text-white px-3 py-1.5 rounded hover:bg-[#166794]"
            >
              Open Full Detection Workspace →
            </button>
          </div>
          <div className="h-[480px]">
            <SatelliteMap slickCoords={null} compareMode={true} />
          </div>
        </div>
      )}

      {/* Tab 3: DRIFT ANALYSIS */}
      {activeTab === 'Drift Analysis' && (
        <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Hydrodynamic Drift Backtracking Engine</h3>
              <p className="text-xs text-slate-500">Reverse Eulerian-Lagrangian trajectory back to estimated release origin</p>
            </div>
            <button
              onClick={() => setActivePage('drift-analysis')}
              className="text-xs font-bold bg-[#1976A8] text-white px-3 py-1.5 rounded hover:bg-[#166794]"
            >
              Open Full Drift Workspace →
            </button>
          </div>
          <div className="h-[480px]">
            <DriftMap hoursBack={hoursBack} setHoursBack={setHoursBack} />
          </div>
        </div>
      )}

      {/* Tab 4: AIS CORRELATION */}
      {activeTab === 'AIS Correlation' && (
        <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Candidate Vessel Correlation Panel</h3>
              <p className="text-xs text-slate-500">Historical AIS trajectories passing within release origin ellipse</p>
            </div>
            <button
              onClick={() => {
                setSelectedVessel(candidateVessels[0]);
                setActivePage('vessel-correlation');
              }}
              className="text-xs font-bold bg-[#1976A8] text-white px-3 py-1.5 rounded hover:bg-[#166794]"
            >
              Open Full Vessel Correlation Workspace →
            </button>
          </div>
          <div className="h-[460px]">
            <AISMap 
              candidateVessels={candidateVessels}
              selectedVessel={candidateVessels[0]}
              setSelectedVessel={(v) => {
                setSelectedVessel(v);
                setActivePage('vessel-correlation');
              }}
            />
          </div>
        </div>
      )}

      {/* Tab 5: EVIDENCE */}
      {activeTab === 'Evidence' && (
        <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#172033]">Incident Evidence Package & Cryptographic Hashes</h3>
          <div className="overflow-x-auto border border-[#E3E8EF] rounded-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E3E8EF] text-[#667085] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Evidence ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Original Timestamp</th>
                  <th className="py-2.5 px-3">SHA-256 Checksum</th>
                  <th className="py-2.5 px-3">Analyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8EF] text-[#172033]">
                {MOCK_EVIDENCE.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-[#1976A8]">{ev.id}</td>
                    <td className="py-2.5 px-3 font-medium">{ev.type}</td>
                    <td className="py-2.5 px-3 text-slate-600">{ev.source}</td>
                    <td className="py-2.5 px-3 text-slate-500">{ev.originalTimestamp}</td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 truncate max-w-[140px]">{ev.hash}</td>
                    <td className="py-2.5 px-3 font-medium">{ev.analyst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: TIMELINE */}
      {activeTab === 'Timeline' && (
        <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#172033]">Investigation Audit Sequence</h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E3E8EF]">
            {MOCK_TIMELINE.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#1976A8] border-2 border-white ring-2 ring-sky-100"></div>
                <div className="text-xs font-mono text-slate-400 font-semibold">{item.time}</div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">{item.title}</div>
                <div className="text-xs text-slate-600 mt-0.5">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: REPORT */}
      {activeTab === 'Report' && (
        <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Incident Investigation Report Generator</h3>
              <p className="text-xs text-slate-500">Export verified court-ready incident documentation</p>
            </div>
            <button
              onClick={() => setActivePage('reports')}
              className="bg-[#1976A8] text-white px-4 py-2 rounded text-xs font-semibold"
            >
              Open Full Report Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
