import React, { useState } from 'react';
import { FileText, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MOCK_INCIDENTS, MOCK_CANDIDATE_VESSELS, MOCK_EVIDENCE } from '../data/mockData';

export function ReportGenerator({ incidentId }) {
  const incident = MOCK_INCIDENTS.find(i => i.id === incidentId) || MOCK_INCIDENTS[0];
  const topCandidate = MOCK_CANDIDATE_VESSELS[0];

  const [authority, setAuthority] = useState('Indian Coast Guard / Directorate General of Shipping');
  const [reportType, setReportType] = useState('Formal Investigation Incident Report');
  const [analystName, setAnalystName] = useState('Cmdr. R. Sharma (Senior Maritime Analyst)');
  const [executiveSummary, setExecutiveSummary] = useState(
    `On 27 September 2026 at 03:42 UTC, a Synthetic Aperture Radar (SAR) scene acquired by Sentinel-1 detected a major dark slick anomaly measuring 3.82 km² in the Arabian Sea (Maharashtra Offshore Basin). Automated hydrodynamic drift backtracking identified an estimated release origin centroid at 18°55'N, 72°42'E occurring between 22:10 and 23:40 UTC on 26 September 2026. Query of historical terrestrial and satellite AIS trajectory data shortlisted 4 candidate vessels. MV OCEAN CREST (Crude Oil Tanker, MMSI 419001234) exhibited an overall correlation score of 89%, passing 0.8 NM from the origin centroid with a concurrent 16-minute AIS transmission gap.`
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Controls Bar (No Print) */}
      <div className="no-print bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E8EF] pb-3">
          <div>
            <h1 className="text-xl font-bold text-[#172033]">Incident Investigation Report Generator</h1>
            <p className="text-xs text-[#667085]">Generate official, court-ready maritime spill assessment dossier</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#1976A8] hover:bg-[#166794] text-white px-4 py-2 rounded text-xs font-bold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF / Print Dossier</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-500 block font-medium mb-1">Target Authority</label>
            <input
              type="text"
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded px-3 py-1.5 text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="text-slate-500 block font-medium mb-1">Report Classification</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded px-3 py-1.5 text-xs text-slate-800"
            >
              <option value="Preliminary Investigation Report">Preliminary Investigation Report</option>
              <option value="Formal Investigation Incident Report">Formal Investigation Incident Report</option>
              <option value="Court Evidence Dossier">Court Evidence Dossier</option>
            </select>
          </div>
          <div>
            <label className="text-slate-500 block font-medium mb-1">Investigating Analyst</label>
            <input
              type="text"
              value={analystName}
              onChange={(e) => setAnalystName(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded px-3 py-1.5 text-xs text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Official Printed Report Document Preview */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-8 shadow-md space-y-6 text-xs text-slate-800 leading-relaxed font-sans">
        {/* Government Letterhead Header */}
        <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-extrabold text-[#172033] uppercase tracking-wider">
              GOVERNMENT OF INDIA — MARITIME INVESTIGATION AUTHORITY
            </div>
            <div className="text-[11px] font-semibold text-slate-600">
              NATIONAL SPILL DISPERSION & CORRELATION PLATFORM (AquaSentinels)
            </div>
          </div>
          <div className="text-right space-y-0.5 text-[11px]">
            <div className="font-mono font-bold text-[#1976A8]">{incident.id}</div>
            <div className="text-slate-500">Date: 27 Sep 2026</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{reportType}</h2>
          <p className="text-[11px] text-slate-600 font-medium">Incident Reference: {incident.id} — {incident.region}</p>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            1. Executive Summary
          </h3>
          <p className="text-justify text-slate-700 leading-normal">
            {executiveSummary}
          </p>
        </div>

        {/* Satellite Detection & Spill Geometry */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            2. Satellite Detection & Geometry Matrix
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11px]">
            <div><span className="text-slate-500 block">Satellite Sensor:</span> <strong>{incident.satelliteSource}</strong></div>
            <div><span className="text-slate-500 block">Slick Surface Area:</span> <strong className="text-red-600">{incident.estimatedArea}</strong></div>
            <div><span className="text-slate-500 block">Estimated Volume:</span> <strong>{incident.estimatedVolume}</strong></div>
            <div><span className="text-slate-500 block">Detection Confidence:</span> <strong className="text-emerald-700">{incident.confidence}</strong></div>
          </div>
        </div>

        {/* Hydrodynamic Drift Model Results */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            3. Hydrodynamic Drift Backtracking & Estimated Origin
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11px]">
            <div><span className="text-slate-500 block">Estimated Release Window:</span> <strong>{incident.driftModel.releaseWindow}</strong></div>
            <div><span className="text-slate-500 block">Origin Coordinates:</span> <strong className="font-mono">{incident.driftModel.probableOrigin}</strong></div>
            <div><span className="text-slate-500 block">Uncertainty Radius:</span> <strong>{incident.driftModel.uncertaintyRadius}</strong></div>
            <div><span className="text-slate-500 block">Backtrack Model Confidence:</span> <strong className="text-teal-700">{incident.driftModel.modelConfidence}</strong></div>
          </div>
        </div>

        {/* Candidate Vessel Analysis */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            4. High-Priority Candidate Vessel Evaluation
          </h3>
          <table className="w-full text-left border border-slate-200 text-[11px]">
            <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-2">Vessel Name</th>
                <th className="p-2">IMO / MMSI</th>
                <th className="p-2">Type / Flag</th>
                <th className="p-2">Closest Approach</th>
                <th className="p-2">AIS Anomaly Status</th>
                <th className="p-2 text-right">Correlation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {MOCK_CANDIDATE_VESSELS.map(v => (
                <tr key={v.id}>
                  <td className="p-2 font-bold text-slate-900">{v.name}</td>
                  <td className="p-2 font-mono text-slate-600">{v.imo} / {v.mmsi}</td>
                  <td className="p-2 text-slate-600">{v.vesselType} ({v.flag.split(' ')[0]})</td>
                  <td className="p-2 font-medium">{v.closestDistance}</td>
                  <td className="p-2 font-semibold text-amber-800">{v.aisStatus}</td>
                  <td className="p-2 text-right font-extrabold text-red-600">{v.correlationScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cryptographic Hashes */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            5. Evidence Cryptographic Integrity Hashes
          </h3>
          <div className="space-y-1 text-[10px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
            {MOCK_EVIDENCE.map(ev => (
              <div key={ev.id} className="flex justify-between">
                <span>{ev.id} ({ev.type}):</span>
                <span className="text-slate-800 font-semibold">{ev.hash}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Block */}
        <div className="pt-8 flex justify-between items-end border-t border-slate-200">
          <div>
            <div className="text-[11px] text-slate-500">Document Security Status:</div>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-4 h-4" /> Digitally Signed & Encrypted Audit Trail
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="h-10 w-40 border-b border-slate-400 ml-auto"></div>
            <div className="font-bold text-slate-900">{analystName}</div>
            <div className="text-[10px] text-slate-500">{authority}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
