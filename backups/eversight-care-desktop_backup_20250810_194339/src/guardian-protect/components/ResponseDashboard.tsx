// File: src/guardian-protect/components/ResponseDashboard.tsx
// Clean version with direct mock data - no service calls

import React, { useState, useEffect, useCallback } from 'react';

interface EmergencyResponse {
    id: string;
    alertId: string;
    type: 'fall' | 'medical' | 'wandering' | 'behavioral' | 'fire' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    residentId: string;
    residentName: string;
    location: string;
    timestamp: string;
    status: 'initiated' | 'dispatched' | 'on_scene' | 'resolved';
    assignedStaff: string[];
    responseTime?: string;
    resolutionTime?: string;
    notes?: string;
    actions: Array<{
        timestamp: string;
        action: string;
        performedBy: string;
        notes?: string;
    }>;
}

interface StaffMember {
    id: string;
    name: string;
    role: 'doctor' | 'nurse' | 'caregiver' | 'security' | 'activities';
    status: 'available' | 'busy' | 'off_duty';
    currentLocation?: string;
    certifications: string[];
}

interface ResponseDashboardProps {
    maxHeight?: string;
    autoRefresh?: boolean;
    refreshInterval?: number;
    onResponseClick?: (responseId: string) => void;
    className?: string;
}

