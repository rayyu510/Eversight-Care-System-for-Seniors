// File: src/guardian-protect/components/VideoFeedGrid.tsx
// Clean version with direct mock data - no service calls

import React, { useState, useEffect, useCallback } from 'react';

interface Camera {
    id: string;
    name: string;
    location: string;
    floor: number;
    type: 'indoor' | 'outdoor' | 'hallway' | 'room';
    status: 'online' | 'offline' | 'maintenance';
    lastUpdate: string;
    resolution: string;
    hasRecording: boolean;
    hasMotionDetection: boolean;
    streamUrl?: string;
}

interface VideoFeedGridProps {
    selectedFloor?: number;
    gridSize?: '2x2' | '2x3' | '3x3' | '4x4';
    maxHeight?: string;
    autoRefresh?: boolean;
    onCameraSelect?: (cameraId: string) => void;
    className?: string;
}

const VideoFeedGrid: React.FC<VideoFeedGridProps> = ({
    selectedFloor = 1,
    gridSize = '3x3',
    maxHeight = '32rem',
    autoRefresh = false,
    onCameraSelect,
    className = ''
}) => {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'indoor' | 'outdoor' | 'hallway' | 'room'>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('online');

    // Mock camera data matching our facility
    const mockCameras: Camera[] = [
        // Floor 1 Cameras
        {
            id: 'CAM-WW101',
            name: 'WW-101 Room Camera',
            location: 'WW-101',
            floor: 1,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 30000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-WW102',
            name: 'WW-102 Room Camera',
            location: 'WW-102',
            floor: 1,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 45000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-WW103',
            name: 'WW-103 Room Camera',
            location: 'WW-103',
            floor: 1,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 60000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-EW101',
            name: 'EW-101 Room Camera',
            location: 'EW-101',
            floor: 1,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 20000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-EW102',
            name: 'EW-102 Room Camera',
            location: 'EW-102',
            floor: 1,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 90000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-EW103',
            name: 'EW-103 Room Camera',
            location: 'EW-103',
            floor: 1,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 15000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-DINING1',
            name: 'Main Dining Camera',
            location: 'Main Dining Room',
            floor: 1,
            type: 'indoor',
            status: 'online',
            lastUpdate: new Date(Date.now() - 10000).toISOString(),
            resolution: '4K',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-LOBBY1',
            name: 'Main Lobby Camera',
            location: 'Main Lobby',
            floor: 1,
            type: 'indoor',
            status: 'online',
            lastUpdate: new Date(Date.now() - 25000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-HALL1',
            name: 'West Corridor Camera',
            location: 'West Corridor',
            floor: 1,
            type: 'hallway',
            status: 'online',
            lastUpdate: new Date(Date.now() - 35000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },

        // Floor 2 Cameras
        {
            id: 'CAM-WW201',
            name: 'WW-201 Room Camera',
            location: 'WW-201',
            floor: 2,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 40000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-WW202',
            name: 'WW-202 Room Camera',
            location: 'WW-202',
            floor: 2,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 5000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-WW203',
            name: 'WW-203 Room Camera',
            location: 'WW-203',
            floor: 2,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 55000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-EW201',
            name: 'EW-201 Room Camera',
            location: 'EW-201',
            floor: 2,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 70000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-EW202',
            name: 'EW-202 Room Camera',
            location: 'EW-202',
            floor: 2,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 80000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        },
        {
            id: 'CAM-EW203',
            name: 'EW-203 Room Camera',
            location: 'EW-203',
            floor: 2,
            type: 'room',
            status: 'online',
            lastUpdate: new Date(Date.now() - 12000).toISOString(),
            resolution: '1080p',
            hasRecording: true,
            hasMotionDetection: true
        }
    ];

    // Load mock data
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setCameras(mockCameras);
            setLoading(false);
        }, 600);
    }, []);

    // Filter cameras by floor and filters
    const filteredCameras = cameras.filter(camera => {
        const floorMatch = camera.floor === selectedFloor;
        const typeMatch = filterType === 'all' || camera.type === filterType;
        const statusMatch = filterStatus === 'all' || camera.status === filterStatus;
        return floorMatch && typeMatch && statusMatch;
    });

    // Get grid dimensions
    const getGridDimensions = useCallback(() => {
        switch (gridSize) {
            case '2x2': return { cols: 2, rows: 2, max: 4 };
            case '2x3': return { cols: 3, rows: 2, max: 6 };
            case '3x3': return { cols: 3, rows: 3, max: 9 };
            case '4x4': return { cols: 4, rows: 4, max: 16 };
            default: return { cols: 3, rows: 3, max: 9 };
        }
    }, [gridSize]);

    // Select cameras for grid
    const gridDimensions = getGridDimensions();
    const displayCameras = selectedCameras.length > 0
        ? cameras.filter(cam => selectedCameras.includes(cam.id)).slice(0, gridDimensions.max)
        : filteredCameras.slice(0, gridDimensions.max);

    // Handle camera selection
    const handleCameraSelect = useCallback((cameraId: string) => {
        setSelectedCameras(prev => {
            const isSelected = prev.includes(cameraId);
            if (isSelected) {
                return prev.filter(id => id !== cameraId);
            } else {
                if (prev.length >= gridDimensions.max) {
                    return [...prev.slice(1), cameraId]; // Replace oldest
                } else {
                    return [...prev, cameraId];
                }
            }
        });
        onCameraSelect?.(cameraId);
    }, [gridDimensions.max, onCameraSelect]);

    // Get camera status color
    const getStatusColor = useCallback((status: string): string => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'offline': return 'bg-red-500';
            case 'maintenance': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    }, []);

    if (loading) {
        return (
            <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
                <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading camera feeds...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Video Surveillance</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">
                            {filteredCameras.filter(c => c.status === 'online').length} Online
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Grid:</label>
                        <select
                            value={gridSize}
                            onChange={() => { }} // Controlled by parent
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                            <option value="2x2">2×2</option>
                            <option value="2x3">2×3</option>
                            <option value="3x3">3×3</option>
                            <option value="4x4">4×4</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Type:</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="room">Rooms</option>
                            <option value="hallway">Hallways</option>
                            <option value="indoor">Common Areas</option>
                            <option value="outdoor">Outdoor</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                            <option value="online">Online Only</option>
                            <option value="all">All Status</option>
                            <option value="offline">Offline Only</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setSelectedCameras([])}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200"
                    >
                        Clear Selection
                    </button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="p-4">
                <div
                    className={`grid gap-2`}
                    style={{
                        gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
                        maxHeight
                    }}
                >
                    {displayCameras.map((camera, index) => (
                        <div
                            key={camera.id}
                            className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video border-2 border-gray-300 hover:border-blue-500 transition-colors"
                        >
                            {/* Video Feed Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="text-4xl mb-2">📹</div>
                                    <div className="text-sm font-medium">{camera.name}</div>
                                    <div className="text-xs text-gray-300">{camera.resolution}</div>
                                </div>
                            </div>

                            {/* Camera Status */}
                            <div className="absolute top-2 left-2 flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`}></div>
                                <span className="text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                                    {camera.status.toUpperCase()}
                                </span>
                            </div>

                            {/* Camera Info */}
                            <div className="absolute bottom-2 left-2 right-2">
                                <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                    <div className="font-medium">{camera.location}</div>
                                    <div className="text-gray-300">
                                        Floor {camera.floor} • {camera.type}
                                    </div>
                                </div>
                            </div>

                            {/* Recording Indicator */}
                            {camera.hasRecording && (
                                <div className="absolute top-2 right-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                </div>
                            )}

                            {/* Motion Detection Indicator */}
                            {camera.hasMotionDetection && (
                                <div className="absolute top-2 right-6 text-white text-xs">
                                    👁️
                                </div>
                            )}

                            {/* Click Overlay */}
                            <div
                                className="absolute inset-0 cursor-pointer"
                                onClick={() => handleCameraSelect(camera.id)}
                            />
                        </div>
                    ))}

                    {/* Empty Grid Slots */}
                    {Array.from({ length: Math.max(0, gridDimensions.max - displayCameras.length) }).map((_, index) => (
                        <div
                            key={`empty-${index}`}
                            className="bg-gray-100 rounded-lg aspect-video border-2 border-dashed border-gray-300 flex items-center justify-center"
                        >
                            <div className="text-center text-gray-400">
                                <div className="text-2xl mb-1">📷</div>
                                <div className="text-xs">No Camera</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Camera List */}
            <div className="border-t border-gray-200 p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Available Cameras (Floor {selectedFloor})
                </h4>
                <div className="max-h-32 overflow-y-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {filteredCameras.map((camera) => (
                            <button
                                key={camera.id}
                                onClick={() => handleCameraSelect(camera.id)}
                                className={`text-left p-2 rounded border text-xs transition-colors ${selectedCameras.includes(camera.id)
                                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`}></div>
                                    <span className="font-medium">{camera.location}</span>
                                </div>
                                <div className="text-gray-500">{camera.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Status Summary */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                        {displayCameras.length} of {filteredCameras.length} cameras shown
                    </span>
                    <div className="flex gap-4">
                        <span className="text-green-600">
                            {filteredCameras.filter(c => c.status === 'online').length} Online
                        </span>
                        <span className="text-red-600">
                            {filteredCameras.filter(c => c.status === 'offline').length} Offline
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoFeedGrid;