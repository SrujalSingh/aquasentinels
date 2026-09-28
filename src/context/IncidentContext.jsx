import React, { createContext, useContext, useState } from 'react';
import { 
  DEFAULT_INCIDENT_ID, 
  MOCK_INCIDENTS, 
  MOCK_CANDIDATE_VESSELS, 
  MOCK_EVIDENCE, 
  MOCK_TIMELINE 
} from '../data/mockData';

const IncidentContext = createContext(null);

export function IncidentProvider({ children }) {
  // Primary Incident State
  const [incident, setIncident] = useState({
    id: "INC-2026-0087",
    name: "Arabian Sea Offshore Spill — MH Basin",
    date: "27 Sep 2026",
    time: "03:42 UTC",
    region: "Arabian Sea — Maharashtra Offshore",
    coordinates: { lat: 18.9167, lng: 72.7000 },
    estimatedArea: 3.82, // Numeric for dynamic updates
    estimatedVolume: "12 - 18 m³ (Heavy Fuel Oil / Crude)",
    slickLength: "4.6 km",
    slickWidth: "1.3 km",
    orientation: "SW → NE (225°)",
    status: "Detected",
    priority: "High",
    confidence: "92%",
    satelliteSource: "Sentinel-1 SAR (IW C-Band)",
    sceneId: "S1A-IW-20260927-0342",
    resolution: "10 m",
    sensorMode: "Interferometric Wide (IW)",
    acquisitionDate: "27 Sep 2026 03:42:11 UTC",
    validationStatus: "Confirmed Oil Slick",
    analystNotes: "Observed characteristic low-backscatter dark patch consistent with mineral oil slick. Shape and aspect ratio indicate continuous discharge.",
    lookAlikes: [
      { name: "Low Wind Area", prob: 18 },
      { name: "Ship Wake", prob: 7 },
      { name: "Natural Slick", prob: 5 }
    ]
  });

  // Drift Model State
  const [driftModel, setDriftModel] = useState({
    releaseWindow: "26 Sep 2026 · 22:10 – 23:40 UTC",
    probableOrigin: "18°55'N, 72°42'E",
    originCoords: { lat: 18.8800, lng: 72.6400 },
    uncertaintyRadius: 3.4,
    modelConfidence: "82%",
    elapsedDrift: "Approx. 5h 32m",
    driftDistance: "9.6 km",
    driftDirection: "45° (NE)",
    currentVelocity: "0.42 m/s @ NE",
    windVelocity: "7.2 m/s @ SW",
    waveHeight: "1.6 m",
    seaTemp: "28.1°C",
    showUncertainty: false,
    isCalculating: false
  });

  // AIS Vessel Data State
  const [aisData, setAisData] = useState({
    searchRadius: 10,
    timeWindow: "21:00 – 01:00 UTC",
    date: "26 Sep 2026",
    selectedVesselId: "v-01",
    candidateVessels: MOCK_CANDIDATE_VESSELS
  });

  // Central Evidence Repository State
  const [evidenceList, setEvidenceList] = useState(MOCK_EVIDENCE);

  // Timeline State
  const [timelineEvents, setTimelineEvents] = useState(MOCK_TIMELINE);

  // Toast Notification State for Demo Mode
  const [toast, setToast] = useState(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // State Mutators
  const updateBoundaryArea = (newArea) => {
    setIncident(prev => ({
      ...prev,
      estimatedArea: newArea
    }));
    showToast(`Detection boundary recalculated: ${newArea} km²`, 'info');
  };

  const confirmDetection = (validationStatus, notes) => {
    setIncident(prev => ({
      ...prev,
      status: "Under Analysis",
      validationStatus: validationStatus || prev.validationStatus,
      analystNotes: notes || prev.analystNotes
    }));
    showToast("Oil spill detection confirmed & logged to incident record", "success");
  };

  const recalculateDriftModel = () => {
    setDriftModel(prev => ({ ...prev, isCalculating: true }));
    showToast("Running Eulerian-Lagrangian drift reconstruction...", "info");
    setTimeout(() => {
      setDriftModel(prev => ({ ...prev, isCalculating: false }));
      setIncident(prev => ({ ...prev, status: "Drift Calculated" }));
      showToast("Drift model completed. Estimated origin centroid: 18°55'N, 72°42'E", "success");
    }, 1200);
  };

  const setDriftUncertaintyMode = (show) => {
    setDriftModel(prev => ({ ...prev, showUncertainty: show }));
  };

  const addEvidenceItem = (item) => {
    const newId = `EVD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: newId,
      incidentId: incident.id,
      type: item.type || "AIS Vessel Track",
      source: item.source || "DGS / ICG AIS Hub",
      originalTimestamp: item.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      processingTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      hash: `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      analyst: "Cmdr. R. Sharma (ICG)",
      version: "v1.0 (Verified)",
      notes: item.notes || `Evidence added for ${item.vesselName || 'candidate vessel'}`
    };

    setEvidenceList(prev => [newEntry, ...prev]);

    // Also add to timeline
    const newTimelineItem = {
      time: "Just Now",
      title: `Evidence Added: ${item.type}`,
      detail: item.notes || `Evidence ${newId} verified and locked into incident archive.`,
      icon: "file-check"
    };
    setTimelineEvents(prev => [newTimelineItem, ...prev]);

    showToast(`Evidence ${newId} added to repository`, 'success');
  };

  const markVesselUnderInvestigation = (vesselName) => {
    setIncident(prev => ({ ...prev, status: "AIS Correlation" }));
    showToast(`${vesselName} shortlisted as high-priority candidate for investigation`, 'warning');
  };

  // Automated Interactive Demo Simulation Sequence
  const runDemoSimulation = (setActivePage) => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    showToast("🚀 Launching Automated Investigation Simulation...", "info");

    setTimeout(() => {
      setActivePage('spill-detection');
      showToast("Step 1/5: Loading Sentinel-1 SAR scene & AI segmentation...", "info");

      setTimeout(() => {
        confirmDetection("Confirmed Oil Slick", "Automated validation confirmed 3.82 km² mineral slick");
        showToast("Step 2/5: Slick boundary confirmed. Launching drift engine...", "info");
        setActivePage('drift-analysis');

        setTimeout(() => {
          recalculateDriftModel();
          showToast("Step 3/5: Hydrodynamic drift calculated. Release origin estimated.", "info");

          setTimeout(() => {
            setActivePage('ais-tracking');
            showToast("Step 4/5: Querying historical AIS tracks in release origin zone...", "info");

            setTimeout(() => {
              setActivePage('vessel-correlation');
              markVesselUnderInvestigation("MV OCEAN CREST");
              addEvidenceItem({
                type: "AIS Correlation Report",
                source: "AIS Correlation Engine",
                vesselName: "MV OCEAN CREST",
                notes: "MV OCEAN CREST correlated with 89% score & 16m AIS gap."
              });
              showToast("Step 5/5: Correlation analysis complete! Report ready.", "success");
              setIsDemoRunning(false);
            }, 1400);
          }, 1400);
        }, 1400);
      }, 1400);
    }, 1000);
  };

  return (
    <IncidentContext.Provider value={{
      incident,
      driftModel,
      aisData,
      evidenceList,
      timelineEvents,
      toast,
      isDemoRunning,
      showToast,
      updateBoundaryArea,
      confirmDetection,
      recalculateDriftModel,
      setDriftUncertaintyMode,
      addEvidenceItem,
      markVesselUnderInvestigation,
      runDemoSimulation
    }}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncident() {
  const ctx = useContext(IncidentContext);
  if (!ctx) {
    throw new Error('useIncident must be used within IncidentProvider');
  }
  return ctx;
}
