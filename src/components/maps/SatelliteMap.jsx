import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Rectangle, Popup, LayersControl, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Eye, Layers, ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

// Custom marker icon fix for Leaflet in Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export function SatelliteMap({ slickCoords, isEditing, onAreaChange, compareMode }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeLayer, setActiveLayer] = useState('sar'); // 'sar', 'optical', 'mask'

  // Incident slick centroid
  const center = [18.9167, 72.7000];

  const polygonCoords = slickCoords || [
    [18.930, 72.685],
    [18.945, 72.710],
    [18.925, 72.735],
    [18.905, 72.705],
    [18.915, 72.680]
  ];

  // Satellite scene bounds
  const sceneBounds = [
    [18.70, 72.45],
    [19.15, 72.95]
  ];

  return (
    <div className="relative w-full h-full bg-[#E6F0F6] rounded-md overflow-hidden border border-[#E3E8EF] flex flex-col">
      {/* Map Toolbar */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm border border-[#E3E8EF] rounded-md shadow-sm p-1 flex items-center gap-1">
        <button 
          onClick={() => setActiveLayer('vv')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${activeLayer === 'vv' || activeLayer === 'sar' ? 'bg-[#1976A8] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          Sentinel-1 SAR (VV Co-Pol)
        </button>
        <button 
          onClick={() => setActiveLayer('vh')}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${activeLayer === 'vh' ? 'bg-[#1976A8] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
        >
          Sentinel-1 SAR (VH Cross-Pol)
        </button>
        <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
        <span className="text-[11px] text-slate-500 px-1 font-medium">Sensor: C-Band SAR</span>
      </div>

      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={12}
        zoomControl={false}
        className="w-full h-full min-h-[400px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            activeLayer === 'sar'
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}'
              : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          }
        />

        {/* Satellite Scene Frame */}
        <Rectangle
          bounds={sceneBounds}
          pathOptions={{ color: '#1976A8', weight: 1, dashArray: '4, 4', fill: false }}
        />

        {/* Oil Slick Polygon */}
        <Polygon
          positions={polygonCoords}
          pathOptions={{
            color: '#E85D68',
            fillColor: '#E85D68',
            fillOpacity: 0.45,
            weight: 2
          }}
        >
          <Popup>
            <div className="text-xs space-y-1">
              <div className="font-semibold text-slate-800">Detected Oil Slick</div>
              <div>Estimated Area: <span className="font-semibold text-red-600">3.82 km²</span></div>
              <div>Confidence: <span className="font-semibold text-emerald-600">92%</span></div>
              <div>Orientation: SW → NE (225°)</div>
            </div>
          </Popup>
        </Polygon>

        {/* Slick Centroid Marker */}
        <Marker position={center} icon={defaultIcon}>
          <Popup>
            <div className="text-xs font-semibold text-slate-800">Slick Centroid (18°55'N, 72°42'E)</div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Compare Mode Split Slider (If enabled) */}
      {compareMode && (
        <div className="absolute inset-x-0 bottom-3 left-3 right-3 z-[1000] bg-white/95 border border-slate-200 rounded p-2 text-xs flex items-center gap-3">
          <span className="font-medium text-slate-700 shrink-0">Before/After Comparison:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(e.target.value)}
            className="w-full accent-[#1976A8] cursor-pointer"
          />
          <span className="text-slate-500 shrink-0 font-medium">{sliderPosition}% Baseline</span>
        </div>
      )}

      {/* Legend Badge */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 border border-[#E3E8EF] rounded px-3 py-1.5 text-[11px] shadow-sm flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#E85D68]/80 border border-[#E85D68]"></span>
          <span className="font-medium text-slate-700">Detected Slick</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-[#1976A8] border-dashed"></span>
          <span className="font-medium text-slate-700">Scene Footprint</span>
        </div>
      </div>
    </div>
  );
}
