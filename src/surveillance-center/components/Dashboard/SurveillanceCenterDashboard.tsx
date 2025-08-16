// src/surveillance-center/components/Dashboard/SurveillanceCenterDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Eye, Camera, Activity, AlertCircle, Play, Pause, Settings, Wifi, WifiOff, Monitor, Users, Clock, MapPin, Shield, RefreshCw, Search, Archive, Download } from 'lucide-react';

const SurveillanceCenterDashboard: React.FC = () => {
    const [cameras, setCameras] = useState([
        { id: 1, name: 'Entrance Hall', location: 'Main Entrance', status: 'online', recording: true, alerts: 0, aiEnabled: true, resolution: '1080p', coverage: 'Entry/Exit' },
        { id: 2, name: 'Dining Room', location: 'Dining Area', status: 'online', recording: true, alerts: 1, aiEnabled: true, resolution: '4K', coverage: 'Dining Activity' },
        { id: 3, name: 'Recreation Area', location: 'Common Room', status: 'online', recording: true, alerts: 0, aiEnabled: true, resolution: '1080p', coverage: 'Social Activity' },
        { id: 4, name: 'Hallway A', location: 'East Corridor', status: 'online', recording: true, alerts: 0, aiEnabled: true, resolution: '1080p', coverage: 'Movement' },
        { id: 5, name: 'Hallway B', location: 'West Corridor', status: 'online', recording: true, alerts: 0, aiEnabled: false, resolution: '720p', coverage: 'Movement' },
        { id: 6, name: 'Garden View', location: 'Outdoor Area', status: 'online', recording: true, alerts: 0, aiEnabled: true, resolution: '4K', coverage: 'Outdoor Activity' },
        { id: 7, name: 'Kitchen', location: 'Food Service', status: 'maintenance', recording: false, alerts: 2, aiEnabled: false, resolution: '1080p', coverage: 'Staff Area' },
        { id: 8, name: 'Staff Office', location: 'Administration', status: 'online', recording: true, alerts: 0, aiEnabled: false, resolution: '720p', coverage: 'Work Area' }
    ]);

    const [aiDetections, setAiDetections] = useState([
        { id: 1, type: 'motion', camera: 'Dining Room', confidence: 95, timestamp: new Date(Date.now() - 60000), details: 'Normal dining activity detected', severity: 'low' },
        { id: 2, type: 'person', camera: 'Entrance Hall', confidence: 88, timestamp: new Date(Date.now() - 180000), details: 'Visitor entry logged', severity: 'low' },
        { id: 3, type: 'fall_detection', camera: 'Hallway A', confidence: 92, timestamp: new Date(Date.now() - 300000), details: 'Potential fall incident', severity: 'high' },
        { id: 4, type: 'unusual_behavior', camera: 'Recreation Area', confidence: 78, timestamp: new Date(Date.now() - 420000), details: 'Extended stationary position detected', severity: 'medium' }
    ]);

    const [securityIncidents, setSecurityIncidents] = useState([
        { id: 1, type: 'access_violation', location: 'Emergency Exit', severity: 'high', status: 'investigating', timestamp: new Date(Date.now() - 780000), description: 'Unauthorized exit attempt detected' },
        { id: 2, type: 'equipment_failure', location: 'Kitchen', severity: 'medium', status: 'resolved', timestamp: new Date(Date.now() - 1200000), description: 'Camera maintenance completed' }
    ]);

    const [selectedCamera, setSelectedCamera] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');
    const [aiAnalyticsEnabled, setAiAnalyticsEnabled] = useState(true);

    // Calculate metrics
    const onlineCameras = cameras.filter(c => c.status === 'online').length;
    const totalCameras = cameras.length;
    const recordingCameras = cameras.filter(c => c.recording).length;
    const aiEnabledCameras = cameras.filter(c => c.aiEnabled).length;
    const systemUptime = 98.5;
    const totalDetections = aiDetections.length;
    const highPriorityIncidents = securityIncidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length;

    // Filter cameras based on status
    const filteredCameras = cameras.filter(camera => {
        if (filterStatus === 'all') return true;
        return camera.status === filterStatus;
    });

    const toggleCameraRecording = (cameraId) => {
        setCameras(cameras.map(camera =>
            camera.id === cameraId
                ? { ...camera, recording: !camera.recording }
                : camera
        ));
    };

    const toggleAI = (cameraId) => {
        setCameras(cameras.map(camera =>
            camera.id === cameraId
                ? { ...camera, aiEnabled: !camera.aiEnabled }
                : camera
        ));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'text-green-600 bg-green-50 border-green-200';
            case 'offline': return 'text-red-600 bg-red-50 border-red-200';
            case 'maintenance': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getDetectionColor = (type) => {
        switch (type) {
            case 'fall_detection': return 'bg-red-100 text-red-700 border-red-300';
            case 'security_breach': return 'bg-red-100 text-red-700 border-red-300';
            case 'unusual_behavior': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'person': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'motion': return 'bg-green-100 text-green-700 border-green-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="p-8 max-w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl p-8 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Surveillance Center</h1>
                        <p className="text-indigo-100">AI-Powered Video Analytics & Security Management</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setAiAnalyticsEnabled(!aiAnalyticsEnabled)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${aiAnalyticsEnabled
                                ? 'bg-green-500 hover:bg-green-400 text-white'
                                : 'bg-gray-400 hover:bg-gray-300 text-gray-700'
                                }`}
                        >
                            AI Analytics {aiAnalyticsEnabled ? 'ON' : 'OFF'}
                        </button>
                        <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2">
                            <RefreshCw className="h-5 w-5" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Total Cameras</h3>
                            <p className="text-3xl font-bold text-indigo-600">{totalCameras}</p>
                            <p className="text-sm text-gray-500">Installed</p>
                        </div>
                        <Camera className="h-12 w-12 text-indigo-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Online</h3>
                            <p className="text-3xl font-bold text-green-600">{onlineCameras}</p>
                            <p className="text-sm text-gray-500">Active</p>
                        </div>
                        <Eye className="h-12 w-12 text-green-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Recording</h3>
                            <p className="text-3xl font-bold text-blue-600">{recordingCameras}</p>
                            <p className="text-sm text-gray-500">Active</p>
                        </div>
                        <Monitor className="h-12 w-12 text-blue-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">AI Detection</h3>
                            <p className="text-3xl font-bold text-purple-600">{totalDetections}</p>
                            <p className="text-sm text-gray-500">Events</p>
                        </div>
                        <Activity className="h-12 w-12 text-purple-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Uptime</h3>
                            <p className="text-3xl font-bold text-orange-600">{systemUptime}%</p>
                            <p className="text-sm text-gray-500">System</p>
                        </div>
                        <Shield className="h-12 w-12 text-orange-600 opacity-20" />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Camera Grid */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Live Camera Feeds</h3>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-green-600">Live</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredCameras.map((camera) => (
                                <div
                                    key={camera.id}
                                    onClick={() => setSelectedCamera(camera)}
                                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${getStatusColor(camera.status)}`}
                                >
                                    {/* Camera Preview */}
                                    <div className="aspect-video bg-gray-900 rounded-lg mb-3 relative overflow-hidden">
                                        {camera.status === 'online' ? (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Eye className="h-8 w-8 text-white opacity-50" />
                                                </div>
                                                {camera.recording && (
                                                    <div className="absolute top-2 left-2 flex items-center space-x-1">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                        <span className="text-white text-xs font-medium">REC</span>
                                                    </div>
                                                )}
                                                {camera.aiEnabled && (
                                                    <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                        AI
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                                                <Camera className="h-8 w-8 text-gray-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Camera Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-sm">{camera.name}</h4>
                                            {camera.alerts > 0 && (
                                                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {camera.alerts}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{camera.location}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>{camera.resolution}</span>
                                                <span className="capitalize font-medium">{camera.status}</span>
                                            </div>
                                        </div>

                                        {/* Camera Controls */}
                                        <div className="flex space-x-1 mt-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCameraRecording(camera.id);
                                                }}
                                                className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${camera.recording
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                                disabled={camera.status !== 'online'}
                                            >
                                                {camera.recording ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleAI(camera.id);
                                                }}
                                                className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${camera.aiEnabled
                                                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                disabled={camera.status !== 'online'}
                                            >
                                                AI
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* AI Detections */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">AI Detections</h3>
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {totalDetections} Today
                            </span>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {aiDetections.map((detection) => (
                                <div key={detection.id} className={`p-3 rounded-lg border ${getDetectionColor(detection.type)}`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="text-xs font-medium uppercase tracking-wide">
                                                {detection.type.replace('_', ' ')}
                                            </span>
                                            <p className="text-sm font-semibold">{detection.camera}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-medium">{detection.confidence}%</div>
                                            <div className="text-xs opacity-75">{detection.timestamp.toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs">{detection.details}</p>
                                    <div className="mt-2">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityColor(detection.severity)}`}>
                                            {detection.severity} priority
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analytics Controls */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics Controls</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <Camera className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">Live Analysis</span>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <Activity className="h-5 w-5 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-700">Motion Tracking</span>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <Users className="h-5 w-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">People Counting</span>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                    <span className="text-sm font-medium text-orange-700">Incident Detection</span>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Camera Detail Modal */}
            {selectedCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Camera Details</h3>
                            <button
                                onClick={() => setSelectedCamera(null)}
                                className="text-gray-400 hover:text-gray-600 p-2"
                            >
                                ×
                            </button>
                        </div>

                        <div className="aspect-video bg-gray-900 rounded-lg mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Eye className="h-16 w-16 text-white opacity-50" />
                            </div>
                            {selectedCamera.recording && (
                                <div className="absolute top-4 left-4 flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-white font-semibold">RECORDING</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Camera Name</label>
                                    <p className="font-semibold text-lg">{selectedCamera.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Location</label>
                                    <p className="font-semibold">{selectedCamera.location}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Resolution</label>
                                    <p className="font-semibold">{selectedCamera.resolution}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedCamera.status)}`}>
                                        {selectedCamera.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Recording</label>
                                    <p className="font-semibold">{selectedCamera.recording ? 'Active' : 'Stopped'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">AI Analytics</label>
                                    <p className="font-semibold">{selectedCamera.aiEnabled ? 'Enabled' : 'Disabled'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => toggleCameraRecording(selectedCamera.id)}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${selectedCamera.recording
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                            >
                                {selectedCamera.recording ? 'Stop Recording' : 'Start Recording'}
                            </button>

                            <button
                                onClick={() => toggleAI(selectedCamera.id)}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${selectedCamera.aiEnabled
                                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {selectedCamera.aiEnabled ? 'Disable AI' : 'Enable AI'}
                            </button>

                            <button className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center space-x-2">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SurveillanceCenterDashboard;