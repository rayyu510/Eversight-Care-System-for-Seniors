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

// Import your actual service functions
import {
    getDashboardSummary,
    getDevicesAsync,
    getActiveAlertsAsync,
    getResidents
} from '../../services/mockDataService';

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
        case 'camera': return <Camera style={{ width: '20px', height: '20px' }} />;
        case 'motion_sensor': return <Radio style={{ width: '20px', height: '20px' }} />;
        case 'door_sensor': return <DoorOpen style={{ width: '20px', height: '20px' }} />;
        case 'emergency_button': return <Phone style={{ width: '20px', height: '20px' }} />;
        default: return <Shield style={{ width: '20px', height: '20px' }} />;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'online': return { color: '#16a34a', backgroundColor: '#dcfce7' };
        case 'offline': return { color: '#dc2626', backgroundColor: '#fee2e2' };
        case 'warning': return { color: '#ca8a04', backgroundColor: '#fef3c7' };
        default: return { color: '#6b7280', backgroundColor: '#f3f4f6' };
    }
};

const getSeverityColor = (severity) => {
    switch (severity) {
        case 'critical': return { color: '#dc2626', backgroundColor: '#fee2e2', borderColor: '#fecaca' };
        case 'high': return { color: '#ea580c', backgroundColor: '#fed7aa', borderColor: '#fdba74' };
        case 'medium': return { color: '#ca8a04', backgroundColor: '#fef3c7', borderColor: '#fde68a' };
        case 'low': return { color: '#2563eb', backgroundColor: '#dbeafe', borderColor: '#93c5fd' };
        default: return { color: '#6b7280', backgroundColor: '#f3f4f6', borderColor: '#d1d5db' };
    }
};

const DeviceCard = ({ device }) => {
    const statusColor = getStatusColor(device.status);

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.15s ease-in-out',
            marginBottom: '16px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        padding: '8px',
                        borderRadius: '8px',
                        ...statusColor
                    }}>
                        {getDeviceIcon(device.type)}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#111827' }}>{device.name}</h3>
                        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>{device.location}</p>
                    </div>
                </div>
                <span style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '14px',
                    fontWeight: '500',
                    ...statusColor
                }}>
                    {device.status}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Battery style={{
                        width: '16px',
                        height: '16px',
                        color: device.batteryLevel < 30 ? '#ef4444' : '#22c55e'
                    }} />
                    <span style={{ fontSize: '14px' }}>{device.batteryLevel}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wifi style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                    <span style={{ fontSize: '14px' }}>{device.signalStrength}%</span>
                </div>
            </div>

            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Last activity: {formatTimeAgo(device.lastActivity)}
            </div>
        </div>
    );
};

