// src/renderer/pages/guardian/GuardianInsightPage.tsx
import React from 'react';
import GuardianInsightDashboard from '../../../guardian-insight/components/Dashboard/GuardianInsightDashboard';

export const GuardianInsightPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="status-badge">Module: Guardian Insight</div>
      <h2 className="page-title">AI-Powered Healthcare Analytics</h2>
      <p className="page-description">
        Advanced artificial intelligence platform for predictive healthcare analytics, behavioral pattern recognition,
        and proactive risk assessment. Real-time insights for optimized resident care and safety.
      </p>

      <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
        <strong style={{ color: '#0369a1' }}>🧠 AI-Powered:</strong> This module leverages machine learning algorithms for predictive healthcare insights
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Live AI Dashboard</h3>
        <GuardianInsightDashboard />
      </div>

      <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>AI Capabilities</h3>
      <ul className="feature-list">
        <li className="feature-item">Predictive fall risk assessment with 78% accuracy</li>
        <li className="feature-item">Behavioral pattern anomaly detection and alerts</li>
        <li className="feature-item">Health decline prediction 3-5 days in advance</li>
        <li className="feature-item">Medication adherence monitoring and optimization</li>
        <li className="feature-item">Environmental impact analysis on resident wellness</li>
        <li className="feature-item">Real-time vital sign trend analysis</li>
        <li className="feature-item">Automated care recommendation engine</li>
        <li className="feature-item">Risk stratification and priority alert system</li>
      </ul>
    </div>
  );
};