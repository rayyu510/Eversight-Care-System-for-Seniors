import React, { useState } from 'react';
import {
    Monitor, Shield, BarChart3, Users, Heart, Home, Settings, Menu, X,
    Camera, Activity, AlertTriangle, MapPin, Eye, EyeOff
} from 'lucide-react';

// Independent Monitoring System - Completely separate from Guardian modules
const mockMonitoringData = {
    facility: {
        name: "Sunrise Senior Living Facility",
        address: "123 Care Lane, Fairfield, CA",
        floors: 2,
        totalRooms: 20,
        totalCameras: 45
    },
    floors: [
        {
            id: 1,
            name: "First Floor",
            rooms: Array.from({ length: 10 }, (_, i) => ({
                id: `1-${i + 1}`,
                number: `10${i + 1}`,
                resident: {
                    name: `${['John', 'Mary', 'Robert', 'Patricia', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara'][i]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][i]}`,
                    age: 75 + Math.floor(Math.random() * 15),
                    careLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
                },
                camera: {
                    id: `CAM-R${i + 1}01`,
                    status: Math.random() > 0.1 ? 'online' : 'offline',
                    lastActivity: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                    alertLevel: ['none', 'low', 'medium', 'high'][Math.floor(Math.random() * 4)],
                    currentActivity: ['Sleeping', 'Reading', 'Watching TV', 'Resting', 'Moving around'][Math.floor(Math.random() * 5)]
                },
                position: { x: 100 + (i % 5) * 160, y: 80 + Math.floor(i / 5) * 120 }
            })),
            publicAreas: [
                {
                    id: 'dining-1',
                    name: 'Dining Hall',
                    cameras: [
                        { id: 'CAM-D101', position: { x: 50, y: 300 }, status: 'online' },
                        { id: 'CAM-D102', position: { x: 200, y: 300 }, status: 'online' },
                        { id: 'CAM-D103', position: { x: 350, y: 300 }, status: 'online' }
                    ],
                    currentOccupancy: Math.floor(Math.random() * 25),
                    maxCapacity: 40,
                    position: { x: 30, y: 320, width: 400, height: 100 }
                },
                {
                    id: 'lounge-1',
                    name: 'Main Lounge',
                    cameras: [
                        { id: 'CAM-L101', position: { x: 550, y: 300 }, status: 'online' },
                        { id: 'CAM-L102', position: { x: 650, y: 300 }, status: 'online' }
                    ],
                    currentOccupancy: Math.floor(Math.random() * 15),
                    maxCapacity: 20,
                    position: { x: 500, y: 320, width: 250, height: 100 }
                }
            ]
        }
    ],
    recentAlerts: [
        {
            id: 'A001',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            type: 'fall_detection',
            severity: 'high',
            location: 'Room 105',
            resident: 'Mary Johnson',
            description: 'Possible fall detected',
            status: 'active'
        }
    ]
};

