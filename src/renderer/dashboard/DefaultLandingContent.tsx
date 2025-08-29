import React from 'react';

const DefaultLandingContent: React.FC<{ onConfigureDashboard?: () => void }> = ({ onConfigureDashboard }) => {
    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Welcome to EverSight Care</h2>
            <p style={{ color: '#6b7280' }}>Use the Configuration wizard to set up your facility and dashboards.</p>
            {onConfigureDashboard && (
                <div style={{ marginTop: 12 }}>
                    <button onClick={onConfigureDashboard} style={{ padding: '8px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6 }}>
                        Configure Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default DefaultLandingContent;
