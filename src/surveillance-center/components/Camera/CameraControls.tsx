// src/surveillance-center/components/Camera/CameraControls.tsx
import React, { useState, useRef, useEffect } from 'react';
import { CameraDevice, CameraControl } from '../../types/cameraTypes'; // Fixed import

interface CameraControlsProps {
    camera: CameraDevice; // Fixed type
    onControl?: (control: CameraControl) => Promise<boolean>;
    onSnapshot?: (cameraId: string) => Promise<string>;
    onStartRecording?: (cameraId: string, duration?: number) => Promise<string>;
    onStopRecording?: (cameraId: string, recordingId: string) => Promise<boolean>;
    compact?: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
    camera,
    onControl,
    onSnapshot,
    onStartRecording,
    onStopRecording,
    compact = false
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [controlLoading, setControlLoading] = useState<string | null>(null);
    const [panTiltValues, setPanTiltValues] = useState({ pan: 0, tilt: 0 });
    const [zoomValue, setZoomValue] = useState(1);
    const [selectedPreset, setSelectedPreset] = useState<string>('');

    const recordingInterval = useRef<NodeJS.Timeout | null>(null);

    // Camera presets (mock data)
    const presets = [
        { id: 'preset-1', name: 'Main View', pan: 0, tilt: 0, zoom: 1 },
        { id: 'preset-2', name: 'Entrance Focus', pan: 15, tilt: -10, zoom: 2 },
        { id: 'preset-3', name: 'Wide Angle', pan: 0, tilt: 0, zoom: 0.5 },
        { id: 'preset-4', name: 'Security Point', pan: -20, tilt: 5, zoom: 1.5 }
    ];

    useEffect(() => {
        if (isRecording) {
            recordingInterval.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (recordingInterval.current) {
                clearInterval(recordingInterval.current);
                recordingInterval.current = null;
            }
            setRecordingDuration(0);
        }

        return () => {
            if (recordingInterval.current) {
                clearInterval(recordingInterval.current);
            }
        };
    }, [isRecording]);

    const executeControl = async (action: string, parameters: Record<string, any>) => {
        if (!onControl) return false;

        setControlLoading(action);
        try {
            const control: CameraControl = {
                cameraId: camera.id,
                action: action as any,
                parameters,
                timestamp: new Date().toISOString()
            };

            const success = await onControl(control);
            if (success && (action === 'pan' || action === 'tilt')) {
                setPanTiltValues(prev => ({
                    ...prev,
                    [action]: parameters.value
                }));
            } else if (success && action === 'zoom') {
                setZoomValue(parameters.value);
            }

            return success;
        } catch (error) {
            console.error('Control action failed:', error);
            return false;
        } finally {
            setControlLoading(null);
        }
    };

    const handlePanTilt = async (direction: 'up' | 'down' | 'left' | 'right') => {
        const step = 5; // degrees
        let panDelta = 0;
        let tiltDelta = 0;

        switch (direction) {
            case 'up': tiltDelta = step; break;
            case 'down': tiltDelta = -step; break;
            case 'left': panDelta = -step; break;
            case 'right': panDelta = step; break;
        }

        const newPan = Math.max(-180, Math.min(180, panTiltValues.pan + panDelta));
        const newTilt = Math.max(-90, Math.min(90, panTiltValues.tilt + tiltDelta));

        if (panDelta !== 0) {
            await executeControl('pan', { value: newPan, relative: false });
        }
        if (tiltDelta !== 0) {
            await executeControl('tilt', { value: newTilt, relative: false });
        }
    };

    const handleZoom = async (direction: 'in' | 'out') => {
        const step = 0.1;
        const newZoom = direction === 'in'
            ? Math.min(10, zoomValue + step)
            : Math.max(0.1, zoomValue - step);

        await executeControl('zoom', { value: newZoom });
    };

    const handlePreset = async (presetId: string) => {
        const preset = presets.find(p => p.id === presetId);
        if (!preset) return;

        const success = await executeControl('preset', { presetId, preset });
        if (success) {
            setSelectedPreset(presetId);
            setPanTiltValues({ pan: preset.pan, tilt: preset.tilt });
            setZoomValue(preset.zoom);
        }
    };

