// src/surveillance-center/components/Camera/CameraView.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    CameraDevice,
    CameraStatus,
    DetectionEvent,
    getCameraStatusString
} from '../../types/cameraTypes';

interface CameraViewProps {
    camera: CameraDevice;
    isSelected?: boolean;
    onCameraSelect?: (camera: CameraDevice) => void;
    onDetection?: (detection: DetectionEvent) => void;
    showOverlays?: boolean;
    className?: string;
}

export const CameraView: React.FC<CameraViewProps> = ({
    camera,
    isSelected = false,
    onCameraSelect,
    onDetection,
    showOverlays = true,
    className = ''
}) => {
    // State variables that were missing
    const [isLive, setIsLive] = useState(true);
    const [currentDetections, setCurrentDetections] = useState<DetectionEvent[]>([]);
    const [streamError, setStreamError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Get stream URL from camera device
    const getStreamUrl = (camera: CameraDevice): string => {
        return camera.stream.primaryUrl;
    };

    // Handle camera selection - was missing
    const handleCameraClick = () => {
        if (onCameraSelect) {
            onCameraSelect(camera);
        }
    };

    // Render detection overlays - was missing
    const renderDetectionOverlays = () => {
        if (!showOverlays || !currentDetections.length) return null;

        return (
            <div className="absolute inset-0 pointer-events-none">
                {currentDetections.map((detection) => (
                    <div
                        key={detection.id}
                        className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20"
                        style={{
                            left: `${detection.boundingBox.x}px`,
                            top: `${detection.boundingBox.y}px`,
                            width: `${detection.boundingBox.width}px`,
                            height: `${detection.boundingBox.height}px`
                        }}
                    >
                        <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 rounded">
                            {detection.type} ({Math.round(detection.confidence * 100)}%)
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Get status indicator color
    const getStatusColor = (status: CameraStatus): string => {
        const statusString = getCameraStatusString(status);
        switch (statusString) {
            case 'online': return 'bg-green-500';
            case 'offline': return 'bg-red-500';
            case 'maintenance': return 'bg-yellow-500';
            case 'error': return 'bg-red-600';
            default: return 'bg-gray-500';
        }
    };

    // Handle stream errors - was missing
    const handleStreamError = () => {
        setStreamError('Failed to load video stream');
        setIsLive(false);
    };

    // Toggle live/playback mode - was missing
    const toggleLiveMode = () => {
        setIsLive(!isLive);
        setStreamError(null);
    };

    // Mock detection simulation
    useEffect(() => {
        if (!isLive || !camera.status.online) return;

        const detectionInterval = setInterval(() => {
            // Simulate random detections
            if (Math.random() > 0.7) {
                const newDetection: DetectionEvent = {
                    id: `detection_${Date.now()}`,
                    cameraId: camera.id,
                    timestamp: new Date(),
                    type: Math.random() > 0.5 ? 'motion' : 'face_recognition',
                    confidence: 0.6 + Math.random() * 0.4,
                    boundingBox: {
                        x: Math.random() * 200,
                        y: Math.random() * 150,
                        width: 50 + Math.random() * 100,
                        height: 50 + Math.random() * 100
                    },
                    metadata: {
                        processed: true
                    }
                };

                setCurrentDetections(prev => [newDetection, ...prev.slice(0, 4)]); // Keep last 5

                if (onDetection) {
                    onDetection(newDetection);
                }

                // Clear detection after 3 seconds
                setTimeout(() => {
                    setCurrentDetections(prev => prev.filter(d => d.id !== newDetection.id));
                }, 3000);
            }
        }, 2000);

        return () => clearInterval(detectionInterval);
    }, [isLive, camera.status.online, onDetection, camera.id]);

    return (
        <div
            className={`relative bg-gray-900 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${isSelected ? 'border-blue-500' : 'border-gray-600'
                } ${className}`}
            onClick={handleCameraClick}
        >
            {/* Video Display */}
            <div className="relative aspect-video bg-gray-800">
                {camera.status.online && !streamError ? (
                    <>
                        {/* Mock video element - in real app this would show actual stream */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                            <div className="text-gray-400 text-center">
                                <div className="text-lg font-medium">{camera.name}</div>
                                <div className="text-sm">🔹 Live Feed</div>
                                <div className="text-xs mt-1">{isLive ? 'LIVE' : 'PLAYBACK'}</div>
                            </div>
                        </div>

                        {/* Hidden video element for real implementation */}
                        <video
                            ref={videoRef}
                            className="hidden w-full h-full object-cover"
                            autoPlay
                            muted
                            onError={handleStreamError}
                        >
                            <source src={getStreamUrl(camera)} type="video/mp4" />
                        </video>

                        {/* Detection overlays */}
                        {renderDetectionOverlays()}
                    </>
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                            <div className="text-4xl mb-2">🔹</div>
                            <div className="text-sm">
                                {streamError || (!camera.status.online ? 'Camera Offline' : 'No Signal')}
                            </div>
                        </div>
                    </div>
                )}

                {/* Status indicator */}
                <div className="absolute top-2 left-2 flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(camera.status)}`} />
                    <span className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                        {getCameraStatusString(camera.status).toUpperCase()}
                    </span>
                </div>

                {/* Live indicator */}
                {isLive && camera.status.online && (
                    <div className="absolute top-2 right-2">
                        <span className="text-red-500 text-xs bg-black bg-opacity-50 px-2 py-1 rounded flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                            LIVE
                        </span>
                    </div>
                )}

                {/* Controls overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <div className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                        {camera.location.description}
                    </div>

                    <div className="flex space-x-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleLiveMode();
                            }}
                            className="text-white bg-black bg-opacity-50 p-1 rounded hover:bg-opacity-70 transition-opacity"
                            title={isLive ? 'Switch to Playback' : 'Switch to Live'}
                        >
                            {isLive ? '⏸️' : '▶️'}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // Handle fullscreen - could implement actual fullscreen here
                                console.log('Fullscreen requested for camera:', camera.id);
                            }}
                            className="text-white bg-black bg-opacity-50 p-1 rounded hover:bg-opacity-70 transition-opacity"
                            title="Fullscreen"
                        >
                            🔍
                        </button>
                    </div>
                </div>
            </div>

            {/* Camera info footer */}
            <div className="p-2 bg-gray-800 text-white">
                <div className="text-sm font-medium truncate">{camera.name}</div>
                <div className="text-xs text-gray-400 flex justify-between items-center">
                    <span>{camera.location.zone} • {camera.stream.resolution}</span>
                    {currentDetections.length > 0 && (
                        <span className="text-orange-400">
                            {currentDetections.length} detection{currentDetections.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Canvas for advanced overlays (hidden) */}
            <canvas
                ref={canvasRef}
                className="hidden absolute inset-0 pointer-events-none"
            />
        </div>
    );
};