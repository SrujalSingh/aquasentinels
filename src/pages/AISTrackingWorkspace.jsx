import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  X, 
  ArrowRight, 
  ShieldAlert, 
  GitCommit,
  Calendar,
  Clock
} from 'lucide-react';
import { MapContainer, TileLayer, Circle, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useIncident } from '../context/IncidentContext';

const createVesselIcon = (color, isSelected) => {
  const size = isSelected ? 20 : 14;
  return L.divIcon({
    className: 'vessel-marker-icon',
    html: `
      <div style="
        background-color: ${color}; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 3px; 
        border: 2px solid white; 
        transform: rotate(45deg);
        box-shadow: ${isSelected ? '0 0 10px ' + color : '0 2px 4px rgba(0,0,0,0.2)'};
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

export function AISTrackingWorkspace({ setActivePage, setSelectedVessel }) {
  const { incident, aisData, showToast } = useIncident();

  const [searchTerm, setSearchTerm] = useState('');
  const [vesselTypeFilter, setVesselTypeFilter] = useState('All');
  const [selectedVessel, setSelectedVesselState] = useState(aisData.candidateVessels[0]);
  const [timeStepIndex, setTimeStepIndex] = useState(3); // Default around 22:30 UTC
  const [isPlaying, setIsPlaying] = useState(false);

  const timeTimeline = [
    "21:00 UTC", "21:30 UTC", "22:00 UTC", "22:30 UTC", 
    "23:00 UTC", "23:30 UTC", "00:00 UTC", "00:30 UTC", "01:00 UTC"
  ];

  // Animation player
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeStepIndex(prev => {
          if (prev >= timeTimeline.length - 1) {
            setIsPlaying(false);
            return timeTimeline.length - 1;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const vesselColors = {
    "v-01": "#E85D68", // MV Ocean Crest (Coral Red)
    "v-02": "#1683B6", // Sea Pioneer (Ocean Blue)
    "v-03": "#0F9D8A", // Arabian Meridian (Muted Teal)
    "v-04": "#667085"  // Western Star (Slate Gray)
  };

  const filteredVessels = aisData.candidateVessels.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.mmsi.includes(searchTerm) ||
                          v.imo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = vesselTypeFilter === 'All' || v.vesselType.includes(vesselTypeFilter);
    return matchesSearch && matchesType;
  });

  const handleSelectVessel = (vessel) => {
    setSelectedVesselState(vessel);
    setSelectedVessel(vessel);
  };

  const handleAnalyseCorrelation = () => {
    setSelectedVessel(selectedVessel);
    setActivePage('vessel-correlation');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4 flex flex-col min-h-[calc(100vh-80px)]">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8EF] shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
            <span>Incident</span>
            <span>/</span>
            <span className="font-semibold text-[#1976A8]">{incident.id}</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">AIS Vessel Tracking</span>
          </div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Historical AIS Vessel Tracking</h1>
          <p className="text-xs text-[#667085] mt-0.5">Search vessel movements near the estimated release zone and time window</p>
        </div>
      </div>

      {/* Top Compact Filter Bar */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-800">26 Sep 2026</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-800">21:00 – 01:00 UTC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Radius:</span>
            <span className="font-bold text-[#1976A8] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">10 NM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={vesselTypeFilter}
              onChange={(e) => setVesselTypeFilter(e.target.value)}
              className="bg-[#F6F8FB] border border-[#E3E8EF] rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#1976A8]"
            >
              <option value="All">All Types</option>
              <option value="Tanker">Tankers</option>
              <option value="Cargo">Cargo</option>
              <option value="Carrier">Bulk Carrier</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Vessel Name / MMSI / IMO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded pl-8 pr-3 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#1976A8]"
            />
          </div>
          <button
            onClick={() => showToast("Searching AIS historical database (4 candidate matches found)", "info")}
            className="bg-[#1976A8] hover:bg-[#166794] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap"
          >
            Search AIS History
          </button>
        </div>
      </div>

      {/* Main AIS Map & Vessel Drawer Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative min-h-[480px]">
        {/* AIS Map Workspace (Hero element) */}
        <div className="lg:col-span-8 bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="h-[460px] rounded border border-slate-200 overflow-hidden relative">
            <MapContainer
              center={[18.8800, 72.6400]}
              zoom={11}
              zoomControl={false}
              className="w-full h-full min-h-[460px]"
            >
              <TileLayer
                attribution='&copy; Esri &mdash; GEBCO, NOAA, CHS, Natural Earth'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean/MapServer/tile/{z}/{y}/{x}"
              />

              {/* Probable Release Zone (Amber Circle) */}
              <Circle
                center={[18.8800, 72.6400]}
                radius={3400}
                pathOptions={{ color: '#E9A23B', fillColor: '#E9A23B', fillOpacity: 0.22, weight: 2, dashArray: '4, 4' }}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <div className="font-extrabold text-amber-900">ESTIMATED RELEASE ORIGIN ZONE</div>
                    <div>Coordinates: 18°55'N, 72°42'E</div>
                    <div>Window: 26 Sep 22:10 – 23:40 UTC</div>
                  </div>
                </Popup>
              </Circle>

              {/* Vessel Historical Trajectories & Gap Visualizations */}
              {filteredVessels.map(vessel => {
                const isSelected = selectedVessel?.id === vessel.id;
                const color = vesselColors[vessel.id] || '#1976A8';
                const points = vessel.trackCoords.map(c => [c.lat, c.lng]);

                let normalSegment = points;
                let gapSegment = [];

                if (vessel.name === "MV OCEAN CREST") {
                  normalSegment = points.slice(0, 3);
                  gapSegment = points.slice(2, 4);
                }

                return (
                  <React.Fragment key={vessel.id}>
                    {/* Normal Track */}
                    <Polyline
                      positions={normalSegment}
                      pathOptions={{
                        color: color,
                        weight: isSelected ? 4 : 2.5,
                        opacity: isSelected ? 1 : 0.4
                      }}
                      eventHandlers={{ click: () => handleSelectVessel(vessel) }}
                    />

                    {/* AIS Gap Segment for MV OCEAN CREST */}
                    {gapSegment.length > 0 && (
                      <Polyline
                        positions={gapSegment}
                        pathOptions={{
                          color: '#E85D68',
                          weight: isSelected ? 4 : 3,
                          dashArray: '4, 6',
                          opacity: isSelected ? 1 : 0.6
                        }}
                      />
                    )}

                    {/* Animated Vessel Current Location Marker based on Timeline Slider */}
                    {vessel.trackCoords.map((coord, idx) => {
                      const isCurrentStepMarker = idx === Math.min(timeStepIndex, vessel.trackCoords.length - 1);
                      if (!isCurrentStepMarker && !isSelected) return null;

                      return (
                        <Marker
                          key={idx}
                          position={[coord.lat, coord.lng]}
                          icon={createVesselIcon(color, isSelected && isCurrentStepMarker)}
                          eventHandlers={{ click: () => handleSelectVessel(vessel) }}
                        >
                          <Popup>
                            <div className="text-xs space-y-1">
                              <div className="font-extrabold text-slate-900">{vessel.name}</div>
                              <div>MMSI: <span className="font-mono">{vessel.mmsi}</span> | {vessel.vesselType}</div>
                              <div>Time: {coord.time}</div>
                              <div>Speed: {coord.speed} knots | Heading: {vessel.heading}</div>
                              {coord.status.includes('Gap') ? (
                                <div className="text-red-600 font-bold mt-1 p-1 bg-red-50 rounded border border-red-200">
                                  AIS transmission unavailable | 16-minute data gap | Requires further investigation
                                </div>
                              ) : (
                                <div>Status: {coord.status}</div>
                              )}
                              <button
                                onClick={() => handleSelectVessel(vessel)}
                                className="mt-1.5 w-full bg-[#1976A8] text-white py-1 px-2 rounded text-[11px] font-bold"
                              >
                                Select Vessel
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </MapContainer>

            {/* Floating AIS Map Legend */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm border border-[#E3E8EF] rounded px-3 py-2 text-xs shadow-sm flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E9A23B]/40 border border-[#E9A23B]"></span>
                <span className="font-medium text-slate-700">Origin Zone</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-[#E85D68] rounded"></span>
                <span className="font-medium text-slate-700">MV Ocean Crest</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-[#E85D68] border-t border-dashed"></span>
                <span className="font-medium text-red-600">16-min AIS Gap</span>
              </div>
            </div>
          </div>

          {/* Bottom Timeline Control */}
          <div className="bg-[#F8FAFC] border border-[#E3E8EF] rounded-md p-3 shadow-inner space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#172033]">AIS Time Scrubber:</span>
                <span className="font-bold text-[#1976A8] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {timeTimeline[timeStepIndex]}
                </span>
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-[#1976A8] hover:bg-[#166794] text-white px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : '▶ Play AIS Movement'}</span>
              </button>
            </div>

            <input
              type="range"
              min="0"
              max={timeTimeline.length - 1}
              step="1"
              value={timeStepIndex}
              onChange={(e) => setTimeStepIndex(Number(e.target.value))}
              className="w-full accent-[#1976A8] cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-[#667085]">
              {timeTimeline.map((t, idx) => (
                <span key={idx} className={idx === timeStepIndex ? 'font-bold text-[#1976A8]' : ''}>
                  {t.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Vessel Drawer Panel (4 Cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
          {selectedVessel ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#172033] uppercase tracking-wider">Vessel Profile Drawer</span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {selectedVessel.correlationScore}% Correlation
                </span>
              </div>

              <div>
                <h2 className="text-base font-extrabold text-[#172033]">{selectedVessel.name}</h2>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedVessel.vesselType} · Flag: {selectedVessel.flag}
                </div>
              </div>

              {/* Vessel Specs Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">MMSI Identification:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedVessel.mmsi}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">IMO Registry Number:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedVessel.imo || "IMO 9382187"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Flag State:</span>
                  <span className="font-medium text-slate-800">{selectedVessel.flag}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Length / Beam Dimensions:</span>
                  <span className="font-medium text-slate-800">{selectedVessel.length} / {selectedVessel.beam}</span>
                </div>
              </div>

              {/* Closest Approach Section */}
              <div className="p-3 bg-[#F8FAFC] border border-[#E3E8EF] rounded space-y-2 text-xs">
                <div className="font-bold text-[#172033] border-b border-slate-200 pb-1 uppercase text-[11px]">
                  Closest Approach Parameters
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="font-semibold text-slate-800">22:42 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Distance to Origin:</span>
                  <span className="font-bold text-red-600">{selectedVessel.closestDistance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Navigation Speed:</span>
                  <span className="font-semibold text-slate-800">11.8 knots</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Heading Angle:</span>
                  <span className="font-semibold text-slate-800">{selectedVessel.heading}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AIS Status Mode:</span>
                  <span className="font-medium text-slate-800">Under Way Using Engine</span>
                </div>
              </div>

              {/* AIS Gap Alert if applicable */}
              {selectedVessel.name === "MV OCEAN CREST" && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs space-y-1">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>AIS Transmission Gap Detected</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    AIS transmission unavailable from 22:31 – 22:47 UTC (16-minute data gap). Requires further investigation.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center py-10">Select a vessel track on map</div>
          )}

          <button
            onClick={handleAnalyseCorrelation}
            className="w-full bg-[#1976A8] hover:bg-[#166794] text-white py-3 px-4 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Analyse Vessel Correlation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
