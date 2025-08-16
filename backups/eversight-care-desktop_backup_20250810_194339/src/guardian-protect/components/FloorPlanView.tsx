// File: src/guardian-protect/components/FloorPlanView.tsx
// Clean version with direct mock data - no service calls

import React, { useState, useEffect, useCallback } from 'react';

interface Resident {
    id: string;
    name: string;
    roomNumber: string;
    riskLevel: 'low' | 'medium' | 'high';
    currentLocation: string;
    lastSeen: string;
    status: 'present' | 'away' | 'unknown';
}

interface FloorPlan {
    id: string;
    floor: number;
    name: string;
    rooms: Array<{
        id: string;
        number: string;
        name: string;
        type: 'resident_room' | 'common_area' | 'staff_area' | 'utility';
        x: number;
        y: number;
        width: number;
        height: number;
        occupants: string[];
    }>;
    dimensions: {
        width: number;
        height: number;
    };
}

interface FloorPlanViewProps {
    selectedFloor: number;
    onRoomClick?: (roomId: string) => void;
    showResidents?: boolean;
    className?: string;
}

const FloorPlanView: React.FC<FloorPlanViewProps> = ({
    selectedFloor,
    onRoomClick,
    showResidents = true,
    className = ''
}) => {
    const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    // Mock floor plan data
    const mockFloorPlans: FloorPlan[] = [
        {
            id: 'floor-1',
            floor: 1,
            name: 'First Floor',
            dimensions: { width: 600, height: 400 },
            rooms: [
                {
                    id: 'WW-101',
                    number: 'WW-101',
                    name: 'West Wing Room 101',
                    type: 'resident_room',
                    x: 50,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['WW101']
                },
                {
                    id: 'WW-102',
                    number: 'WW-102',
                    name: 'West Wing Room 102',
                    type: 'resident_room',
                    x: 140,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['WW102']
                },
                {
                    id: 'WW-103',
                    number: 'WW-103',
                    name: 'West Wing Room 103',
                    type: 'resident_room',
                    x: 230,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['WW103']
                },
                {
                    id: 'EW-101',
                    number: 'EW-101',
                    name: 'East Wing Room 101',
                    type: 'resident_room',
                    x: 350,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['EW101']
                },
                {
                    id: 'EW-102',
                    number: 'EW-102',
                    name: 'East Wing Room 102',
                    type: 'resident_room',
                    x: 440,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['EW102']
                },
                {
                    id: 'EW-103',
                    number: 'EW-103',
                    name: 'East Wing Room 103',
                    type: 'resident_room',
                    x: 530,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['EW103']
                },
                {
                    id: 'main-dining',
                    number: 'DR',
                    name: 'Main Dining Room',
                    type: 'common_area',
                    x: 180,
                    y: 180,
                    width: 160,
                    height: 80,
                    occupants: []
                },
                {
                    id: 'nurses-station',
                    number: 'NS',
                    name: 'Nurses Station',
                    type: 'staff_area',
                    x: 350,
                    y: 180,
                    width: 80,
                    height: 80,
                    occupants: []
                },
                {
                    id: 'main-lobby',
                    number: 'LB',
                    name: 'Main Lobby',
                    type: 'common_area',
                    x: 200,
                    y: 50,
                    width: 200,
                    height: 40,
                    occupants: []
                }
            ]
        },
        {
            id: 'floor-2',
            floor: 2,
            name: 'Second Floor',
            dimensions: { width: 600, height: 400 },
            rooms: [
                {
                    id: 'WW-201',
                    number: 'WW-201',
                    name: 'West Wing Room 201',
                    type: 'resident_room',
                    x: 50,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['WW201']
                },
                {
                    id: 'WW-202',
                    number: 'WW-202',
                    name: 'West Wing Room 202',
                    type: 'resident_room',
                    x: 140,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['WW202']
                },
                {
                    id: 'WW-203',
                    number: 'WW-203',
                    name: 'West Wing Room 203',
                    type: 'resident_room',
                    x: 230,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['WW203']
                },
                {
                    id: 'EW-201',
                    number: 'EW-201',
                    name: 'East Wing Room 201',
                    type: 'resident_room',
                    x: 350,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['EW201']
                },
                {
                    id: 'EW-202',
                    number: 'EW-202',
                    name: 'East Wing Room 202',
                    type: 'resident_room',
                    x: 440,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['EW202']
                },
                {
                    id: 'EW-203',
                    number: 'EW-203',
                    name: 'East Wing Room 203',
                    type: 'resident_room',
                    x: 530,
                    y: 100,
                    width: 80,
                    height: 60,
                    occupants: ['EW203']
                },
                {
                    id: 'activity-room',
                    number: 'AR',
                    name: 'Activity Room',
                    type: 'common_area',
                    x: 180,
                    y: 180,
                    width: 160,
                    height: 80,
                    occupants: []
                },
                {
                    id: 'second-nurses',
                    number: 'NS2',
                    name: 'Second Floor Nurses Station',
                    type: 'staff_area',
                    x: 350,
                    y: 180,
                    width: 80,
                    height: 80,
                    occupants: []
                }
            ]
        }
    ];

    // Mock resident data
    const mockResidents: Resident[] = [
        {
            id: 'WW101',
            name: 'Sarah Thompson',
            roomNumber: 'WW-101',
            riskLevel: 'medium',
            currentLocation: 'WW-101',
            lastSeen: new Date(Date.now() - 15 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'WW102',
            name: 'Michael Rodriguez',
            roomNumber: 'WW-102',
            riskLevel: 'high',
            currentLocation: 'WW-102',
            lastSeen: new Date(Date.now() - 5 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'WW103',
            name: 'Jennifer Davis',
            roomNumber: 'WW-103',
            riskLevel: 'low',
            currentLocation: 'WW-103',
            lastSeen: new Date(Date.now() - 30 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'WW201',
            name: 'Robert Chen',
            roomNumber: 'WW-201',
            riskLevel: 'medium',
            currentLocation: 'WW-201',
            lastSeen: new Date(Date.now() - 10 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'WW202',
            name: 'Maria Garcia',
            roomNumber: 'WW-202',
            riskLevel: 'high',
            currentLocation: 'Main Dining Room',
            lastSeen: new Date(Date.now() - 2 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'WW203',
            name: 'David Wilson',
            roomNumber: 'WW-203',
            riskLevel: 'low',
            currentLocation: 'WW-203',
            lastSeen: new Date(Date.now() - 45 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'EW101',
            name: 'Lisa Anderson',
            roomNumber: 'EW-101',
            riskLevel: 'medium',
            currentLocation: 'EW-101',
            lastSeen: new Date(Date.now() - 20 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'EW102',
            name: 'James Miller',
            roomNumber: 'EW-102',
            riskLevel: 'low',
            currentLocation: 'Activity Room',
            lastSeen: new Date(Date.now() - 8 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'EW103',
            name: 'Patricia Brown',
            roomNumber: 'EW-103',
            riskLevel: 'high',
            currentLocation: 'EW-103',
            lastSeen: new Date(Date.now() - 1 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'EW201',
            name: 'Charles Johnson',
            roomNumber: 'EW-201',
            riskLevel: 'medium',
            currentLocation: 'EW-201',
            lastSeen: new Date(Date.now() - 25 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'EW202',
            name: 'Mary Williams',
            roomNumber: 'EW-202',
            riskLevel: 'low',
            currentLocation: 'EW-202',
            lastSeen: new Date(Date.now() - 35 * 60000).toISOString(),
            status: 'present'
        },
        {
            id: 'EW203',
            name: 'Thomas Taylor',
            roomNumber: 'EW-203',
            riskLevel: 'medium',
            currentLocation: 'EW-203',
            lastSeen: new Date(Date.now() - 12 * 60000).toISOString(),
            status: 'present'
        }
    ];

    // Load mock data
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setFloorPlans(mockFloorPlans);
            setResidents(mockResidents);
            setLoading(false);
        }, 500);
    }, []);

    // Handle room click
    const handleRoomClick = useCallback((roomId: string) => {
        setSelectedRoom(roomId);
        onRoomClick?.(roomId);
    }, [onRoomClick]);

    // Get room color based on occupancy and risk
    const getRoomColor = useCallback((room: any): string => {
        if (room.type === 'staff_area') return '#e0f2fe'; // Light blue
        if (room.type === 'common_area') return '#f3e5f5'; // Light purple
        if (room.type === 'utility') return '#f1f8e9'; // Light green

        // For resident rooms, color by risk level
        const occupants = residents.filter(r => room.occupants.includes(r.id));
        if (occupants.length === 0) return '#f5f5f5'; // Gray for empty

        const hasHighRisk = occupants.some(r => r.riskLevel === 'high');
        const hasMediumRisk = occupants.some(r => r.riskLevel === 'medium');

        if (hasHighRisk) return '#ffebee'; // Light red
        if (hasMediumRisk) return '#fff3e0'; // Light orange
        return '#e8f5e8'; // Light green
    }, [residents]);

    // Get current floor plan
    const currentFloor = floorPlans.find(fp => fp.floor === selectedFloor);

    if (loading) {
        return (
            <div className={`flex items-center justify-center h-64 ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading floor plan...</p>
                </div>
            </div>
        );
    }

    if (!currentFloor) {
        return (
            <div className={`flex items-center justify-center h-64 ${className}`}>
                <p className="text-gray-500">Floor plan not available for Floor {selectedFloor}</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {currentFloor.name} Layout
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                            <span>High Risk</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
                            <span>Medium Risk</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                            <span>Low Risk</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floor Plan */}
            <div className="p-4">
                <div className="relative border border-gray-300 bg-gray-50 rounded overflow-hidden">
                    <svg
                        viewBox={`0 0 ${currentFloor.dimensions.width} ${currentFloor.dimensions.height}`}
                        className="w-full h-auto"
                        style={{ minHeight: '400px' }}
                    >
                        {/* Background Grid */}
                        <defs>
                            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Rooms */}
                        {currentFloor.rooms.map((room) => (
                            <g key={room.id}>
                                {/* Room Rectangle */}
                                <rect
                                    x={room.x}
                                    y={room.y}
                                    width={room.width}
                                    height={room.height}
                                    fill={getRoomColor(room)}
                                    stroke={selectedRoom === room.id ? '#2563eb' : '#6b7280'}
                                    strokeWidth={selectedRoom === room.id ? 3 : 1}
                                    rx="4"
                                    className="cursor-pointer transition-all duration-200 hover:stroke-blue-500 hover:stroke-2"
                                    onClick={() => handleRoomClick(room.id)}
                                />

                                {/* Room Number */}
                                <text
                                    x={room.x + room.width / 2}
                                    y={room.y + room.height / 2 - 5}
                                    textAnchor="middle"
                                    className="text-sm font-bold fill-gray-800 pointer-events-none"
                                >
                                    {room.number}
                                </text>

                                {/* Occupancy Count */}
                                {showResidents && room.occupants.length > 0 && (
                                    <text
                                        x={room.x + room.width / 2}
                                        y={room.y + room.height / 2 + 10}
                                        textAnchor="middle"
                                        className="text-xs fill-gray-600 pointer-events-none"
                                    >
                                        {room.occupants.length} resident{room.occupants.length !== 1 ? 's' : ''}
                                    </text>
                                )}

                                {/* Alert Indicator for High Risk Residents */}
                                {residents.some(r => room.occupants.includes(r.id) && r.riskLevel === 'high') && (
                                    <circle
                                        cx={room.x + room.width - 8}
                                        cy={room.y + 8}
                                        r="5"
                                        fill="#ef4444"
                                        className="animate-pulse"
                                    />
                                )}
                            </g>
                        ))}

                        {/* Corridors and Connections */}
                        <g stroke="#d1d5db" strokeWidth="2" fill="none">
                            {/* Main horizontal corridor */}
                            <line x1="40" y1="190" x2="560" y2="190" />
                            {/* Vertical connections */}
                            <line x1="90" y1="160" x2="90" y2="190" />
                            <line x1="180" y1="160" x2="180" y2="190" />
                            <line x1="270" y1="160" x2="270" y2="190" />
                            <line x1="390" y1="160" x2="390" y2="190" />
                            <line x1="480" y1="160" x2="480" y2="190" />
                            <line x1="570" y1="160" x2="570" y2="190" />
                        </g>
                    </svg>
                </div>
            </div>

            {/* Room Details Panel */}
            {selectedRoom && (
                <div className="border-t border-gray-200 p-4">
                    {(() => {
                        const room = currentFloor.rooms.find(r => r.id === selectedRoom);
                        const roomResidents = residents.filter(r => room?.occupants.includes(r.id));

                        return room ? (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">{room.name}</h4>
                                {roomResidents.length > 0 ? (
                                    <div className="space-y-2">
                                        {roomResidents.map(resident => (
                                            <div key={resident.id} className="flex justify-between items-center text-sm">
                                                <span>{resident.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${resident.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                                                            resident.riskLevel === 'medium' ? 'bg-orange-100 text-orange-800' :
                                                                'bg-green-100 text-green-800'
                                                        }`}>
                                                        {resident.riskLevel} risk
                                                    </span>
                                                    <span className="text-gray-500">
                                                        Last seen: {new Date(resident.lastSeen).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No residents currently assigned</p>
                                )}
                            </div>
                        ) : null;
                    })()}
                </div>
            )}
        </div>
    );
};

export default FloorPlanView;