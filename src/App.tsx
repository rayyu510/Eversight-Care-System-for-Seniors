import React, { useState } from 'react';
import AppHeader from './components/layout/AppHeader';
import HomePage from './pages/HomePage';
import OperationsCenterPage from './pages/operations/OperationsCenterPage';
import SurveillanceCenterPage from './pages/surveillance/SurveillanceCenterPage';

// Import your existing Guardian modules
import { GuardianProtectPage } from './renderer/pages/guardian/GuardianProtectPage';
import { GuardianInsightPage } from './renderer/pages/guardian/GuardianInsightPage';
import { GuardianCareProPage } from './renderer/pages/guardian/GuardianCareProPage';
import { GuardianCareTrackPage } from './renderer/pages/guardian/GuardianCareTrackPage';

const App = () => {
    const [activeModule, setActiveModule] = useState('home');

    const guardianModules = [
        {
            id: 'guardian-protect',
            label: 'Guardian Protect',
            description: 'AI-powered fall detection & emergency response',
            icon: '🛡️',
            status: 'Active',
            metric: '48 Devices Online',
            metricIcon: '✅'
        },
        {
            id: 'guardian-insight',
            label: 'Guardian Insight',
            description: 'AI analytics & health predictions',
            icon: '🧠',
            status: 'Development',
            metric: '76% Risk Score',
            metricIcon: '📊'
        },
        {
            id: 'guardian-carepro',
            label: 'Guardian CarePro',
            description: 'Comprehensive care management',
            icon: '🏥',
            status: 'Development',
            metric: '89 Staff Members',
            metricIcon: '👥'
        },
        {
            id: 'guardian-caretrack',
            label: 'Guardian CareTrack',
            description: 'Medication & treatment tracking',
            icon: '💊',
            status: 'Development',
            metric: '92% Compliance',
            metricIcon: '✅'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {/* Left Sidebar - Guardian Modules Manual Bar */}
            <div style={{
                width: '200px',
                backgroundColor: 'transparent',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: '0',
                top: '0',
                height: '100vh',
                zIndex: 10
            }}>
                {/* Logo Section - Top Left with White Background (No Border) */}
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    {/* Company Logo - 2.5x Bigger */}
                    <img
                        src="/assets/logo.png"
                        alt="EverSight Care"
                        style={{
                            height: '60px',
                            width: 'auto',
                            objectFit: 'contain'
                        }}
                        onError={(e) => {
                            // Fallback to text logo if image fails - also 2.5x bigger
                            e.currentTarget.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.style.cssText = 'width: 60px; height: 60px; background-color: #3b82f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 35px; font-weight: bold; color: white;';
                            fallback.textContent = 'E';
                            e.currentTarget.parentElement?.insertBefore(fallback, e.currentTarget);
                        }}
                    />
                </div>

                {/* Spacer to move gray background lower by 15mm (20mm - 5mm) */}
                <div style={{ height: '57px', backgroundColor: 'transparent' }}></div>

                {/* Dark Background Container - Starts 20mm lower */}
                <div style={{
                    backgroundColor: '#111827',
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Sidebar Header - Aligned with EverSight Care header */}
                    <div style={{
                        padding: '16px',
                        borderBottom: '1px solid #374151',
                        backgroundColor: '#6b7280'
                    }}>
                        <h2 style={{
                            margin: '0 0 4px 0',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            Guardian Modules
                        </h2>
                        <p style={{
                            margin: '0',
                            fontSize: '11px',
                            color: '#e5e7eb'
                        }}>
                            AI-Powered Care Systems
                        </p>
                    </div>

                    {/* Guardian Module Navigation - Much Narrower with Gray Background */}
                    <div style={{ flex: '1', padding: '12px', overflowY: 'auto', backgroundColor: '#6b7280' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {guardianModules.map(module => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModule(module.id)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        backgroundColor: activeModule === module.id ? '#3b82f6' :
                                            module.id === 'guardian-protect' ? '#2563eb' :
                                                module.id === 'guardian-insight' ? '#7c3aed' :
                                                    module.id === 'guardian-carepro' ? '#059669' : '#16a34a',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s ease',
                                        opacity: activeModule === module.id ? '1' : '0.9'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeModule !== module.id) {
                                            e.currentTarget.style.opacity = '1';
                                            e.currentTarget.style.transform = 'translateX(2px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeModule !== module.id) {
                                            e.currentTarget.style.opacity = '0.9';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '16px' }}>{module.icon}</span>
                                        <span style={{ fontWeight: '600', color: 'white', fontSize: '13px' }}>
                                            {module.label}
                                        </span>
                                    </div>
                                    <p style={{
                                        margin: '0 0 6px 0',
                                        fontSize: '10px',
                                        color: 'rgba(255,255,255,0.8)',
                                        lineHeight: '1.2'
                                    }}>
                                        {module.description}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>{module.metricIcon}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{module.metric}</span>
                                        </span>
                                        <span style={{
                                            backgroundColor: module.status === 'Active' ? '#3b82f6' : '#f97316',
                                            padding: '1px 4px',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '8px'
                                        }}>
                                            {module.status}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Footer with Gray Background */}
                    <div style={{
                        padding: '12px',
                        borderTop: '1px solid #374151',
                        backgroundColor: '#6b7280'
                    }}>
                        <div style={{ fontSize: '9px', color: '#e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <span>System:</span>
                                <span style={{ color: '#10b981' }}>97%</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Update:</span>
                                <span style={{ color: 'white' }}>Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Offset by much narrower sidebar width */}
            <div style={{
                marginLeft: '200px',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                {/* Header Section with Moved Text */}
                <div style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '24px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Moved Company Name to Upper Center - Single Line */}
                        <div style={{ flex: '1', textAlign: 'center' }}>
                            <h1 style={{
                                margin: '0',
                                fontSize: '32px',
                                fontWeight: 'bold',
                                color: '#111827'
                            }}>
                                EverSight Care Desktop Platform
                            </h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>97%</div>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>System Health</div>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#d1fae5',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{ fontSize: '24px', color: '#10b981' }}>✅</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area with Always Visible Control Centers */}
                <div style={{ padding: '24px', backgroundColor: '#f9fafb', flex: '1' }}>
                    {/* ALWAYS VISIBLE: Upper Section - Operations & Surveillance Centers */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '24px',
                        marginBottom: '32px'
                    }}>
                        {/* Operations Center - ALWAYS VISIBLE */}
                        <button
                            onClick={() => setActiveModule('operations-center')}
                            style={{
                                backgroundColor: 'white',
                                padding: '24px',
                                borderRadius: '12px',
                                border: activeModule === 'operations-center' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                boxShadow: activeModule === 'operations-center' ? '0 4px 12px 0 rgba(0, 0, 0, 0.15)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '24px' }}>⚙️</span>
                                </div>
                                <div>
                                    <h3 style={{ margin: '0', fontSize: '20px', fontWeight: '600', color: '#111827' }}>
                                        Operations Center
                                    </h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                                        Central command and control hub
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                                        <span style={{ color: '#10b981' }}>✅</span>
                                        <span style={{ color: '#10b981' }}>Operational</span>
                                    </span>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>3 Active Alerts</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>System Status</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Real-time monitoring</div>
                                </div>
                            </div>
                        </button>

                        {/* Surveillance Center - ALWAYS VISIBLE */}
                        <button
                            onClick={() => setActiveModule('surveillance-center')}
                            style={{
                                backgroundColor: 'white',
                                padding: '24px',
                                borderRadius: '12px',
                                border: activeModule === 'surveillance-center' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                boxShadow: activeModule === 'surveillance-center' ? '0 4px 12px 0 rgba(0, 0, 0, 0.15)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: '#eef2ff',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '24px' }}>📹</span>
                                </div>
                                <div>
                                    <h3 style={{ margin: '0', fontSize: '20px', fontWeight: '600', color: '#111827' }}>
                                        Surveillance Center
                                    </h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                                        AI-powered video analytics
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                                        <span style={{ color: '#10b981' }}>✅</span>
                                        <span style={{ color: '#10b981' }}>Operational</span>
                                    </span>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>22/24 Cameras Online</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>AI Analytics</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>94% Detection Accuracy</div>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Dynamic Module Content Area - Below the always visible centers */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        minHeight: '500px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden'
                    }}>
                        {/* Load specific module content based on selection */}
                        {activeModule === 'operations-center' && (
                            <div style={{ padding: '0' }}>
                                <OperationsCenterPage />
                            </div>
                        )}
                        {activeModule === 'surveillance-center' && (
                            <div style={{ padding: '0' }}>
                                <SurveillanceCenterPage />
                            </div>
                        )}
                        {activeModule === 'guardian-protect' && (
                            <div style={{ padding: '0' }}>
                                <GuardianProtectPage />
                            </div>
                        )}
                        {activeModule === 'guardian-insight' && (
                            <div style={{ padding: '0' }}>
                                <GuardianInsightPage />
                            </div>
                        )}
                        {activeModule === 'guardian-carepro' && (
                            <div style={{ padding: '0' }}>
                                <GuardianCareProPage />
                            </div>
                        )}
                        {activeModule === 'guardian-caretrack' && (
                            <div style={{ padding: '0' }}>
                                <GuardianCareTrackPage />
                            </div>
                        )}
                        {(activeModule === 'home' || !activeModule) && (
                            <div style={{ padding: '24px' }}>
                                {/* KPI Overview Grid for Home */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(6, 1fr)',
                                    gap: '16px',
                                    marginBottom: '24px'
                                }}>
                                    {[
                                        { value: '127', label: 'Residents', color: '#3b82f6' },
                                        { value: '47', label: 'Staff Online', color: '#10b981' },
                                        { value: '22/24', label: 'Cameras', color: '#6366f1' },
                                        { value: '48', label: 'Safety Devices', color: '#3b82f6' },
                                        { value: '97%', label: 'System Health', color: '#10b981' },
                                        { value: '92%', label: 'Med Compliance', color: '#059669' }
                                    ].map((kpi, index) => (
                                        <div key={index} style={{
                                            backgroundColor: '#f9fafb',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: kpi.color }}>
                                                {kpi.value}
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                                {kpi.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Activity & System Status for Home */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                                    {/* Recent Activity */}
                                    <div style={{
                                        backgroundColor: '#f9fafb',
                                        padding: '24px',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                                            Recent Activity
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px',
                                                backgroundColor: '#dbeafe',
                                                borderRadius: '8px'
                                            }}>
                                                <span style={{ fontSize: '20px' }}>🛡️</span>
                                                <div style={{ flex: '1' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                                        Emergency Response Activated
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        Guardian Protect - Room 204
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>2 min ago</div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px',
                                                backgroundColor: '#d1fae5',
                                                borderRadius: '8px'
                                            }}>
                                                <span style={{ fontSize: '20px' }}>📹</span>
                                                <div style={{ flex: '1' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                                        Security Event Resolved
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        Surveillance Center - Lobby
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>5 min ago</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* System Status */}
                                    <div style={{
                                        backgroundColor: '#f9fafb',
                                        padding: '24px',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                                            System Status
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>Overall System Health</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{
                                                        width: '96px',
                                                        backgroundColor: '#e5e7eb',
                                                        borderRadius: '4px',
                                                        height: '8px',
                                                        position: 'relative'
                                                    }}>
                                                        <div style={{
                                                            backgroundColor: '#10b981',
                                                            height: '8px',
                                                            borderRadius: '4px',
                                                            width: '97%'
                                                        }}></div>
                                                    </div>
                                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>97%</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>Guardian Modules</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '14px', color: '#10b981' }}>1 Active</span>
                                                    <span style={{ fontSize: '14px', color: '#f97316' }}>3 Development</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>Active Alerts</span>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#f97316' }}>3 Pending</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>Response Time</span>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>2.3 min avg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;