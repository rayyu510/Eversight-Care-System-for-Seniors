// src/surveillance-center/components/Analytics/AlertGeneration.tsx
import React from 'react';

export const AlertGeneration: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Alert Generation</h3>
                <p className="text-sm text-gray-600">Manage automated alert generation rules</p>
            </div>

            <div className="p-6">
                <div className="text-center text-gray-500">
                    <div className="text-4xl mb-4">🚨</div>
                    <div className="text-lg font-medium">Alert Generation System</div>
                    <div className="text-sm">Configure AI-powered alert rules</div>
                </div>
            </div>
        </div>
    );
};