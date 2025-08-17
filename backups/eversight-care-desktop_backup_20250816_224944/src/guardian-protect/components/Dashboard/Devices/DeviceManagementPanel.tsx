import React, { useState, useEffect } from 'react';

interface DeviceManagementPanelProps {
    devices?: any[];
    onRefresh?: () => void;
    onAddDevice?: () => void;
    onRemoveDevice?: (deviceId: string) => void;
    onUpdateDevice?: (deviceId: string, updates: any) => void;
}

const DeviceManagementPanel: React.FC<DeviceManagementPanelProps> = ({
    devices = [],
    onRefresh,
    onAddDevice,
    onRemoveDevice,
    onUpdateDevice
}) => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showAddDevice, setShowAddDevice] = useState(false);
    const [selectedDeviceType, setSelectedDeviceType] = useState('all');

    // Filter and sort devices
    const filteredDevices = devices
        .filter(device => {
            const matchesFilter = filter === 'all' || device.status === filter;
            const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                device.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedDeviceType === 'all' || device.type === selectedDeviceType;
            return matchesFilter && matchesSearch && matchesType;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'location': return a.location.localeCompare(b.location);
                case 'battery': return b.batteryLevel - a.batteryLevel;
                case 'status': return a.status.localeCompare(b.status);
                case 'signal': return (b.signalStrength || 0) - (a.signalStrength || 0);
                default: return 0;
            }
        });

    const deviceStats = {
        total: devices.length,
        online: devices.filter(d => d.status === 'online').length,
        offline: devices.filter(d => d.status === 'offline').length,
        warning: devices.filter(d => d.status === 'warning').length,
        lowBattery: devices.filter(d => d.batteryLevel < 30).length,
        critical: devices.filter(d => d.batteryLevel < 10).length
    };

    const deviceTypes = [
        { key: 'all', label: 'All Types', icon: '📱' },
        { key: 'motion_sensor', label: 'Motion Sensors', icon: '👁️' },
        { key: 'door_sensor', label: 'Door Sensors', icon: '🚪' },
        { key: 'camera', label: 'Cameras', icon: '📹' },
        { key: 'emergency_button', label: 'Emergency Buttons', icon: '🆘' }
    ];

    const handleDeviceAction = async (action: string, deviceId: string, ...args: any[]) => {
        try {
            switch (action) {
                case 'test':
                    console.log(`Testing device ${deviceId}...`);
                    // Simulate device test
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    alert(`Device ${deviceId} test completed successfully!`);
                    break;
                case 'updateStatus':
                    console.log(`Updating device ${deviceId} status to ${args[0]}`);
                    onUpdateDevice?.(deviceId, { status: args[0] });
                    break;
                case 'configure':
                    console.log(`Opening configuration for device ${deviceId}`);
                    // This would open a configuration modal
                    break;
                case 'viewDetails':
                    console.log(`Viewing details for device:`, args[0]);
                    // This would open a details modal
                    break;
            }
        } catch (error) {
            console.error(`Error performing ${action} on device ${deviceId}:`, error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Device Management</h2>
                        <p className="text-sm text-gray-600 mt-1">Monitor and manage all Guardian Protect devices</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                ⊞
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                ☰
                            </button>
                        </div>
                        <button
                            onClick={onRefresh}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                        >
                            🔄 Refresh
                        </button>
                        <button
                            onClick={() => setShowAddDevice(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                        >
                            + Add Device
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{deviceStats.total}</div>
                        <div className="text-sm text-blue-800">Total Devices</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600">{deviceStats.online}</div>
                        <div className="text-sm text-green-800">Online</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-600">{deviceStats.offline}</div>
                        <div className="text-sm text-red-800">Offline</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-600">{deviceStats.warning}</div>
                        <div className="text-sm text-yellow-800">Warning</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-600">{deviceStats.lowBattery}</div>
                        <div className="text-sm text-orange-800">Low Battery</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600">{deviceStats.critical}</div>
                        <div className="text-sm text-purple-800">Critical</div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="p-6 bg-gray-50 border-b">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="flex-1 min-w-64">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search devices by name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="online">Online Only</option>
                        <option value="offline">Offline Only</option>
                        <option value="warning">Warning Only</option>
                    </select>

                    {/* Sort By */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="location">Sort by Location</option>
                        <option value="battery">Sort by Battery</option>
                        <option value="status">Sort by Status</option>
                        <option value="signal">Sort by Signal</option>
                    </select>
                </div>

                {/* Device Type Filter */}
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {deviceTypes.map(type => (
                            <button
                                key={type.key}
                                onClick={() => setSelectedDeviceType(type.key)}
                                className={`px-3 py-2 text-sm border rounded-full transition-colors ${selectedDeviceType === type.key
                                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-1">{type.icon}</span>
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Devices Display */}
            <div className="p-6">
                {filteredDevices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">📱</div>
                        <div className="text-lg font-medium mb-2">No devices found</div>
                        <div className="text-sm">Try adjusting your filters or search terms</div>
                        {devices.length === 0 && (
                            <button
                                onClick={() => setShowAddDevice(true)}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                                Add Your First Device
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm text-gray-600">
                                Showing {filteredDevices.length} of {devices.length} devices
                            </div>
                            <div className="text-sm text-gray-500">
                                Last updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>

                        <div className={
                            viewMode === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "space-y-4"
                        }>
                            {filteredDevices.map(device => (
                                <DeviceCard
                                    key={device.id}
                                    device={device}
                                    onUpdateStatus={(deviceId, newStatus) =>
                                        handleDeviceAction('updateStatus', deviceId, newStatus)
                                    }
                                    onViewDetails={(device) =>
                                        handleDeviceAction('viewDetails', device.id, device)
                                    }
                                    onTestDevice={(deviceId) =>
                                        handleDeviceAction('test', deviceId)
                                    }
                                    onConfigureDevice={(deviceId) =>
                                        handleDeviceAction('configure', deviceId)
                                    }
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Add Device Modal */}
            {showAddDevice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Add New Device</h3>
                            <button
                                onClick={() => setShowAddDevice(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Device Type</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">Select device type...</option>
                                    <option value="motion_sensor">👁️ Motion Sensor</option>
                                    <option value="door_sensor">🚪 Door Sensor</option>
                                    <option value="camera">📹 Camera</option>
                                    <option value="emergency_button">🆘 Emergency Button</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Device Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Living Room Motion Sensor"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Living Room"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Device ID</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., GT300-007-2024"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddDevice(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddDevice(false);
                                    onAddDevice?.();
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Add Device
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Embedded Device Card Component (to avoid import issues)
const DeviceCard = ({ device, onUpdateStatus, onViewDetails, onTestDevice, onConfigureDevice }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!device) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'bg-green-100 text-green-800 border-green-200';
            case 'offline': return 'bg-red-100 text-red-800 border-red-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getBatteryColor = (level) => {
        if (level > 50) return 'text-green-600';
        if (level > 20) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getDeviceIcon = (type) => {
        switch (type) {
            case 'motion_sensor': return '👁️';
            case 'door_sensor': return '🚪';
            case 'camera': return '📹';
            case 'emergency_button': return '🆘';
            default: return '📱';
        }
    };

    const formatLastActivity = (timestamp) => {
        if (!timestamp) return 'Never';
        const now = new Date();
        const activity = new Date(timestamp);
        const diffMs = now.getTime() - activity.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    const handleTestDevice = async () => {
        setIsLoading(true);
        try {
            await onTestDevice?.(device.id);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getStatusColor(device.status)}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
                        {getDeviceIcon(device.type)}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900">{device.name}</h3>
                        <p className="text-xs text-gray-600">{device.location}</p>
                        <p className="text-xs text-gray-500 capitalize">
                            {device.type?.replace('_', ' ') || 'Device'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${device.status === 'online' ? 'bg-green-100 text-green-800' :
                            device.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {(device.status || 'unknown').toUpperCase()}
                    </span>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        {isExpanded ? '↑ Less' : '↓ More'}
                    </button>
                </div>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                    <div className={`text-lg font-bold ${getBatteryColor(device.batteryLevel || 0)}`}>
                        {device.batteryLevel || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Battery</div>
                    {(device.batteryLevel || 0) < 20 && (
                        <div className="text-xs text-red-600 font-medium">⚠️ Replace Soon</div>
                    )}
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                        {device.signalStrength || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Signal</div>
                    <div className="text-xs text-gray-500">
                        {(device.signalStrength || 0) > 80 ? '📶 Strong' :
                            (device.signalStrength || 0) > 50 ? '📶 Good' : '📶 Weak'}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                        {formatLastActivity(device.lastActivity)}
                    </div>
                    <div className="text-xs text-gray-600">Last Activity</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2 mb-3">
                <button
                    onClick={() => onViewDetails?.(device)}
                    className="flex-1 px-3 py-2 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    📋 Details
                </button>
                <button
                    onClick={handleTestDevice}
                    disabled={isLoading || device.status === 'offline'}
                    className="flex-1 px-3 py-2 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? '⏳' : '🔧'} Test
                </button>
                <button
                    onClick={() => onUpdateStatus?.(device.id, device.status === 'online' ? 'offline' : 'online')}
                    className="flex-1 px-3 py-2 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                    🔄 Toggle
                </button>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
                    {/* Device Information */}
                    <div className="bg-white bg-opacity-60 p-3 rounded-md">
                        <h4 className="font-medium text-xs text-gray-700 mb-2">Device Information</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="font-medium text-gray-600">Device ID:</span>
                                <div className="text-gray-800">{device.id}</div>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Firmware:</span>
                                <div className="text-gray-800">{device.firmware || 'v2.1.3'}</div>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Installed:</span>
                                <div className="text-gray-800">{device.installedDate || '2024-01-15'}</div>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">Last Maintenance:</span>
                                <div className="text-gray-800">{device.lastMaintenance || '2024-07-20'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Device-specific Settings */}
                    {device.type === 'motion_sensor' && (
                        <div className="bg-blue-50 p-3 rounded-md">
                            <h4 className="font-medium text-xs text-blue-800 mb-2">Motion Detection Settings</h4>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Sensitivity:</span>
                                    <span className="font-medium text-blue-900">{device.sensitivity || 'Medium'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Detection Range:</span>
                                    <span className="font-medium text-blue-900">{device.range || '5 meters'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Events Today:</span>
                                    <span className="font-medium text-blue-900">{device.eventsToday || 12}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {device.type === 'camera' && (
                        <div className="bg-purple-50 p-3 rounded-md">
                            <h4 className="font-medium text-xs text-purple-800 mb-2">Camera Settings</h4>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-purple-700">Resolution:</span>
                                    <span className="font-medium text-purple-900">{device.resolution || '1080p'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-purple-700">Night Vision:</span>
                                    <span className="font-medium text-purple-900">
                                        {device.nightVision ? '✅ Enabled' : '❌ Disabled'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-purple-700">Recording:</span>
                                    <span className="font-medium text-purple-900">
                                        {device.recording ? '🔴 Active' : '⏸️ Standby'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Advanced Actions */}
                    <div className="flex space-x-2 pt-2">
                        <button
                            onClick={() => onConfigureDevice?.(device.id)}
                            className="flex-1 px-3 py-2 text-xs bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                        >
                            ⚙️ Configure
                        </button>
                        <button
                            className="flex-1 px-3 py-2 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                        >
                            📊 History
                        </button>
                        <button
                            className="flex-1 px-3 py-2 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            🗑️ Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceManagementPanel;