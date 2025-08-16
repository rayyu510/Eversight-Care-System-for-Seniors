import React from 'react';
import { createRoot } from 'react-dom/client';

const TestApp = () => {
    return (
        <div style={{ padding: '20px', fontSize: '24px', color: 'green' }}>
            <h1>🎉 Electron is working!</h1>
            <p>Guardian Protect System - Test Mode</p>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<TestApp />);
} else {
    console.error('Root container not found');
}