// Main Application Component - 5 Independent Sections
const EverSightCareDesktop = () => {
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Five independent sections
    const sections = [
        {
            id: 'dashboard',
            name: 'Main Dashboard',
            icon: Home,
            color: 'bg-blue-500',
            description: 'System overview and quick access'
        },
        {
            id: 'monitoring',
            name: 'Live Monitoring',
            icon: Monitor,
            color: 'bg-indigo-600',
            description: 'Real-time facility monitoring'
        },
        {
            id: 'guardian-protect',
            name: 'Guardian Protect',
            icon: Shield,
            color: 'bg-green-500',
            description: 'Security & emergency response'
        },
        {
            id: 'guardian-insight',
            name: 'Guardian Insight',
            icon: BarChart3,
            color: 'bg-purple-500',
            description: 'Analytics & reporting'
        },
        {
            id: 'guardian-carepro',
            name: 'Guardian CarePro',
            icon: Users,
            color: 'bg-orange-500',
            description: 'Staff & resident management'
        },
        {
            id: 'guardian-caretrack',
            name: 'Guardian CareTrack',
            icon: Heart,
            color: 'bg-red-500',
            description: 'Health monitoring & tracking'
        }
    ];

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            {/* Sidebar Navigation */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
                {/* Header */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <div>
                                <h1 className="text-xl font-bold">EverSight Care</h1>
                                <p className="text-sm text-gray-400">Desktop Platform</p>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-700 rounded"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setCurrentSection(section.id)}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${currentSection === section.id
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <div className={`p-2 rounded ${section.color} mr-3`}>
                                <section.icon className="h-5 w-5 text-white" />
                            </div>
                            {sidebarOpen && (
                                <div className="text-left">
                                    <div className="font-medium">{section.name}</div>
                                    <div className="text-xs text-gray-400">{section.description}</div>
                                </div>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700">
                    <div className="text-xs text-gray-500">
                        EverSight Care Desktop v2.0
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                {sections.find(s => s.id === currentSection) && (
                                    <div className={`p-2 rounded ${sections.find(s => s.id === currentSection).color}`}>
                                        {React.createElement(sections.find(s => s.id === currentSection).icon, { className: "h-5 w-5 text-white" })}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {sections.find(s => s.id === currentSection)?.name || 'Dashboard'}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {sections.find(s => s.id === currentSection)?.description || 'Welcome to EverSight Care Desktop'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-600 hover:text-gray-900">
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Section Content */}
                <main className="flex-1 overflow-auto">
                    <SectionContent currentSection={currentSection} />
                </main>
            </div>
        </div>
    );
};

// Section Content Router
const SectionContent = ({ currentSection }) => {
    const renderSectionContent = () => {
        switch (currentSection) {
            case 'dashboard':
                return <MainDashboard />;
            case 'monitoring':
                return <IndependentMonitoringSystem />;
            case 'guardian-protect':
                return <GuardianProtectSection />;
            case 'guardian-insight':
                return <GuardianInsightSection />;
            case 'guardian-carepro':
                return <GuardianCareProSection />;
            case 'guardian-caretrack':
                return <GuardianCareTrackSection />;
            default:
                return <MainDashboard />;
        }
    };

    return (
        <div className="h-full">
            {renderSectionContent()}
        </div>
    );
};

// Main Dashboard Section
const MainDashboard = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Monitor className="h-8 w-8 text-indigo-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Live Monitoring</p>
                            <p className="text-2xl font-semibold text-gray-900">45 Cameras</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Shield className="h-8 w-8 text-green-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Guardian Protect</p>
                            <p className="text-2xl font-semibold text-gray-900">24/7 Active</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-purple-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Analytics</p>
                            <p className="text-2xl font-semibold text-gray-900">15 Reports</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-orange-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Staff & Residents</p>
                            <p className="text-2xl font-semibold text-gray-900">52 People</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Heart className="h-8 w-8 text-red-500" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Health Tracking</p>
                            <p className="text-2xl font-semibold text-gray-900">20 Monitored</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
                    <p className="text-gray-600 mb-4">
                        Welcome to EverSight Care Desktop. Navigate between the five independent sections using the sidebar.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                            <Monitor className="h-8 w-8 text-indigo-600 mb-2" />
                            <h4 className="font-medium text-gray-900">Live Monitoring</h4>
                            <p className="text-sm text-gray-600">Complete facility monitoring with floor plans and camera feeds</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <Shield className="h-8 w-8 text-green-500 mb-2" />
                            <h4 className="font-medium text-gray-900">Guardian Protect</h4>
                            <p className="text-sm text-gray-600">Security and emergency response management</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <BarChart3 className="h-8 w-8 text-purple-500 mb-2" />
                            <h4 className="font-medium text-gray-900">Guardian Insight</h4>
                            <p className="text-sm text-gray-600">Analytics and reporting dashboard</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Independent Monitoring System - Completely separate
const IndependentMonitoringSystem = () => {
    const [selectedFloor, setSelectedFloor] = useState(1);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [showCameraOverlay, setShowCameraOverlay] = useState(true);
    const [showActivityHeatmap, setShowActivityHeatmap] = useState(false);

    const currentFloor = mockMonitoringData.floors.find(f => f.id === selectedFloor);

    const getCameraStatusColor = (status) => {
        switch (status) {
            case 'online': return '#10B981';
            case 'offline': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getAlertColor = (level) => {
        switch (level) {
            case 'high': return '#EF4444';
            case 'medium': return '#F59E0B';
            case 'low': return '#3B82F6';
            default: return '#10B981';
        }
    };

    return (
        <div className="h-full bg-gray-50">
            {/* Monitoring Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Live Monitoring System</h2>
                        <p className="text-sm text-gray-600">{mockMonitoringData.facility.name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Live Feed Active</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Monitoring Content */}
            <div className="p-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <Camera className="h-6 w-6 text-blue-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Total Cameras</p>
                                <p className="text-xl font-semibold text-gray-900">{mockMonitoringData.facility.totalCameras}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <Activity className="h-6 w-6 text-green-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Online Cameras</p>
                                <p className="text-xl font-semibold text-gray-900">42</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                                <p className="text-xl font-semibold text-gray-900">1</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center">
                            <MapPin className="h-6 w-6 text-purple-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Monitored Areas</p>
                                <p className="text-xl font-semibold text-gray-900">22</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Monitoring Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Floor Plan */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Interactive Floor Plan</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex rounded-md bg-gray-100 p-1">
                                        {mockMonitoringData.floors.map(floor => (
                                            <button
                                                key={floor.id}
                                                onClick={() => setSelectedFloor(floor.id)}
                                                className={`px-3 py-1 rounded text-sm font-medium ${selectedFloor === floor.id
                                                        ? 'bg-white text-blue-600 shadow-sm'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                {floor.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setShowCameraOverlay(!showCameraOverlay)}
                                            className={`p-2 rounded ${showCameraOverlay ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {showCameraOverlay ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </button>
                                        <button
                                            onClick={() => setShowActivityHeatmap(!showActivityHeatmap)}
                                            className={`p-2 rounded ${showActivityHeatmap ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            <Activity className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* SVG Floor Plan */}
                            <div className="relative">
                                <svg viewBox="0 0 800 500" className="w-full h-96 border rounded bg-gray-50">
                                    {/* Background */}
                                    <rect width="800" height="500" fill="#F8FAFC" />

                                    {/* Public Areas */}
                                    {currentFloor?.publicAreas.map(area => (
                                        <g key={area.id}>
                                            <rect
                                                x={area.position.x}
                                                y={area.position.y}
                                                width={area.position.width}
                                                height={area.position.height}
                                                fill="#E5E7EB"
                                                stroke="#9CA3AF"
                                                strokeWidth="2"
                                                opacity="0.7"
                                            />
                                            <text
                                                x={area.position.x + area.position.width / 2}
                                                y={area.position.y + area.position.height / 2}
                                                textAnchor="middle"
                                                className="text-sm font-medium fill-gray-700"
                                            >
                                                {area.name}
                                            </text>
                                            <text
                                                x={area.position.x + area.position.width / 2}
                                                y={area.position.y + area.position.height / 2 + 20}
                                                textAnchor="middle"
                                                className="text-xs fill-gray-600"
                                            >
                                                {area.currentOccupancy} occupants
                                            </text>
                                        </g>
                                    ))}

                                    {/* Resident Rooms */}
                                    {currentFloor?.rooms.map(room => (
                                        <g key={room.id}>
                                            <rect
                                                x={room.position.x}
                                                y={room.position.y}
                                                width="140"
                                                height="100"
                                                fill={getAlertColor(room.camera.alertLevel)}
                                                stroke="#374151"
                                                strokeWidth="1"
                                                opacity="0.8"
                                                className="cursor-pointer hover:opacity-100"
                                                onClick={() => setSelectedCamera(room.camera)}
                                            />
                                            <text
                                                x={room.position.x + 70}
                                                y={room.position.y + 25}
                                                textAnchor="middle"
                                                className="text-sm font-bold fill-white"
                                            >
                                                Room {room.number}
                                            </text>
                                            <text
                                                x={room.position.x + 70}
                                                y={room.position.y + 45}
                                                textAnchor="middle"
                                                className="text-xs fill-white"
                                            >
                                                {room.resident.name.split(' ')[0]} {room.resident.name.split(' ')[1].charAt(0)}.
                                            </text>
                                            <text
                                                x={room.position.x + 70}
                                                y={room.position.y + 65}
                                                textAnchor="middle"
                                                className="text-xs fill-white"
                                            >
                                                {room.camera.currentActivity}
                                            </text>
                                        </g>
                                    ))}

                                    {/* Camera Positions */}
                                    {showCameraOverlay && currentFloor?.publicAreas.map(area =>
                                        area.cameras.map(camera => (
                                            <g key={camera.id}>
                                                <circle
                                                    cx={camera.position.x}
                                                    cy={camera.position.y}
                                                    r="8"
                                                    fill={getCameraStatusColor(camera.status)}
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    className="cursor-pointer"
                                                    onClick={() => setSelectedCamera(camera)}
                                                />
                                                <text
                                                    x={camera.position.x}
                                                    y={camera.position.y + 3}
                                                    textAnchor="middle"
                                                    className="text-xs fill-white pointer-events-none"
                                                >
                                                    📹
                                                </text>
                                            </g>
                                        ))
                                    )}
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-6">
                        {/* Recent Alerts */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h4>
                                <div className="space-y-3">
                                    {mockMonitoringData.recentAlerts.map(alert => (
                                        <div
                                            key={alert.id}
                                            className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{alert.location}</p>
                                                    <p className="text-sm text-gray-600">{alert.resident}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                                                </div>
                                                <div className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                                                    {alert.status}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-2">
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Camera Details */}
                        {selectedCamera && (
                            <div className="bg-white rounded-lg shadow">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-gray-900">Camera Details</h4>
                                        <button
                                            onClick={() => setSelectedCamera(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Camera ID</p>
                                            <p className="text-sm text-gray-900">{selectedCamera.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Status</p>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${selectedCamera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                <span className="text-sm text-gray-900 capitalize">{selectedCamera.status}</span>
                                            </div>
                                        </div>
                                        {selectedCamera.currentActivity && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Current Activity</p>
                                                <p className="text-sm text-gray-900">{selectedCamera.currentActivity}</p>
                                            </div>
                                        )}
                                        {selectedCamera.lastActivity && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Last Activity</p>
                                                <p className="text-sm text-gray-900">
                                                    {new Date(selectedCamera.lastActivity).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Legend */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Legend</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                                        <span className="text-sm text-gray-700">Normal / Online</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                        <span className="text-sm text-gray-700">Low Alert</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                        <span className="text-sm text-gray-700">Medium Alert</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                                        <span className="text-sm text-gray-700">High Alert / Emergency</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Guardian Module Placeholders - Completely independent
const GuardianProtectSection = () => (
    <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Guardian Protect - Security & Emergency Response</h2>
            <p className="text-gray-600 mb-4">
                This is the Guardian Protect section - completely independent from the monitoring system.
                Your existing Guardian Protect functionality would be integrated here.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-800 font-medium">Status: Fully Operational & Independent</span>
                </div>
            </div>
        </div>
    </div>
);

const GuardianInsightSection = () => (
    <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Guardian Insight - Analytics & Reporting</h2>
            <p className="text-gray-600 mb-4">
                Independent analytics and reporting section. This operates separately from the monitoring system.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-purple-800 font-medium">Framework Ready for Independent Development</span>
                </div>
            </div>
        </div>
    </div>
);

const GuardianCareProSection = () => (
    <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Guardian CarePro - Staff & Resident Management</h2>
            <p className="text-gray-600 mb-4">
                Independent staff and resident management section. Operates separately from monitoring.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center">
                    <Users className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-orange-800 font-medium">Framework Ready for Independent Development</span>
                </div>
            </div>
        </div>
    </div>
);

const GuardianCareTrackSection = () => (
    <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Guardian CareTrack - Health Monitoring</h2>
            <p className="text-gray-600 mb-4">
                Independent health monitoring section. Separate from the facility monitoring system.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-800 font-medium">Framework Ready for Independent Development</span>
                </div>
            </div>
        </div>
    </div>
);

export default EverSightCareDesktop;