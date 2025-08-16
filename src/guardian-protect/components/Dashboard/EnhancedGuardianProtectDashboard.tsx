import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, MapPin, AlertTriangle, Play, Pause, Shield, Users, Activity, Eye, EyeOff, Settings, Download, RotateCcw, X, Check } from 'lucide-react';

// Types
interface CameraDevice {
    id: string;
    name: string;
    location: {
        room: string;
        x: number;
        y: number;
        floor: string;
    };
    status: 'online' | 'offline' | 'maintenance';
    streamUrl: string;
    isRecording: boolean;
    hasMotionDetection: boolean;
    lastActivity: string;
    permissions: {
        view: boolean;
        record: boolean;
        audio: boolean;
    };
    specifications?: {
        resolution: string;
        fieldOfView: number;
        nightVision: boolean;
        audioCapture: boolean;
    };
}

interface FallIncident {
    id: string;
    timestamp: string;
    severity: 'critical' | 'high' | 'medium';
    cameraId: string;
    location: {
        room: string;
        x: number;
        y: number;
        description: string;
        floor: string;
    };
    status: 'active' | 'acknowledged' | 'resolved' | 'false_positive';
    confidence: number;
    responseTime?: number;
    acknowledgedBy?: string;
    resolvedBy?: string;
    notes?: string;
    videoClipUrl?: string;
}

interface RealTimeAlert {
    id: string;
    type: 'fall_detected' | 'motion_detected' | 'camera_offline';
    timestamp: string;
    cameraId?: string;
    location: {
        room: string;
        coordinates: { x: number; y: number };
    };
    severity: 'critical' | 'high' | 'medium';
    message: string;
}

