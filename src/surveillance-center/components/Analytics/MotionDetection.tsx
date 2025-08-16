// src/surveillance-center/components/Analytics/MotionDetection.tsx
import React from 'react';
import { useAIDetections } from '../../hooks';

export const MotionDetection: React.FC = () => {
    const { motionEvents, loading } = useAIDetections();

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Motion Detection</h3>
                <p className="text-sm text-gray-600">Real-time motion detection events</p>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{motionEvents.length}</div>
                        <div className="text-sm text-blue-800">Motion Events (24h)</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {motionEvents.filter(m => m.classification === 'person').length}
                        </div>
                        <div className="text-sm text-green-800">Recordings Triggered</div>
                    </div>
                </div>
            </div>
        </div>
    );
};