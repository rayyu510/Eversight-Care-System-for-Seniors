import React, { useState } from 'react';

interface EnhancedDeviceCardProps {
    device: any;
    onUpdateStatus?: (deviceId: string, newStatus: string) => void;
    onViewDetails?: (device: any) => void;
    onTestDevice?: (deviceId: string) => void;
    onConfigureDevice?: (deviceId: string) => void;
}

const EnhancedDeviceCard: React.FC<EnhancedDeviceCardProps> = ({
    device,
    onUpdateStatus,
    onViewDetails,
    onTestDevice,
    onConfigureDevice
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!device) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-100 text-green-800 border-green-200';
            case 'offline': return 'bg-red-100 text-red-800 border-red-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getBatteryColor = (level: number) => {
        if (level > 50) return 'text-green-600';
        if (level > 20) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'motion_sensor': return '👁️';
            case 'door_sensor': return '🚪';
            case 'camera': return '📹';
            case 'emergency_button': return '🆘';
            default: return '📱';
        }
    };

    const getSignalStrength = (strength: number) => {
        return Math.min(Math.max(strength || 75, 0), 100);
    };

    const formatLastActivity = (timestamp: string) => {
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
                            {device.type.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${device.status === 'online' ? 'bg-green-100 text-green-800' :
                            device.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {device.status.toUpperCase()}
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
                    <div className={`text-lg font-bold ${getBatteryColor(device.batteryLevel)}`}>
                        {device.batteryLevel}%
                    </div>
                    <div className="text-xs text-gray-600">Battery</div>
                    {device.batteryLevel < 20 && (
                        <div className="text-xs text-red-600 font-medium">⚠️ Replace Soon</div>
                    )}
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                        {getSignalStrength(device.signalStrength)}%
                    </div>
                    <div className="text-xs text-gray-600">Signal</div>
                    <div className="text-xs text-gray-500">
                        {device.signalStrength > 80 ? '📶 Strong' :
                            device.signalStrength > 50 ? '📶 Good' : '📶 Weak'}
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
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-3 animate-fadeIn">
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
                            {device.manufacturer && (
                                <>
                                    <div>
                                        <span className="font-medium text-gray-600">Manufacturer:</span>
                                        <div className="text-gray-800">{device.manufacturer}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Model:</span>
                                        <div className="text-gray-800">{device.model}</div>
                                    </div>
                                </>
                            )}
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
                                {device.storageUsed && (
                                    <div className="flex justify-between">
                                        <span className="text-purple-700">Storage Used:</span>
                                        <span className="font-medium text-purple-900">{device.storageUsed}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {device.type === 'emergency_button' && (
                        <div className="bg-red-50 p-3 rounded-md">
                            <h4 className="font-medium text-xs text-red-800 mb-2">Emergency Button Status</h4>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-red-700">Test Mode:</span>
                                    <span className="font-medium text-red-900">
                                        {device.testMode ? '🧪 Enabled' : '🔒 Disabled'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-700">Last Test:</span>
                                    <span className="font-medium text-red-900">{device.lastTest || '2024-08-01'}</span>
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

export default EnhancedDeviceCard;