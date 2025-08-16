import React from 'react';
import GuardianCareProDashboard from '../../../guardian-carepro/components/Dashboard/GuardianCareProDashboard';

export const GuardianCareProPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="status-badge">Module: Guardian CarePro</div>
      <h2 className="page-title">Professional Care Management</h2>
      <p className="page-description">
        Advanced professional care management system with chronic disease prediction and prevention.
        AI-powered heart attack, stroke, and diabetes risk assessment with early warning capabilities.
      </p>

      <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
        <strong style={{ color: '#991b1b' }}>🏥 Clinical Grade:</strong> Professional care management with chronic disease prediction algorithms
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Live Care Dashboard</h3>
        <GuardianCareProDashboard />
      </div>

      <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Professional Features</h3>
      <ul className="feature-list">
        <li className="feature-item">Chronic disease prediction (Heart attack, Stroke, Diabetes)</li>
        <li className="feature-item">Advanced risk assessment with 65-82% AI confidence</li>
        <li className="feature-item">Professional care plan management and documentation</li>
        <li className="feature-item">Staff scheduling and performance analytics</li>
        <li className="feature-item">Family communication and engagement platform</li>
        <li className="feature-item">Real-time vital sign monitoring and trend analysis</li>
        <li className="feature-item">Predictive alerts with 12 hours to 10 days advance warning</li>
        <li className="feature-item">Clinical decision support and care recommendations</li>
      </ul>
    </div>
  );
};