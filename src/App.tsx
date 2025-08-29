// File: src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DefaultLandingContent from './renderer/dashboard/DefaultLandingContent';
import Dashboard from './pages/Dashboard';
import DashboardTemplates from './pages/configuration/DashboardTemplates';
import Header from './components/layout/AppHeader';
import { useConfigurationStore } from './store/configurationStore';
import DashboardConfigurationWizard from './setup/DashboardConfigurationWizard';
import { DashboardTemplateRenderer } from './components/templates/DashboardTemplateRenderer';
import logo from '@assets/logo.png';

// Guardian Module Pages
import { GuardianProtectPage } from './renderer/pages/guardian/GuardianProtectPage';
import { GuardianInsightPage } from './renderer/pages/guardian/GuardianInsightPage';
import { GuardianCareProPage } from './renderer/pages/guardian/GuardianCareProPage';
import { GuardianCareTrackPage } from './renderer/pages/guardian/GuardianCareTrackPage';

// New Integration Pages
import WorksheetManagementPage from './pages/worksheets/WorksheetManagementPage';
import CameraManagementPage from './pages/cameras/CameraManagementPage';
import OperationsCenterPage from './pages/operations/OperationsCenterPage';
import SurveillanceCenterPage from './pages/surveillance/SurveillanceCenterPage';
import ProfileTemplatesPage from './pages/configuration/ProfileTemplatesPage';
import SystemSettingsPage from './pages/configuration/SystemSettingsPage';
import FamilyConnectSystem from './components/FamilyConnectSystem';

// System components
import SystemStatus from './components/layout/SystemStatus';

interface AppProps { }