// Real-time Alerts Component
const RealTimeAlerts: React.FC<{
    alerts: RealTimeAlert[];
    onAcknowledge: (alertId: string) => void;
    onResolve: (alertId: string) => void;
    onMarkFalsePositive: (alertId: string) => void;
}> = ({ alerts, onAcknowledge, onResolve, onMarkFalsePositive }) => {
    if (alerts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {alerts.map(alert => (
                <div
                    key={alert.id}
                    className={`bg-white border-l-4 rounded-lg shadow-lg p-4 ${alert.severity === 'critical' ? 'border-red-500' :
                            alert.severity === 'high' ? 'border-orange-500' :
                                'border-yellow-500'
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle
                                className={`h-5 w-5 mt-0.5 ${alert.severity === 'critical' ? 'text-red-500' :
                                        alert.severity === 'high' ? 'text-orange-500' :
                                            'text-yellow-500'
                                    }`}
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                    {alert.type === 'fall_detected' ? 'Fall Detected' : 'Alert'}
                                </p>
                                <p className="text-sm text-gray-600">{alert.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {alert.location.room} • {new Date(alert.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onMarkFalsePositive(alert.id)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-3 flex space-x-2">
                        <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="flex-1 bg-yellow-600 text-white text-sm py-1 px-3 rounded hover:bg-yellow-700 flex items-center justify-center space-x-1"
                        >
                            <Eye className="h-3 w-3" />
                            <span>Acknowledge</span>
                        </button>
                        <button
                            onClick={() => onResolve(alert.id)}
                            className="flex-1 bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700 flex items-center justify-center space-x-1"
                        >
                            <Check className="h-3 w-3" />
                            <span>Resolve</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Main Enhanced Guardian Protect Component
const EnhancedGuardianProtect: React.FC = () => {
    // State management
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'overview' | 'monitoring' | 'incidents' | 'analytics'>('overview');
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [streamQuality, setStreamQuality] = useState<'low' | 'medium' | 'high'>('medium');
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [incidents, setIncidents] = useState<FallIncident[]>([]);
    const [activeAlerts, setActiveAlerts] = useState<RealTimeAlert[]>([]);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const recordingTimer = useRef<NodeJS.Timeout | null>(null);

    // Mock data initialization
    useEffect(() => {
        const mockCameras: CameraDevice[] = [
            {
                id: 'cam-001',
                name: 'Living Room Camera - Main View',
                location: { room: 'Living Room', x: 25, y: 25, floor: 'main-floor' },
                status: 'online',
                streamUrl: 'rtsp://192.168.1.101:554/stream1',
                isRecording: true,
                hasMotionDetection: true,
                lastActivity: '2 minutes ago',
                permissions: { view: true, record: true, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 120,
                    nightVision: true,
                    audioCapture: true
                }
            },
            {
                id: 'cam-002',
                name: 'Kitchen Camera - Island View',
                location: { room: 'Kitchen', x: 70, y: 20, floor: 'main-floor' },
                status: 'online',
                streamUrl: 'rtsp://192.168.1.102:554/stream1',
                isRecording: true,
                hasMotionDetection: true,
                lastActivity: '5 minutes ago',
                permissions: { view: true, record: true, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 110,
                    nightVision: true,
                    audioCapture: false
                }
            },
            {
                id: 'cam-003',
                name: 'Bedroom Camera - Privacy Mode',
                location: { room: 'Master Bedroom', x: 22, y: 65, floor: 'main-floor' },
                status: 'online',
                streamUrl: 'rtsp://192.168.1.103:554/stream1',
                isRecording: false,
                hasMotionDetection: true,
                lastActivity: '1 hour ago',
                permissions: { view: true, record: false, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 100,
                    nightVision: true,
                    audioCapture: false
                }
            },
            {
                id: 'cam-004',
                name: 'Bathroom Camera - Fall Detection',
                location: { room: 'Bathroom', x: 47, y: 60, floor: 'main-floor' },
                status: 'offline',
                streamUrl: 'rtsp://192.168.1.104:554/stream1',
                isRecording: false,
                hasMotionDetection: true,
                lastActivity: '3 hours ago',
                permissions: { view: false, record: false, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 130,
                    nightVision: true,
                    audioCapture: false
                }
            },
            {
                id: 'cam-005',
                name: 'Hallway Camera - Motion Tracking',
                location: { room: 'Hallway', x: 50, y: 40, floor: 'main-floor' },
                status: 'online',
                streamUrl: 'rtsp://192.168.1.105:554/stream1',
                isRecording: true,
                hasMotionDetection: true,
                lastActivity: '1 minute ago',
                permissions: { view: true, record: true, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 140,
                    nightVision: true,
                    audioCapture: false
                }
            }
        ];

        const mockIncidents: FallIncident[] = [
            {
                id: 'fall-001',
                timestamp: '2025-08-10T14:23:15Z',
                severity: 'critical',
                cameraId: 'cam-002',
                location: {
                    room: 'Kitchen',
                    x: 65,
                    y: 25,
                    description: 'Near kitchen island, possible slip on wet floor',
                    floor: 'main-floor'
                },
                status: 'active',
                confidence: 94,
                videoClipUrl: '/recordings/incidents/fall-001.mp4'
            },
            {
                id: 'fall-002',
                timestamp: '2025-08-10T09:15:32Z',
                severity: 'high',
                cameraId: 'cam-001',
                location: {
                    room: 'Living Room',
                    x: 30,
                    y: 20,
                    description: 'By the coffee table, resident got up too quickly',
                    floor: 'main-floor'
                },
                status: 'resolved',
                confidence: 87,
                responseTime: 45,
                acknowledgedBy: 'Nurse Sarah',
                resolvedBy: 'Dr. Johnson',
                notes: 'Resident confirmed safe, minor stumble while reaching for remote',
                videoClipUrl: '/recordings/incidents/fall-002.mp4'
            },
            {
                id: 'fall-003',
                timestamp: '2025-08-09T21:45:12Z',
                severity: 'medium',
                cameraId: 'cam-003',
                location: {
                    room: 'Master Bedroom',
                    x: 20,
                    y: 70,
                    description: 'Getting out of bed, possible false positive',
                    floor: 'main-floor'
                },
                status: 'false_positive',
                confidence: 76,
                notes: 'Normal movement getting out of bed, AI sensitivity needs adjustment',
                videoClipUrl: '/recordings/incidents/fall-003.mp4'
            }
        ];

        const mockAlerts: RealTimeAlert[] = [
            {
                id: 'alert-fall-001',
                type: 'fall_detected',
                timestamp: '2025-08-10T14:23:15Z',
                cameraId: 'cam-002',
                location: {
                    room: 'Kitchen',
                    coordinates: { x: 65, y: 25 }
                },
                severity: 'critical',
                message: 'Fall detected in Kitchen - 94% confidence'
            }
        ];

        setCameras(mockCameras);
        setIncidents(mockIncidents);
        setActiveAlerts(mockAlerts);
        setLastUpdate(new Date().toISOString());
    }, []);

    // Mock real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date().toISOString());
            // Simulate random camera activity updates
            setCameras(prev => prev.map(camera => ({
                ...camera,
                lastActivity: Math.random() > 0.8 ? 'Just now' : camera.lastActivity
            })));
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Recording timer effect
    useEffect(() => {
        if (isRecording) {
            recordingTimer.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (recordingTimer.current) {
                clearInterval(recordingTimer.current);
                recordingTimer.current = null;
            }
            setRecordingDuration(0);
        }

        return () => {
            if (recordingTimer.current) {
                clearInterval(recordingTimer.current);
            }
        };
    }, [isRecording]);

    // Floor plan data
    const floorPlan = {
        id: 'main-floor',
        name: 'Main Floor - Assisted Living Unit',
        rooms: [
            { id: 'living-room', name: 'Living Room', type: 'living_room', coordinates: { x: 10, y: 10, width: 40, height: 30 }, riskLevel: 'medium' },
            { id: 'kitchen', name: 'Kitchen', type: 'kitchen', coordinates: { x: 55, y: 10, width: 35, height: 25 }, riskLevel: 'high' },
            { id: 'bedroom-1', name: 'Master Bedroom', type: 'bedroom', coordinates: { x: 10, y: 50, width: 25, height: 30 }, riskLevel: 'medium' },
            { id: 'bathroom', name: 'Bathroom', type: 'bathroom', coordinates: { x: 40, y: 50, width: 15, height: 20 }, riskLevel: 'high' },
            { id: 'hallway', name: 'Hallway', type: 'hallway', coordinates: { x: 35, y: 35, width: 30, height: 10 }, riskLevel: 'low' }
        ]
    };

    // Utility functions
    const getCameraStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'offline': return 'bg-red-500';
            case 'maintenance': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const getIncidentSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-600 animate-pulse';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const formatRecordingDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Event handlers
    const handleCameraClick = (cameraId: string) => {
        setSelectedCamera(cameraId);
        setViewMode('monitoring');
    };

    const handleIncidentClick = (incident: FallIncident) => {
        setSelectedCamera(incident.cameraId);
        setViewMode('monitoring');
    };

    const requestCameraPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setPermissionsGranted(true);
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        } catch (error) {
            console.error('Camera permissions denied:', error);
            alert('Camera permissions are required for live monitoring');
        }
    };

    const startStream = () => {
        setIsStreaming(true);
    };

    const stopStream = () => {
        setIsStreaming(false);
    };

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    const acknowledgeAlert = (alertId: string) => {
        setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
        // Update related incident
        const incidentId = alertId.replace('alert-', '');
        setIncidents(prev => prev.map(incident =>
            incident.id === incidentId
                ? { ...incident, status: 'acknowledged' as const, acknowledgedBy: 'Current User' }
                : incident
        ));
    };

    const resolveAlert = (alertId: string) => {
        setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
        const incidentId = alertId.replace('alert-', '');
        setIncidents(prev => prev.map(incident =>
            incident.id === incidentId
                ? { ...incident, status: 'resolved' as const, resolvedBy: 'Current User' }
                : incident
        ));
    };

    const markFalsePositive = (alertId: string) => {
        setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
        const incidentId = alertId.replace('alert-', '');
        setIncidents(prev => prev.map(incident =>
            incident.id === incidentId
                ? { ...incident, status: 'false_positive' as const, notes: 'Marked as false positive' }
                : incident
        ));
    };

    const triggerEmergencyAlert = (cameraId: string) => {
        const camera = cameras.find(c => c.id === cameraId);
        if (camera) {
            const newAlert: RealTimeAlert = {
                id: `emergency-${Date.now()}`,
                type: 'fall_detected',
                timestamp: new Date().toISOString(),
                cameraId,
                location: {
                    room: camera.location.room,
                    coordinates: { x: camera.location.x, y: camera.location.y }
                },
                severity: 'critical',
                message: `Emergency alert triggered in ${camera.location.room}`
            };
            setActiveAlerts(prev => [...prev, newAlert]);

            if (Notification.permission === 'granted') {
                new Notification('Emergency Alert', {
                    body: `Emergency alert triggered in ${camera.location.room}`,
                    icon: '/favicon.ico'
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Real-time Alerts Overlay */}
            <RealTimeAlerts
                alerts={activeAlerts}
                onAcknowledge={acknowledgeAlert}
                onResolve={resolveAlert}
                onMarkFalsePositive={markFalsePositive}
            />

            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Shield className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Guardian Protect</h1>
                                <p className="text-gray-600">Real-time Floor Plan & Camera Monitoring</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            {/* Connection Status */}
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' :
                                        connectionStatus === 'reconnecting' ? 'bg-yellow-500 animate-pulse' :
                                            'bg-red-500'
                                    }`}></div>
                                <span className="text-sm text-gray-600 capitalize">{connectionStatus}</span>
                            </div>

                            {/* System Stats */}
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-semibold text-green-600">{cameras.filter(c => c.status === 'online').length}</span>
                                    <span className="ml-1">cameras online</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-red-600">{activeAlerts.length}</span>
                                    <span className="ml-1">active alerts</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-blue-600">{cameras.filter(c => c.isRecording).length}</span>
                                    <span className="ml-1">recording</span>
                                </div>
                            </div>

                            {/* Last Update */}
                            {lastUpdate && (
                                <div className="text-xs text-gray-500">
                                    Last update: {new Date(lastUpdate).toLocaleTimeString()}
                                </div>
                            )}

                            {/* Permissions Button */}
                            {!permissionsGranted && (
                                <button
                                    onClick={requestCameraPermissions}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                                >
                                    <Eye className="h-4 w-4" />
                                    <span>Enable Live View</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            {/* Navigation Tabs */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {viewMode === 'overview' && 'Floor Plan Overview'}
                                        {viewMode === 'monitoring' && 'Live Camera Monitoring'}
                                        {viewMode === 'incidents' && 'Incident Management'}
                                        {viewMode === 'analytics' && 'Analytics Dashboard'}
                                    </h2>
                                    <div className="flex space-x-2">
                                        {['overview', 'monitoring', 'incidents', 'analytics'].map(mode => (
                                            <button
                                                key={mode}
                                                onClick={() => setViewMode(mode as any)}
                                                className={`px-3 py-1 rounded text-sm capitalize ${viewMode === mode ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'
                                                    }`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Overview Mode - Floor Plan */}
                                {viewMode === 'overview' && (
                                    <div className="space-y-6">
                                        <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-gray-300 rounded-lg overflow-hidden">
                                            {/* Room Overlays */}
                                            {floorPlan.rooms.map(room => (
                                                <div
                                                    key={room.id}
                                                    className={`absolute border-2 border-dashed rounded-lg transition-all hover:opacity-80 ${room.riskLevel === 'high' ? 'border-red-300 bg-red-50' :
                                                            room.riskLevel === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                                                                'border-green-300 bg-green-50'
                                                        } opacity-60`}
                                                    style={{
                                                        left: `${room.coordinates.x}%`,
                                                        top: `${room.coordinates.y}%`,
                                                        width: `${room.coordinates.width}%`,
                                                        height: `${room.coordinates.height}%`,
                                                    }}
                                                >
                                                    <div className="p-2">
                                                        <span className="text-xs font-semibold text-gray-700">{room.name}</span>
                                                        <div className="text-xs text-gray-600 mt-1">
                                                            Risk: <span className="capitalize">{room.riskLevel}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Camera Positions */}
                                            {cameras.map(camera => (
                                                <div
                                                    key={camera.id}
                                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                                    style={{
                                                        left: `${camera.location.x}%`,
                                                        top: `${camera.location.y}%`,
                                                    }}
                                                    onClick={() => handleCameraClick(camera.id)}
                                                >
                                                    <div className={`relative p-3 rounded-full ${getCameraStatusColor(camera.status)} shadow-lg hover:scale-110 transition-transform`}>
                                                        <Camera className="h-5 w-5 text-white" />
                                                        {camera.status === 'online' && camera.isRecording && (
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                        )}
                                                    </div>
                                                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <div className="font-semibold">{camera.name}</div>
                                                        <div className="text-gray-300">Status: {camera.status}</div>
                                                        <div className="text-gray-300">Last: {camera.lastActivity}</div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Fall Incident Markers */}
                                            {incidents.filter(incident => incident.status === 'active').map(incident => (
                                                <div
                                                    key={incident.id}
                                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                                    style={{
                                                        left: `${incident.location.x}%`,
                                                        top: `${incident.location.y}%`,
                                                    }}
                                                    onClick={() => handleIncidentClick(incident)}
                                                >
                                                    <div className={`relative p-3 rounded-full ${getIncidentSeverityColor(incident.severity)} shadow-lg z-20`}>
                                                        <AlertTriangle className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                                        <div className="font-semibold">Fall Detected</div>
                                                        <div>{incident.confidence}% confidence</div>
                                                        <div>{new Date(incident.timestamp).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Enhanced Legend */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                                <span>Camera Online</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                                <span>Camera Offline</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                                                <span>Active Fall Alert</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                <span>Recording Active</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Monitoring Mode - Live Camera Feed */}
                                {viewMode === 'monitoring' && selectedCamera && (
                                    <div className="space-y-6">
                                        {(() => {
                                            const camera = cameras.find(c => c.id === selectedCamera);
                                            if (!camera) return <div>Camera not found</div>;

                                            return (
                                                <div>
                                                    {/* Camera Controls Header */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center space-x-4">
                                                            <h3 className="text-xl font-semibold">{camera.name}</h3>
                                                            <span className={`px-3 py-1 rounded-full text-sm text-white ${getCameraStatusColor(camera.status)}`}>
                                                                {camera.status}
                                                            </span>
                                                            <span className="text-sm text-gray-600">{camera.location.room}</span>
                                                        </div>

                                                        <div className="flex items-center space-x-3">
                                                            {/* Stream Quality Selector */}
                                                            <select
                                                                value={streamQuality}
                                                                onChange={(e) => setStreamQuality(e.target.value as any)}
                                                                className="text-sm border border-gray-300 rounded px-2 py-1"
                                                            >
                                                                <option value="low">Low (480p)</option>
                                                                <option value="medium">Medium (720p)</option>
                                                                <option value="high">High (1080p)</option>
                                                            </select>

                                                            {/* Stream Controls */}
                                                            {camera.permissions.view && permissionsGranted && (
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => isStreaming ? stopStream() : startStream()}
                                                                        className={`p-2 rounded ${isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                                                                    >
                                                                        {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                                    </button>

                                                                    {camera.permissions.record && (
                                                                        <button
                                                                            onClick={() => isRecording ? stopRecording() : startRecording()}
                                                                            className={`p-2 rounded ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                                                                        >
                                                                            <div className="w-4 h-4 bg-white rounded-sm"></div>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Video Stream Area */}
                                                    <div className="relative">
                                                        {camera.permissions.view && permissionsGranted ? (
                                                            <div className="bg-black rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                                                                {isStreaming ? (
                                                                    <video
                                                                        ref={videoRef}
                                                                        autoPlay
                                                                        muted
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="text-white text-center">
                                                                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                                                        <p className="text-lg">Live Camera Feed</p>
                                                                        <p className="text-sm opacity-75">{camera.location.room}</p>
                                                                        <button
                                                                            onClick={startStream}
                                                                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                                        >
                                                                            Start Stream
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {/* Recording Indicator */}
                                                                {isRecording && (
                                                                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg flex items-center space-x-2 animate-pulse">
                                                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                                                        <span className="text-sm font-semibold">REC {formatRecordingDuration(recordingDuration)}</span>
                                                                    </div>
                                                                )}

                                                                {/* Stream Info Overlay */}
                                                                {isStreaming && (
                                                                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm">
                                                                        <div>Quality: {streamQuality}</div>
                                                                        <div>Camera: {camera.id}</div>
                                                                    </div>
                                                                )}

                                                                {/* Emergency Alert Button */}
                                                                <button
                                                                    onClick={() => triggerEmergencyAlert(camera.id)}
                                                                    className="absolute bottom-4 right-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 shadow-lg"
                                                                >
                                                                    <AlertTriangle className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                                                                <div className="text-gray-500 text-center">
                                                                    <EyeOff className="h-16 w-16 mx-auto mb-4" />
                                                                    <p className="text-lg">Camera Access Restricted</p>
                                                                    <p className="text-sm">Enable permissions to view live feed</p>
                                                                    {!permissionsGranted && (
                                                                        <button
                                                                            onClick={requestCameraPermissions}
                                                                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                                        >
                                                                            Request Access
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Camera Details */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <h4 className="font-semibold text-gray-900 mb-2">Camera Status</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Status:</span>
                                                                    <span className="font-medium">{camera.status}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Last Activity:</span>
                                                                    <span className="font-medium">{camera.lastActivity}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Recording:</span>
                                                                    <span className="font-medium">{camera.isRecording ? 'Active' : 'Inactive'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>Resolution:</span>
                                                                    <span className="font-medium">{camera.specifications?.resolution || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Field of View:</span>
                                                                    <span className="font-medium">{camera.specifications?.fieldOfView || 'N/A'}°</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Night Vision:</span>
                                                                    <span className="font-medium">{camera.specifications?.nightVision ? 'Yes' : 'No'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <h4 className="font-semibold text-gray-900 mb-2">Permissions</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span>View:</span>
                                                                    <span className={`font-medium ${camera.permissions.view ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {camera.permissions.view ? 'Allowed' : 'Denied'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Record:</span>
                                                                    <span className={`font-medium ${camera.permissions.record ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {camera.permissions.record ? 'Allowed' : 'Denied'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span>Audio:</span>
                                                                    <span className={`font-medium ${camera.permissions.audio ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {camera.permissions.audio ? 'Allowed' : 'Denied'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* Incidents Mode */}
                                {viewMode === 'incidents' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">Fall Detection Incidents</h3>
                                            <div className="flex space-x-2">
                                                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                                                    <option>All Incidents</option>
                                                    <option>Active Only</option>
                                                    <option>Resolved</option>
                                                    <option>False Positives</option>
                                                </select>
                                                <button className="p-2 text-gray-600 hover:text-gray-800">
                                                    <RotateCcw className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {incidents.map(incident => (
                                                <div key={incident.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <span className={`px-3 py-1 rounded-full text-sm text-white ${getIncidentSeverityColor(incident.severity)}`}>
                                                                    {incident.severity.toUpperCase()}
                                                                </span>
                                                                <span className={`px-2 py-1 rounded text-xs ${incident.status === 'active' ? 'bg-red-100 text-red-800' :
                                                                        incident.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                                                                            incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                                                'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                    {incident.status}
                                                                </span>
                                                                <span className="text-sm text-gray-600">
                                                                    {new Date(incident.timestamp).toLocaleString()}
                                                                </span>
                                                                <span className="text-sm text-gray-600">
                                                                    Confidence: {incident.confidence}%
                                                                </span>
                                                            </div>

                                                            <div className="mb-2">
                                                                <p className="text-gray-900 font-medium">
                                                                    {incident.location.room} - {incident.location.description}
                                                                </p>
                                                                <p className="text-gray-600 text-sm">
                                                                    Camera: {cameras.find(c => c.id === incident.cameraId)?.name || 'Unknown'}
                                                                </p>
                                                                {incident.responseTime && (
                                                                    <p className="text-gray-600 text-sm">
                                                                        Response time: {incident.responseTime} seconds
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {incident.notes && (
                                                                <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">
                                                                    <strong>Notes:</strong> {incident.notes}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col space-y-2 ml-4">
                                                            {incident.status === 'active' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => acknowledgeAlert(`alert-${incident.id}`)}
                                                                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                                                                    >
                                                                        Acknowledge
                                                                    </button>
                                                                    <button
                                                                        onClick={() => resolveAlert(`alert-${incident.id}`)}
                                                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                                                    >
                                                                        Resolve
                                                                    </button>
                                                                    <button
                                                                        onClick={() => markFalsePositive(`alert-${incident.id}`)}
                                                                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                                                                    >
                                                                        False Positive
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button
                                                                onClick={() => handleIncidentClick(incident)}
                                                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                                            >
                                                                View Camera
                                                            </button>
                                                            {incident.videoClipUrl && (
                                                                <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 flex items-center space-x-1">
                                                                    <Download className="h-3 w-3" />
                                                                    <span>Download</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Analytics Mode */}
                                {viewMode === 'analytics' && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold">System Analytics</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-blue-600">{cameras.length}</div>
                                                <div className="text-sm text-gray-600">Total Cameras</div>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {Math.round((cameras.filter(c => c.status === 'online').length / cameras.length) * 100)}%
                                                </div>
                                                <div className="text-sm text-gray-600">System Uptime</div>
                                            </div>
                                            <div className="bg-orange-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-orange-600">{incidents.length}</div>
                                                <div className="text-sm text-gray-600">Total Incidents</div>
                                            </div>
                                            <div className="bg-red-50 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {incidents.filter(i => i.status === 'false_positive').length}
                                                </div>
                                                <div className="text-sm text-gray-600">False Positives</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold mb-4">Recent Activity</h4>
                                            <div className="space-y-2 text-sm">
                                                {incidents.slice(0, 5).map(incident => (
                                                    <div key={incident.id} className="flex justify-between items-center">
                                                        <span>{incident.location.room} - {incident.severity} incident</span>
                                                        <span className="text-gray-500">{new Date(incident.timestamp).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Camera Status Panel */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Camera Status</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {cameras.map(camera => (
                                    <div
                                        key={camera.id}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedCamera === camera.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => handleCameraClick(camera.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-3 h-3 rounded-full ${getCameraStatusColor(camera.status)}`}></div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{camera.name}</p>
                                                    <p className="text-sm text-gray-600">{camera.location.room}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                {camera.isRecording && (
                                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                )}
                                                {camera.hasMotionDetection && (
                                                    <Activity className="h-3 w-3 text-blue-500" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Last activity: {camera.lastActivity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Total Cameras</span>
                                    <span className="font-semibold">{cameras.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Online</span>
                                    <span className="font-semibold text-green-600">{cameras.filter(c => c.status === 'online').length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Recording</span>
                                    <span className="font-semibold text-red-600">{cameras.filter(c => c.isRecording).length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Active Incidents</span>
                                    <span className="font-semibold text-orange-600">{incidents.filter(i => i.status === 'active').length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Connection</span>
                                    <span className={`font-semibold ${connectionStatus === 'connected' ? 'text-green-600' :
                                            connectionStatus === 'reconnecting' ? 'text-yellow-600' :
                                                'text-red-600'
                                        }`}>
                                        {connectionStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Controls */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Emergency Controls</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <button
                                    onClick={() => selectedCamera && triggerEmergencyAlert(selectedCamera)}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                                >
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Emergency Alert</span>
                                </button>
                                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 flex items-center justify-center space-x-2">
                                    <Users className="h-4 w-4" />
                                    <span>Call Caregiver</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('incidents')}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                                >
                                    <Activity className="h-4 w-4" />
                                    <span>View All Incidents</span>
                                </button>
                                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2">
                                    <Settings className="h-4 w-4" />
                                    <span>System Settings</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedGuardianProtect;