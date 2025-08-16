// src/operations-center/components/Monitoring/SystemStatusPanel.tsx
import React from 'react';
import { Activity, Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { SystemStatus } from '../../types';

interface SystemStatusPanelProps {
    systems: SystemStatus[];
    onSystemAction: (systemId: string, action: 'restart' | 'maintenance' | 'activate') => Promise<boolean>;
    loading?: boolean;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({
    systems,
    onSystemAction,
    loading = false
}) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'operational':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'maintenance':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'error':
                return <WifiOff className="h-5 w-5 text-red-600" />;
            case 'offline':
                return <WifiOff className="h-5 w-5 text-gray-600" />;
            default:
                return <Wifi className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'border-green-200 bg-green-50';
            case 'maintenance':
                return 'border-yellow-200 bg-yellow-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            case 'offline':
                return 'border-gray-200 bg-gray-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">System Status Panel</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Activity className="h-4 w-4" />
                    <span>Real-time monitoring</span>
                </div>
            </div>

            <div className="space-y-3">
                {systems.map(system => (
                    <div key={system.id} className={`border rounded-lg p-4 ${getStatusColor(system.status)}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {getStatusIcon(system.status)}
                                <div>
                                    <h4 className="font-medium text-gray-900">{system.name}</h4>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span>Uptime: {system.uptime}</span>
                                        <span>•</span>
                                        <span>Health: {system.healthScore}%</span>
                                        <span>•</span>
                                        <span>v{system.version}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                {system.status === 'operational' && (
                                    <button
                                        onClick={() => onSystemAction(system.id, 'maintenance')}
                                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                                    >
                                        Maintenance
                                    </button>
                                )}
                                {(system.status === 'error' || system.status === 'offline') && (
                                    <button
                                        onClick={() => onSystemAction(system.id, 'restart')}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        Restart
                                    </button>
                                )}
                                {system.status === 'maintenance' && (
                                    <button
                                        onClick={() => onSystemAction(system.id, 'activate')}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                    >
                                        Activate
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};