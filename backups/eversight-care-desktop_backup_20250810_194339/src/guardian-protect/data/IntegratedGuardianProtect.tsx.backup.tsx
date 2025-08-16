import React, { useState, useEffect } from 'react';

// Types
export type Resident = {
    id: string;
    firstName: string;
    lastName: string;
    roomNumber: string;
    floor: number;
    riskLevel: string;
    currentLocation: string;
};

export type Camera = {
    id: string;
    name: string;
    floor: number;
    status: string;
};

export type Alert = {
    id: string;
    type: string;
    severity: string;
    title: string;
    description: string;
    location: string;
    timestamp: string;
    status: string;
};

export type StaffMember = {
    id: string;
    name: string;
    role: string;
    status: string;
};

export type EmergencyResponse = {
    id: string;
    title: string;
    status: string;
    priority: string;
    assignedTeam: string[];
};

// Mock Data
const mockData = {
    residents: [
        {
            id: 'RES-101',
            firstName: 'Margaret',
            lastName: 'Johnson',
            roomNumber: '101',
            floor: 1,
            riskLevel: 'medium',
            currentLocation: 'Dining Room'
        },
        {
            id: 'RES-102',
            firstName: 'Harold',
            lastName: 'Williams',
            roomNumber: '102',
            floor: 1,
            riskLevel: 'high',
            currentLocation: 'Room 102'
        },
        {
            id: 'RES-201',
            firstName: 'Robert',
            lastName: 'Martinez',
            roomNumber: '201',
            floor: 2,
            riskLevel: 'critical',
            currentLocation: 'Room 201'
        }
    ],
    cameras: [
        { id: 'CAM-101', name: 'Room 101 Monitor', floor: 1, status: 'online' },
        { id: 'CAM-102', name: 'Room 102 Monitor', floor: 1, status: 'online' },
        { id: 'CAM-H01', name: 'Hallway Floor 1', floor: 1, status: 'online' },
        { id: 'CAM-201', name: 'Room 201 Monitor', floor: 2, status: 'online' },
        { id: 'CAM-H02', name: 'Hallway Floor 2', floor: 2, status: 'online' }
    ],
    alerts: [
        {
            id: 'ALERT-001',
            type: 'fall_detected',
            severity: 'critical',
            title: 'Fall Detected - Room 201',
            description: 'AI detected fall in Room 201',
            location: 'Room 201',
            timestamp: new Date().toISOString(),
            status: 'active'
        },
        {
            id: 'ALERT-002',
            type: 'wandering',
            severity: 'high',
            title: 'Wandering Alert - Harold Williams',
            description: 'Resident found in unauthorized area',
            location: 'Room 102',
            timestamp: new Date().toISOString(),
            status: 'active'
        }
    ],
    staff: [
        { id: 'STAFF-001', name: 'Dr. Patricia Wells', role: 'doctor', status: 'on_duty' },
        { id: 'STAFF-002', name: 'Nurse Jennifer Adams', role: 'nurse', status: 'on_duty' }
    ]
};

