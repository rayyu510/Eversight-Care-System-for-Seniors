// src/surveillance-center/components/Dashboard/AIDetectionPanel.tsx
import React, { useState } from 'react';
import { Eye, Users, Zap, Activity, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { AIDetection, Camera } from '../../types';

const getBoundingBox = (detection: AIDetection) => {
    if (detection.type === 'motion' && 'bbox' in detection.data) {
        return detection.data.bbox;
    }
    if (detection.type === 'face' && 'bbox' in detection.data) {
        return detection.data.bbox;
    }
    // Fallback
    return { x: 0, y: 0, width: 0, height: 0 };
};

interface AIDetectionPanelProps {
    detections: AIDetection[];
    cameras: Camera[];
    onDetectionAction?: (detectionId: string, action: string) => void;
    loading?: boolean;
}

export const AIDetectionPanel: React.FC<AIDetectionPanelProps> = ({
    detections,
    cameras,
    onDetectionAction,
    loading = false
}) => {
    const [filterType, setFilterType] = useState<string>('all');
    const [selectedCamera, setSelectedCamera] = useState<string>('all');

    const getDetectionIcon = (type: string) => {
        switch (type) {
            case 'person':
                return <Users className="h-5 w-5 text-green-600" />;
            case 'motion':
                return <Zap className="h-5 w-5 text-blue-600" />;
            case 'face':
                return <Eye className="h-5 w-5 text-purple-600" />;
            case 'vehicle':
                return <Activity className="h-5 w-5 text-orange-600" />;
            case 'object':
                return <Activity className="h-5 w-5 text-gray-600" />;
            default:
                return <Activity className="h-5 w-5 text-gray-600" />;
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.9) return 'bg-green-100 text-green-800';
        if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getDetectionTypeColor = (type: string) => {
        switch (type) {
            case 'person':
                return 'bg-green-100';
            case 'motion':
                return 'bg-blue-100';
            case 'face':
                return 'bg-purple-100';
            case 'vehicle':
                return 'bg-orange-100';
            default:
                return 'bg-gray-100';
        }
    };

    const filteredDetections = detections.filter(detection => {
        if (filterType !== 'all' && detection.type !== filterType) return false;
        if (selectedCamera !== 'all' && detection.cameraId !== selectedCamera) return false;
        return true;
    });

    const detectionTypes = ['all', 'person', 'motion', 'face', 'vehicle', 'object'];

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">AI Detection Panel</h3>
                <div className="flex items-center space-x-3">
                    {/* Type Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                        {detectionTypes.map(type => (
                            <option key={type} value={type}>
                                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>

                    {/* Camera Filter */}
                    <select
                        value={selectedCamera}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                        <option value="all">All Cameras</option>
                        {cameras.map(camera => (
                            <option key={camera.id} value={camera.id}>
                                {camera.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Detection Summary */}
            <div className="grid grid-cols-5 gap-3">
                {detectionTypes.slice(1).map(type => {
                    const count = detections.filter(d => d.type === type).length;
                    return (
                        <div key={type} className={`${getDetectionTypeColor(type)} rounded-lg p-3 text-center`}>
                            {getDetectionIcon(type)}
                            <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{type}</p>
                            <p className="text-lg font-bold text-gray-900">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Detection List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredDetections.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p>No detections found</p>
                    </div>
                ) : (
                    filteredDetections.map(detection => (
                        <div key={detection.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getDetectionTypeColor(detection.type)}`}>
                                        {getDetectionIcon(detection.type)}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 capitalize">{detection.type} Detection</h4>
                                        <p className="text-sm text-gray-600">{detection.type}</p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                            <span>Camera: {cameras.find(c => c.id === detection.cameraId)?.name}</span>
                                            <span>•</span>
                                            <span>{new Date(detection.timestamp).toLocaleTimeString()}</span>
                                            <span>•</span>
                                            <span>
                                                {(() => {
                                                    const bbox = getBoundingBox(detection);
                                                    return `Box: ${bbox.x},${bbox.y} (${bbox.width}x${bbox.height})`;
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(detection.confidence)}`}>
                                        {Math.round(detection.confidence * 100)}%
                                    </div>
                                    {detection.cameraId && (
                                        <video
                                            src={`/api/cameras/${detection.cameraId}/video?timestamp=${detection.timestamp}`}
                                            controls
                                            className="w-full h-32 rounded"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};