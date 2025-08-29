import React from 'react';

export const DashboardTemplateRenderer: React.FC<{ template?: any }> = ({ template }) => {
    return (
        <div style={{ padding: 12 }}>
            <h3>Template Preview</h3>
            <pre style={{ fontSize: 12 }}>{JSON.stringify(template || {}, null, 2)}</pre>
        </div>
    );
};

export default DashboardTemplateRenderer;
