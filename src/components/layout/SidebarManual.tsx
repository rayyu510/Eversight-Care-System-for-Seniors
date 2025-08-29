import React from 'react';
import logo from '@assets/logo.png';

interface SidebarManualProps {
    activeModule: string;
    setActiveModule: (id: string) => void;
}

const SidebarManual: React.FC<SidebarManualProps> = ({ activeModule, setActiveModule }) => {
    const cameraCount = 0; // placeholder, App.tsx shows count; kept minimal here

    const guardianModules = [
        { id: 'operations-center', label: 'Operations Center', icon: '🏥', subtitle: 'AI Enhanced' },
        { id: 'surveillance-center', label: 'Surveillance Center', icon: '📹', subtitle: 'AI Vision' }
    ];

    const configurationModules = [
        { id: 'worksheets', label: 'AI Worksheets', icon: '📋', subtitle: 'Automation Hub' },
        { id: 'profile-templates', label: 'Profile Templates', icon: '👤', subtitle: 'Zero-Code Config' },
        { id: 'dashboard-templates', label: 'Dashboard Templates', icon: '📊', subtitle: 'Management Config — includes Camera Management guidance' },
        { id: 'camera-management', label: 'Camera Management', icon: '📹', subtitle: `${cameraCount} Cameras` },
        { id: 'family-connect', label: 'Family Connect', icon: '👨‍👩‍👧‍👦', subtitle: 'Family Portal' },
        { id: 'system-settings', label: 'System Settings', icon: '⚙️', subtitle: 'Enhanced' }
    ];

    return (
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
            <div style={{
                padding: '12px 16px',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
            }} onClick={() => setActiveModule('home')}>
                <img src={logo} alt="EverSight Care" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
            </div>

            <div style={{ height: '57px', backgroundColor: 'transparent' }} />

            <div style={{ backgroundColor: '#111827', flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px', borderBottom: '1px solid #374151', backgroundColor: '#374151' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Operations</div>
                    {guardianModules.map(m => (
                        <button key={m.id} onClick={() => setActiveModule(m.id)} style={{ width: '100%', padding: '8px', backgroundColor: activeModule === m.id ? '#3b82f6' : '#4b5563', borderRadius: '4px', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '6px', transition: 'all 0.2s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '14px' }}>{m.icon}</span>
                                <div>
                                    <div style={{ fontWeight: '600', color: 'white', fontSize: '12px' }}>{m.label}</div>
                                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>{m.subtitle}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div style={{ padding: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Guardian Modules</div>
                    {configurationModules.map(m => (
                        <button key={m.id} onClick={() => setActiveModule(m.id)} style={{ width: '100%', padding: '8px', backgroundColor: activeModule === m.id ? '#3b82f6' : 'transparent', borderRadius: '4px', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '6px', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '14px' }}>{m.icon}</span>
                                <div>
                                    <div style={{ fontWeight: '600', color: 'white', fontSize: '12px' }}>{m.label}</div>
                                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>{m.subtitle}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div style={{ padding: '12px', marginTop: 'auto', borderTop: '1px solid #374151' }}>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '6px' }}>Status</div>
                    <div style={{ fontSize: '12px', color: 'white' }}>System Online</div>
                </div>
            </div>
        </div>
    );
};

export default SidebarManual;
