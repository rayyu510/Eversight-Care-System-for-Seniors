// src/surveillance-center/components/Camera/CameraStatus.tsx
import React from 'react';
import { CameraDevice, getCameraStatusString } from '../../types/cameraTypes'; // Add helper import

interface CameraStatusProps {
    camera: CameraDevice; // Changed from Camera to CameraDevice
    onRestart?: (cameraId: string) => void;
    onSettings?: (camera: CameraDevice) => void; // Changed from Camera to CameraDevice
    detailed?: boolean;
}

export const CameraStatus: React.FC<CameraStatusProps> = ({
    camera,
    onRestart,
    onSettings,
    detailed = false
}) => {
    const getStatusColor = (status: CameraDevice['status']) => { // Updated parameter type
        const statusString = getCameraStatusString(status);
        switch (statusString) {
            case 'online': return 'green';
            case 'offline': return 'red';
            case 'maintenance': return 'yellow';
            case 'error': return 'red';
            default: return 'gray';
        }
    };

    const getStatusIcon = (status: CameraDevice['status']) => { // Updated parameter type
        const statusString = getCameraStatusString(status);
        switch (statusString) {
            case 'online': return '🟢';
            case 'offline': return '🔴';
            case 'maintenance': return '🟡';
            case 'error': return '⚠️';
            default: return '⚪';
        }
    };

    const formatUptime = (uptime: number) => {
        if (uptime >= 99) return 'Excellent';
        if (uptime >= 95) return 'Good';
        if (uptime >= 90) return 'Fair';
        return 'Poor';
    };

    return (
        <div className={`bg-white rounded-lg shadow ${detailed ? 'p-6' : 'p-4'}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getStatusIcon(camera.status)}</span>
                    <div>
                        <h3 className={`font-semibold text-gray-900 ${detailed ? 'text-lg' : 'text-base'}`}>
                            {camera.name}
                        </h3>
                        <p className="text-sm text-gray-600">{camera.location.description}</p> {/* Fixed: use location.description */}
                        {detailed && (
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                <span>ID: {camera.id}</span>
                                <span>Zone: {camera.location.zone}</span> {/* Fixed: use location.zone */}
                                <span>Type: {camera.type}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getStatusColor(camera.status)}-100 text-${getStatusColor(camera.status)}-800`}>
                        {getCameraStatusString(camera.status).toUpperCase()}
                    </span>
                    {onSettings && (
                        <button
                            onClick={() => onSettings(camera)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Camera Settings"
                        >
                            ⚙️
                        </button>
                    )}
                </div>
            </div>

            {/* Status Details - Fix metrics access */}
            <div className={`grid ${detailed ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'} gap-4 mb-4`}>
                <div className="text-center">
                    <div className={`text-lg font-bold text-${getStatusColor(camera.status)}-600`}>
                        {camera.status.uptime}%
                    </div>
                    <div className="text-xs text-gray-600">Uptime</div>
                    <div className="text-xs text-gray-500">{formatUptime(camera.status.uptime)}</div>
                </div>

                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                        {camera.stream.resolution}
                    </div>
                    <div className="text-xs text-gray-600">Resolution</div>
                    <div className="text-xs text-gray-500">{camera.stream.frameRate} FPS</div>
                </div>

                {/* Remove metrics that don't exist in CameraDevice interface or add them */}
            </div>

            {/* Features Status - Fix boolean access */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 text-xs rounded ${camera.status.recording
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    🔹 Recording {camera.status.recording ? 'ON' : 'OFF'}
                </span>

                <span className={`px-2 py-1 text-xs rounded ${camera.status.motionDetection
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    🎯 Motion {camera.status.motionDetection ? 'ON' : 'OFF'}
                </span>

                <span className={`px-2 py-1 text-xs rounded ${camera.capabilities.faceRecognition
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    🤖 AI {camera.capabilities.faceRecognition ? 'ON' : 'OFF'}
                </span>
            </div>

            {/* Fix capabilities access */}
            {detailed && (
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Capabilities</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between">
                                <span>Pan/Tilt:</span>
                                <span>{camera.capabilities.ptz ? '✅' : '❌'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Zoom:</span>
                                <span>{camera.capabilities.zoom ? '✅' : '❌'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Night Vision:</span>
                                <span>{camera.capabilities.nightVision ? '✅' : '❌'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Audio:</span>
                                <span>{camera.capabilities.audioRecording ? '✅' : '❌'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Face Recognition:</span>
                                <span>{camera.capabilities.faceRecognition ? '✅' : '❌'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    Last seen: {new Date(camera.status.lastSeen).toLocaleTimeString()}
                </div>

                {onRestart && !camera.status.online && (
                    <button
                        onClick={() => onRestart(camera.id)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                        🔄 Restart
                    </button>
                )}
            </div>
        </div>
    );
};