const IntegratedGuardianProtect: React.FC = () => {
    const [activeModule, setActiveModule] = useState('floor-plan');
    const [selectedFloor, setSelectedFloor] = useState<1 | 2>(1);
    const [alerts, setAlerts] = useState(mockData.alerts);

    useEffect(() => {
        const interval = setInterval(() => {
            const newAlert = {
                id: `ALERT-${Date.now()}`,
                type: 'wandering',
                severity: 'medium',
                title: 'Demo Alert',
                description: 'Auto-generated alert for demo',
                location: `Room ${Math.floor(Math.random() * 3) + 101}`,
                timestamp: new Date().toISOString(),
                status: 'active'
            };
            setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
        }, 60000); // Changed to 60 seconds instead of 15

        return () => clearInterval(interval);
    }, []);

    const handleRoomClick = (roomNumber: string) => {
        console.log(`Room ${roomNumber} clicked`);
        alert(`Clicked on Room ${roomNumber}`);
    };

    const handleAlertClick = (alertId: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId
                ? { ...alert, status: 'acknowledged' }
                : alert
        ));
    };

    const renderFloorPlan = () => {
        const floorResidents = mockData.residents.filter(r => r.floor === selectedFloor);
        const floorAlerts = alerts.filter(a =>
            a.status === 'active' &&
            mockData.residents.some(r =>
                a.location.includes(r.roomNumber) && r.floor === selectedFloor
            )
        );

        const rooms = selectedFloor === 1
            ? ['101', '102', '103', '104', '105', '106']
            : ['201', '202', '203', '204', '205', '206'];

        return (
            <div className="p-6 h-full">
                <h2 className="text-xl font-bold mb-4">Floor {selectedFloor} - Interactive Plan</h2>

                <div className="grid grid-cols-3 gap-6 mb-6">
                    {rooms.map(roomNum => {
                        const resident = floorResidents.find(r => r.roomNumber === roomNum);
                        const hasAlert = floorAlerts.some(a => a.location.includes(roomNum));

                        return (
                            <div
                                key={roomNum}
                                onClick={() => handleRoomClick(roomNum)}
                                className={`
                                    relative border-2 rounded-lg p-4 cursor-pointer min-h-32 
                                    flex flex-col justify-center items-center
                                    transition-all duration-200 hover:shadow-lg
                                    ${hasAlert
                                        ? 'border-red-500 bg-red-100 animate-pulse'
                                        : resident
                                            ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <div className="font-bold text-lg">Room {roomNum}</div>
                                {resident && (
                                    <div className="text-center mt-2">
                                        <div className="font-medium">{resident.firstName} {resident.lastName}</div>
                                        <div className="text-sm text-gray-600">Risk: {resident.riskLevel}</div>
                                        <div className="text-xs text-gray-500">{resident.currentLocation}</div>
                                    </div>
                                )}

                                {hasAlert && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                                        🚨 ALERT
                                    </div>
                                )}

                                <div className="absolute bottom-2 right-2 text-blue-600">📹</div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Floor {selectedFloor} Status</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Residents:</strong> {floorResidents.length}
                            <ul className="ml-4 mt-1">
                                {floorResidents.map(r => (
                                    <li key={r.id}>• {r.firstName} {r.lastName} (Room {r.roomNumber})</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Active Alerts:</strong> {floorAlerts.length}
                            <ul className="ml-4 mt-1">
                                {floorAlerts.map(a => (
                                    <li key={a.id} className="text-red-600">• {a.title}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAlerts = () => (
        <div className="p-6 h-full">
            <h2 className="text-xl font-bold mb-4">Active Alerts ({alerts.filter(a => a.status === 'active').length})</h2>
            <div className="space-y-4">
                {alerts.filter(a => a.status === 'active').map(alert => (
                    <div key={alert.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-red-800">{alert.title}</h3>
                                <p className="text-red-600 mt-1">{alert.description}</p>
                                <div className="text-sm text-gray-600 mt-2">
                                    <span>Location: {alert.location}</span> •
                                    <span> Severity: {alert.severity}</span> •
                                    <span> {new Date(alert.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAlertClick(alert.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                                Acknowledge
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderVideoFeeds = () => (
        <div className="p-6 h-full">
            <h2 className="text-xl font-bold mb-4">Video Feeds - Floor {selectedFloor}</h2>
            <div className="grid grid-cols-2 gap-4">
                {mockData.cameras.filter(c => c.floor === selectedFloor).map(camera => (
                    <div key={camera.id} className="border border-gray-300 rounded-lg p-4 bg-gray-100">
                        <h3 className="font-semibold mb-2">{camera.name}</h3>
                        <div className="bg-black rounded h-32 flex items-center justify-center text-white">
                            📹 Live Feed Placeholder
                        </div>
                        <div className="mt-2 text-sm">
                            Status: <span className="text-green-600">{camera.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderResponseDashboard = () => (
        <div className="p-6 h-full">
            <h2 className="text-xl font-bold mb-4">Emergency Response Dashboard</h2>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold mb-3">Active Staff</h3>
                    <div className="space-y-2">
                        {mockData.staff.map(staff => (
                            <div key={staff.id} className="border border-green-200 bg-green-50 rounded p-3">
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-gray-600">{staff.role} - {staff.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">Response Protocols</h3>
                    <div className="space-y-2">
                        <button className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700">
                            🚨 Emergency Alert
                        </button>
                        <button className="w-full bg-orange-600 text-white p-3 rounded hover:bg-orange-700">
                            🏥 Medical Response
                        </button>
                        <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                            🔐 Security Protocol
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeModule) {
            case 'floor-plan':
                return renderFloorPlan();
            case 'alerts':
                return renderAlerts();
            case 'video-feeds':
                return renderVideoFeeds();
            case 'response-dashboard':
                return renderResponseDashboard();
            default:
                return <div className="p-6">Select a module to begin</div>;
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Guardian Protect Integration</h1>
                    <select
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(Number(e.target.value) as 1 | 2)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value={1}>Floor 1</option>
                        <option value={2}>Floor 2</option>
                    </select>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b px-6 py-3">
                <div className="flex space-x-2">
                    {[
                        { id: 'floor-plan', label: 'Floor Plan', icon: '🏢' },
                        { id: 'alerts', label: 'Alerts', icon: '🚨', count: alerts.filter(a => a.status === 'active').length },
                        { id: 'video-feeds', label: 'Video Feeds', icon: '📹' },
                        { id: 'response-dashboard', label: 'Response', icon: '🚑' }
                    ].map(module => (
                        <button
                            key={module.id}
                            onClick={() => setActiveModule(module.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${activeModule === module.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            <span className="mr-2">{module.icon}</span>
                            {module.label}
                            {module.count && module.count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {module.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-white">
                {renderContent()}
            </div>

            {/* Status Bar */}
            <div className="bg-gray-800 text-white px-6 py-2 text-sm">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <span>🟢 System Online</span>
                        <span>👥 {mockData.residents.length} Residents</span>
                        <span>📹 {mockData.cameras.length} Cameras</span>
                        <span>🚨 {alerts.filter(a => a.status === 'active').length} Active Alerts</span>
                    </div>
                    <div>
                        Module: {activeModule} | Floor: {selectedFloor}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegratedGuardianProtect;