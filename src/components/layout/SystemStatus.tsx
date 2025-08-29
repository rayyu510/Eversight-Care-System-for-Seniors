import React from 'react';

const SystemStatus: React.FC = () => (
    <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: '#10b981' }}>●</div>
        <div style={{ fontSize: 12, color: '#374151' }}>AI: Active</div>
    </div>
);

export default SystemStatus;