const App = () => {

    //    const { isConfigured } = useConfigurationStore();  // Move this INSIDE
    const [activeModule, setActiveModule] = useState('home');
    // Read configuration state to decide whether to show the full app or the setup wizard
    const { isConfigured } = useConfigurationStore();

    // Listen for global navigation events (used by DashboardTemplates quick links)
    useEffect(() => {
        const handler = (e: any) => {
            try {
                const id = e?.detail?.id;
                if (id) setActiveModule(id);
            } catch (err) {
                // ignore
            }
        };
        window.addEventListener('navigate-to', handler as EventListener);
        return () => window.removeEventListener('navigate-to', handler as EventListener);
    }, []);

    // If the application has not been configured yet, show only the DashboardConfigurationWizard
    // with a fixed logo in the top-left. The full sidebar and other UI will render after
    // the user saves/submits the wizard which should call markAsConfigured() in the store.
    if (!isConfigured) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
                {/* Fixed logo in top-left while configuring */}
                <div style={{ position: 'fixed', left: 0, top: 0, zIndex: 50, padding: '8px 12px', backgroundColor: 'white', borderBottomRightRadius: 10 }}>
                    <img src={logo} alt="EverSight Care" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                {/* Wizard content takes the full available area */}
                <div style={{ paddingTop: '72px' }}>
                    <DashboardConfigurationWizard />
                </div>
            </div>
        );
    }

    // Check configuration AFTER hooks
    //    if (!isConfigured) {
    //        return <DashboardConfigurationWizard />;
    //    }

    // Time & Weather Widget Component (clean, single return)
    const TimeWeatherWidget = () => {
        const [currentTime, setCurrentTime] = useState(new Date());
        const [weather, setWeather] = useState({ temp: 'Loading...', condition: '⏳', location: 'Palo Alto, CA', description: 'Loading weather...' });
        const [weatherLoading, setWeatherLoading] = useState(true);

        useEffect(() => {
            const timer = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(timer);
        }, []);

        useEffect(() => {
            const fetchWeather = async () => {
                try {
                    const demoWeatherData = [
                        { temp: '72°F', condition: '☀️', description: 'Clear sky' },
                        { temp: '74°F', condition: '🌤️', description: 'Partly cloudy' },
                        { temp: '70°F', condition: '⛅', description: 'Scattered clouds' }
                    ];
                    const randomWeather = demoWeatherData[Math.floor(Math.random() * demoWeatherData.length)];
                    setWeather({ temp: randomWeather.temp, condition: randomWeather.condition, location: 'Palo Alto, CA', description: randomWeather.description });
                    setWeatherLoading(false);
                } catch (error) {
                    console.error('Weather fetch failed:', error);
                    setWeather({ temp: '72°F', condition: '🌤️', location: 'Palo Alto, CA', description: 'Weather unavailable' });
                    setWeatherLoading(false);
                }
            };
            fetchWeather();
            const weatherTimer = setInterval(fetchWeather, 600000);
            return () => clearInterval(weatherTimer);
        }, []);

        const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        return (
            <div style={{ padding: '12px 16px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', minWidth: '200px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'default' }} title={`Weather: ${weather.description}`}>
                {/* Time Section */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', fontFamily: 'monospace' }}>{formatTime(currentTime)}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{formatDate(currentTime)}</div>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '40px', backgroundColor: '#e5e7eb' }} />

                {/* Weather Section */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '2px' }}>{weatherLoading ? '⏳' : weather.condition}</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{weather.temp}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280' }}>{weather.location}</div>
                </div>
            </div>
        );
    };

    const guardianModules = [
        {
            id: 'guardian-protect',
            label: 'Guardian Protect',
            icon: '🛡️',
            status: '99% Fall DetectionAccuracy',
            metric: '48 Devices Online',
            metricIcon: '✅',
            badgeColor: '#2563eb' // Production blue
        },
        {
            id: 'guardian-insight',
            label: 'Guardian Insight',
            icon: '📊',
            status: '+ AI Worksheets',
            metric: '76% Risk Score',
            metricIcon: '📊',
            badgeColor: '#7c3aed' // AI purple
        },
        {
            id: 'guardian-carepro',
            label: 'Guardian CarePro',
            icon: '👥',
            status: '+ AI Care Management',
            metric: '89 Staff Members',
            metricIcon: '👥',
            badgeColor: '#059669' // Care green
        },
        {
            id: 'guardian-caretrack',
            label: 'Guardian CareTrack',
            icon: '💊',
            status: '+ AI Nutrition/Medication',
            metric: '92% Compliance',
            metricIcon: '✅',
            badgeColor: '#16a34a' // Track green
        }
    ];

    // NEW: AI Configuration modules
    const configurationModules = [
        {
            id: 'worksheets',
            label: 'AI Worksheets',
            subtitle: 'Automation Hub',
            icon: '📋',
            status: '70% Time Reduction'
        },
        {
            id: 'profile-templates',
            label: 'Profile Templates',
            subtitle: 'Zero-Code Config',
            icon: '👤',
            status: 'Ready'
        },
        {
            id: 'dashboard-templates',
            label: 'Dashboard Templates',
            subtitle: 'Management Config',
            icon: '📊',
            status: 'Template System'
        },
        {
            id: 'camera-management',
            label: 'Camera Management',
            subtitle: 'Monitor & Control',
            icon: '📹',
            status: 'Manage cameras'
        },
        {
            id: 'family-connect',
            label: 'Family Connect',
            subtitle: 'Family Portal',
            icon: '👨‍👩‍👧‍👦',
            badge: 'NEW',
            status: 'Real-time Updates'
        },

        {
            id: 'system-settings',
            label: 'System Settings',
            subtitle: 'Enhanced',
            icon: '⚙️',
            status: 'Active'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {/* Enhanced Left Sidebar */}
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
                    gap: '8px',
                    cursor: 'pointer'
                }}
                    onClick={() => setActiveModule('home')}
                >
                    {/* Company Logo - 2.5x Bigger */}
                    <img
                        src={logo}
                        alt="EverSight Care"
                        style={{
                            height: '60px',
                            width: 'auto',
                            objectFit: 'contain',
                            cursor: 'pointer'
                        }}
                        onError={(e) => {
                            // Fallback to text logo if image fails - also 2.5x bigger
                            e.currentTarget.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.style.cssText = 'width: 60px; height: 60px; background-color: #3b82f6; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 35px; font-weight: bold; color: white; cursor: pointer;';
                            fallback.textContent = 'E';
                            fallback.onclick = () => setActiveModule('home');
                            e.currentTarget.parentElement?.insertBefore(fallback, e.currentTarget);
                        }}
                        onClick={() => setActiveModule('home')}
                    />
                </div>

                <div style={{ height: '57px', backgroundColor: 'transparent' }}></div>

                {/* Dark Background Container */}
                <div style={{
                    backgroundColor: '#111827',
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Operations Section - NEW */}
                    <div style={{
                        padding: '12px',
                        borderBottom: '1px solid #374151',
                        backgroundColor: '#374151'
                    }}>
                        <div style={{
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '8px'
                        }}>
                            Operations
                        </div>

                        <button
                            onClick={() => setActiveModule('operations-center')}
                            style={{
                                width: '100%',
                                padding: '8px',
                                backgroundColor: activeModule === 'operations-center' ? '#3b82f6' : '#4b5563',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                marginBottom: '6px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '14px' }}>🏥</span>
                                <div>
                                    <div style={{ fontWeight: '600', color: 'white', fontSize: '12px' }}>
                                        Operations Center
                                    </div>
                                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>
                                        AI Enhanced
                                    </div>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveModule('surveillance-center')}
                            style={{
                                width: '100%',
                                padding: '8px',
                                backgroundColor: activeModule === 'surveillance-center' ? '#3b82f6' : '#4b5563',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '14px' }}>📹</span>
                                <div>
                                    <div style={{ fontWeight: '600', color: 'white', fontSize: '12px' }}>
                                        Surveillance Center
                                    </div>
                                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>
                                        AI Vision
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Guardian Modules Section */}
                    <div style={{
                        padding: '12px',
                        borderBottom: '1px solid #374151',
                        backgroundColor: '#6b7280'
                    }}>
                        <div style={{
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: '#e5e7eb',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '8px'
                        }}>
                            Guardian Modules
                        </div>
                        <div style={{ fontSize: '11px', color: '#e5e7eb', marginBottom: '12px' }}>
                            AI-Powered Care Systems
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {guardianModules.map(module => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModule(module.id)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        backgroundColor: activeModule === module.id ? '#3b82f6' : module.badgeColor,
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s ease',
                                        opacity: activeModule === module.id ? '1' : '0.9'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '16px' }}>{module.icon}</span>
                                        <span style={{ fontWeight: '600', color: 'white', fontSize: '13px' }}>
                                            {module.label}
                                        </span>
                                        {module.id === 'guardian-protect' && (
                                            <span style={{
                                                backgroundColor: '#10b981',
                                                padding: '1px 4px',
                                                borderRadius: '8px',
                                                color: 'white',
                                                fontSize: '7px',
                                                marginLeft: 'auto'
                                            }}>
                                                ✅
                                            </span>
                                        )}
                                    </div>
                                    <div style={{
                                        fontSize: '10px',
                                        color: 'rgba(255,255,255,0.8)',
                                        marginBottom: '4px'
                                    }}>
                                        {module.status}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            <span>{module.metricIcon}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{module.metric}</span>
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Configuration Section - NEW */}
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#374151',
                        flex: '1'
                    }}>
                        <div style={{
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '12px'
                        }}>
                            Configuration
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {configurationModules.map(config => (
                                <button
                                    key={config.id}
                                    onClick={() => setActiveModule(config.id)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        backgroundColor: activeModule === config.id ? '#3b82f6' : '#4b5563',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                        <span style={{ fontSize: '14px' }}>{config.icon}</span>
                                        <div style={{ flex: '1' }}>
                                            <div style={{ fontWeight: '600', color: 'white', fontSize: '12px' }}>
                                                {config.label}
                                            </div>
                                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>
                                                {config.subtitle}
                                            </div>
                                        </div>
                                        {config.badge && (
                                            <span style={{
                                                backgroundColor: '#f97316',
                                                padding: '1px 4px',
                                                borderRadius: '8px',
                                                color: 'white',
                                                fontSize: '7px'
                                            }}>
                                                {config.badge}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Footer */}
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
                                <span>AI Status:</span>
                                <span style={{ color: '#10b981' }}>Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{
                marginLeft: '200px',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                {/* Header Section with Time & Weather */}
                <div style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '24px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Center Title */}
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

                    {/* Right Side - Time & Weather Only */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <TimeWeatherWidget />
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ padding: '24px', backgroundColor: '#f9fafb', flex: '1' }}>
                    {/* MANAGEMENT OVERVIEW DASHBOARD */}
                    {(activeModule === 'home' || !activeModule) && (
                        <div style={{ padding: '24px' }}>
                            <DefaultLandingContent
                                onConfigureDashboard={() => setActiveModule('dashboard-templates')}
                            />
                        </div>
                    )}
                    {activeModule === 'dashboard-templates' && (
                        <div style={{ padding: '0' }}>
                            <DashboardConfigurationWizard />
                        </div>
                    )}
                    {activeModule === 'family-connect' && (
                        <div style={{ padding: '0' }}>
                            <FamilyConnectSystem />
                        </div>
                    )}

                    {/* Dynamic Module Content - Full Width */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        minHeight: '500px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden'
                    }}>
                        {/* EXISTING PAGE COMPONENTS - Your imports work here */}
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

                        {/* NEW AI FEATURES - Connect to your new imports */}
                        {activeModule === 'worksheets' && (
                            <div style={{ padding: '0' }}>
                                <WorksheetManagementPage />
                            </div>
                        )}
                        {activeModule === 'profile-templates' && (
                            <div style={{ padding: '0' }}>
                                <ProfileTemplatesPage />
                            </div>
                        )}
                        {activeModule === 'camera-management' && (
                            <div style={{ padding: '0' }}>
                                <CameraManagementPage />
                            </div>
                        )}
                        {activeModule === 'system-settings' && (
                            <div style={{ padding: '0' }}>
                                <SystemSettingsPage />
                            </div>
                        )}

                        {/* HOME DASHBOARD */}
                        {(activeModule === 'home' || !activeModule) && (
                            <div style={{ padding: '24px' }}>
                                {/* KPI Overview Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(6, 1fr)',
                                    gap: '16px',
                                    marginBottom: '24px'
                                }}>
                                </div>

                                {/* Recent Activity & System Status */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                                    {/* Recent Activity with AI Integration */}
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
                                                backgroundColor: '#fef2f2',
                                                borderRadius: '8px',
                                                borderLeft: '4px solid #ef4444'
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
                                                backgroundColor: '#f0fdf4',
                                                borderRadius: '8px',
                                                borderLeft: '4px solid #22c55e'
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
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px',
                                                backgroundColor: '#eff6ff',
                                                borderRadius: '8px',
                                                borderLeft: '4px solid #3b82f6'
                                            }}>
                                                <span style={{ fontSize: '20px' }}>📋</span>
                                                <div style={{ flex: '1' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                                        AI Worksheet Generated
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        Guardian Insight - ADL Assessment
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>8 min ago</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* System Status with AI Metrics */}
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
                                                    <span style={{ fontSize: '14px', color: '#3b82f6' }}>3 Enhanced</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>AI Processing</span>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>Active</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>Active Alerts</span>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#f97316' }}>3 Pending</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>Response Time</span>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>2.3 min avg</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '14px', color: '#6b7280' }}>Documentation Automation</span>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#7c3aed' }}>70% Reduction</span>
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