const ResponseDashboard: React.FC<ResponseDashboardProps> = ({
    maxHeight = '32rem',
    autoRefresh = false,
    refreshInterval = 30000,
    onResponseClick,
    className = ''
}) => {
    const [responses, setResponses] = useState<EmergencyResponse[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedResponse, setSelectedResponse] = useState<string | null>(null);

    // Mock emergency response data
    const mockResponses: EmergencyResponse[] = [
        {
            id: 'resp-001',
            alertId: 'alert-001',
            type: 'fall',
            severity: 'critical',
            residentId: 'WW202',
            residentName: 'Maria Garcia',
            location: 'WW-202',
            timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
            status: 'on_scene',
            assignedStaff: ['staff-002', 'staff-004'],
            responseTime: '3 minutes',
            actions: [
                {
                    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
                    action: 'Response initiated',
                    performedBy: 'System Alert'
                },
                {
                    timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
                    action: 'Staff dispatched',
                    performedBy: 'Nurse Jennifer Adams'
                },
                {
                    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
                    action: 'Arrived on scene',
                    performedBy: 'Caregiver Amanda Foster',
                    notes: 'Resident conscious and responsive'
                }
            ]
        },
        {
            id: 'resp-002',
            alertId: 'alert-002',
            type: 'wandering',
            severity: 'high',
            residentId: 'WW102',
            residentName: 'Michael Rodriguez',
            location: 'Main Entrance',
            timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
            status: 'dispatched',
            assignedStaff: ['staff-003'],
            responseTime: '2 minutes',
            actions: [
                {
                    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
                    action: 'Response initiated',
                    performedBy: 'Security Alert'
                },
                {
                    timestamp: new Date(Date.now() - 16 * 60000).toISOString(),
                    action: 'Security dispatched',
                    performedBy: 'Marcus Thompson'
                }
            ]
        },
        {
            id: 'resp-003',
            alertId: 'alert-003',
            type: 'medical',
            severity: 'medium',
            residentId: 'EW101',
            residentName: 'Lisa Anderson',
            location: 'EW-101',
            timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
            status: 'initiated',
            assignedStaff: ['staff-001'],
            actions: [
                {
                    timestamp: new Date(Date.now() - 33 * 60000).toISOString(),
                    action: 'Medical response initiated',
                    performedBy: 'Dr. Patricia Wells'
                }
            ]
        },
        {
            id: 'resp-004',
            alertId: 'alert-004',
            type: 'fire',
            severity: 'low',
            residentId: '',
            residentName: 'Fire Drill - Floor 2',
            location: 'Floor 2',
            timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
            status: 'resolved',
            assignedStaff: ['staff-002', 'staff-003', 'staff-005'],
            responseTime: '5 minutes',
            resolutionTime: '45 minutes',
            notes: 'Scheduled fire drill completed successfully. All residents evacuated safely.',
            actions: [
                {
                    timestamp: new Date(Date.now() - 88 * 60000).toISOString(),
                    action: 'Fire drill initiated',
                    performedBy: 'System'
                },
                {
                    timestamp: new Date(Date.now() - 85 * 60000).toISOString(),
                    action: 'All staff notified',
                    performedBy: 'Emergency System'
                },
                {
                    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
                    action: 'Drill completed',
                    performedBy: 'Jennifer Adams',
                    notes: 'All residents accounted for'
                }
            ]
        },
        {
            id: 'resp-005',
            alertId: 'alert-005',
            type: 'behavioral',
            severity: 'medium',
            residentId: 'WW201',
            residentName: 'Robert Chen',
            location: 'Recreation Room',
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
            status: 'on_scene',
            assignedStaff: ['staff-006'],
            responseTime: '8 minutes',
            actions: [
                {
                    timestamp: new Date(Date.now() - 58 * 60000).toISOString(),
                    action: 'Behavioral response initiated',
                    performedBy: 'Activities Staff'
                },
                {
                    timestamp: new Date(Date.now() - 52 * 60000).toISOString(),
                    action: 'Specialist arrived',
                    performedBy: 'Rachel Green',
                    notes: 'Providing calming intervention'
                }
            ]
        }
    ];

    // Mock staff data
    const mockStaff: StaffMember[] = [
        {
            id: 'staff-001',
            name: 'Dr. Patricia Wells',
            role: 'doctor',
            status: 'available',
            currentLocation: 'Medical Office',
            certifications: ['MD', 'Emergency Medicine', 'Geriatrics']
        },
        {
            id: 'staff-002',
            name: 'Jennifer Adams',
            role: 'nurse',
            status: 'busy',
            currentLocation: 'WW-202',
            certifications: ['RN', 'CPR', 'First Aid']
        },
        {
            id: 'staff-003',
            name: 'Marcus Thompson',
            role: 'security',
            status: 'busy',
            currentLocation: 'Main Entrance',
            certifications: ['Security License', 'CPR', 'Crisis Intervention']
        },
        {
            id: 'staff-004',
            name: 'Amanda Foster',
            role: 'caregiver',
            status: 'available',
            currentLocation: 'Nurses Station',
            certifications: ['CNA', 'CPR', 'Dementia Care']
        },
        {
            id: 'staff-005',
            name: 'David Kumar',
            role: 'caregiver',
            status: 'available',
            currentLocation: 'East Wing',
            certifications: ['CNA', 'First Aid']
        },
        {
            id: 'staff-006',
            name: 'Rachel Green',
            role: 'activities',
            status: 'busy',
            currentLocation: 'Recreation Room',
            certifications: ['Activities Director', 'Behavioral Management']
        }
    ];

    // Load mock data
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setResponses(mockResponses);
            setStaff(mockStaff);
            setLoading(false);
        }, 700);
    }, []);

    // Handle response actions
    const updateResponseStatus = useCallback((responseId: string, newStatus: EmergencyResponse['status']) => {
        setResponses(prev => prev.map(response => {
            if (response.id === responseId) {
                const newAction = {
                    timestamp: new Date().toISOString(),
                    action: `Status changed to ${newStatus.replace('_', ' ')}`,
                    performedBy: 'Current User'
                };
                return {
                    ...response,
                    status: newStatus,
                    actions: [...response.actions, newAction]
                };
            }
            return response;
        }));
    }, []);

    // Assign staff to response
    const assignStaff = useCallback((responseId: string, staffId: string) => {
        setResponses(prev => prev.map(response => {
            if (response.id === responseId) {
                const staffMember = staff.find(s => s.id === staffId);
                const newAction = {
                    timestamp: new Date().toISOString(),
                    action: `${staffMember?.name} assigned to response`,
                    performedBy: 'Current User'
                };
                return {
                    ...response,
                    assignedStaff: [...response.assignedStaff, staffId],
                    actions: [...response.actions, newAction]
                };
            }
            return response;
        }));
    }, [staff]);

    // Get severity color
    const getSeverityColor = useCallback((severity: string): string => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }, []);

    // Get status color
    const getStatusColor = useCallback((status: string): string => {
        switch (status) {
            case 'initiated': return 'bg-yellow-500';
            case 'dispatched': return 'bg-blue-500';
            case 'on_scene': return 'bg-orange-500';
            case 'resolved': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    }, []);

    // Get response type icon
    const getResponseIcon = useCallback((type: string): string => {
        switch (type) {
            case 'fall': return '🚨';
            case 'medical': return '🏥';
            case 'wandering': return '🚶';
            case 'behavioral': return '😟';
            case 'fire': return '🔥';
            case 'other': return '⚠️';
            default: return '📋';
        }
    }, []);

    if (loading) {
        return (
            <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
                <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading emergency responses...</p>
                    </div>
                </div>
            </div>
        );
    }

    const activeResponses = responses.filter(r => r.status !== 'resolved');

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Emergency Response</h3>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${activeResponses.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="text-sm text-gray-600">
                            {activeResponses.length} Active Response{activeResponses.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Response List */}
            <div className="divide-y divide-gray-200" style={{ maxHeight, overflowY: 'auto' }}>
                {responses.map((response) => (
                    <div
                        key={response.id}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedResponse === response.id ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                            setSelectedResponse(response.id);
                            onResponseClick?.(response.id);
                        }}
                    >
                        <div className="flex items-start gap-3">
                            {/* Response Icon */}
                            <div className="text-xl">{getResponseIcon(response.type)}</div>

                            {/* Response Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(response.severity)}`}>
                                        {response.severity.toUpperCase()}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(response.status)}`}></div>
                                    <span className="text-xs text-gray-500 capitalize">{response.status.replace('_', ' ')}</span>
                                </div>

                                <h4 className="font-medium text-gray-900 mb-1">{response.residentName}</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    {response.type.charAt(0).toUpperCase() + response.type.slice(1)} response at {response.location}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                    <span>🕒 {new Date(response.timestamp).toLocaleTimeString()}</span>
                                    {response.responseTime && <span>⏱️ {response.responseTime} response</span>}
                                    <span>👥 {response.assignedStaff.length} staff assigned</span>
                                </div>

                                {/* Action Buttons */}
                                {response.status !== 'resolved' && (
                                    <div className="flex gap-2 mt-2">
                                        {response.status === 'initiated' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateResponseStatus(response.id, 'dispatched');
                                                }}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                                            >
                                                Dispatch
                                            </button>
                                        )}
                                        {response.status === 'dispatched' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateResponseStatus(response.id, 'on_scene');
                                                }}
                                                className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200"
                                            >
                                                Arrived
                                            </button>
                                        )}
                                        {response.status === 'on_scene' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateResponseStatus(response.id, 'resolved');
                                                }}
                                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Assigned Staff */}
                                {response.assignedStaff.length > 0 && (
                                    <div className="mt-2">
                                        <div className="text-xs text-gray-600 mb-1">Assigned Staff:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {response.assignedStaff.map(staffId => {
                                                const staffMember = staff.find(s => s.id === staffId);
                                                return staffMember ? (
                                                    <span
                                                        key={staffId}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                                    >
                                                        {staffMember.name} ({staffMember.role})
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                {response.notes && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                        <strong>Notes:</strong> {response.notes}
                                    </div>
                                )}
                            </div>

                            {/* Time Ago */}
                            <div className="text-xs text-gray-400">
                                {Math.round((Date.now() - new Date(response.timestamp).getTime()) / 60000)}m ago
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Available Staff Panel */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Staff</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {staff.filter(s => s.status === 'available').map(staffMember => (
                        <div
                            key={staffMember.id}
                            className="bg-white p-2 rounded border text-xs"
                        >
                            <div className="font-medium">{staffMember.name}</div>
                            <div className="text-gray-500 capitalize">{staffMember.role}</div>
                            <div className="text-gray-400">{staffMember.currentLocation}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResponseDashboard;