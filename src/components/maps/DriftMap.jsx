import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Circle, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Play, Pause, RotateCcw, Wind, Compass, Layers } from 'lucide-react';

const originIcon = L.divIcon({
  className: 'custom-origin-pin',
  html: `<div style="background-color: #E9A23B; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(233,162,59,0.8);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

export function DriftMap({ hoursBack = 0, setHoursBack, showLayers = {} }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Centroid at T-0 (Observation Time 27 Sep 03:42 UTC)
  const t0Centroid = [18.9167, 72.7000];

  // Calculated origin at T-5h (26 Sep 22:40 UTC)
  const originCentroid = [18.8800, 72.6400]; // 18°55'N, 72°42'E

  // Backtracked trajectory line points (T-0 down to T-24h)
  const trajectoryPoints = [
    [18.9167, 72.7000], // T-0h (Detected)
    [18.9050, 72.6820], // T-3h
    [18.8800, 72.6400], // T-5.5h (Probable Release Origin Centroid)
    [18.8650, 72.6150], // T-9h
    [18.8400, 72.5800], // T-12h
    [18.8100, 72.5300], // T-18h
    [18.7800, 72.4700]  // T-24h
  ];

  // Compute interpolated position for current time scrubber value (hoursBack: 0..24)
  // Drift vector offset: ~0.0055 deg per hour southwest
  const latOffset = -(hoursBack * 0.0057);
  const lngOffset = -(hoursBack * 0.0095);

  const activeSlickCoords = [
    [18.930 + latOffset, 72.685 + lngOffset],
    [18.945 + latOffset, 72.710 + lngOffset],
    [18.925 + latOffset, 72.735 + lngOffset],
    [18.905 + latOffset, 72.705 + lngOffset],
    [18.915 + latOffset, 72.680 + lngOffset]
  ];

  const currentSlickCentroid = [18.9167 + latOffset, 72.7000 + lngOffset];

  // Time scrubber steps
  const timeSteps = [
    { label: "T - 0h", hours: 0, text: "Observed (27 Sep 03:42)" },
    { label: "T - 3h", hours: 3, text: "27 Sep 00:42" },
    { label: "T - 6h", hours: 6, text: "26 Sep 21:42" },
    { label: "T - 9h", hours: 9, text: "26 Sep 18:42" },
    { label: "T - 12h", hours: 12, text: "26 Sep 15:42" },
    { label: "T - 18h", hours: 18, text: "26 Sep 09:42" },
    { label: "T - 24h", hours: 24, text: "26 Sep 03:42" }
  ];

  return (
    <div className="relative w-full h-full bg-[#E6F0F6] rounded-md overflow-hidden border border-[#E3E8EF] flex flex-col">
      {/* Map Container */}
      <MapContainer
        center={t0Centroid}
        zoom={11}
        zoomControl={false}
        className="w-full h-full min-h-[420px]"
      >
        <TileLayer
          attribution='&copy; Esri &mdash; GEBCO, NOAA, CHS, Natural Earth'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Backtracked Drift Polyline */}
        <Polyline
          positions={trajectoryPoints}
          pathOptions={{
            color: '#1976A8',
            weight: 3,
            dashArray: '6, 8',
            opacity: 0.85
          }}
        />

        {/* Estimated Origin Zone (Amber Circle with Uncertainty Radius 3.4km ~ 3400m) */}
        <Circle
          center={originCentroid}
          radius={3400}
          pathOptions={{
            color: '#E9A23B',
            fillColor: '#E9A23B',
            fillOpacity: 0.25,
            weight: 2,
            dashArray: '3, 4'
          }}
        >
          <Popup>
            <div className="text-xs space-y-1">
              <div className="font-semibold text-amber-900">ESTIMATED SPILL ORIGIN ZONE</div>
              <div>Release Window: <span className="font-[#172033] font-[#1976A8] font-medium">26 Sep 22:10 – 23:40 UTC</span></div>
              <div>Uncertainty Radius: <span className="font-medium">3.4 km</span></div>
              <div>Model Confidence: <span className="font-medium text-emerald-700">82%</span></div>
              <div>Coordinates: 18°55'N, 72°42'E</div>
            </div>
          </Popup>
        </Circle>

        {/* Origin Centroid Marker */}
        <Marker position={originCentroid} icon={originIcon}>
          <Popup>
            <div className="text-xs font-semibold text-amber-900">Probable Origin Centroid</div>
          </Popup>
        </Marker>

        {/* Active Backtracked Slick Polygon */}
        <Polygon
          positions={activeSlickCoords}
          pathOptions={{
            color: hoursBack === 0 ? '#E85D68' : '#1976A8',
            fillColor: hoursBack === 0 ? '#E85D68' : '#1976A8',
            fillOpacity: 0.5,
            weight: 2
          }}
        >
          <Popup>
            <div className="text-xs space-y-1">
              <div className="font-semibold text-slate-800">
                {hoursBack === 0 ? 'Detected Slick (Observation Time)' : `Backtracked Slick Position at T - ${hoursBack}h`}
              </div>
              <div>Position: {currentSlickCentroid[0].toFixed(4)}°N, {currentSlickCentroid[1].toFixed(4)}°E</div>
            </div>
          </Popup>
        </Polygon>
      </MapContainer>

      {/* Floating Environmental Overlay Indicators */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm border border-[#E3E8EF] rounded-md shadow-sm p-2 text-xs space-y-1.5 min-w-[170px]">
        <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider border-b border-slate-100 pb-1">
          Active Drift Vectors
        </div>
        <div className="flex items-center justify-between text-slate-700">
          <span className="text-slate-500">Ocean Current:</span>
          <span className="font-medium text-[#1976A8]">0.42 m/s @ NE</span>
        </div>
        <div className="flex items-center justify-between text-slate-700">
          <span className="text-slate-500">Surface Wind:</span>
          <span className="font-medium text-teal-700">7.2 m/s @ SW</span>
        </div>
        <div className="flex items-center justify-between text-slate-700">
          <span className="text-slate-500">Net Drift Rate:</span>
          <span className="font-medium text-slate-800">0.48 m/s (2.3%)</span>
        </div>
      </div>

      {/* Time Scrubber Controls Bar at Bottom */}
      <div className="absolute inset-x-3 bottom-3 z-[1000] bg-white/95 border border-[#E3E8EF] rounded-md p-3 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#172033]">Backtrack Time Scrubber</span>
            <span className="text-xs bg-[#EBF3F8] text-[#1976A8] font-semibold px-2 py-0.5 rounded border border-sky-200">
              T - {hoursBack}h {hoursBack === 0 ? '(Observation Time)' : ''}
            </span>
          </div>
          <div className="text-[11px] text-[#667085]">
            Estimated Position: <span className="font-medium text-slate-800">{currentSlickCentroid[0].toFixed(4)}°N, {currentSlickCentroid[1].toFixed(4)}°E</span>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="24"
            step="1"
            value={hoursBack}
            onChange={(e) => setHoursBack(Number(e.target.value))}
            className="w-full accent-[#1976A8] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#667085] pt-0.5">
            {timeSteps.map(step => (
              <button
                key={step.hours}
                onClick={() => setHoursBack(step.hours)}
                className={`hover:text-[#1976A8] transition-colors ${hoursBack === step.hours ? 'font-bold text-[#1976A8]' : ''}`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