const AlertCard = ({ alert, onAcknowledge, onDismiss }) => {
    const severityColor = getSeverityColor(alert.severity);

    return (
        <div style={{
            padding: '16px',
            borderRadius: '8px',
            borderLeft: `4px solid ${severityColor.borderColor}`,
            backgroundColor: severityColor.backgroundColor,
            marginBottom: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <AlertTriangle style={{ width: '16px', height: '16px' }} />
                        <span style={{ fontWeight: '600' }}>{alert.title}</span>
                        <span style={{
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: '500',
                            ...severityColor
                        }}>
                            {alert.severity}
                        </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>{alert.description}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
                        <span>{alert.location}</span>
                        <span>{formatTimeAgo(alert.triggeredAt)}</span>
                    </div>
                </div>
                {alert.status === 'active' && (
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                        <button
                            onClick={() => onAcknowledge(alert.id)}
                            style={{
                                padding: '4px 12px',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                fontSize: '12px',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Acknowledge
                        </button>
                        <button
                            onClick={() => onDismiss(alert.id)}
                            style={{
                                padding: '4px 12px',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                fontSize: '12px',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Dismiss
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const GuardianProtectDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);
    const [devices, setDevices] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Home style={{ width: '16px', height: '16px' }} /> },
        { id: 'devices', label: 'Devices', icon: <Shield style={{ width: '16px', height: '16px' }} /> },
        { id: 'alerts', label: 'Alerts', icon: <AlertTriangle style={{ width: '16px', height: '16px' }} /> },
        { id: 'residents', label: 'Residents', icon: <Users style={{ width: '16px', height: '16px' }} /> },
        { id: 'reports', label: 'Reports', icon: <BarChart3 style={{ width: '16px', height: '16px' }} /> }
    ];

    const loadData = async () => {
        setLoading(true);
        try {
            const [summaryData, devicesData, alertsData, residentsData] = await Promise.all([
                getDashboardSummary(),
                getDevicesAsync(),
                getActiveAlertsAsync(),
                getResidents()
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
            <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <RefreshCw style={{ width: '32px', height: '32px', color: '#2563eb', animation: 'spin 1s linear infinite' }} />
                <span style={{ marginLeft: '8px', fontSize: '18px' }}>Loading Guardian Protect...</span>
            </div>
        );
    }

    const renderOverview = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Total Devices</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                                {dashboardData?.overview.totalDevices}
                            </p>
                        </div>
                        <Shield style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Online Devices</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>
                                {dashboardData?.overview.onlineDevices}
                            </p>
                        </div>
                        <CheckCircle style={{ width: '32px', height: '32px', color: '#16a34a' }} />
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>Active Alerts</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#ea580c' }}>
                                {alerts.filter(a => a.status === 'active').length}
                            </p>
                        </div>
                        <AlertTriangle style={{ width: '32px', height: '32px', color: '#ea580c' }} />
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>System Health</p>
                            <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>
                                {dashboardData?.overview.systemHealth}
                            </p>
                        </div>
                        <Activity style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                    </div>
                </div>
            </div>

            {/* Critical Alerts */}
            {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length > 0 && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#991b1b' }}>
                        Critical Alerts Requiring Immediate Attention
                    </h3>
                    <div>
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
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontWeight: '600', color: '#111827' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {alerts.slice(0, 3).map(alert => (
                        <div key={alert.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px'
                        }}>
                            <AlertTriangle style={{ width: '16px', height: '16px', color: '#ea580c' }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500' }}>{alert.title}</p>
                                <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                                    {alert.location} • {formatTimeAgo(alert.triggeredAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDevices = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Device Management</h2>
                <button
                    onClick={loadData}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <RefreshCw style={{ width: '16px', height: '16px' }} />
                    <span>Refresh</span>
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {devices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    );

    const renderAlerts = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Alert Management</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                        padding: '4px 12px',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: '999px',
                        fontSize: '14px'
                    }}>
                        {alerts.filter(a => a.status === 'active').length} Active
                    </span>
                    <span style={{
                        padding: '4px 12px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '999px',
                        fontSize: '14px'
                    }}>
                        {alerts.filter(a => a.status === 'acknowledged').length} Acknowledged
                    </span>
                </div>
            </div>

            <div>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Resident Management</h2>

            {residents.map(resident => (
                <div key={resident.id} style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600' }}>{resident.name}</h3>
                            <p style={{ margin: '0', color: '#6b7280' }}>Age: {resident.age} • {resident.careLevel}</p>
                        </div>
                        <Users style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <h4 style={{ margin: '0 0 8px 0', fontWeight: '500' }}>Emergency Contacts</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {resident.emergencyContacts.map(contact => (
                                    <div key={contact.name} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '4px'
                                    }}>
                                        <div>
                                            <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '500' }}>{contact.name}</p>
                                            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>{contact.relation}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: '0 0 2px 0', fontSize: '14px' }}>{contact.phone}</p>
                                            {contact.primary && <span style={{ fontSize: '12px', color: '#2563eb' }}>Primary</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ margin: '0 0 8px 0', fontWeight: '500' }}>Activity Patterns</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '8px',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '4px'
                                }}>
                                    <span style={{ fontSize: '14px' }}>Wake Time</span>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{resident.activityPatterns.wakeTime}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '8px',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '4px'
                                }}>
                                    <span style={{ fontSize: '14px' }}>Bed Time</span>
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{resident.activityPatterns.bedTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderReports = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>Reports & Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontWeight: '600' }}>Device Health Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Online</span>
                            <span style={{ fontWeight: '500', color: '#16a34a' }}>{dashboardData?.deviceStatus.online}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Offline</span>
                            <span style={{ fontWeight: '500', color: '#dc2626' }}>{dashboardData?.deviceStatus.offline}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Warning</span>
                            <span style={{ fontWeight: '500', color: '#ca8a04' }}>{dashboardData?.deviceStatus.warning}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Low Battery</span>
                            <span style={{ fontWeight: '500', color: '#ea580c' }}>{dashboardData?.deviceStatus.lowBattery}</span>
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontWeight: '600' }}>Alert Statistics</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Active</span>
                            <span style={{ fontWeight: '500', color: '#dc2626' }}>{dashboardData?.alertsSummary.active}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Critical</span>
                            <span style={{ fontWeight: '500', color: '#991b1b' }}>{dashboardData?.alertsSummary.critical}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Resolved</span>
                            <span style={{ fontWeight: '500', color: '#16a34a' }}>{dashboardData?.alertsSummary.resolved}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Acknowledged</span>
                            <span style={{ fontWeight: '500', color: '#2563eb' }}>{dashboardData?.alertsSummary.acknowledged}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 16px 0', fontWeight: '600' }}>System Performance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <TrendingUp style={{ width: '32px', height: '32px', color: '#16a34a', margin: '0 auto 8px' }} />
                        <p style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>99.8%</p>
                        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>Uptime</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Clock style={{ width: '32px', height: '32px', color: '#2563eb', margin: '0 auto 8px' }} />
                        <p style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>120ms</p>
                        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>Response Time</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Activity style={{ width: '32px', height: '32px', color: '#7c3aed', margin: '0 auto 8px' }} />
                        <p style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'bold', color: '#7c3aed' }}>8,640</p>
                        <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>Data Points</p>
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
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '16px 24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                                Guardian Protect Dashboard
                            </h1>
                            <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                                Last updated: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={loadData}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                <RefreshCw style={{ width: '16px', height: '16px' }} />
                                <span>Refresh All</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
                    <nav style={{ display: 'flex', gap: '32px', padding: '0 24px' }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '16px 4px',
                                    borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onMouseOver={(e) => {
                                    if (activeTab !== tab.id) {
                                        const target = e.target as HTMLElement;
                                        target.style.color = '#374151';
                                        target.style.borderBottomColor = '#d1d5db';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (activeTab !== tab.id) {
                                        const target = e.target as HTMLElement;
                                        target.style.color = '#6b7280';
                                        target.style.borderBottomColor = 'transparent';
                                    }
                                }}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                {tab.id === 'alerts' && alerts.filter(a => a.status === 'active').length > 0 && (
                                    <span style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        fontSize: '12px',
                                        borderRadius: '999px',
                                        padding: '2px 8px',
                                        minWidth: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {alerts.filter(a => a.status === 'active').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default GuardianProtectDashboard;