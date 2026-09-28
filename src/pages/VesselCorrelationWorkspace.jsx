import React, { useState } from 'react';
import { 
  GitCommit, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  Download, 
  Search, 
  Layers, 
  X, 
  CheckCircle2, 
  FileText,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { MapContainer, TileLayer, Circle, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useIncident } from '../context/IncidentContext';

const approachIcon = L.divIcon({
  className: 'custom-approach-pin',
  html: `<div style="background-color: #E85D68; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(232,93,104,0.9);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

export function VesselCorrelationWorkspace({ setActivePage, selectedVesselProp }) {
  const { 
    incident, 
    aisData, 
    addEvidenceItem, 
    markVesselUnderInvestigation, 
    showToast 
  } = useIncident();

  const [selectedVessel, setSelectedVessel] = useState(
    selectedVesselProp || aisData.candidateVessels[0]
  );
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Normalized Factor Calculation (30% Spatial + 25% Temporal + 20% Trajectory + 10% Type + 15% AIS)
  const calcSpatial = selectedVessel.id === 'v-01' ? 94 : selectedVessel.id === 'v-02' ? 78 : selectedVessel.id === 'v-03' ? 68 : 45;
  const calcTemporal = selectedVessel.id === 'v-01' ? 88 : selectedVessel.id === 'v-02' ? 74 : selectedVessel.id === 'v-03' ? 62 : 40;
  const calcTrajectory = selectedVessel.id === 'v-01' ? 91 : selectedVessel.id === 'v-02' ? 70 : selectedVessel.id === 'v-03' ? 65 : 42;
  const calcType = selectedVessel.id === 'v-01' ? 82 : selectedVessel.id === 'v-02' ? 55 : selectedVessel.id === 'v-03' ? 78 : 20;
  const calcAis = selectedVessel.id === 'v-01' ? 78 : selectedVessel.id === 'v-02' ? 95 : selectedVessel.id === 'v-03' ? 80 : 90;

  const calculatedScore = Math.round(
    calcSpatial * 0.30 +
    calcTemporal * 0.25 +
    calcTrajectory * 0.20 +
    calcType * 0.10 +
    calcAis * 0.15
  );

  const handleAddToEvidence = () => {
    addEvidenceItem({
      type: "AIS Track Log",
      source: `AIS Hub — ${selectedVessel.name}`,
      vesselName: selectedVessel.name,
      notes: `Verified AIS trajectory log for ${selectedVessel.name} (MMSI ${selectedVessel.mmsi}) passing ${selectedVessel.closestDistance} from release centroid.`
    });
  };

  const handleMarkForInvestigation = () => {
    markVesselUnderInvestigation(selectedVessel.name);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8EF]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
            <span>Incident</span>
            <span>/</span>
            <span className="font-semibold text-[#1976A8]">{incident.id}</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">Vessel Correlation</span>
          </div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Vessel Correlation Analysis</h1>
          <p className="text-xs text-[#667085] mt-0.5">Compare candidate vessels using spill origin, timing, trajectory, and AIS behaviour</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCompareModal(true)}
            className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
          >
            Compare Candidates
          </button>
          <button
            onClick={() => setActivePage('reports')}
            className="bg-[#1976A8] hover:bg-[#166794] text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Main 68% Left Map & Breakdown / 32% Right Ranking Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 68% Map & Detailed Breakdown */}
        <div className="lg:col-span-8 space-y-5">
          {/* Correlation Map */}
          <div className="bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Geospatial Correlation Map — {selectedVessel.name}
              </h2>
              <span className="text-xs text-[#667085]">Closest Approach: <strong className="text-red-600 font-bold">{selectedVessel.closestDistance}</strong> at 22:42 UTC</span>
            </div>

            <div className="h-[380px] rounded border border-slate-200 overflow-hidden relative">
              <MapContainer
                center={[18.8800, 72.6400]}
                zoom={11}
                zoomControl={false}
                className="w-full h-full min-h-[380px]"
              >
                <TileLayer
                  attribution='&copy; Esri &mdash; GEBCO, NOAA, CHS, Natural Earth'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}"
                />

                {/* Release Origin Zone */}
                <Circle
                  center={[18.8800, 72.6400]}
                  radius={3400}
                  pathOptions={{ color: '#E9A23B', fillColor: '#E9A23B', fillOpacity: 0.25, weight: 2, dashArray: '4, 4' }}
                />

                {/* Vessel Tracks (Highlights selected vessel) */}
                {aisData.candidateVessels.map(v => {
                  const isSel = selectedVessel.id === v.id;
                  const points = v.trackCoords.map(c => [c.lat, c.lng]);
                  return (
                    <Polyline
                      key={v.id}
                      positions={points}
                      pathOptions={{
                        color: isSel ? '#E85D68' : '#667085',
                        weight: isSel ? 4 : 1.5,
                        opacity: isSel ? 1 : 0.25,
                        dashArray: v.name === "MV OCEAN CREST" && isSel ? '4, 4' : null
                      }}
                    />
                  );
                })}

                {/* Closest Approach Point Marker */}
                <Marker position={[18.8900, 72.6800]} icon={approachIcon}>
                  <Popup>
                    <div className="text-xs font-bold text-slate-900">
                      {selectedVessel.name}<br />
                      Closest Approach: {selectedVessel.closestDistance} at 22:42 UTC
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Detailed Correlation Breakdown Card */}
          <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Correlation Score Breakdown ({selectedVessel.name})
              </h3>
              <span className="text-sm font-extrabold text-red-600 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                Overall: {calculatedScore}%
              </span>
            </div>

            {/* Horizontal Factor Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Spatial Proximity (30% weight)</span>
                  <span className="text-[#1976A8]">{calcSpatial}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1976A8] h-full" style={{ width: `${calcSpatial}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Temporal Match (25% weight)</span>
                  <span className="text-[#1976A8]">{calcTemporal}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1976A8] h-full" style={{ width: `${calcTemporal}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Trajectory Intersection (20% weight)</span>
                  <span className="text-[#1976A8]">{calcTrajectory}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1976A8] h-full" style={{ width: `${calcTrajectory}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Vessel Type Relevance (10% weight)</span>
                  <span className="text-[#1976A8]">{calcType}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1976A8] h-full" style={{ width: `${calcType}%` }}></div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>AIS Transmission Behaviour (15% weight)</span>
                  <span className="text-[#1976A8]">{calcAis}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1976A8] h-full" style={{ width: `${calcAis}%` }}></div>
                </div>
              </div>
            </div>

            {/* Why Shortlisted Explanation */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-[#172033] block">Why was this vessel shortlisted?</span>
              <ul className="space-y-1 text-slate-700 list-disc list-inside leading-relaxed text-[11px]">
                <li>Vessel entered the estimated release uncertainty zone during target timeframe.</li>
                <li>Closest approach was <strong className="text-slate-900">{selectedVessel.closestDistance}</strong> from predicted release centroid.</li>
                <li>Passage occurred within 18 minutes of estimated release window (26 Sep 22:10–23:40 UTC).</li>
                <li>Vessel navigation route directly intersected reconstructed slick backtrack trajectory.</li>
                <li>Vessel classification ({selectedVessel.vesselType}) is compatible with petroleum transport.</li>
                {selectedVessel.name === "MV OCEAN CREST" && (
                  <li className="text-amber-900 font-semibold">A 16-minute AIS data gap (22:31–22:47 UTC) exists near the estimated release window.</li>
                )}
              </ul>

              {/* Crucial Legal Responsibility Warning Box */}
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-950 font-medium">
                ⚠️ <strong>Important Investigation Notice:</strong> This correlation score does not establish legal responsibility. Results are intended to prioritize further investigation by authorized Coast Guard officers.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 32% Candidate Ranking Panel */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Candidate Vessels</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Ranked by multi-factor correlation model</p>
            </div>

            <div className="space-y-3">
              {aisData.candidateVessels.map(vessel => {
                const isSelected = selectedVessel.id === vessel.id;
                return (
                  <div
                    key={vessel.id}
                    onClick={() => setSelectedVessel(vessel)}
                    className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1976A8] bg-sky-50/70 shadow-sm'
                        : 'border-[#E3E8EF] bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{vessel.name}</span>
                      <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {vessel.correlationScore}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex justify-between font-medium">
                      <span>{vessel.vesselType}</span>
                      <span>MMSI: {vessel.mmsi}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div>Closest: <strong className="text-slate-900">{vessel.closestDistance}</strong></div>
                      <div>Offset: <strong className="text-slate-900">{vessel.timeDifference || '18 min'}</strong></div>
                      <div>AIS Gap: <strong className={vessel.aisStatusSeverity === 'warning' ? 'text-amber-700' : 'text-slate-700'}>{vessel.aisStatus.includes('Gap') ? '16 min' : 'None'}</strong></div>
                      <div>Priority: <strong className={vessel.correlationScore > 80 ? 'text-red-600' : 'text-slate-700'}>{vessel.correlationScore > 80 ? 'High' : 'Medium'}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Investigation Actions */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={handleAddToEvidence}
                className="w-full bg-[#1976A8] hover:bg-[#166794] text-white py-2 px-3 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Add to Evidence Repository</span>
              </button>

              <button
                onClick={handleMarkForInvestigation}
                className="w-full bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 py-2 px-3 rounded text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#1976A8]" />
                <span>Mark for Investigation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E3E8EF] rounded-lg shadow-xl max-w-4xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Candidate Vessel Comparison Matrix</h3>
                <p className="text-xs text-slate-500">Side-by-side metric comparison across all 4 candidate vessels</p>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto border border-[#E3E8EF] rounded-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E3E8EF] text-[#667085] font-semibold">
                  <tr>
                    <th className="p-2.5">Metric</th>
                    <th className="p-2.5 text-[#1976A8]">MV Ocean Crest</th>
                    <th className="p-2.5">Sea Pioneer</th>
                    <th className="p-2.5">Arabian Meridian</th>
                    <th className="p-2.5">Western Star</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8EF] text-[#172033]">
                  <tr>
                    <td className="p-2.5 font-medium text-slate-500">Vessel Type</td>
                    <td className="p-2.5 font-bold">Oil Tanker</td>
                    <td className="p-2.5 font-medium">Cargo Vessel</td>
                    <td className="p-2.5 font-medium">Product Tanker</td>
                    <td className="p-2.5 font-medium">Bulk Carrier</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-500">Closest Approach</td>
                    <td className="p-2.5 font-bold text-red-600">0.8 NM</td>
                    <td className="p-2.5 font-medium">2.1 NM</td>
                    <td className="p-2.5 font-medium">3.0 NM</td>
                    <td className="p-2.5 font-medium">7.2 NM</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-500">Time Offset</td>
                    <td className="p-2.5 font-bold text-red-600">18 min</td>
                    <td className="p-2.5 font-medium">31 min</td>
                    <td className="p-2.5 font-medium">42 min</td>
                    <td className="p-2.5 font-medium">110 min</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-500">Route Intersection</td>
                    <td className="p-2.5 font-bold text-emerald-700">Direct Match</td>
                    <td className="p-2.5 font-medium">Parallel Passage</td>
                    <td className="p-2.5 font-medium">Partial Track</td>
                    <td className="p-2.5 font-medium">Distant Passage</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-500">AIS Data Gap</td>
                    <td className="p-2.5 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">16-min Gap</td>
                    <td className="p-2.5 font-medium text-slate-600">Continuous</td>
                    <td className="p-2.5 font-medium text-slate-600">Continuous</td>
                    <td className="p-2.5 font-medium text-slate-600">Continuous</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-500">Spatial Score</td>
                    <td className="p-2.5 font-bold">94%</td>
                    <td className="p-2.5 font-medium">78%</td>
                    <td className="p-2.5 font-medium">68%</td>
                    <td className="p-2.5 font-medium">45%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-slate-500">Temporal Score</td>
                    <td className="p-2.5 font-bold">88%</td>
                    <td className="p-2.5 font-medium">74%</td>
                    <td className="p-2.5 font-medium">62%</td>
                    <td className="p-2.5 font-medium">40%</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2.5 text-slate-900">Overall Correlation</td>
                    <td className="p-2.5 text-red-600 text-sm">89%</td>
                    <td className="p-2.5 text-slate-700">72%</td>
                    <td className="p-2.5 text-slate-700">64%</td>
                    <td className="p-2.5 text-slate-700">43%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
