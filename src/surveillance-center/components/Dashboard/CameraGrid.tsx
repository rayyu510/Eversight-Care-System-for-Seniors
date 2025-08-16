// src/surveillance-center/components/Dashboard/CameraGrid.tsx
import React from 'react';

export const CameraGrid: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Camera Grid</h3>
                <p className="text-sm text-gray-600">Live camera feed grid view</p>
            </div>

            <div className="p-6">
                <div className="text-center text-gray-500">
                    <div className="text-4xl mb-4">📹</div>
                    <div className="text-lg font-medium">Camera Grid View</div>
                    <div className="text-sm">Multi-camera live feed display</div>
                </div>
            </div>
        </div>
    );
};