import React, { useState } from 'react';

const EnhancedAlertSystem = ({ alerts, onAcknowledge, onResolve, onDismiss }) => {
    const [activeTab, setActiveTab] = useState('active');
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [filterSeverity, setFilterSeverity] = useState('all');

    const filteredAlerts = alerts?.filter(alert => {
        const matchesTab = activeTab === 'all' || alert.status === activeTab;
        const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
        return matchesTab && matchesSeverity;
    }) || [];

    const alertCounts = {
        active: alerts?.filter(a => a.status === 'active').length || 0,
        acknowledged: alerts?.filter(a => a.status === 'acknowledged').length || 0,
        resolved: alerts?.filter(a => a.status === 'resolved').length || 0,
        total: alerts?.length || 0
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'critical': return '🚨';
            case 'high': return '⚠️';
            case 'medium': return '⚡';
            case 'low': return 'ℹ️';
            default: return '📢';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-300';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getTimeAgo = (date) => {
        if (!date) return 'Unknown time';
        try {
            const alertDate = new Date(date);
            const now = new Date();
            const diffMs = now.getTime() - alertDate.getTime();
            const diffMins = Math.floor(diffMs / (1000 * 60));

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours}h ago`;
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}d ago`;
        } catch {
            return 'Just now';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Alert Management Center</h2>
                        <p className="text-sm text-gray-600">Monitor and respond to safety alerts</p>
                    </div>
                    <div className="flex space-x-2">
                        <select
                            value={filterSeverity}
                            onChange={(e) => setFilterSeverity(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="all">All Severities</option>
                            <option value="critical">Critical Only</option>
                            <option value="high">High Only</option>
                            <option value="medium">Medium Only</option>
                            <option value="low">Low Only</option>
                        </select>
                    </div>
                </div>

                {/* Alert Statistics */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="text-lg font-bold text-red-600">{alertCounts.active}</div>
                        <div className="text-sm text-red-800">Active Alerts</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="text-lg font-bold text-yellow-600">{alertCounts.acknowledged}</div>
                        <div className="text-sm text-yellow-800">Acknowledged</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-lg font-bold text-green-600">{alertCounts.resolved}</div>
                        <div className="text-sm text-green-800">Resolved</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-lg font-bold text-blue-600">{alertCounts.total}</div>
                        <div className="text-sm text-blue-800">Total Today</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
                <nav className="flex space-x-8 px-6">
                    {[
                        { key: 'active', label: 'Active', count: alertCounts.active },
                        { key: 'acknowledged', label: 'Acknowledged', count: alertCounts.acknowledged },
                        { key: 'resolved', label: 'Resolved', count: alertCounts.resolved },
                        { key: 'all', label: 'All Alerts', count: alertCounts.total }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </nav>
            </div>

            {/* Alerts List */}
            <div className="p-6">
                {filteredAlerts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">🔕</div>
                        <div className="font-medium">No alerts found</div>
                        <div className="text-sm">All clear in this category</div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredAlerts.map(alert => (
                            <div
                                key={alert.id}
                                className={`border rounded-lg p-4 transition-all hover:shadow-md ${getSeverityColor(alert.severity)}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <div className="text-2xl">{getSeverityIcon(alert.severity)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold text-sm">{alert.title}</h3>
                                                <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-70">
                                                    {alert.severity.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-600">
                                                <span>📍 Device: {alert.deviceId}</span>
                                                <span>🕒 {getTimeAgo(alert.triggeredAt)}</span>
                                                <span>👤 Status: {alert.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col space-y-2">
                                        {alert.status === 'active' && (
                                            <>
                                                <button
                                                    onClick={() => onAcknowledge?.(alert.id)}
                                                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Acknowledge
                                                </button>
                                                <button
                                                    onClick={() => onResolve?.(alert.id)}
                                                    className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Resolve
                                                </button>
                                            </>
                                        )}
                                        {alert.status === 'acknowledged' && (
                                            <button
                                                onClick={() => onResolve?.(alert.id)}
                                                className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedAlert(alert)}
                                            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>

                                {/* Additional Alert Information */}
                                {alert.severity === 'critical' && (
                                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-red-800">🚨 CRITICAL ALERT</span>
                                            <span className="text-red-600">Immediate attention required</span>
                                        </div>
                                    </div>
                                )}

                                {/* Emergency Contact Information for High/Critical */}
                                {(alert.severity === 'critical' || alert.severity === 'high') && (
                                    <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                                        <div className="font-medium text-orange-800 mb-1">Emergency Contacts Notified:</div>
                                        <div className="text-orange-700">
                                            📞 Primary Contact: (555) 123-4567 | 📧 Backup: caregiver@email.com
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Alert Detail Modal */}
                {selectedAlert && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold">Alert Details</h3>
                                <button
                                    onClick={() => setSelectedAlert(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className={`p-3 rounded-lg ${getSeverityColor(selectedAlert.severity)}`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-2xl">{getSeverityIcon(selectedAlert.severity)}</span>
                                        <span className="font-semibold">{selectedAlert.title}</span>
                                    </div>
                                    <p className="text-sm">{selectedAlert.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Alert ID:</span>
                                        <div className="text-gray-600">{selectedAlert.id}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Severity:</span>
                                        <div className="text-gray-600">{selectedAlert.severity}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Device:</span>
                                        <div className="text-gray-600">{selectedAlert.deviceId}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Status:</span>
                                        <div className="text-gray-600">{selectedAlert.status}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Triggered:</span>
                                        <div className="text-gray-600">{getTimeAgo(selectedAlert.triggeredAt)}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Location:</span>
                                        <div className="text-gray-600">Living Room</div>
                                    </div>
                                </div>

                                {/* Alert Timeline */}
                                <div>
                                    <span className="font-medium text-sm">Alert Timeline:</span>
                                    <div className="mt-2 space-y-2">
                                        <div className="flex items-center space-x-2 text-xs">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span className="text-gray-600">{getTimeAgo(selectedAlert.triggeredAt)} - Alert triggered</span>
                                        </div>
                                        {selectedAlert.status === 'acknowledged' && (
                                            <div className="flex items-center space-x-2 text-xs">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                <span className="text-gray-600">2m ago - Alert acknowledged</span>
                                            </div>
                                        )}
                                        {selectedAlert.status === 'resolved' && (
                                            <div className="flex items-center space-x-2 text-xs">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-gray-600">1m ago - Alert resolved</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recommended Actions */}
                                <div>
                                    <span className="font-medium text-sm">Recommended Actions:</span>
                                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                                        {selectedAlert.severity === 'critical' && (
                                            <>
                                                <div>• Contact emergency services if needed</div>
                                                <div>• Check on resident immediately</div>
                                                <div>• Verify device is functioning properly</div>
                                            </>
                                        )}
                                        {selectedAlert.severity === 'high' && (
                                            <>
                                                <div>• Check on resident within 15 minutes</div>
                                                <div>• Review recent activity patterns</div>
                                                <div>• Consider device recalibration</div>
                                            </>
                                        )}
                                        {selectedAlert.severity === 'medium' && (
                                            <>
                                                <div>• Monitor for pattern changes</div>
                                                <div>• Schedule routine check</div>
                                                <div>• Update care plan if needed</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    onClick={() => setSelectedAlert(null)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                {selectedAlert.status === 'active' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                onAcknowledge?.(selectedAlert.id);
                                                setSelectedAlert(null);
                                            }}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Acknowledge
                                        </button>
                                        <button
                                            onClick={() => {
                                                onResolve?.(selectedAlert.id);
                                                setSelectedAlert(null);
                                            }}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Resolve
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions Panel */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-3">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">
                            🚨 Trigger Emergency Protocol
                        </button>
                        <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                            📞 Contact All Caregivers
                        </button>
                        <button className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">
                            ✅ Mark All as Reviewed
                        </button>
                        <button className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600">
                            📊 Generate Alert Report
                        </button>
                        <button className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600">
                            🔄 Refresh All Devices
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedAlertSystem;