import React from 'react';
import GuardianProtectDashboard from '../../../guardian-protect/components/Dashboard/GuardianProtectDashboard';

export const GuardianProtectPage: React.FC = () => {
    return (
        <div className="page-content">
            <div className="status-badge">Module: Guardian Protect</div>
            <h2 className="page-title">Fall Detection & Floor Monitoring</h2>
            <p className="page-description">
                AI-powered fall detection system with comprehensive floor plan monitoring for rooms 201-210.
                Advanced video analytics and real-time emergency response coordination.
            </p>
            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}> </h3>
                <GuardianProtectDashboard />
            </div>

            <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Core Features</h3>
            <ul className="feature-list">
                <li className="feature-item">Interactive floor plan visualization for rooms 201-210</li>
                <li className="feature-item">Multi-camera video feed integration with AI analysis</li>
                <li className="feature-item">Real-time fall detection with confidence scoring</li>
                <li className="feature-item">Heat map visualization of high-risk zones</li>
                <li className="feature-item">Automated emergency alert system</li>
                <li className="feature-item">Caregiver location tracking and response coordination</li>
                <li className="feature-item">Historical incident analysis and reporting</li>
                <li className="feature-item">Predictive risk assessment modeling</li>
            </ul>
        </div>
    );
};