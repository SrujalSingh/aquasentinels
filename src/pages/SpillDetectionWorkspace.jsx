import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  Move, 
  ZoomIn, 
  Square, 
  Edit3, 
  Ruler, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  Save, 
  Eye, 
  Undo, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus,
  HelpCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import { useIncident } from '../context/IncidentContext';
import { StatusBadge } from '../components/common/StatusBadge';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36]
});

export function SpillDetectionWorkspace({ setActivePage }) {
  const { incident, confirmDetection, updateBoundaryArea, showToast } = useIncident();

  const [compareMode, setCompareMode] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isEditing, setIsEditing] = useState(false);
  const [validationChoice, setValidationChoice] = useState(incident.validationStatus || 'Confirmed Oil Slick');
  const [notesText, setNotesText] = useState(incident.analystNotes || '');
  
  // Layer controls
  const [layers, setLayers] = useState({
    satelliteBase: true,
    detectedSlick: true,
    vesselPositions: true,
    windLayer: false,
    oceanCurrent: false
  });

  // Current editable slick polygon coords
  const [slickPoly, setSlickPoly] = useState([
    [18.930, 72.685],
    [18.945, 72.710],
    [18.925, 72.735],
    [18.905, 72.705],
    [18.915, 72.680]
  ]);

  const handleApplyBoundary = () => {
    // Dynamic mock area recalculation based on edit
    const newArea = (incident.estimatedArea - 0.08).toFixed(2);
    updateBoundaryArea(Number(newArea));
    setIsEditing(false);
    showToast(`Boundary updated! Calculated Area: ${newArea} km²`, 'success');
  };

  const handleConfirmAndContinue = () => {
    confirmDetection(validationChoice, notesText);
    setActivePage('drift-analysis');
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
            <span className="text-slate-800 font-medium">Spill Detection</span>
          </div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Oil Spill Detection Workspace</h1>
          <p className="text-xs text-[#667085] mt-0.5">Satellite imagery analysis and slick boundary verification</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              compareMode ? 'bg-[#1976A8] text-white border-[#1976A8]' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{compareMode ? 'Exit Comparison' : 'Compare Scene'}</span>
          </button>

          <button
            onClick={() => showToast("Detection analysis saved to evidence package", "success")}
            className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Analysis</span>
          </button>
        </div>
      </div>

      {/* Compact Information Strip */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-3 shadow-sm grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <span className="text-[#667085] block text-[11px] font-medium">Satellite Source</span>
          <span className="font-semibold text-[#172033]">{incident.satelliteSource}</span>
        </div>
        <div>
          <span className="text-[#667085] block text-[11px] font-medium">Acquired Timestamp</span>
          <span className="font-semibold text-[#172033]">{incident.date} · {incident.time}</span>
        </div>
        <div>
          <span className="text-[#667085] block text-[11px] font-medium">Scene Identification</span>
          <span className="font-mono font-semibold text-slate-800">{incident.sceneId}</span>
        </div>
        <div>
          <span className="text-[#667085] block text-[11px] font-medium">Sensor Resolution</span>
          <span className="font-semibold text-[#172033]">{incident.resolution}</span>
        </div>
        <div>
          <span className="text-[#667085] block text-[11px] font-medium">Processing Status</span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
            Detection Completed
          </span>
        </div>
      </div>

      {/* Main 70% Left / 30% Right Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 70% Satellite Imagery Analysis Workspace */}
        <div className="lg:col-span-8 bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm flex flex-col justify-between space-y-3">
          {/* Above Map Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-1">
              <button title="Pan Tool" className="p-1.5 rounded hover:bg-slate-100 text-slate-700"><Move className="w-4 h-4" /></button>
              <button title="Zoom Tool" className="p-1.5 rounded hover:bg-slate-100 text-slate-700"><ZoomIn className="w-4 h-4" /></button>
              <button title="Rectangle Bounding" className="p-1.5 rounded hover:bg-slate-100 text-slate-700"><Square className="w-4 h-4" /></button>
              <button title="Polygon Edit" onClick={() => setIsEditing(!isEditing)} className={`p-1.5 rounded ${isEditing ? 'bg-sky-100 text-[#1976A8]' : 'hover:bg-slate-100 text-slate-700'}`}>
                <Edit3 className="w-4 h-4" />
              </button>
              <button title="Distance Measure" className="p-1.5 rounded hover:bg-slate-100 text-slate-700"><Ruler className="w-4 h-4" /></button>
              <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
              <button onClick={() => setCompareMode(!compareMode)} className={`px-2 py-1 text-xs rounded border font-medium ${compareMode ? 'bg-[#1976A8] text-white' : 'bg-slate-50 text-slate-700'}`}>
                Before/After
              </button>
            </div>

            {/* Layer selector checkboxes */}
            <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={layers.detectedSlick} onChange={(e) => setLayers({...layers, detectedSlick: e.target.checked})} className="accent-[#E85D68]" /> Slick Overlay
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={layers.vesselPositions} onChange={(e) => setLayers({...layers, vesselPositions: e.target.checked})} className="accent-[#1976A8]" /> Vessels
              </label>
            </div>
          </div>

          {/* Polygon Editing Actions Bar (If enabled) */}
          {isEditing && (
            <div className="bg-sky-50 border border-sky-200 rounded p-2 text-xs flex items-center justify-between">
              <span className="font-semibold text-[#1976A8]">Polygon Boundary Edit Mode Active</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => showToast("Add point tool ready", "info")} className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Point
                </button>
                <button onClick={() => showToast("Remove point tool ready", "info")} className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-1">
                  <Minus className="w-3 h-3" /> Remove
                </button>
                <button onClick={handleApplyBoundary} className="px-3 py-0.5 bg-[#1976A8] text-white rounded font-bold hover:bg-[#166794]">
                  Apply Boundary
                </button>
              </div>
            </div>
          )}

          {/* Satellite Map Workspace */}
          <div className="h-[440px] rounded border border-slate-200 overflow-hidden relative">
            <MapContainer
              center={[18.9167, 72.7000]}
              zoom={12}
              zoomControl={false}
              className="w-full h-full min-h-[440px]"
            >
              <TileLayer
                attribution='&copy; Esri &mdash; GEBCO, NOAA, CHS, Natural Earth'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}"
              />

              {/* SAR Footprint Bounding Frame */}
              <Rectangle
                bounds={[[18.75, 72.50], [19.10, 72.90]]}
                pathOptions={{ color: '#1976A8', weight: 1, dashArray: '4, 4', fill: false }}
              />

              {/* Detected Dark Slick Polygon SLICK-087-A */}
              {layers.detectedSlick && (
                <Polygon
                  positions={slickPoly}
                  pathOptions={{
                    color: '#E85D68',
                    fillColor: '#E85D68',
                    fillOpacity: 0.45,
                    weight: isEditing ? 3 : 2,
                    dashArray: isEditing ? '2, 4' : null
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-extrabold text-red-700">SLICK-087-A</div>
                      <div>Area: <span className="font-bold text-slate-900">{incident.estimatedArea} km²</span></div>
                      <div>Confidence: <span className="font-bold text-emerald-700">92%</span></div>
                      <div>Detected: <span className="font-medium text-slate-700">03:42 UTC</span></div>
                    </div>
                  </Popup>
                </Polygon>
              )}

              {/* Centroid Marker */}
              <Marker position={[18.9167, 72.7000]} icon={defaultIcon}>
                <Popup>
                  <div className="text-xs font-bold text-slate-900">SLICK-087-A Centroid (18°55'N, 72°42'E)</div>
                </Popup>
              </Marker>
            </MapContainer>

            {/* Slick ID Badge */}
            <div className="absolute top-3 right-3 z-[1000] bg-white/95 border border-[#E3E8EF] rounded px-3 py-1.5 text-xs shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E85D68]"></span>
              <span className="font-bold text-[#172033]">SLICK-087-A</span>
              <span className="text-slate-400">|</span>
              <span className="text-red-600 font-semibold">{incident.estimatedArea} km²</span>
            </div>
          </div>

          {/* Interactive Before/After Split Comparison Control */}
          {compareMode && (
            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
              <div className="flex justify-between items-center font-semibold text-slate-800">
                <span className="text-slate-600">Previous Scene (26 Sep 03:39 UTC) — Clean Baseline</span>
                <span className="text-[#1976A8]">Current Scene (27 Sep 03:42 UTC) — Slick Detected</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="w-full accent-[#1976A8] cursor-pointer"
              />
              <div className="text-[11px] text-slate-500 text-center font-medium">
                Baseline Opacity Blend: {sliderPosition}%
              </div>
            </div>
          )}
        </div>

        {/* Right Side: 30% Detection Analysis & Analyst Validation */}
        <div className="lg:col-span-4 space-y-5">
          {/* Detection Analysis Panel */}
          <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
              Detection Analysis
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center justify-between text-red-900 font-bold">
                  <span>Oil Slick Probability</span>
                  <span className="text-base font-extrabold text-red-600">92%</span>
                </div>
                <div className="w-full bg-red-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-red-600 h-full w-[92%]"></div>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Detected Area:</span>
                <span className="font-bold text-red-600">{incident.estimatedArea} km²</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Estimated Length:</span>
                <span className="font-semibold text-slate-800">{incident.slickLength}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Maximum Width:</span>
                <span className="font-semibold text-slate-800">{incident.slickWidth}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Orientation:</span>
                <span className="font-semibold text-slate-800">{incident.orientation}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Classification:</span>
                <span className="font-medium text-slate-800">Probable Mineral Oil Slick</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Confidence Rating:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  High
                </span>
              </div>

              {/* Possible Look-Alikes Progress Bars */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">Possible Look-Alikes Evaluated:</span>
                {incident.lookAlikes.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-semibold text-slate-800">{item.prob}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full" style={{ width: `${item.prob}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analyst Validation Form */}
          <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
              Analyst Validation & Signoff
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="validation"
                    value="Confirmed Oil Slick"
                    checked={validationChoice === 'Confirmed Oil Slick'}
                    onChange={(e) => setValidationChoice(e.target.value)}
                    className="accent-[#1976A8]"
                  />
                  <span>Confirmed Oil Slick</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="validation"
                    value="Possible Oil Slick"
                    checked={validationChoice === 'Possible Oil Slick'}
                    onChange={(e) => setValidationChoice(e.target.value)}
                    className="accent-[#1976A8]"
                  />
                  <span>Possible Oil Slick</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="validation"
                    value="False Positive"
                    checked={validationChoice === 'False Positive'}
                    onChange={(e) => setValidationChoice(e.target.value)}
                    className="accent-[#1976A8]"
                  />
                  <span>False Positive</span>
                </label>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-slate-700 block">Analyst Assessment Notes:</label>
                <textarea
                  rows="3"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1976A8]"
                ></textarea>
              </div>
            </div>

            <button
              onClick={handleConfirmAndContinue}
              className="w-full bg-[#1976A8] hover:bg-[#166794] text-white py-2.5 px-4 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Confirm Detection & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
