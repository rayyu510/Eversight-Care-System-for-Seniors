import React from 'react';
import { useConfigurationStore } from '../../store/configurationStore';

const DashboardTemplates: React.FC = () => {
    const cameraCount = useConfigurationStore(state => state.cameraProfiles.length);

    return (
        <div style={{ padding: 24 }}>
            <h1>Dashboard Templates</h1>
            <p>Manage and create dashboard templates. This section includes instructions on associating cameras to rooms and launching the Camera Management tool.</p>

            <div style={{ marginTop: 16, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                <h3>Camera Management</h3>
                <p>Use the Camera Management page to add, edit, and assign cameras to rooms. Current camera count: <strong>{cameraCount}</strong>.</p>
                <p>To reconcile camera assignments with the dashboard configuration wizard, ensure you:</p>
                <ol>
                    <li>Run the <em>Dashboard Configuration Wizard</em> to generate room assignments.</li>
                    <li>Open <code>Camera Management</code> to add cameras and assign them to room IDs created by the wizard (e.g., <code>resident_room_1</code>).</li>
                    <li>Use the Technology step in the wizard to set preferred camera types; these preferences are stored as room assignments in the configuration store.</li>
                </ol>
                <p><a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate-to', { detail: { id: 'camera-management' } })); }}>Open Camera Management</a></p>
            </div>
        </div>
    );
};

export default DashboardTemplates;
