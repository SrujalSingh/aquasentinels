import React from 'react';
import { MapContainer, TileLayer, Circle, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom vessel marker icons
const createVesselIcon = (color, isSelected) => {
  const size = isSelected ? 22 : 16;
  return L.divIcon({
    className: 'vessel-marker-icon',
    html: `
      <div style="
        background-color: ${color}; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 4px; 
        border: 2px solid white; 
        transform: rotate(45deg);
        box-shadow: ${isSelected ? '0 0 10px ' + color : '0 2px 4px rgba(0,0,0,0.2)'};
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

export function AISMap({ candidateVessels = [], selectedVessel, setSelectedVessel }) {
  const center = [18.9167, 72.7000];
  const originCentroid = [18.8800, 72.6400]; // 18°55'N, 72°42'E

  const vesselColors = {
    "MV OCEAN CREST": "#E85D68", // Highlight candidate red/coral
    "SEA PIONEER": "#1683B6",    // Ocean blue
    "ARABIAN MERIDIAN": "#0F9D8A",// Teal
    "COAST DEFENDER": "#667085"  // Muted gray
  };

  return (
    <div className="relative w-full h-full bg-[#E6F0F6] rounded-md overflow-hidden border border-[#E3E8EF] flex flex-col">
      <MapContainer
        center={center}
        zoom={10}
        zoomControl={false}
        className="w-full h-full min-h-[420px]"
      >
        <TileLayer
          attribution='&copy; Esri &mdash; GEBCO, NOAA, CHS, Natural Earth'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Probable Release Origin Zone (Amber Circle) */}
        <Circle
          center={originCentroid}
          radius={3400}
          pathOptions={{
            color: '#E9A23B',
            fillColor: '#E9A23B',
            fillOpacity: 0.22,
            weight: 2,
            dashArray: '4, 4'
          }}
        >
          <Popup>
            <div className="text-xs space-y-1">
              <div className="font-semibold text-amber-900">PROBABLE RELEASE ORIGIN ZONE</div>
              <div>Coordinates: 18°55'N, 72°42'E</div>
              <div>Time Window: 26 Sep 22:10 – 23:40 UTC</div>
              <div>Uncertainty Radius: 3.4 km</div>
            </div>
          </Popup>
        </Circle>

        {/* Vessel Trajectories and Waypoints */}
        {candidateVessels.map(vessel => {
          const isSelected = selectedVessel?.id === vessel.id;
          const color = vesselColors[vessel.name] || '#1683B6';
          const points = vessel.trackCoords.map(c => [c.lat, c.lng]);

          // Handle AIS gap for MV OCEAN CREST
          let normalPoints = points;
          let gapPoints = [];

          if (vessel.name === "MV OCEAN CREST") {
            normalPoints = points.slice(0, 3);
            gapPoints = points.slice(2, 4);
          }

          return (
            <React.Fragment key={vessel.id}>
              {/* Main Track Polyline */}
              <Polyline
                positions={normalPoints}
                pathOptions={{
                  color: color,
                  weight: isSelected ? 4 : 2.5,
                  opacity: isSelected ? 1 : 0.65
                }}
                eventHandlers={{
                  click: () => setSelectedVessel(vessel)
                }}
              />

              {/* Dotted Segment for AIS Gap if applicable */}
              {gapPoints.length > 0 && (
                <Polyline
                  positions={gapPoints}
                  pathOptions={{
                    color: '#E85D68',
                    weight: 3,
                    dashArray: '4, 6',
                    opacity: 0.9
                  }}
                />
              )}

              {/* Waypoint Markers */}
              {vessel.trackCoords.map((coord, idx) => (
                <Marker
                  key={idx}
                  position={[coord.lat, coord.lng]}
                  icon={createVesselIcon(color, isSelected && idx === vessel.trackCoords.length - 1)}
                  eventHandlers={{
                    click: () => setSelectedVessel(vessel)
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-slate-900">{vessel.name}</div>
                      <div>MMSI: <span className="font-mono">{vessel.mmsi}</span> | {vessel.vesselType}</div>
                      <div>Timestamp: {coord.time}</div>
                      <div>Speed: {coord.speed} knots</div>
                      <div>Status: <span className={coord.status.includes('Gap') ? 'text-red-600 font-semibold' : 'text-slate-600'}>{coord.status}</span></div>
                      <button
                        onClick={() => setSelectedVessel(vessel)}
                        className="mt-1.5 w-full bg-[#1976A8] text-white py-1 px-2 rounded text-[11px] font-medium"
                      >
                        Inspect Vessel Correlation
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm border border-[#E3E8EF] rounded px-3 py-2 text-xs shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#E9A23B]/40 border border-[#E9A23B]"></span>
          <span className="font-medium text-slate-700">Origin Zone (3.4 km radius)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-[#E85D68] rounded"></span>
          <span className="font-medium text-slate-700">MV Ocean Crest (89%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-[#1683B6] rounded"></span>
          <span className="font-medium text-slate-700">Sea Pioneer (72%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-[#E85D68] border-t border-dashed"></span>
          <span className="font-medium text-red-600">AIS Signal Gap Segment</span>
        </div>
      </div>
    </div>
  );
}
