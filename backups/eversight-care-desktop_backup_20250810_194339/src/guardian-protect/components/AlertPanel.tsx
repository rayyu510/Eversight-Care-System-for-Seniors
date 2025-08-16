// File: src/guardian-protect/components/AlertPanel.tsx
// Clean version with direct mock data - no service calls

import React, { useState, useEffect, useCallback } from 'react';

interface Alert {
    id: string;
    type: 'fall_detection' | 'wandering' | 'emergency_button' | 'medication' | 'vital_signs' | 'behavioral';
    severity: 'low' | 'medium' | 'high' | 'critical';
    residentId: string;
    residentName: string;
    location: string;
    timestamp: string;
    status: 'active' | 'acknowledged' | 'resolved';
    description: string;
    assignedTo?: string;
    responseTime?: string;
    notes?: string;
}

interface AlertPanelProps {
    showFilters?: boolean;
    maxHeight?: string;
    autoRefresh?: boolean;
    refreshInterval?: number;
    onAlertClick?: (alertId: string) => void;
    className?: string;
}

const AlertPanel: React.FC<AlertPanelProps> = ({
    showFilters = true,
    maxHeight = '32rem',
    autoRefresh = false,
    refreshInterval = 30000,
    onAlertClick,
    className = ''
}) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('active');
    const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

    // Mock alert data
    const mockAlerts: Alert[] = [
        {
            id: 'alert-001',
            type: 'fall_detection',
            severity: 'critical',
            residentId: 'WW202',
            residentName: 'Maria Garcia',
            location: 'WW-202',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            status: 'active',
            description: 'Fall detected in resident room. Immediate assistance required.',
            assignedTo: 'Nurse Jennifer Adams',
            responseTime: '2 minutes'
        },
        {
            id: 'alert-002',
            type: 'wandering',
            severity: 'high',
            residentId: 'WW102',
            residentName: 'Michael Rodriguez',
            location: 'Main Entrance',
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            status: 'acknowledged',
            description: 'Resident attempting to leave facility without supervision.',
            assignedTo: 'Security Officer Marcus Thompson'
        },
        {
            id: 'alert-003',
            type: 'emergency_button',
            severity: 'high',
            residentId: 'EW103',
            residentName: 'Patricia Brown',
            location: 'EW-103',
            timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
            status: 'active',
            description: 'Emergency call button pressed. Resident requesting immediate assistance.',
            assignedTo: 'Caregiver Amanda Foster'
        },
        {
            id: 'alert-004',
            type: 'medication',
            severity: 'medium',
            residentId: 'EW101',
            residentName: 'Lisa Anderson',
            location: 'EW-101',
            timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
            status: 'resolved',
            description: 'Missed medication administration. Evening dose not taken.',
            assignedTo: 'Nurse Jennifer Adams',
            responseTime: '15 minutes',
            notes: 'Medication administered. Resident was sleeping and missed initial call.'
        },
        {
            id: 'alert-005',
            type: 'behavioral',
            severity: 'medium',
            residentId: 'WW201',
            residentName: 'Robert Chen',
            location: 'Recreation Room',
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
            status: 'resolved',
            description: 'Agitated behavior observed. Resident refusing to participate in activities.',
            assignedTo: 'Activities Coordinator Rachel Green',
            responseTime: '30 minutes',
            notes: 'Calmed down after one-on-one conversation. Provided alternative quiet activity.'
        },
        {
            id: 'alert-006',
            type: 'vital_signs',
            severity: 'low',
            residentId: 'EW202',
            residentName: 'Mary Williams',
            location: 'EW-202',
            timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
            status: 'resolved',
            description: 'Blood pressure reading outside normal range during routine check.',
            assignedTo: 'Dr. Patricia Wells',
            responseTime: '45 minutes',
            notes: 'Follow-up reading normal. Likely due to recent physical activity.'
        }
    ];

    // Load mock data
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAlerts(mockAlerts);
            setLoading(false);
        }, 800);
    }, []);

    // Auto-refresh
    useEffect(() => {
        if (autoRefresh && refreshInterval > 0) {
            const interval = setInterval(() => {
                // Simulate real-time updates
                setAlerts(prev => prev.map(alert => ({
                    ...alert,
                    timestamp: alert.status === 'active' ? new Date().toISOString() : alert.timestamp
                })));
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval]);

    // Filter alerts
    const filteredAlerts = alerts.filter(alert => {
        switch (filter) {
            case 'active':
                return alert.status === 'active' || alert.status === 'acknowledged';
            case 'critical':
                return alert.severity === 'critical';
            case 'all':
            default:
                return true;
        }
    });

    console.log(`Alerts loaded: ${filteredAlerts.length} alerts for filter: ${filter}`);

    // Handle alert click
    const handleAlertClick = useCallback((alertId: string) => {
        setSelectedAlert(alertId);
        onAlertClick?.(alertId);
    }, [onAlertClick]);

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
            case 'active': return 'bg-red-500';
            case 'acknowledged': return 'bg-yellow-500';
            case 'resolved': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    }, []);

    // Get alert type icon
    const getAlertIcon = useCallback((type: string): string => {
        switch (type) {
            case 'fall_detection': return '🚨';
            case 'wandering': return '🚶';
            case 'emergency_button': return '🆘';
            case 'medication': return '💊';
            case 'vital_signs': return '❤️';
            case 'behavioral': return '😟';
            default: return '⚠️';
        }
    }, []);

    if (loading) {
        return (
            <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
                <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading alerts...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Alert Management</h3>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${filteredAlerts.some(a => a.status === 'active') ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="text-sm text-gray-600">
                            {filteredAlerts.filter(a => a.status === 'active').length} Active
                        </span>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-3 py-1 rounded-full text-sm ${filter === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Active ({alerts.filter(a => a.status === 'active' || a.status === 'acknowledged').length})
                        </button>
                        <button
                            onClick={() => setFilter('critical')}
                            className={`px-3 py-1 rounded-full text-sm ${filter === 'critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Critical ({alerts.filter(a => a.severity === 'critical').length})
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            All ({alerts.length})
                        </button>
                    </div>
                )}
            </div>

            {/* Alert List */}
            <div className="overflow-y-auto" style={{ maxHeight }}>
                {filteredAlerts.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-gray-500">No alerts matching current filter</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                onClick={() => handleAlertClick(alert.id)}
                                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedAlert === alert.id ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Alert Icon */}
                                    <div className="text-xl">{getAlertIcon(alert.type)}</div>

                                    {/* Alert Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                                                {alert.severity.toUpperCase()}
                                            </span>
                                            <div className={`w-2 h-2 rounded-full ${getStatusColor(alert.status)}`}></div>
                                            <span className="text-xs text-gray-500 capitalize">{alert.status}</span>
                                        </div>

                                        <h4 className="font-medium text-gray-900 mb-1">{alert.residentName}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{alert.description}</p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>📍 {alert.location}</span>
                                            <span>🕒 {new Date(alert.timestamp).toLocaleTimeString()}</span>
                                            {alert.assignedTo && <span>👤 {alert.assignedTo}</span>}
                                            {alert.responseTime && <span>⏱️ {alert.responseTime}</span>}
                                        </div>

                                        {alert.notes && (
                                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                                <strong>Notes:</strong> {alert.notes}
                                            </div>
                                        )}
                                    </div>

                                    {/* Time Ago */}
                                    <div className="text-xs text-gray-400">
                                        {Math.round((Date.now() - new Date(alert.timestamp).getTime()) / 60000)}m ago
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                        {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} shown
                    </span>
                    <div className="flex gap-4">
                        <span className="text-red-600">
                            {filteredAlerts.filter(a => a.severity === 'critical').length} Critical
                        </span>
                        <span className="text-orange-600">
                            {filteredAlerts.filter(a => a.severity === 'high').length} High
                        </span>
                        <span className="text-yellow-600">
                            {filteredAlerts.filter(a => a.severity === 'medium').length} Medium
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertPanel;