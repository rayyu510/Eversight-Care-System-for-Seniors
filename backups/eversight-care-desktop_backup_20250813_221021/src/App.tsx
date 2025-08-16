// src/renderer/App.tsx
import React, { useState } from 'react';
import { GuardianProtectPage } from './renderer/pages/guardian/GuardianProtectPage';
import { GuardianInsightPage } from './renderer/pages/guardian/GuardianInsightPage';
import { GuardianCareProPage } from './renderer/pages/guardian/GuardianCareProPage';
import { GuardianCareTrackPage } from './renderer/pages/guardian/GuardianCareTrackPage';


const App = () => {
    const [activeModule, setActiveModule] = useState('guardian-protect');

    const navigationItems = [
        {
            id: 'guardian-protect',
            label: 'Guardian Protect',
            description: 'Fall Detection & Floor Monitoring',
            icon: '🛡️',
            component: GuardianProtectPage
        },
        {
            id: 'guardian-insight',
            label: 'Guardian Insight',
            description: 'AI-Powered Healthcare Analytics',
            icon: '🧠',
            component: GuardianInsightPage
        },
        {
            id: 'guardian-carepro',
            label: 'Guardian CarePro',
            description: 'Professional Care Management',
            icon: '🏥',
            component: GuardianCareProPage
        },
        {
            id: 'guardian-caretrack',
            label: 'Guardian CareTrack',
            description: 'Medication & Treatment Tracking',
            icon: '💊',
            component: GuardianCareTrackPage
        }
    ];

    return (
        <div className="app">
            {/* Header with Logo */}
            <div className="app-header" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 24px',
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Company Logo */}
                    <img
                        src="/assets/logo.png"
                        alt="EverSight Care"
                        style={{
                            height: '40px',
                            width: 'auto',
                            objectFit: 'contain'
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    {/* Company Name */}
                    <h1 style={{
                        margin: '0',
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#111827',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}>
                        EverSight Care Desktop
                    </h1>
                </div>

                {/* Navigation or user info on the right */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Healthcare Management Platform
                    </div>
                </div>
            </div>

            {/* Module Navigation */}
            <div style={{ padding: '24px' }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '600' }}>
                    Healthcare Modules
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    {navigationItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveModule(item.id)}
                            style={{
                                padding: '20px',
                                border: activeModule === item.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                borderRadius: '12px',
                                backgroundColor: activeModule === item.id ? '#f0f9ff' : 'white',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                                <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600' }}>
                                    {item.label}
                                </h3>
                            </div>
                            <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                {item.description}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Render the active module */}
                <div>
                    {activeModule === 'guardian-protect' && <GuardianProtectPage />}
                    {activeModule === 'guardian-insight' && <GuardianInsightPage />}
                    {activeModule === 'guardian-carepro' && <GuardianCareProPage />}
                    {activeModule === 'guardian-caretrack' && <GuardianCareTrackPage />}
                </div>
            </div>
        </div>
    );
};

export default App; // ✅ This is the key line that was missing!