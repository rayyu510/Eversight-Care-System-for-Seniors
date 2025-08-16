// src/surveillance-center/components/Storage/VideoStorage.tsx
import React, { useState } from 'react';
import { HardDrive, Download, Trash2, Archive, Play, Calendar } from 'lucide-react';
import { VideoStorage as VideoStorageType, Camera } from '../../types';

interface VideoStorageProps {
    videos: VideoStorageType[];
    cameras: Camera[];
    onVideoAction?: (videoId: string, action: string) => Promise<boolean>;
    loading?: boolean;
}

export const VideoStorage: React.FC<VideoStorageProps> = ({
    videos,
    cameras,
    onVideoAction,
    loading = false
}) => {
    const [selectedCamera, setSelectedCamera] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('date');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const filteredVideos = videos.filter(video => {
        const cameraMatch = selectedCamera === 'all' || video.id.includes(selectedCamera);
        return cameraMatch;
    });

    const sortedVideos = [...filteredVideos].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.metadata.lastCheck).getTime() - new Date(a.metadata.lastCheck).getTime();
            case 'size':
                return b.capacity.used - a.capacity.used;
            case 'duration':
                return b.capacity.percentage - a.capacity.percentage;
            default: return 0;
        }
    });

    if (loading) {
        return <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Video Storage</h3>
                <div className="flex space-x-3">
                    <select
                        value={selectedCamera}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                        <option value="all">All Cameras</option>
                        {cameras.map(camera => (
                            <option key={camera.id} value={camera.id}>{camera.name}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="size">Sort by Size</option>
                        <option value="duration">Sort by Duration</option>
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white border rounded-lg p-4 text-center">
                    <Archive className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Storage Devices</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredVideos.length}</p>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center">
                    <Download className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Used Space</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {formatBytes(filteredVideos.reduce((sum, v) => sum + v.capacity.used, 0))}
                    </p>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center">
                    <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Oldest Check</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {filteredVideos.length > 0 ? Math.floor((Date.now() - Math.min(...filteredVideos.map(v => new Date(v.metadata.lastCheck).getTime()))) / (1000 * 60 * 60 * 24)) : 0} days
                    </p>
                </div>
            </div>

            {/* Storage Device List */}
            <div className="space-y-3">
                {sortedVideos.map(video => (
                    <div key={video.id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <HardDrive className="h-6 w-6 text-gray-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{video.name}</h4>
                                    <p className="text-sm text-gray-600">
                                        Storage Device: {video.type} - {video.location}
                                    </p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                        <span>Used: {formatBytes(video.capacity.used)}</span>
                                        <span>•</span>
                                        <span>Total: {formatBytes(video.capacity.total)}</span>
                                        <span>•</span>
                                        <span>Type: {video.type}</span>
                                        <span>•</span>
                                        <span>Last Check: {new Date(video.metadata.lastCheck).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onVideoAction?.(video.id, 'view')}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => onVideoAction?.(video.id, 'configure')}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                >
                                    Configure
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};