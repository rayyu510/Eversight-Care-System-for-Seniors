// src/pages/operations/OperationsCenterPage.tsx
import React from 'react';

const OperationsCenterPage = () => {
    const systemMetrics = [
        { label: 'System Health', value: '97%', status: 'excellent', color: '#10b981' },
        { label: 'Active Staff', value: '47', status: 'normal', color: '#3b82f6' },
        { label: 'Residents', value: '127', status: 'normal', color: '#6366f1' },
        { label: 'Safety Devices', value: '45/48', status: 'good', color: '#10b981' },
        { label: 'Camera Systems', value: '22/24', status: 'good', color: '#10b981' },
        { label: 'Response Time', value: '2.3 min', status: 'excellent', color: '#10b981' }
    ];

    const activeAlerts = [
        { id: 1, type: 'Device Low Battery', location: 'Room 204', priority: 'medium', time: '2 min ago' },
        { id: 2, type: 'Camera Offline', location: 'Garden Area', priority: 'low', time: '15 min ago' },
        { id: 3, type: 'System Maintenance', location: 'Server Room', priority: 'high', time: '1 hour ago' }
    ];

    const moduleStatus = [
        { name: 'Guardian Protect', status: 'Operational', health: 98, color: '#10b981' },
        { name: 'Surveillance Center', status: 'Operational', health: 94, color: '#10b981' },
        { name: 'Guardian Insight', status: 'Development', health: 0, color: '#f97316' },
        { name: 'Guardian CarePro', status: 'Development', health: 0, color: '#f97316' },
        { name: 'Guardian CareTrack', status: 'Development', health: 0, color: '#f97316' }
    ];

    const recentActivity = [
        { time: '14:32', event: 'Emergency Response Activated', location: 'Room 204', type: 'emergency' },
        { time: '14:25', event: 'Security Event Resolved', location: 'Lobby', type: 'security' },
        { time: '14:18', event: 'System Health Check Completed', location: 'System', type: 'system' },
        { time: '14:12', event: 'Staff Shift Change', location: 'All Areas', type: 'staff' },
        { time: '14:05', event: 'Medication Alert Acknowledged', location: 'Room 156', type: 'medical' }
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                    Operations Center
                </h1>
                <p style={{ color: '#6b7280', margin: '0', fontSize: '16px' }}>
                    Central Command & Control Hub - Real-time System Monitoring
                </p>
            </div>

            {/* System Metrics Grid - Box Layout */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    System Metrics
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px'
                }}>
                    {systemMetrics.map((metric, index) => (
                        <div key={index} style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: 'bold',
                                color: metric.color,
                                marginBottom: '8px'
                            }}>
                                {metric.value}
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#6b7280',
                                marginBottom: '8px'
                            }}>
                                {metric.label}
                            </div>
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: metric.status === 'excellent' ? '#d1fae5' :
                                    metric.status === 'good' ? '#dbeafe' : '#fef3cd',
                                color: metric.status === 'excellent' ? '#065f46' :
                                    metric.status === 'good' ? '#1e40af' : '#92400e'
                            }}>
                                {metric.status.toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Active Alerts Box */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                        Active Alerts ({activeAlerts.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activeAlerts.map(alert => (
                            <div key={alert.id} style={{
                                padding: '16px',
                                borderRadius: '8px',
                                backgroundColor: alert.priority === 'high' ? '#fef2f2' :
                                    alert.priority === 'medium' ? '#fefbf2' : '#f0f9ff',
                                border: `1px solid ${alert.priority === 'high' ? '#fca5a5' :
                                    alert.priority === 'medium' ? '#fbbf24' : '#93c5fd'}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: '1' }}>
                                        <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                            {alert.type}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                            📍 {alert.location}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                            {alert.time}
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        backgroundColor: alert.priority === 'high' ? '#dc2626' :
                                            alert.priority === 'medium' ? '#f59e0b' : '#3b82f6',
                                        color: 'white'
                                    }}>
                                        {alert.priority.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Module Status Box */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                        Module Status
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {moduleStatus.map((module, index) => (
                            <div key={index} style={{
                                padding: '16px',
                                borderRadius: '8px',
                                backgroundColor: '#f9fafb',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ fontWeight: '600', color: '#111827' }}>
                                        {module.name}
                                    </div>
                                    <div style={{
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        backgroundColor: module.status === 'Operational' ? '#d1fae5' : '#fef3cd',
                                        color: module.status === 'Operational' ? '#065f46' : '#92400e'
                                    }}>
                                        {module.status}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        flex: '1',
                                        height: '8px',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${module.health}%`,
                                            height: '100%',
                                            backgroundColor: module.color,
                                            borderRadius: '4px'
                                        }}></div>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                        {module.health}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Box */}
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Recent Activity
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {recentActivity.map((activity, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: activity.type === 'emergency' ? '#dc2626' :
                                    activity.type === 'security' ? '#f59e0b' :
                                        activity.type === 'medical' ? '#3b82f6' :
                                            activity.type === 'staff' ? '#10b981' : '#6b7280',
                                marginRight: '12px'
                            }}></div>
                            <div style={{ fontSize: '12px', color: '#6b7280', minWidth: '60px' }}>
                                {activity.time}
                            </div>
                            <div style={{ flex: '1', fontSize: '14px', color: '#111827', marginLeft: '12px' }}>
                                {activity.event}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                📍 {activity.location}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OperationsCenterPage;