    const handleSnapshot = async () => {
        if (!onSnapshot) return;

        setControlLoading('snapshot');
        try {
            const snapshotUrl = await onSnapshot(camera.id);
            // Download the snapshot
            const link = document.createElement('a');
            link.href = snapshotUrl;
            link.download = `${camera.name}-${new Date().toISOString()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Snapshot failed:', error);
        } finally {
            setControlLoading(null);
        }
    };

    const handleRecording = async () => {
        if (isRecording) {
            // Stop recording
            if (onStopRecording && currentRecordingId) {
                setControlLoading('stop-record');
                try {
                    await onStopRecording(camera.id, currentRecordingId);
                    setIsRecording(false);
                    setCurrentRecordingId(null);
                } catch (error) {
                    console.error('Stop recording failed:', error);
                } finally {
                    setControlLoading(null);
                }
            }
        } else {
            // Start recording
            if (onStartRecording) {
                setControlLoading('start-record');
                try {
                    const recordingId = await onStartRecording(camera.id);
                    setIsRecording(true);
                    setCurrentRecordingId(recordingId);
                } catch (error) {
                    console.error('Start recording failed:', error);
                } finally {
                    setControlLoading(null);
                }
            }
        }
    };

    const formatRecordingTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (compact) {
        return (
            <div className="bg-white rounded-lg shadow p-3">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 text-sm">Camera Controls</h4>
                    <span className={`w-2 h-2 rounded-full ${camera.status.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleSnapshot}
                        disabled={controlLoading === 'snapshot' || !camera.status.online}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                    >
                        {controlLoading === 'snapshot' ? '⏳' : '📸'} Snapshot
                    </button>

                    <button
                        onClick={handleRecording}
                        disabled={controlLoading?.includes('record') || !camera.status.online}
                        className={`px-2 py-1 text-xs rounded transition-colors disabled:opacity-50 ${isRecording
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                    >
                        {controlLoading?.includes('record') ? '⏳' : isRecording ? '⏹️' : '🔴'}
                        {isRecording ? 'Stop' : 'Record'}
                    </button>
                </div>

                {isRecording && (
                    <div className="mt-2 text-center">
                        <div className="text-xs text-red-600 font-mono">
                            🔴 REC {formatRecordingTime(recordingDuration)}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Camera Controls</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{camera.name}</span>
                        <span className={`w-3 h-3 rounded-full ${camera.status.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Pan/Tilt Controls */}
                {camera.capabilities && camera.capabilities.ptz && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Pan / Tilt Control</h4>
                        <div className="flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-2">
                                <div></div>
                                <button
                                    onClick={() => handlePanTilt('up')}
                                    disabled={controlLoading !== null || !camera.status.online}
                                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                    ⬆️
                                </button>
                                <div></div>

                                <button
                                    onClick={() => handlePanTilt('left')}
                                    disabled={controlLoading !== null || !camera.status.online}
                                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                    ⬅️
                                </button>
                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                    🎯
                                </div>
                                <button
                                    onClick={() => handlePanTilt('right')}
                                    disabled={controlLoading !== null || !camera.status.online}
                                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                    ➡️
                                </button>

                                <div></div>
                                <button
                                    onClick={() => handlePanTilt('down')}
                                    disabled={controlLoading !== null || !camera.status.online}
                                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                    ⬇️
                                </button>
                                <div></div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Pan:</span>
                                <span className="ml-2 font-mono">{panTiltValues.pan}°</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Tilt:</span>
                                <span className="ml-2 font-mono">{panTiltValues.tilt}°</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Zoom Controls */}
                {camera.capabilities && camera.capabilities.zoom && (
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Zoom Control</h4>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleZoom('out')}
                                disabled={controlLoading !== null || !camera.status.online || zoomValue <= 0.1}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                            >
                                🔍➖ Zoom Out
                            </button>

                            <div className="flex-1 text-center">
                                <div className="text-lg font-mono">{zoomValue.toFixed(1)}x</div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="10"
                                    step="0.1"
                                    value={zoomValue}
                                    onChange={(e) => {
                                        const newZoom = parseFloat(e.target.value);
                                        setZoomValue(newZoom);
                                        executeControl('zoom', { value: newZoom });
                                    }}
                                    disabled={controlLoading !== null || !camera.status.online}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <button
                                onClick={() => handleZoom('in')}
                                disabled={controlLoading !== null || !camera.status.online || zoomValue >= 10}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                            >
                                🔍➕ Zoom In
                            </button>
                        </div>
                    </div>
                )}

                {/* Preset Positions */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Preset Positions</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => handlePreset(preset.id)}
                                disabled={controlLoading !== null || !camera.status.online}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 ${selectedPreset === preset.id
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                🎯 {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recording Controls */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recording Controls</h4>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleRecording}
                            disabled={controlLoading?.includes('record') || !camera.status.online}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${isRecording
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                        >
                            {controlLoading?.includes('record') ? '⏳ Processing...' :
                                isRecording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
                        </button>

                        <button
                            onClick={handleSnapshot}
                            disabled={controlLoading === 'snapshot' || !camera.status.online}
                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                        >
                            {controlLoading === 'snapshot' ? '⏳ Taking...' : '📸 Take Snapshot'}
                        </button>
                    </div>

                    {isRecording && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-red-800 font-medium">Recording in progress</span>
                                </div>
                                <div className="text-red-600 font-mono text-lg">
                                    {formatRecordingTime(recordingDuration)}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-red-700">
                                Recording ID: {currentRecordingId}
                            </div>
                        </div>
                    )}
                </div>

                {/* Camera Information */}
                <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Camera Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Resolution:</span>
                            <span className="ml-2 font-medium">{camera.stream.resolution}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Frame Rate:</span>
                            <span className="ml-2 font-medium">{camera.stream.frameRate} FPS</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Type:</span>
                            <span className="ml-2 font-medium capitalize">{camera.type}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Location:</span>
                            <span className="ml-2 font-medium">{camera.location.zone}</span>
                        </div>
                    </div>

                    {/* Capabilities */}
                    <div className="mt-3">
                        <span className="text-gray-600 text-sm">Capabilities:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {camera.capabilities && Object.entries(camera.capabilities).map(([capability, supported]) => (
                                <span
                                    key={capability}
                                    className={`px-2 py-1 text-xs rounded ${supported
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {capability.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};