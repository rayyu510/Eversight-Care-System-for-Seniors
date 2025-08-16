import React, { useState, useEffect } from 'react';
import {
    Shield,
    AlertTriangle,
    Battery,
    Wifi,
    Eye,
    Users,
    BarChart3,
    Settings,
    RefreshCw,
    CheckCircle,
    X,
    Camera,
    Radio,
    DoorOpen,
    Phone,
    Clock,
    TrendingUp,
    Activity,
    Home
} from 'lucide-react';

// Mock data service (replace with your actual service imports)
const mockDataService = {
    getDashboardSummary: async () => ({
        overview: {
            totalDevices: 6,
            onlineDevices: 4,
            totalAlerts: 1,
            criticalAlerts: 0,
            systemHealth: 'Good'
        },
        deviceStatus: {
            online: 4,
            offline: 1,
            warning: 1,
            lowBattery: 2
        },
        alertsSummary: {
            active: 3,
            critical: 1,
            resolved: 12,
            acknowledged: 1
        }
    }),
    getDevicesAsync: async () => [
        {
            id: "1",
            name: "Living Room Motion Sensor",
            status: "online",
            batteryLevel: 85,
            type: "motion_sensor",
            location: "Living Room",
            signalStrength: 92,
            lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString()
        },
        {
            id: "2",
            name: "Front Door Sensor",
            status: "online",
            batteryLevel: 25,
            type: "door_sensor",
            location: "Front Door",
            signalStrength: 88,
            lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
            id: "3",
            name: "Bedroom Camera",
            status: "online",
            batteryLevel: 78,
            type: "camera",
            location: "Bedroom",
            signalStrength: 95,
            lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
            id: "4",
            name: "Kitchen Motion Sensor",
            status: "warning",
            batteryLevel: 15,
            type: "motion_sensor",
            location: "Kitchen",
            signalStrength: 67,
            lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
            id: "5",
            name: "Bathroom Emergency Button",
            status: "online",
            batteryLevel: 92,
            type: "emergency_button",
            location: "Bathroom",
            signalStrength: 85,
            lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "6",
            name: "Hallway Camera",
            status: "offline",
            batteryLevel: 0,
            type: "camera",
            location: "Hallway",
            signalStrength: 0,
            lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
    ],
    getActiveAlertsAsync: async () => [
        {
            id: "a1",
            title: "Critical Battery Warning",
            description: "Kitchen Motion Sensor battery critically low (15%). Replace immediately.",
            severity: "critical",
            status: "active",
            deviceId: "4",
            location: "Kitchen",
            triggeredAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
            id: "a2",
            title: "Device Offline",
            description: "Hallway Camera has been offline for 4 hours.",
            severity: "high",
            status: "active",
            deviceId: "6",
            location: "Hallway",
            triggeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "a3",
            title: "Low Battery Alert",
            description: "Front Door Sensor battery below 30% (25%).",
            severity: "medium",
            status: "acknowledged",
            deviceId: "2",
            location: "Front Door",
            triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
    ],
    getResidents: async () => [
        {
            id: "r1",
            name: "Eleanor Johnson",
            age: 78,
            careLevel: "Independent with Monitoring",
            emergencyContacts: [
                { name: "Sarah Johnson", relation: "Daughter", phone: "(555) 123-4567", primary: true },
                { name: "Dr. Williams", relation: "Primary Care", phone: "(555) 987-6543", primary: false }
            ],
            activityPatterns: {
                wakeTime: "07:00",
                bedTime: "22:30"
            }
        }
    ]
};

const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const getDeviceIcon = (type) => {
    switch (type) {
        case 'camera': return <Camera className="w-5 h-5" />;
        case 'motion_sensor': return <Radio className="w-5 h-5" />;
        case 'door_sensor': return <DoorOpen className="w-5 h-5" />;
        case 'emergency_button': return <Phone className="w-5 h-5" />;
        default: return <Shield className="w-5 h-5" />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'online': return 'text-green-600 bg-green-100';
        case 'offline': return 'text-red-600 bg-red-100';
        case 'warning': return 'text-yellow-600 bg-yellow-100';
        default: return 'text-gray-600 bg-gray-100';
    }
};

const getSeverityColor = (severity) => {
    switch (severity) {
        case 'critical': return 'text-red-600 bg-red-100 border-red-200';
        case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
        case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
        case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
        default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
};

const DeviceCard = ({ device }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getStatusColor(device.status)}`}>
                    {getDeviceIcon(device.type)}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{device.name}</h3>
                    <p className="text-sm text-gray-600">{device.location}</p>
                </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(device.status)}`}>
                {device.status}
            </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
                <Battery className={`w-4 h-4 ${device.batteryLevel < 30 ? 'text-red-500' : 'text-green-500'}`} />
                <span className="text-sm">{device.batteryLevel}%</span>
            </div>
            <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{device.signalStrength}%</span>
            </div>
        </div>

        <div className="text-xs text-gray-500">
            Last activity: {formatTimeAgo(device.lastActivity)}
        </div>
    </div>
);

const AlertCard = ({ alert, onAcknowledge, onDismiss }) => (
    <div className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}>
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-semibold">{alert.title}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                    </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{alert.location}</span>
                    <span>{formatTimeAgo(alert.triggeredAt)}</span>
                </div>
            </div>
            {alert.status === 'active' && (
                <div className="flex space-x-2 ml-4">
                    <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                    >
                        Acknowledge
                    </button>
                    <button
                        onClick={() => onDismiss(alert.id)}
                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    </div>
);

const GuardianProtectDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);
    const [devices, setDevices] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
        { id: 'devices', label: 'Devices', icon: <Shield className="w-4 h-4" /> },
        { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" /> },
        { id: 'residents', label: 'Residents', icon: <Users className="w-4 h-4" /> },
        { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> }
    ];

    const loadData = async () => {
        setLoading(true);
        try {
            const [summaryData, devicesData, alertsData, residentsData] = await Promise.all([
                mockDataService.getDashboardSummary(),
                mockDataService.getDevicesAsync(),
                mockDataService.getActiveAlertsAsync(),
                mockDataService.getResidents()
            ]);

            setDashboardData(summaryData);
            setDevices(devicesData);
            setAlerts(alertsData);
            setResidents(residentsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAcknowledgeAlert = (alertId) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
        ));
    };

    const handleDismissAlert = (alertId) => {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-lg">Loading Guardian Protect...</span>
                </div>
            </div>
        );
    }

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Devices</p>
                            <p className="text-2xl font-bold text-gray-900">{dashboardData?.overview.totalDevices}</p>
                        </div>
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Online Devices</p>
                            <p className="text-2xl font-bold text-green-600">{dashboardData?.overview.onlineDevices}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Alerts</p>
                            <p className="text-2xl font-bold text-orange-600">{alerts.filter(a => a.status === 'active').length}</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">System Health</p>
                            <p className="text-2xl font-bold text-blue-600">{dashboardData?.overview.systemHealth}</p>
                        </div>
                        <Activity className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Critical Alerts */}
            {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Critical Alerts Requiring Immediate Attention</h3>
                    <div className="space-y-2">
                        {alerts.filter(a => a.severity === 'critical' && a.status === 'active').map(alert => (
                            <AlertCard
                                key={alert.id}
                                alert={alert}
                                onAcknowledge={handleAcknowledgeAlert}
                                onDismiss={handleDismissAlert}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {alerts.slice(0, 3).map(alert => (
                        <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{alert.title}</p>
                                <p className="text-xs text-gray-600">{alert.location} • {formatTimeAgo(alert.triggeredAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDevices = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Device Management</h2>
                <button
                    onClick={loadData}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    );

    const renderAlerts = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Alert Management</h2>
                <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {alerts.filter(a => a.status === 'active').length} Active
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {alerts.filter(a => a.status === 'acknowledged').length} Acknowledged
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {alerts.map(alert => (
                    <AlertCard
                        key={alert.id}
                        alert={alert}
                        onAcknowledge={handleAcknowledgeAlert}
                        onDismiss={handleDismissAlert}
                    />
                ))}
            </div>
        </div>
    );

    const renderResidents = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Resident Management</h2>

            {residents.map(resident => (
                <div key={resident.id} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">{resident.name}</h3>
                            <p className="text-gray-600">Age: {resident.age} • {resident.careLevel}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-2">Emergency Contacts</h4>
                            <div className="space-y-2">
                                {resident.emergencyContacts.map(contact => (
                                    <div key={contact.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div>
                                            <p className="text-sm font-medium">{contact.name}</p>
                                            <p className="text-xs text-gray-600">{contact.relation}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm">{contact.phone}</p>
                                            {contact.primary && <span className="text-xs text-blue-600">Primary</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Activity Patterns</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">Wake Time</span>
                                    <span className="text-sm font-medium">{resident.activityPatterns.wakeTime}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">Bed Time</span>
                                    <span className="text-sm font-medium">{resident.activityPatterns.bedTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderReports = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Reports & Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-4">Device Health Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Online</span>
                            <span className="font-medium text-green-600">{dashboardData?.deviceStatus.online}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Offline</span>
                            <span className="font-medium text-red-600">{dashboardData?.deviceStatus.offline}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Warning</span>
                            <span className="font-medium text-yellow-600">{dashboardData?.deviceStatus.warning}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Low Battery</span>
                            <span className="font-medium text-orange-600">{dashboardData?.deviceStatus.lowBattery}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-4">Alert Statistics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Active</span>
                            <span className="font-medium text-red-600">{dashboardData?.alertsSummary.active}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Critical</span>
                            <span className="font-medium text-red-800">{dashboardData?.alertsSummary.critical}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Resolved</span>
                            <span className="font-medium text-green-600">{dashboardData?.alertsSummary.resolved}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Acknowledged</span>
                            <span className="font-medium text-blue-600">{dashboardData?.alertsSummary.acknowledged}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">System Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">99.8%</p>
                        <p className="text-sm text-gray-600">Uptime</p>
                    </div>
                    <div className="text-center">
                        <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">120ms</p>
                        <p className="text-sm text-gray-600">Response Time</p>
                    </div>
                    <div className="text-center">
                        <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">8,640</p>
                        <p className="text-sm text-gray-600">Data Points</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'devices': return renderDevices();
            case 'alerts': return renderAlerts();
            case 'residents': return renderResidents();
            case 'reports': return renderReports();
            default: return renderOverview();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Guardian Protect Dashboard</h1>
                            <p className="text-sm text-gray-600">
                                Last updated: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={loadData}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Refresh All</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                {tab.id === 'alerts' && alerts.filter(a => a.status === 'active').length > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                                        {alerts.filter(a => a.status === 'active').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default GuardianProtectDashboard;