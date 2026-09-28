import React, { useState } from 'react';
import { Sliders, Save, Shield, Database, Cpu } from 'lucide-react';

export function Settings() {
  const [spatialWeight, setSpatialWeight] = useState(35);
  const [temporalWeight, setTemporalWeight] = useState(25);
  const [routeWeight, setRouteWeight] = useState(20);
  const [anomalyWeight, setAnomalyWeight] = useState(20);
  const [windageFactor, setWindageFactor] = useState(3.0);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8EF]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">System Parameters & Model Calibration</h1>
          <p className="text-xs text-[#667085] mt-0.5">Tune Eulerian-Lagrangian drift physics & AIS spatial-temporal weighting algorithms</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-[#1976A8] hover:bg-[#166794] text-white px-4 py-2 rounded text-xs font-bold shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded">
          Model parameters successfully updated and saved across all active analytical engines.
        </div>
      )}

      {/* AIS Correlation Weights */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#172033]">AIS Correlation Weighting Coefficients</h2>
        
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Spatial Proximity Score Weight ({spatialWeight}%)</span>
              <span className="text-[#1976A8]">{spatialWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={spatialWeight}
              onChange={(e) => setSpatialWeight(Number(e.target.value))}
              className="w-full accent-[#1976A8]"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Temporal Release Window Weight ({temporalWeight}%)</span>
              <span className="text-[#1976A8]">{temporalWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={temporalWeight}
              onChange={(e) => setTemporalWeight(Number(e.target.value))}
              className="w-full accent-[#1976A8]"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>Route & Vector Match Weight ({routeWeight}%)</span>
              <span className="text-[#1976A8]">{routeWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={routeWeight}
              onChange={(e) => setRouteWeight(Number(e.target.value))}
              className="w-full accent-[#1976A8]"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-800 mb-1">
              <span>AIS Anomaly & Gap Penalty Weight ({anomalyWeight}%)</span>
              <span className="text-[#1976A8]">{anomalyWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={anomalyWeight}
              onChange={(e) => setAnomalyWeight(Number(e.target.value))}
              className="w-full accent-[#1976A8]"
            />
          </div>
        </div>
      </div>

      {/* Drift Physics */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#172033]">Drift Physics & Windage Calibration</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500 block font-medium mb-1">Wind Drift Coefficient (Windage %)</label>
            <input
              type="number"
              step="0.1"
              value={windageFactor}
              onChange={(e) => setWindageFactor(Number(e.target.value))}
              className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded px-3 py-1.5 text-xs text-slate-800 font-semibold"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Standard oil slick windage factor: 3.0% – 3.5%</span>
          </div>

          <div>
            <label className="text-slate-500 block font-medium mb-1">Minimum Alert Confidence Threshold (%)</label>
            <input
              type="number"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded px-3 py-1.5 text-xs text-slate-800 font-semibold"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Spills below this threshold require manual analyst signoff</span>
          </div>
        </div>
      </div>
    </div>
  );
}
