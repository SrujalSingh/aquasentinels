import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  RefreshCw, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  ShieldAlert,
  Wind,
  Droplets,
  Thermometer,
  Zap
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Polyline, Circle, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useIncident } from '../context/IncidentContext';

const originIcon = L.divIcon({
  className: 'custom-origin-pin',
  html: `<div style="background-color: #E9A23B; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(233,162,59,0.9);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

export function DriftAnalysisWorkspace({ setActivePage }) {
  const { incident, driftModel, recalculateDriftModel, setDriftUncertaintyMode, showToast } = useIncident();

  const [hoursBack, setHoursBack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEnvCollapse, setShowEnvCollapse] = useState(true);

  // Layer Visibility Controls
  const [layers, setLayers] = useState({
    observedSlick: true,
    backtrackedSlick: true,
    releaseZone: true,
    oceanCurrent: true,
    wind: true,
    waveDirection: false,
    vesselTracks: false
  });

  // Time animation interval
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setHoursBack(prev => {
          if (prev >= 24) {
            setIsPlaying(false);
            return 24;
          }
          return prev + 3;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const timeSteps = [
    { label: "T - 0", hours: 0 },
    { label: "T - 3h", hours: 3 },
    { label: "T - 6h", hours: 6 },
    { label: "T - 9h", hours: 9 },
    { label: "T - 12h", hours: 12 },
    { label: "T - 15h", hours: 15 },
    { label: "T - 18h", hours: 18 },
    { label: "T - 21h", hours: 21 },
    { label: "T - 24h", hours: 24 }
  ];

  // Dynamic backtracked coordinates calculation based on hoursBack
  const latOffset = -(hoursBack * 0.0057);
  const lngOffset = -(hoursBack * 0.0095);

  const activeSlickCoords = [
    [18.930 + latOffset, 72.685 + lngOffset],
    [18.945 + latOffset, 72.710 + lngOffset],
    [18.925 + latOffset, 72.735 + lngOffset],
    [18.905 + latOffset, 72.705 + lngOffset],
    [18.915 + latOffset, 72.680 + lngOffset]
  ];

  // Intermediate historical footprint positions (T-6h, T-12h, T-18h)
  const getFootprint = (stepHours) => {
    const lat = -(stepHours * 0.0057);
    const lng = -(stepHours * 0.0095);
    return [
      [18.930 + lat, 72.685 + lng],
      [18.945 + lat, 72.710 + lng],
      [18.925 + lat, 72.735 + lng],
      [18.905 + lat, 72.705 + lng],
      [18.915 + lat, 72.680 + lng]
    ];
  };

  const trajectoryPoints = [
    [18.9167, 72.7000],
    [18.9000, 72.6700],
    [18.8800, 72.6400],
    [18.8550, 72.6000],
    [18.8250, 72.5500],
    [18.7800, 72.4700]
  ];

  const handleNextStep = () => {
    setActivePage('ais-tracking');
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
            <span className="text-slate-800 font-medium">Drift Analysis</span>
          </div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Drift Backtracking & Origin Estimation</h1>
          <p className="text-xs text-[#667085] mt-0.5">Reconstruct probable oil release position using historical marine conditions</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDriftUncertaintyMode(!driftModel.showUncertainty)}
            className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
              driftModel.showUncertainty ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {driftModel.showUncertainty ? 'Hide 95% Search Zone' : 'Show Uncertainty'}
          </button>

          <button
            disabled={driftModel.isCalculating}
            onClick={recalculateDriftModel}
            className="bg-[#1976A8] hover:bg-[#166794] text-white px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${driftModel.isCalculating ? 'animate-spin' : ''}`} />
            <span>{driftModel.isCalculating ? 'Running drift reconstruction...' : 'Recalculate Model'}</span>
          </button>
        </div>
      </div>

      {/* Main 75% Map / 25% Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Workspace (Hero Element 75% = 9 Cols on lg) */}
        <div className="lg:col-span-9 bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm flex flex-col justify-between space-y-3 relative">
          {/* Floating Layer Controls Badge */}
          <div className="absolute top-6 right-6 z-[1000] bg-white/95 backdrop-blur-sm border border-[#E3E8EF] rounded-md shadow-md p-3 text-xs space-y-2 min-w-[200px]">
            <div className="flex items-center justify-between font-bold text-[#172033] border-b border-slate-100 pb-1.5">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[#1976A8]" /> Map Layers</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={layers.observedSlick} onChange={(e) => setLayers({...layers, observedSlick: e.target.checked})} className="accent-[#E85D68]" /> Observed Slick (Red)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={layers.backtrackedSlick} onChange={(e) => setLayers({...layers, backtrackedSlick: e.target.checked})} className="accent-[#1976A8]" /> Backtracked Trajectory (Blue)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={layers.releaseZone} onChange={(e) => setLayers({...layers, releaseZone: e.target.checked})} className="accent-[#E9A23B]" /> Release Zone (Amber)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={layers.oceanCurrent} onChange={(e) => setLayers({...layers, oceanCurrent: e.target.checked})} className="accent-[#0F9D8A]" /> Ocean Current Vectors (Teal)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={layers.wind} onChange={(e) => setLayers({...layers, wind: e.target.checked})} className="accent-[#667085]" /> Surface Wind (Muted Blue)
              </label>
            </div>
          </div>

          {/* Leaflet Map Hero Workspace */}
          <div className="h-[480px] rounded border border-slate-200 overflow-hidden relative">
            <MapContainer
              center={[18.8800, 72.6400]}
              zoom={11}
              zoomControl={false}
              className="w-full h-full min-h-[480px]"
            >
              <TileLayer
                attribution='&copy; Esri &mdash; GEBCO, NOAA, CHS, Natural Earth'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}"
              />

              {/* 1. Backtrack Trajectory Line (Blue) */}
              {layers.backtrackedSlick && (
                <Polyline
                  positions={trajectoryPoints}
                  pathOptions={{ color: '#1976A8', weight: 3, dashArray: '6, 8', opacity: 0.85 }}
                />
              )}

              {/* 2. Intermediate Footprints (Lighter Red) */}
              {layers.observedSlick && (
                <>
                  <Polygon positions={getFootprint(6)} pathOptions={{ color: '#E85D68', fillColor: '#E85D68', fillOpacity: 0.2, weight: 1 }} />
                  <Polygon positions={getFootprint(12)} pathOptions={{ color: '#E85D68', fillColor: '#E85D68', fillOpacity: 0.15, weight: 1 }} />
                  <Polygon positions={getFootprint(18)} pathOptions={{ color: '#E85D68', fillColor: '#E85D68', fillOpacity: 0.1, weight: 1 }} />
                </>
              )}

              {/* 3. Probable Release Zone (Amber Circle) */}
              {layers.releaseZone && (
                <Circle
                  center={[18.8800, 72.6400]}
                  radius={3400}
                  pathOptions={{ color: '#E9A23B', fillColor: '#E9A23B', fillOpacity: 0.25, weight: 2, dashArray: '4, 4' }}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-extrabold text-amber-900">PROBABLE RELEASE ORIGIN ZONE</div>
                      <div>Window: <span className="font-semibold text-slate-800">{driftModel.releaseWindow}</span></div>
                      <div>Radius: <span className="font-semibold text-slate-800">3.4 km</span></div>
                      <div>Confidence: <span className="font-bold text-emerald-700">82%</span></div>
                    </div>
                  </Popup>
                </Circle>
              )}

              {/* 95% Search Zone Translucent Ellipse (If toggled) */}
              {driftModel.showUncertainty && (
                <Circle
                  center={[18.8800, 72.6400]}
                  radius={7500}
                  pathOptions={{ color: '#E9A23B', fillColor: '#E9A23B', fillOpacity: 0.12, weight: 1, dashArray: '2, 6' }}
                >
                  <Popup>
                    <div className="text-xs font-bold text-amber-900">95% Model Search Zone (7.5 km extended radius)</div>
                  </Popup>
                </Circle>
              )}

              {/* Origin Marker */}
              <Marker position={[18.8800, 72.6400]} icon={originIcon}>
                <Popup>
                  <div className="text-xs font-bold text-amber-900">Probable Origin Centroid (18°55'N, 72°42'E)</div>
                </Popup>
              </Marker>

              {/* Active Backtracked Slick Polygon */}
              <Polygon
                positions={activeSlickCoords}
                pathOptions={{
                  color: hoursBack === 0 ? '#E85D68' : '#1976A8',
                  fillColor: hoursBack === 0 ? '#E85D68' : '#1976A8',
                  fillOpacity: 0.55,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-slate-900">
                      {hoursBack === 0 ? 'Observed Slick (T-0)' : `Backtracked Position (T - ${hoursBack}h)`}
                    </div>
                  </div>
                </Popup>
              </Polygon>
            </MapContainer>
          </div>

          {/* Bottom Interactive Timeline Slider & Replay Animation */}
          <div className="bg-[#F8FAFC] border border-[#E3E8EF] rounded-md p-3 shadow-inner space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#172033]">Observation Time Backtrack:</span>
                <span className="text-xs bg-[#EBF3F8] text-[#1976A8] font-bold px-2 py-0.5 rounded border border-sky-200">
                  T - {hoursBack}h
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-[#1976A8] hover:bg-[#166794] text-white px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : '▶ Replay Backtrack'}</span>
                </button>
                <button
                  onClick={() => setHoursBack(0)}
                  className="p-1 text-slate-500 hover:text-slate-800"
                  title="Reset to T-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="24"
              step="3"
              value={hoursBack}
              onChange={(e) => setHoursBack(Number(e.target.value))}
              className="w-full accent-[#1976A8] cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-[#667085]">
              {timeSteps.map(step => (
                <button
                  key={step.hours}
                  onClick={() => setHoursBack(step.hours)}
                  className={`hover:text-[#1976A8] transition-colors ${hoursBack === step.hours ? 'font-extrabold text-[#1976A8]' : ''}`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: 25% Analysis Panel (3 Cols on lg) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Backtracking Result Card */}
          <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
              Backtracking Result
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
                <div className="text-[11px] font-medium text-amber-800">Estimated Release Window</div>
                <div className="text-xs font-bold text-amber-950 mt-0.5">{driftModel.releaseWindow}</div>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Probable Release Position:</span>
                <span className="font-mono font-bold text-slate-800">{driftModel.probableOrigin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Uncertainty Radius:</span>
                <span className="font-semibold text-slate-800">{driftModel.uncertaintyRadius} km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Model Confidence:</span>
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {driftModel.modelConfidence}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Elapsed Drift:</span>
                <span className="font-medium text-slate-800">{driftModel.elapsedDrift}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Estimated Drift Distance:</span>
                <span className="font-semibold text-slate-800">{driftModel.driftDistance}</span>
              </div>
            </div>
          </div>

          {/* Collapsible Environmental Inputs Panel */}
          <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-3">
            <button
              onClick={() => setShowEnvCollapse(!showEnvCollapse)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2"
            >
              <span>Environmental Inputs</span>
              {showEnvCollapse ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showEnvCollapse && (
              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Ocean Current:</span>
                  <span className="font-semibold text-[#1976A8]">{driftModel.currentVelocity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Wind Velocity:</span>
                  <span className="font-semibold text-slate-800">{driftModel.windVelocity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Wave Height:</span>
                  <span className="font-medium text-slate-800">{driftModel.waveHeight}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Sea Surface Temp:</span>
                  <span className="font-medium text-slate-800">{driftModel.seaTemp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Windage Coefficient:</span>
                  <span className="font-medium text-slate-800">3%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Diffusion Rate:</span>
                  <span className="font-medium text-slate-800">0.8 m²/s</span>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div>Current Source: <span className="font-medium text-slate-700">Copernicus Marine API</span></div>
                  <div>Wind Source: <span className="font-medium text-slate-700">ERA5 Reanalysis Assimilation</span></div>
                  <div>Wave Source: <span className="font-medium text-slate-700">WaveWatch III Model</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleNextStep}
            className="w-full bg-[#1976A8] hover:bg-[#166794] text-white py-3 px-4 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Search Historical AIS in Release Zone</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
