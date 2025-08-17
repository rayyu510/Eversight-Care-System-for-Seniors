// src/pages/surveillance/SurveillanceCenterPage.tsx
import React, { useState } from 'react';

const SurveillanceCenterPage = () => {
    const [selectedRoom, setSelectedRoom] = useState('lobby');
    const [showResidentialMonitor, setShowResidentialMonitor] = useState(false);

    const facilities = [
        { id: 'lobby', name: 'Main Lobby', cameras: 4, residents: 8, status: 'active' },
        { id: 'dining', name: 'Dining Room', cameras: 3, residents: 24, status: 'active' },
        { id: 'garden', name: 'Garden Area', cameras: 2, residents: 6, status: 'maintenance' },
        { id: 'hallway-a', name: 'Hallway A', cameras: 2, residents: 3, status: 'active' },
        { id: 'hallway-b', name: 'Hallway B', cameras: 2, residents: 2, status: 'active' },
        { id: 'recreation', name: 'Recreation Room', cameras: 2, residents: 12, status: 'active' },
        { id: 'nursing', name: 'Nursing Station', cameras: 3, residents: 0, status: 'active' },
        { id: 'therapy', name: 'Therapy Room', cameras: 1, residents: 4, status: 'active' },
        { id: 'kitchen', name: 'Kitchen', cameras: 2, residents: 0, status: 'active' },
        { id: 'emergency', name: 'Emergency Exits', cameras: 3, residents: 0, status: 'active' }
    ];

    const residentialRooms = [
        { roomNumber: '101', resident: 'Mary Johnson', status: 'present', lastActivity: '2 min ago', emergencyButton: 'functional', door: 'closed' },
        { roomNumber: '102', resident: 'Robert Smith', status: 'absent', lastActivity: '15 min ago', emergencyButton: 'functional', door: 'open' },
        { roomNumber: '103', resident: 'Helen Davis', status: 'present', lastActivity: 'Live', emergencyButton: 'functional', door: 'closed' },
        { roomNumber: '104', resident: 'James Wilson', status: 'present', lastActivity: '1 min ago', emergencyButton: 'functional', door: 'closed' },
        { roomNumber: '105', resident: 'Patricia Brown', status: 'absent', lastActivity: '45 min ago', emergencyButton: 'functional', door: 'closed' },
        { roomNumber: '106', resident: 'Michael Jones', status: 'present', lastActivity: 'Live', emergencyButton: 'functional', door: 'closed' },
        { roomNumber: '201', resident: 'Linda Garcia', status: 'present', lastActivity: '5 min ago', emergencyButton: 'functional', door: 'closed' },
        { roomNumber: '202', resident: 'David Miller', status: 'absent', lastActivity: '30 min ago', emergencyButton: 'functional', door: 'open' },
        { roomNumber: '203', resident: 'Barbara Wilson', status: 'present', lastActivity: 'Live', emergencyButton: 'functional', door: 'closed' },
        { roomNumber: '204', resident: 'Richard Moore', status: 'emergency', lastActivity: 'Alert Active', emergencyButton: 'activated', door: 'open' },
        { roomNumber: '205', resident: 'Susan Taylor', status: 'present', lastActivity: '3 min ago', emergencyButton: 'functional', door: 'closed' },
        { roomNumber: '206', resident: 'Thomas Anderson', status: 'present', lastActivity: '1 min ago', emergencyButton: 'functional', door: 'closed' }
    ];

    const residents = [
        { id: 1, name: 'Mary Johnson', room: 'lobby', status: 'normal', location: 'Reading Area' },
        { id: 2, name: 'Robert Smith', room: 'dining', status: 'normal', location: 'Table 3' },
        { id: 3, name: 'Helen Davis', room: 'garden', status: 'assisted', location: 'Wheelchair Area' },
        { id: 4, name: 'James Wilson', room: 'recreation', status: 'normal', location: 'TV Lounge' },
        { id: 5, name: 'Patricia Brown', room: 'therapy', status: 'therapy', location: 'Physical Therapy' },
        { id: 6, name: 'Michael Jones', room: 'dining', status: 'normal', location: 'Table 7' },
        { id: 7, name: 'Linda Garcia', room: 'lobby', status: 'waiting', location: 'Front Desk' },
        { id: 8, name: 'David Miller', room: 'hallway-a', status: 'walking', location: 'Corridor' }
    ];

    const cameras = [
        { id: 'CAM-001', location: 'Main Lobby - Entrance', status: 'online', quality: '4K', lastSeen: 'Live' },
        { id: 'CAM-002', location: 'Main Lobby - Reception', status: 'online', quality: '4K', lastSeen: 'Live' },
        { id: 'CAM-003', location: 'Dining Room - North', status: 'online', quality: '1080p', lastSeen: 'Live' },
        { id: 'CAM-004', location: 'Dining Room - South', status: 'online', quality: '1080p', lastSeen: 'Live' },
        { id: 'CAM-005', location: 'Garden Area - Main', status: 'offline', quality: '1080p', lastSeen: '15 min ago' },
        { id: 'CAM-006', location: 'Garden Area - Patio', status: 'maintenance', quality: '1080p', lastSeen: '2 hrs ago' },
        { id: 'CAM-007', location: 'Hallway A - East', status: 'online', quality: '1080p', lastSeen: 'Live' },
        { id: 'CAM-008', location: 'Hallway A - West', status: 'online', quality: '1080p', lastSeen: 'Live' }
    ];

    const securityEvents = [
        { time: '14:45', event: 'Motion detected in restricted area', location: 'Kitchen Storage', priority: 'medium' },
        { time: '14:32', event: 'Person fall detection alert', location: 'Room 204', priority: 'high' },
        { time: '14:28', event: 'Unauthorized access attempt', location: 'Medication Room', priority: 'high' },
        { time: '14:15', event: 'Visitor check-in', location: 'Main Lobby', priority: 'low' },
        { time: '14:08', event: 'Camera offline detected', location: 'Garden Area', priority: 'medium' }
    ];

    const getRoomInfo = (roomId) => {
        const room = facilities.find(f => f.id === roomId);
        const roomResidents = residents.filter(r => r.room === roomId);
        const roomCameras = cameras.filter(c => c.location.toLowerCase().includes(room?.name.toLowerCase() || ''));

        return { room, residents: roomResidents, cameras: roomCameras };
    };

    const selectedRoomInfo = getRoomInfo(selectedRoom);

    return (
        <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Header with Access Control */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                        Surveillance Center
                    </h1>
                    <p style={{ color: '#6b7280', margin: '0', fontSize: '16px' }}>
                        AI-Powered Video Analytics & Facility Monitoring - Real-time Location Tracking
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setShowResidentialMonitor(false)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: !showResidentialMonitor ? '#3b82f6' : 'white',
                            color: !showResidentialMonitor ? 'white' : '#374151',
                            border: '1px solid #3b82f6',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Public Areas
                    </button>
                    <button
                        onClick={() => setShowResidentialMonitor(true)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: showResidentialMonitor ? '#dc2626' : 'white',
                            color: showResidentialMonitor ? 'white' : '#374151',
                            border: '1px solid #dc2626',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            position: 'relative'
                        }}
                    >
                        🔒 Residential Rooms
                        {showResidentialMonitor && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: '#fbbf24',
                                color: '#92400e',
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 'bold'
                            }}>
                                AUTH
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {!showResidentialMonitor ? (
                <>
                    {/* Public Areas Monitoring */}

                    {/* Facility Layout Grid */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                            Facility Layout & Room Status
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '12px'
                        }}>
                            {facilities.map(facility => (
                                <button
                                    key={facility.id}
                                    onClick={() => setSelectedRoom(facility.id)}
                                    style={{
                                        backgroundColor: selectedRoom === facility.id ? '#3b82f6' : 'white',
                                        color: selectedRoom === facility.id ? 'white' : '#111827',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: `2px solid ${selectedRoom === facility.id ? '#3b82f6' : '#e5e7eb'}`,
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Status Indicator */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: facility.status === 'active' ? '#10b981' :
                                            facility.status === 'maintenance' ? '#f59e0b' : '#dc2626'
                                    }}></div>

                                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                        {facility.name}
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
                                        📹 {facility.cameras} cameras
                                    </div>
                                    <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                        👥 {facility.residents} people
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Room Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        {/* Room Information */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '24px',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                                {selectedRoomInfo.room?.name} - Live Status
                            </h3>

                            {/* Camera Status */}
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                                    Camera Systems ({selectedRoomInfo.cameras.length})
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {selectedRoomInfo.cameras.map(camera => (
                                        <div key={camera.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 12px',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '6px',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: '500', color: '#111827' }}>
                                                    {camera.id}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                                    {camera.quality}
                                                </div>
                                            </div>
                                            <div style={{
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                fontWeight: '500',
                                                backgroundColor: camera.status === 'online' ? '#d1fae5' :
                                                    camera.status === 'maintenance' ? '#fef3cd' : '#fecaca',
                                                color: camera.status === 'online' ? '#065f46' :
                                                    camera.status === 'maintenance' ? '#92400e' : '#991b1b'
                                            }}>
                                                {camera.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Room Metrics */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
                                        {selectedRoomInfo.cameras.filter(c => c.status === 'online').length}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Online Cameras</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d' }}>
                                        {selectedRoomInfo.residents.length}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>People Present</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fefbf2', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c2410c' }}>
                                        94%
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>AI Accuracy</div>
                                </div>
                            </div>
                        </div>

                        {/* People in Selected Room */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '24px',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                                People in {selectedRoomInfo.room?.name} ({selectedRoomInfo.residents.length})
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {selectedRoomInfo.residents.length > 0 ? selectedRoomInfo.residents.map(resident => (
                                    <div key={resident.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                                                {resident.name}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                📍 {resident.location}
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: resident.status === 'normal' ? '#d1fae5' :
                                                resident.status === 'assisted' ? '#fef3cd' :
                                                    resident.status === 'therapy' ? '#dbeafe' : '#fecaca',
                                            color: resident.status === 'normal' ? '#065f46' :
                                                resident.status === 'assisted' ? '#92400e' :
                                                    resident.status === 'therapy' ? '#1e40af' : '#991b1b'
                                        }}>
                                            {resident.status}
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '24px',
                                        color: '#6b7280',
                                        fontSize: '14px'
                                    }}>
                                        No people currently detected in this area
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security Events */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                            Recent Security Events
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {securityEvents.map((event, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    backgroundColor: event.priority === 'high' ? '#fef2f2' :
                                        event.priority === 'medium' ? '#fefbf2' : '#f0f9ff',
                                    border: `1px solid ${event.priority === 'high' ? '#fca5a5' :
                                        event.priority === 'medium' ? '#fbbf24' : '#93c5fd'}`
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: event.priority === 'high' ? '#dc2626' :
                                            event.priority === 'medium' ? '#f59e0b' : '#3b82f6'
                                    }} />
                                    <div style={{ marginLeft: '12px', flexGrow: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                                            {event.event}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                            {event.time} - {event.location}
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '500',
                                        backgroundColor: event.priority === 'high' ? '#dc2626' :
                                            event.priority === 'medium' ? '#f59e0b' : '#3b82f6',
                                        color: 'white'
                                    }}>
                                        {event.priority.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                /* Residential Rooms Monitor - Demo Access Enabled */
                <div>
                    {/* Security Notice */}
                    <div style={{
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fca5a5',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '16px' }}>🔒</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b' }}>
                                RESTRICTED ACCESS - HEALTHCARE PROFESSIONALS ONLY
                            </span>
                            <span style={{
                                backgroundColor: '#fbbf24',
                                color: '#92400e',
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 'bold'
                            }}>
                                DEMO MODE
                            </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#7f1d1d', margin: '0' }}>
                            This interface is intended for authorized healthcare staff only. Patient privacy and HIPAA compliance protocols apply.
                        </p>
                    </div>

                    {/* Residential Overview Dashboard */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>7</div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Present ✅</div>
                        </div>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>4</div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Away ⚠️</div>
                        </div>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>1</div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Emergency 🚨</div>
                        </div>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>12</div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Emergency Buttons OK</div>
                        </div>
                    </div>

                    {/* Individual Room Monitoring */}
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                            Individual Room Status (12 Rooms)
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '16px'
                        }}>
                            {residentialRooms.map(room => (
                                <div key={room.roomNumber} style={{
                                    backgroundColor: 'white',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                    border: `2px solid ${room.status === 'present' ? '#10b981' :
                                        room.status === 'absent' ? '#f59e0b' : '#dc2626'}`,
                                    position: 'relative'
                                }}>
                                    {/* Status Indicator */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        backgroundColor: room.status === 'present' ? '#10b981' :
                                            room.status === 'absent' ? '#f59e0b' : '#dc2626'
                                    }}></div>

                                    {/* Room Number */}
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                                        Room {room.roomNumber}
                                    </div>

                                    {/* Resident Name */}
                                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                                        {room.resident}
                                    </div>

                                    {/* Status Information */}
                                    <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                                        <>
                                            <div style={{ marginBottom: '4px' }}>
                                                <span style={{ color: '#6b7280' }}>Door: </span>
                                                <span style={{ color: '#374151' }}>
                                                    {room.door === 'closed' ? 'Closed 🚪' : 'Open 🚪'}
                                                </span>
                                            </div>
                                            <div style={{ marginBottom: '4px' }}>
                                                <span style={{ color: '#6b7280' }}>Status: </span>
                                                <span style={{
                                                    color: room.status === 'present' ? '#10b981' :
                                                        room.status === 'absent' ? '#f59e0b' : '#dc2626',
                                                    fontWeight: '500'
                                                }}>
                                                    {room.status === 'present' ? 'Present ✅' :
                                                        room.status === 'absent' ? 'Away ⚠️' : 'Emergency 🚨'}
                                                </span>
                                            </div>
                                            <div style={{ marginBottom: '4px' }}>
                                                <span style={{ color: '#6b7280' }}>Activity: </span>
                                                <span style={{ color: '#374151' }}>{room.lastActivity}</span>
                                            </div>
                                            <div style={{ marginBottom: '4px' }}>
                                                <span style={{ color: '#6b7280' }}>Emergency: </span>
                                                <span style={{
                                                    color: room.emergencyButton === 'functional' ? '#10b981' : '#dc2626',
                                                    fontWeight: '500'
                                                }}>
                                                    {room.emergencyButton === 'functional' ? 'Functional ✅' : 'Activated 🚨'}
                                                </span>
                                            </div>
                                        </>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Privacy Notice */}
                    <div style={{
                        marginTop: '32px',
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                    }}>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0', textAlign: 'center' }}>
                            🔒 This system complies with HIPAA privacy regulations. All access is logged and monitored.
                            For authorized healthcare professionals only. Demo version - Production system requires multi-factor authentication.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SurveillanceCenterPage



