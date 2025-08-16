// src/operations-centercomponents/Dashboard/OperationsCenterDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Monitor, AlertCircle, Activity, Database, Server, Wifi, Shield, RefreshCw, Bell, CheckCircle, Clock, Users, BarChart3, Settings, Zap, Heart, Eye, TrendingUp, AlertTriangle } from 'lucide-react';

const OperationsCenterDashboard: React.FC = () => {
    const [systemStatus, setSystemStatus] = useState({
        overall: 'operational',
        network: { status: 'online', uptime: '99.8%', latency: '12ms' },
        database: { status: 'connected', queries: '1,247/min', load: '45%' },
        backup: { status: 'complete', lastBackup: '2 hours ago', size: '2.3GB' },
        security: { status: 'protected', threats: 0, lastScan: '30 min ago' }
    });

    const [moduleHealth, setModuleHealth] = useState([
        { id: 'guardian-protect', name: 'Guardian Protect', status: 'operational', health: 97, alerts: 2, uptime: '99.5%' },
        { id: 'guardian-insight', name: 'Guardian Insight', status: 'operational', health: 94, alerts: 0, uptime: '99.8%' },
        { id: 'guardian-carepro', name: 'Guardian CarePro', status: 'operational', health: 98, alerts: 1, uptime: '99.9%' },
        { id: 'guardian-caretrack', name: 'Guardian CareTrack', status: 'operational', health: 96, alerts: 0, uptime: '99.7%' },
        { id: 'surveillance-center', name: 'Surveillance Center', status: 'maintenance', health: 89, alerts: 3, uptime: '98.2%' }
    ]);

    const [systemAlerts, setSystemAlerts] = useState([
        { id: 1, type: 'warning', module: 'Surveillance Center', message: 'Camera 7 requires maintenance', timestamp: new Date(Date.now() - 120000), priority: 'medium', status: 'active' },
        { id: 2, type: 'info', module: 'Guardian Protect', message: 'Device battery optimization completed', timestamp: new Date(Date.now() - 300000), priority: 'low', status: 'acknowledged' },
        { id: 3, type: 'critical', module: 'Network Infrastructure', message: 'Backup server connection restored', timestamp: new Date(Date.now() - 600000), priority: 'high', status: 'resolved' },
        { id: 4, type: 'warning', module: 'Guardian CarePro', message: 'Staff schedule sync pending', timestamp: new Date(Date.now() - 900000), priority: 'medium', status: 'active' }
    ]);

    const [performanceMetrics, setPerformanceMetrics] = useState({
        responseTime: '1.2s',
        throughput: '2,847 req/min',
        errorRate: '0.03%',
        activeUsers: 47,
        systemLoad: 67,
        memoryUsage: 78,
        cpuUsage: 45,
        diskUsage: 62
    });

    const [realTimeData, setRealTimeData] = useState({
        activeDevices: 48,
        onlineStaff: 32,
        patientsMonitored: 127,
        activeCameras: 22,
        totalAlerts: 6,
        criticalAlerts: 1
    });

    // Update real-time data simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setPerformanceMetrics(prev => ({
                ...prev,
                systemLoad: Math.max(30, Math.min(90, prev.systemLoad + (Math.random() - 0.5) * 10)),
                memoryUsage: Math.max(40, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 5)),
                cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 8)),
                activeUsers: Math.max(40, Math.min(60, prev.activeUsers + Math.floor((Math.random() - 0.5) * 4)))
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleAcknowledgeAlert = (alertId) => {
        setSystemAlerts(alerts =>
            alerts.map(alert =>
                alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
            )
        );
    };

    const handleResolveAlert = (alertId) => {
        setSystemAlerts(alerts =>
            alerts.map(alert =>
                alert.id === alertId ? { ...alert, status: 'resolved' } : alert
            )
        );
    };

    const initiateEmergencyProtocol = (protocolType) => {
        // Emergency protocol simulation
        console.log(`Emergency protocol activated: ${protocolType}`);
        // In real implementation, this would trigger actual emergency procedures
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'operational': return 'text-green-600 bg-green-50 border-green-200';
            case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'maintenance': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'critical': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getAlertColor = (type) => {
        switch (type) {
            case 'critical': return 'bg-red-50 border-red-400 text-red-800';
            case 'warning': return 'bg-yellow-50 border-yellow-400 text-yellow-800';
            case 'info': return 'bg-blue-50 border-blue-400 text-blue-800';
            default: return 'bg-gray-50 border-gray-400 text-gray-800';
        }
    };

    const activeAlerts = systemAlerts.filter(alert => alert.status === 'active').length;
    const overallHealth = Math.round(moduleHealth.reduce((acc, module) => acc + module.health, 0) / moduleHealth.length);

    return (
        <div className="p-8 max-w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl p-8 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Operations Center</h1>
                        <p className="text-slate-100">Centralized System Monitoring & Control Hub</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-2xl font-bold">{overallHealth}%</div>
                            <div className="text-sm text-slate-200">System Health</div>
                        </div>
                        <button className="bg-slate-500 hover:bg-slate-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2">
                            <RefreshCw className="h-5 w-5" />
                            <span>Refresh All</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">System Response</h3>
                            <p className="text-3xl font-bold text-blue-600">{performanceMetrics.responseTime}</p>
                            <p className="text-sm text-gray-500">Average Response</p>
                        </div>
                        <Clock className="h-12 w-12 text-blue-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Active Users</h3>
                            <p className="text-3xl font-bold text-green-600">{performanceMetrics.activeUsers}</p>
                            <p className="text-sm text-gray-500">Staff Online</p>
                        </div>
                        <Users className="h-12 w-12 text-green-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">System Load</h3>
                            <p className="text-3xl font-bold text-orange-600">{performanceMetrics.systemLoad}%</p>
                            <p className="text-sm text-gray-500">Current Load</p>
                        </div>
                        <BarChart3 className="h-12 w-12 text-orange-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Active Alerts</h3>
                            <p className="text-3xl font-bold text-red-600">{activeAlerts}</p>
                            <p className="text-sm text-gray-500">Require Attention</p>
                        </div>
                        <AlertCircle className="h-12 w-12 text-red-600 opacity-20" />
                    </div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Infrastructure Status */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Infrastructure Health */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Infrastructure Health</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <Wifi className="h-6 w-6 text-green-600" />
                                        <span className="font-semibold text-gray-900">Network</span>
                                    </div>
                                    <span className="text-green-600 font-semibold">{systemStatus.network.status}</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Uptime:</span>
                                        <span className="font-medium">{systemStatus.network.uptime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Latency:</span>
                                        <span className="font-medium">{systemStatus.network.latency}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <Database className="h-6 w-6 text-green-600" />
                                        <span className="font-semibold text-gray-900">Database</span>
                                    </div>
                                    <span className="text-green-600 font-semibold">{systemStatus.database.status}</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Queries/min:</span>
                                        <span className="font-medium">{systemStatus.database.queries}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Load:</span>
                                        <span className="font-medium">{systemStatus.database.load}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <Server className="h-6 w-6 text-green-600" />
                                        <span className="font-semibold text-gray-900">Backup</span>
                                    </div>
                                    <span className="text-green-600 font-semibold">{systemStatus.backup.status}</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Last Backup:</span>
                                        <span className="font-medium">{systemStatus.backup.lastBackup}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Size:</span>
                                        <span className="font-medium">{systemStatus.backup.size}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        <Shield className="h-6 w-6 text-green-600" />
                                        <span className="font-semibold text-gray-900">Security</span>
                                    </div>
                                    <span className="text-green-600 font-semibold">{systemStatus.security.status}</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Threats:</span>
                                        <span className="font-medium">{systemStatus.security.threats}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Last Scan:</span>
                                        <span className="font-medium">{systemStatus.security.lastScan}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Module Health Status */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Module Health Status</h3>
                        <div className="space-y-4">
                            {moduleHealth.map((module) => (
                                <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-4 h-4 rounded-full ${module.health > 95 ? 'bg-green-500' :
                                            module.health > 90 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{module.name}</h4>
                                            <p className="text-sm text-gray-500">Uptime: {module.uptime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">{module.health}%</div>
                                            <div className="text-sm text-gray-500">Health</div>
                                        </div>
                                        {module.alerts > 0 && (
                                            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                {module.alerts} alerts
                                            </div>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(module.status)}`}>
                                            {module.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Performance</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{performanceMetrics.cpuUsage}%</div>
                                <div className="text-sm text-gray-500">CPU Usage</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${performanceMetrics.cpuUsage}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{performanceMetrics.memoryUsage}%</div>
                                <div className="text-sm text-gray-500">Memory</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${performanceMetrics.memoryUsage}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{performanceMetrics.diskUsage}%</div>
                                <div className="text-sm text-gray-500">Disk Usage</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-orange-600 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${performanceMetrics.diskUsage}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{performanceMetrics.errorRate}</div>
                                <div className="text-sm text-gray-500">Error Rate</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '3%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* System Alerts */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">System Alerts</h3>
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {activeAlerts} Active
                            </span>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {systemAlerts.filter(alert => alert.status === 'active').map((alert) => (
                                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-sm">{alert.message}</h4>
                                            <p className="text-xs opacity-75">{alert.module}</p>
                                        </div>
                                        <div className="text-xs opacity-75">
                                            {alert.timestamp.toLocaleTimeString()}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 mt-3">
                                        <button
                                            onClick={() => handleAcknowledgeAlert(alert.id)}
                                            className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-medium hover:bg-yellow-200 transition-colors"
                                        >
                                            Acknowledge
                                        </button>
                                        <button
                                            onClick={() => handleResolveAlert(alert.id)}
                                            className="flex-1 bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                                        >
                                            Resolve
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {activeAlerts === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p className="font-medium">No active alerts</p>
                                    <p className="text-sm">All systems operating normally</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Emergency Controls */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Emergency Controls</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => initiateEmergencyProtocol('lockdown')}
                                className="w-full p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-center transition-colors flex items-center justify-center space-x-2"
                            >
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <span className="font-medium text-red-700">Facility Lockdown</span>
                            </button>

                            <button
                                onClick={() => initiateEmergencyProtocol('medical')}
                                className="w-full p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-center transition-colors flex items-center justify-center space-x-2"
                            >
                                <Heart className="h-5 w-5 text-orange-600" />
                                <span className="font-medium text-orange-700">Medical Emergency</span>
                            </button>

                            <button
                                onClick={() => initiateEmergencyProtocol('evacuation')}
                                className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg text-center transition-colors flex items-center justify-center space-x-2"
                            >
                                <Users className="h-5 w-5 text-yellow-600" />
                                <span className="font-medium text-yellow-700">Evacuation Protocol</span>
                            </button>

                            <button
                                onClick={() => initiateEmergencyProtocol('backup')}
                                className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-center transition-colors flex items-center justify-center space-x-2"
                            >
                                <Server className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-blue-700">Backup Systems</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Live Statistics</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Active Devices</span>
                                <span className="font-bold text-blue-600">{realTimeData.activeDevices}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Online Staff</span>
                                <span className="font-bold text-green-600">{realTimeData.onlineStaff}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Patients Monitored</span>
                                <span className="font-bold text-purple-600">{realTimeData.patientsMonitored}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Active Cameras</span>
                                <span className="font-bold text-indigo-600">{realTimeData.activeCameras}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Alerts</span>
                                <span className="font-bold text-red-600">{realTimeData.totalAlerts}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationsCenterDashboard;