import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="status-badge">Module: Dashboard</div>
      <h2 className="page-title">Healthcare Management Dashboard</h2>
      <p className="page-description">
        Welcome to the Eversight Care Desktop System. This comprehensive platform provides 
        advanced healthcare management capabilities for senior care facilities.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🛡️ Guardian Protect</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>AI-powered fall detection and floor monitoring system for rooms 201-210</p>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>📊 Guardian Insight</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Health analytics and predictive modeling for resident care</p>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>📋 Guardian CareTrack</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Care documentation and billing optimization system</p>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>🤖 Guardian CarePro</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>AI clinical decision support and telemedicine platform</p>
        </div>
      </div>
      
      <ul className="feature-list">
        <li className="feature-item">Multi-role dashboard system (Caregivers, Family, Admin, Emergency, Residents)</li>
        <li className="feature-item">Real-time mobile-desktop synchronization</li>
        <li className="feature-item">Advanced security with multi-factor authentication</li>
        <li className="feature-item">Comprehensive family engagement portal</li>
        <li className="feature-item">Emergency response and facility coordination</li>
      </ul>
    </div>
  );
};
