import React, { useState } from 'react';
import { Search, Filter, Satellite, Eye, PlusCircle } from 'lucide-react';
import { MOCK_SATELLITE_SCENES } from '../data/mockData';

export function SatelliteLibrary({ setActivePage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [selectedScene, setSelectedScene] = useState(null);

  const filteredScenes = MOCK_SATELLITE_SCENES.filter(scene => {
    const matchesSearch = scene.sceneId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (scene.fullSceneId && scene.fullSceneId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          scene.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'All' || scene.sensorMode.includes(sourceFilter);
    return matchesSearch && matchesSource;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E3E8EF]">
        <div>
          <h1 className="text-xl font-bold text-[#172033] tracking-tight">Sentinel-1 SAR Satellite Imagery Library</h1>
          <p className="text-xs text-[#667085] mt-0.5">Synthetic Aperture Radar (SAR) Maritime Observation Archive</p>
        </div>
        <button
          onClick={() => setActivePage('analysis-flow')}
          className="inline-flex items-center gap-2 bg-[#1976A8] hover:bg-[#166794] text-white px-4 py-2 rounded-md text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Analysis from Scene</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Scene ID or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1976A8]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <Filter className="w-4 h-4 text-[#667085]" />
          <span className="font-medium text-[#667085]">Sensor Mode:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-[#F6F8FB] border border-[#E3E8EF] rounded-md px-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1976A8]"
          >
            <option value="All">All Sentinel-1 Modes</option>
            <option value="IW">Sentinel-1 IW Mode (Interferometric Wide)</option>
            <option value="EW">Sentinel-1 EW Mode (Extra Wide Swath)</option>
            <option value="Stripmap">Sentinel-1 SM Mode (Stripmap)</option>
          </select>
        </div>
      </div>

      {/* Perfectly Proportional Table (No Horizontal Scrollbar, Straight Rows) */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-[11.5px] border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-[#E3E8EF] text-[#667085] font-semibold">
            <tr>
              <th className="py-2.5 px-3">Scene ID</th>
              <th className="py-2.5 px-3">Satellite Source</th>
              <th className="py-2.5 px-3">Sensor Mode</th>
              <th className="py-2.5 px-3">Acquisition Date</th>
              <th className="py-2.5 px-3">Region</th>
              <th className="py-2.5 px-3">Resolution</th>
              <th className="py-2.5 px-3">Detection Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E8EF] text-[#172033]">
            {filteredScenes.map((scene) => (
              <tr key={scene.sceneId} className="hover:bg-slate-50 transition-colors">
                {/* Minimized Scene ID */}
                <td className="py-2.5 px-3">
                  <span 
                    title={scene.fullSceneId || scene.sceneId} 
                    className="font-mono font-bold text-[#1976A8] bg-sky-50 px-2 py-0.5 rounded border border-sky-200 inline-block text-[11px]"
                  >
                    {scene.sceneId}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-bold text-[#172033]">{scene.source}</td>
                <td className="py-2.5 px-3 text-slate-700 font-medium">{scene.sensorMode}</td>
                <td className="py-2.5 px-3 text-[#667085]">{scene.date} · {scene.time}</td>
                <td className="py-2.5 px-3 font-medium text-slate-800">{scene.region}</td>
                <td className="py-2.5 px-3 text-slate-600">{scene.resolution}</td>
                <td className="py-2.5 px-3">
                  {scene.spillDetected ? (
                    <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-semibold text-[11px] inline-block">
                      Spill Detected ({scene.area})
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium text-[11px] inline-block">
                      Clean Baseline
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => setSelectedScene(scene)}
                    className="inline-flex items-center gap-1 text-[#1976A8] font-bold hover:underline py-0.5 px-2 rounded hover:bg-sky-50"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect Scene
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedScene && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E3E8EF] rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Sentinel-1 SAR Scene Details</h3>
                <p className="text-xs font-mono text-[#1976A8] font-bold mt-0.5">{selectedScene.fullSceneId || selectedScene.sceneId}</p>
              </div>
              <button onClick={() => setSelectedScene(null)} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="aspect-video bg-slate-100 rounded border border-slate-200 overflow-hidden relative">
                <img src={selectedScene.previewUrl} alt={selectedScene.sceneId} className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-2 gap-2 py-2 text-xs">
                <div><span className="text-slate-500 block text-[11px]">Satellite:</span> <strong className="text-slate-800">{selectedScene.source}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Sensor Mode:</span> <strong className="text-slate-800">{selectedScene.sensorMode}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Region:</span> <strong className="text-slate-800">{selectedScene.region}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Resolution:</span> <strong className="text-slate-800">{selectedScene.resolution}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Polarization:</span> <strong className="text-slate-800">{selectedScene.polarization}</strong></div>
                <div><span className="text-slate-500 block text-[11px]">Cloud Cover:</span> <strong className="text-slate-800">{selectedScene.cloudCover}</strong></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setSelectedScene(null)} className="px-3 py-1.5 border rounded text-xs">Close</button>
              <button 
                onClick={() => {
                  setSelectedScene(null);
                  setActivePage('analysis-flow');
                }}
                className="px-4 py-1.5 bg-[#1976A8] text-white rounded text-xs font-semibold"
              >
                Launch Oil Spill Analysis Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
