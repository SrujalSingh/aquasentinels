import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Layers, 
  Check, 
  Compass, 
  Radio, 
  AlertTriangle, 
  ArrowRight, 
  ChevronRight, 
  Edit3, 
  Plus, 
  Minus, 
  Ruler, 
  FileText,
  ShieldCheck,
  Info,
  Clock
} from 'lucide-react';
import { SatelliteMap } from '../components/maps/SatelliteMap';
import { DriftMap } from '../components/maps/DriftMap';
import { AISMap } from '../components/maps/AISMap';
import { StatusBadge } from '../components/common/StatusBadge';
import { MOCK_CANDIDATE_VESSELS } from '../data/mockData';

export function AnalysisFlow({ setActivePage, setSelectedVessel, setSelectedIncidentId, initialStep = 1, selectedVesselProp }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [satelliteSource, setSatelliteSource] = useState('Sentinel-1 SAR');
  const [compareMode, setCompareMode] = useState(false);
  const [hoursBack, setHoursBack] = useState(0);
  const [analystNotes, setAnalystNotes] = useState('Observed characteristic low-backscatter dark patch consistent with mineral oil slick. Shape and aspect ratio indicate continuous discharge.');
  const [selectedCandidate, setSelectedCandidate] = useState(selectedVesselProp || MOCK_CANDIDATE_VESSELS[0]);

  useEffect(() => {
    if (initialStep) {
      setCurrentStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    if (selectedVesselProp) {
      setSelectedCandidate(selectedVesselProp);
    }
  }, [selectedVesselProp]);

  // Stepper Header Definitions
  const steps = [
    { number: 1, title: 'Satellite Image' },
    { number: 2, title: 'Detect Spill' },
    { number: 3, title: 'Confirm Slick' },
    { number: 4, title: 'Environmental' },
    { number: 5, title: 'Backtrack Drift' },
    { number: 6, title: 'AIS Correlation' },
    { number: 7, title: 'Result' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Stepper Bar */}
      <div className="bg-white border border-[#E3E8EF] rounded-lg p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E3E8EF] pb-3">
          <div>
            <h1 className="text-lg font-bold text-[#172033]">NEW OIL SPILL ANALYSIS WORKFLOW</h1>
            <p className="text-xs text-[#667085]">Multi-step satellite SAR detection, drift modeling & AIS correlation</p>
          </div>
          <span className="text-xs font-semibold bg-[#EBF3F8] text-[#1976A8] px-3 py-1 rounded border border-sky-200">
            Step {currentStep} of 7: {steps[currentStep - 1].title}
          </span>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="flex items-center justify-between overflow-x-auto py-1">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <React.Fragment key={step.number}>
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className="flex items-center gap-2 group shrink-0"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#1976A8] text-white ring-4 ring-sky-100'
                      : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? 'text-[#1976A8] font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`h-[2px] flex-1 mx-2 min-w-[16px] ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: SATELLITE SCENE SELECTION */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#172033]">Satellite Scene Selection & Ingest</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-dashed border-[#1976A8]/40 bg-sky-50/50 rounded-lg hover:border-[#1976A8] transition-colors cursor-pointer flex flex-col items-center justify-center text-center space-y-2">
                <Satellite className="w-8 h-8 text-[#1976A8]" />
                <span className="text-xs font-bold text-[#172033]">Select Satellite Dataset</span>
                <span className="text-[11px] text-[#667085]">Browse Copernicus / ESA & Canadian Space Agency archive</span>
              </div>
              <div className="p-4 border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg hover:border-slate-400 transition-colors cursor-pointer flex flex-col items-center justify-center text-center space-y-2">
                <Upload className="w-8 h-8 text-slate-500" />
                <span className="text-xs font-bold text-[#172033]">Upload Sample Satellite Scene</span>
                <span className="text-[11px] text-[#667085]">Support GeoTIFF, SAFE, NetCDF, HDF5</span>
              </div>
            </div>

            <div className="h-[360px] rounded border border-slate-200 overflow-hidden relative">
              <SatelliteMap compareMode={false} />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
                Scene Metadata Panel
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 block text-[11px] font-medium mb-1">Satellite Source</label>
                  <select 
                    value={satelliteSource}
                    onChange={(e) => setSatelliteSource(e.target.value)}
                    className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#1976A8]"
                  >
                    <option value="Sentinel-1 SAR (IW Mode)">Sentinel-1 SAR (IW C-Band VV/VH)</option>
                    <option value="Sentinel-1 SAR (EW Mode)">Sentinel-1 SAR (EW Swath HH/HV)</option>
                    <option value="Sentinel-1 SAR (SM Mode)">Sentinel-1 SAR (Stripmap High-Res)</option>
                  </select>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Acquisition Date:</span>
                  <span className="font-semibold text-slate-800">27 Sep 2026</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Acquisition Time:</span>
                  <span className="font-semibold text-slate-800">03:42:11 UTC</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Target Region:</span>
                  <span className="font-semibold text-slate-800">Arabian Sea (MH Offshore)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Scene ID:</span>
                  <span className="font-mono text-[11px] text-slate-700">S1A_IW_GRDH_20260927</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Resolution:</span>
                  <span className="font-semibold text-slate-800">10 m / pixel</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Ingest Status:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ready for Ingestion
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-[#1976A8] hover:bg-[#166794] text-white py-2.5 px-4 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Analyse for Oil Spill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI OIL SPILL DETECTION */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#172033]">AI Oil Spill Segmentation Mask</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${compareMode ? 'bg-[#1976A8] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {compareMode ? 'Exit Comparison' : 'Before / After Compare'}
                </button>
              </div>
            </div>

            <div className="h-[460px] rounded border border-slate-200 overflow-hidden relative">
              <SatelliteMap compareMode={compareMode} />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
                Detection Result
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center justify-between text-red-900 font-bold">
                    <span>Oil Spill Probability:</span>
                    <span className="text-base font-extrabold text-red-600">92%</span>
                  </div>
                  <div className="w-full bg-red-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-red-600 h-full w-[92%]"></div>
                  </div>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Detected Area:</span>
                  <span className="font-bold text-red-600">3.82 km²</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Estimated Length:</span>
                  <span className="font-semibold text-slate-800">4.6 km</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Orientation:</span>
                  <span className="font-semibold text-slate-800">SW → NE (225°)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Confidence Rating:</span>
                  <span className="font-bold text-emerald-700">High Confidence</span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 block">Possible Look-Alikes Evaluated:</span>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Low Wind Zone:</span>
                    <span className="font-medium text-slate-700">5% prob</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Ship Wake:</span>
                    <span className="font-medium text-slate-700">2% prob</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Natural Biogenic Slick:</span>
                    <span className="font-medium text-slate-700">1% prob</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded text-xs font-semibold transition-colors"
              >
                Reject Detection
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="w-2/3 bg-[#1976A8] hover:bg-[#166794] text-white py-2 px-4 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Confirm Oil Slick</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SPILL CONFIRMATION & GEOMETRY EDITING */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#172033]">Analyst Boundary Adjustment Workspace</h2>
              <div className="flex items-center gap-2 text-xs">
                <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Edit Boundary
                </button>
                <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Area
                </button>
                <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded flex items-center gap-1">
                  <Ruler className="w-3 h-3" /> Measure
                </button>
              </div>
            </div>

            <div className="h-[460px] rounded border border-slate-200 overflow-hidden">
              <SatelliteMap isEditing={true} />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
                Confirmed Geometry Parameters
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Calculated Spill Area:</span>
                  <span className="font-bold text-red-600">3.82 km²</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Estimated Slick Width:</span>
                  <span className="font-semibold text-slate-800">840 m</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Estimated Volume Range:</span>
                  <span className="font-semibold text-slate-800">12 – 18 m³</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Detection Confidence:</span>
                  <span className="font-bold text-emerald-700">92%</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-bold text-slate-700 block">Analyst Assessment Note:</label>
                  <textarea
                    rows="4"
                    value={analystNotes}
                    onChange={(e) => setAnalystNotes(e.target.value)}
                    className="w-full bg-[#F6F8FB] border border-[#E3E8EF] rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-[#1976A8]"
                  ></textarea>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(4)}
              className="w-full bg-[#1976A8] hover:bg-[#166794] text-white py-2.5 px-4 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Confirm Spill Geometry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ENVIRONMENTAL CONDITIONS */}
      {currentStep === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#172033]">Hydrodynamic & Meteorological Layer Control</h2>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input type="checkbox" defaultChecked className="accent-[#1976A8]" /> Oil Slick
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input type="checkbox" defaultChecked className="accent-[#1976A8]" /> Ocean Current
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input type="checkbox" defaultChecked className="accent-[#1976A8]" /> Wind
                </label>
              </div>
            </div>

            <div className="h-[460px] rounded border border-slate-200 overflow-hidden">
              <DriftMap hoursBack={0} setHoursBack={setHoursBack} />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
                Observation Time Conditions
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Surface Wind:</span>
                    <span className="font-bold text-slate-800">7.2 m/s @ SW (210°)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Ocean Current:</span>
                    <span className="font-bold text-[#1976A8]">0.42 m/s @ NE (52°)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Wave Height:</span>
                    <span className="font-bold text-slate-800">1.6 m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Sea Temperature:</span>
                    <span className="font-bold text-slate-800">28.1°C</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div>Data Source: <span className="font-semibold text-slate-700">INCOIS High-Res Ocean Model</span></div>
                  <div>Assimilation Window: <span className="font-semibold text-slate-700">26 Sep 22:00 – 27 Sep 04:00 UTC</span></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(5)}
              className="w-full bg-[#1976A8] hover:bg-[#166794] text-white py-2.5 px-4 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Drift Backtracking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: DRIFT BACKTRACKING (KEY FEATURE) */}
      {currentStep === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-[#172033]">Backtrack Oil Drift Simulation</h2>
                <p className="text-xs text-slate-500">Estimating oil release point prior to satellite detection</p>
              </div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                ADIOS/GNOME Backtrack Engine
              </span>
            </div>

            <div className="h-[480px] rounded border border-slate-200 overflow-hidden">
              <DriftMap hoursBack={hoursBack} setHoursBack={setHoursBack} />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
                Estimated Release Window
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md space-y-1">
                  <div className="text-[11px] font-semibold text-amber-900 uppercase">Release Time Window</div>
                  <div className="text-sm font-bold text-amber-950">26 Sep · 22:10 – 23:40 UTC</div>
                  <div className="text-[11px] text-amber-800">~ 5 hours prior to SAR acquisition</div>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Probable Origin Centroid:</span>
                  <span className="font-mono font-semibold text-slate-800">18°55'N, 72°42'E</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Uncertainty Radius:</span>
                  <span className="font-semibold text-slate-800">3.4 km</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Model Confidence:</span>
                  <span className="font-bold text-emerald-700">82%</span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Parameters Used:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ocean Current (0.42 m/s), Surface Wind (7.2 m/s), Stokes Wave Drift (0.06 m/s), Diffusion Coefficient.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(6)}
              className="w-full bg-[#1976A8] hover:bg-[#166794] text-white py-2.5 px-4 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Search AIS Vessels in Origin Zone</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: AIS VESSEL CORRELATION */}
      {currentStep === 6 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#172033]">AIS Candidate Trajectories</h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Filter Radius:</span>
                <span className="font-bold text-[#1976A8] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">10 NM</span>
              </div>
            </div>

            <div className="h-[480px] rounded border border-slate-200 overflow-hidden">
              <AISMap 
                candidateVessels={MOCK_CANDIDATE_VESSELS}
                selectedVessel={selectedCandidate}
                setSelectedVessel={setSelectedCandidate}
              />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
                Candidate Vessels ({MOCK_CANDIDATE_VESSELS.length})
              </h3>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {MOCK_CANDIDATE_VESSELS.map(vessel => {
                  const isSelected = selectedCandidate?.id === vessel.id;
                  return (
                    <div 
                      key={vessel.id}
                      onClick={() => setSelectedCandidate(vessel)}
                      className={`p-3 rounded-md border text-xs cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#1976A8] bg-sky-50/60 shadow-sm' 
                          : 'border-[#E3E8EF] bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{vessel.name}</span>
                        <span className="text-xs text-red-600 font-extrabold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                          {vessel.correlationScore}% corr
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span>{vessel.vesselType}</span>
                        <span>MMSI: {vessel.mmsi}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1 flex justify-between">
                        <span>Closest: <strong className="text-slate-800">{vessel.closestDistance}</strong></span>
                        <span>Passed: {vessel.passedZoneTime.split('·')[1] || vessel.passedZoneTime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedVessel(selectedCandidate);
                setCurrentStep(7);
              }}
              className="w-full bg-[#1976A8] hover:bg-[#166794] text-white py-2.5 px-4 rounded text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>View Candidate Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: VESSEL CORRELATION DETAIL & INVESTIGATION RESULT */}
      {currentStep === 7 && (
        <div className="space-y-6">
          {/* Header Card for Selected Vessel */}
          <div className="bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E8EF] pb-3">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-[#172033]">{selectedCandidate.name}</h2>
                  <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                    High-Priority Candidate Vessel
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {selectedCandidate.vesselType} · {selectedCandidate.flag} · {selectedCandidate.imo} · MMSI: {selectedCandidate.mmsi}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedIncidentId("INC-2026-0087");
                  setActivePage("reports");
                }}
                className="bg-[#1976A8] hover:bg-[#166794] text-white px-4 py-2 rounded text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Incident Report</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Overall Correlation</span>
                <span className="text-lg font-bold text-red-600">{selectedCandidate.correlationScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Closest Approach</span>
                <span className="text-sm font-bold text-slate-800">{selectedCandidate.closestDistance}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Time Difference</span>
                <span className="text-sm font-bold text-slate-800">{selectedCandidate.timeDifference}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">AIS Anomaly Status</span>
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                  {selectedCandidate.aisStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Map */}
            <div className="lg:col-span-7 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#172033]">Vessel Trajectory & Release Origin Intersection</h3>
              <div className="h-[420px] rounded border border-slate-200 overflow-hidden">
                <AISMap 
                  candidateVessels={[selectedCandidate]}
                  selectedVessel={selectedCandidate}
                  setSelectedVessel={setSelectedCandidate}
                />
              </div>
            </div>

            {/* Right: Correlation Breakdown */}
            <div className="lg:col-span-5 bg-white border border-[#E3E8EF] rounded-lg p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider border-b border-slate-100 pb-2">
                Correlation Breakdown Scores
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>Spatial Match</span>
                    <span className="text-[#1976A8]">{selectedCandidate.spatialScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1976A8] h-full" style={{ width: `${selectedCandidate.spatialScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>Temporal Match</span>
                    <span className="text-[#1976A8]">{selectedCandidate.temporalScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1976A8] h-full" style={{ width: `${selectedCandidate.temporalScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>Route Intersection</span>
                    <span className="text-[#1976A8]">{selectedCandidate.routeMatchScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1976A8] h-full" style={{ width: `${selectedCandidate.routeMatchScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>Vessel Type Relevance</span>
                    <span className="text-[#1976A8]">{selectedCandidate.vesselTypeRelevance}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1976A8] h-full" style={{ width: `${selectedCandidate.vesselTypeRelevance}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800 mb-1">
                    <span>AIS Transmission Behaviour</span>
                    <span className="text-[#1976A8]">{selectedCandidate.aisBehaviourScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1976A8] h-full" style={{ width: `${selectedCandidate.aisBehaviourScore}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Neutral Legal Note */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Government Investigation Protocol</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  {selectedCandidate.investigationNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
