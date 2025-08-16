// src/operations-center/components/Dashboard/AlertManagement.tsx
import React, { useState } from 'react';
import { SystemAlert, AlertStats } from '../../types/alertTypes';
import { useAlertAggregation } from '../../hooks/useAlertAggregation';

interface AlertManagementProps {
    alerts: SystemAlert[];
    alertStats: AlertStats | null;
    loading: boolean;
}

export const AlertManagement: React.FC<AlertManagementProps> = ({
    alerts,
    alertStats,
    loading
}) => {
    const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'unacknowledged'>('all');
    const [selectedAlert, setSelectedAlert] = useState<SystemAlert | null>(null);
    const { acknowledgeAlert, resolveAlert, escalateAlert } = useAlertAggregation();

    const filteredAlerts = alerts.filter(alert => {
        switch (filter) {
            case 'critical':
                return alert.severity === 'critical' || alert.severity === 'error';
            case 'warning':
                return alert.severity === 'warning';
            case 'unacknowledged':
                return !alert.acknowledged;
            default:
                return true;
        }
    });

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'red';
            case 'error': return 'orange';
            case 'warning': return 'yellow';
            default: return 'blue';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return '🚨';
            case 'error': return '⚠️';
            case 'warning': return '⚡';
            default: return 'ℹ️';
        }
    };

    const handleAcknowledge = async (alertId: string) => {
        await acknowledgeAlert(alertId);
    };

    const handleResolve = async (alertId: string, resolution?: string) => {
        await resolveAlert(alertId, 'current-user', resolution);
    };

    const handleEscalate = async (alertId: string) => {
        await escalateAlert(alertId);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Alert Statistics */}
            {alertStats && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Statistics</h3>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{alertStats.total}</div>
                            <div className="text-sm text-gray-600">Total Alerts</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{alertStats.bySeverity.critical || 0}</div>
                            <div className="text-sm text-red-800">Critical</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{alertStats.bySeverity.warning || 0}</div>
                            <div className="text-sm text-yellow-800">Warnings</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {Math.round((alertStats.resolved / alertStats.total) * 100)}%
                            </div>
                            <div className="text-sm text-green-800">Resolution Rate</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-lg font-semibold text-blue-900">{alertStats.averageResponseTime}min</div>
                            <div className="text-sm text-blue-700">Avg Response Time</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="text-lg font-semibold text-purple-900">{alertStats.averageResolutionTime}min</div>
                            <div className="text-sm text-purple-700">Avg Resolution Time</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>

                        {/* Filter Buttons */}
                        <div className="flex space-x-2">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'critical', label: 'Critical' },
                                { key: 'warning', label: 'Warning' },
                                { key: 'unacknowledged', label: 'Unacknowledged' }
                            ].map((filterOption) => (
                                <button
                                    key={filterOption.key}
                                    onClick={() => setFilter(filterOption.key as any)}
                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === filterOption.key
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filterOption.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredAlerts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <div className="text-4xl mb-4">✅</div>
                            <div className="text-lg font-medium">No alerts match your filter</div>
                            <div className="text-sm">System is running smoothly</div>
                        </div>
                    ) : (
                        filteredAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`p-6 hover:bg-gray-50 transition-colors ${selectedAlert?.id === alert.id ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">
                                                {getSeverityIcon(alert.severity)}
                                            </span>
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900">{alert.title}</h4>
                                                <p className="text-gray-600">{alert.message}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getSeverityColor(alert.severity)}-100 text-${getSeverityColor(alert.severity)}-800`}>
                                                {alert.severity.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                                            <span>Source: {alert.source}</span>
                                            <span>•</span>
                                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                            {alert.acknowledged && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-green-600">✓ Acknowledged</span>
                                                </>
                                            )}
                                            {alert.resolved && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-blue-600">✓ Resolved</span>
                                                </>
                                            )}
                                            {alert.escalated && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-orange-600">↗ Escalated (Level {alert.escalationLevel})</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 ml-4">
                                        {!alert.acknowledged && (
                                            <button
                                                onClick={() => handleAcknowledge(alert.id)}
                                                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                                            >
                                                Acknowledge
                                            </button>
                                        )}
                                        {alert.acknowledged && !alert.resolved && (
                                            <button
                                                onClick={() => handleResolve(alert.id)}
                                                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                        {!alert.escalated && alert.severity === 'critical' && (
                                            <button
                                                onClick={() => handleEscalate(alert.id)}
                                                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                                            >
                                                Escalate
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                        >
                                            {selectedAlert?.id === alert.id ? 'Hide' : 'Details'}
                                        </button>
                                    </div>
                                </div>

                                {/* Alert Details */}
                                {selectedAlert?.id === alert.id && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <h5 className="font-medium text-gray-900 mb-2">Alert Details</h5>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Alert ID:</span>
                                                <span className="ml-2 text-gray-600">{alert.id}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Type:</span>
                                                <span className="ml-2 text-gray-600">{alert.type}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Created:</span>
                                                <span className="ml-2 text-gray-600">{new Date(alert.timestamp).toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Source:</span>
                                                <span className="ml-2 text-gray-600">{alert.source}</span>
                                            </div>
                                            {alert.acknowledgedBy && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Acknowledged by:</span>
                                                    <span className="ml-2 text-gray-600">{alert.acknowledgedBy}</span>
                                                </div>
                                            )}
                                            {alert.resolvedBy && (
                                                <div>
                                                    <span className="font-medium text-gray-700">Resolved by:</span>
                                                    <span className="ml-2 text-gray-600">{alert.resolvedBy}</span>
                                                </div>
                                            )}
                                        </div>

                                        {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                                            <div className="mt-3">
                                                <span className="font-medium text-gray-700">Additional Information:</span>
                                                <pre className="mt-1 text-xs text-gray-600 bg-white p-2 rounded border">
                                                    {JSON.stringify(alert.metadata, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};