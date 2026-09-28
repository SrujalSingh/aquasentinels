import React, { useState } from 'react';
import { IncidentProvider } from './context/IncidentContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { Overview } from './pages/Overview';
import { Incidents } from './pages/Incidents';
import { IncidentDetail } from './pages/IncidentDetail';
import { AnalysisFlow } from './pages/AnalysisFlow';
import { SpillDetectionWorkspace } from './pages/SpillDetectionWorkspace';
import { DriftAnalysisWorkspace } from './pages/DriftAnalysisWorkspace';
import { AISTrackingWorkspace } from './pages/AISTrackingWorkspace';
import { VesselCorrelationWorkspace } from './pages/VesselCorrelationWorkspace';
import { SatelliteLibrary } from './pages/SatelliteLibrary';
import { EvidenceRepository } from './pages/EvidenceRepository';
import { ReportGenerator } from './pages/ReportGenerator';
import { DataSources } from './pages/DataSources';
import { Settings } from './pages/Settings';
import { DEFAULT_INCIDENT_ID, MOCK_CANDIDATE_VESSELS } from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState(DEFAULT_INCIDENT_ID);
  const [selectedVessel, setSelectedVessel] = useState(MOCK_CANDIDATE_VESSELS[0]);

  const renderMainContent = () => {
    switch (activePage) {
      case 'overview':
        return <Overview setActivePage={setActivePage} setSelectedIncidentId={setSelectedIncidentId} />;
      case 'incidents':
        return <Incidents setActivePage={setActivePage} setSelectedIncidentId={setSelectedIncidentId} />;
      case 'incident-detail':
        return (
          <IncidentDetail 
            incidentId={selectedIncidentId} 
            setActivePage={setActivePage} 
            setSelectedVessel={setSelectedVessel} 
          />
        );
      case 'analysis-flow':
        return (
          <AnalysisFlow 
            key="flow-1"
            initialStep={1}
            setActivePage={setActivePage} 
            setSelectedVessel={setSelectedVessel} 
            setSelectedIncidentId={setSelectedIncidentId} 
          />
        );
      case 'spill-detection':
        return <SpillDetectionWorkspace setActivePage={setActivePage} />;
      case 'drift-analysis':
        return <DriftAnalysisWorkspace setActivePage={setActivePage} />;
      case 'ais-tracking':
        return <AISTrackingWorkspace setActivePage={setActivePage} setSelectedVessel={setSelectedVessel} />;
      case 'vessel-correlation':
        return (
          <VesselCorrelationWorkspace 
            setActivePage={setActivePage} 
            selectedVesselProp={selectedVessel} 
          />
        );
      case 'satellite-library':
        return <SatelliteLibrary setActivePage={setActivePage} />;
      case 'evidence':
        return <EvidenceRepository />;
      case 'reports':
        return <ReportGenerator incidentId={selectedIncidentId} />;
      case 'data-sources':
        return <DataSources />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview setActivePage={setActivePage} setSelectedIncidentId={setSelectedIncidentId} />;
    }
  };

  return (
    <IncidentProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#F6F8FB] text-[#172033] font-sans antialiased">
        {/* Left Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Main Container */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Header */}
          <TopHeader
            activePage={activePage}
            setActivePage={setActivePage}
            selectedIncidentId={selectedIncidentId}
            setSelectedIncidentId={setSelectedIncidentId}
            setSelectedVessel={setSelectedVessel}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-[#F6F8FB]">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </IncidentProvider>
  );
}
