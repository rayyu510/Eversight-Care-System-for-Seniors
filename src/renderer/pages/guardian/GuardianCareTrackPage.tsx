import React from 'react';
import GuardianCareTrackDashboard from '../../../guardian-caretrack/components/Dashboard/GuardianCareTrackDashboard';

export const GuardianCareTrackPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="status-badge">Module: Guardian CareTrack</div>
      <h2 className="page-title">Medication & Treatment Tracking</h2>
      <p className="page-description">
        Digital medication administration record (MAR) and treatment tracking system with pharmacy integration and compliance analytics.
      </p>

      <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
        <strong style={{ color: '#0369a1' }}>💊 Digital MAR:</strong> Complete medication administration record with 92% compliance tracking
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Live Medication Dashboard</h3>
        <GuardianCareTrackDashboard />
      </div>
    </div>
  );
};