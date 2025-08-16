// src/operations-center/components/Dashboard/SystemOverview.tsx
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { SystemStatus, ModuleHealth } from '../../types';

interface SystemOverviewProps {
    systems: SystemStatus[];
    moduleHealth: ModuleHealth[];
    loading?: boolean;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({
    systems,
    moduleHealth,
    loading = false
}) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'operational':
            case 'healthy':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'maintenance':
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'error':
            case 'critical':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
            case 'healthy':
                return 'border-green-200 bg-green-50';
            case 'maintenance':
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'error':
            case 'critical':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">System Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systems.map(system => (
                    <div key={system.id} className={`border rounded-lg p-4 ${getStatusColor(system.status)}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(system.status)}
                                <h4 className="font-medium text-gray-900">{system.name}</h4>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-white rounded-full">
                                v{system.version}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Uptime:</span>
                                <span className="font-medium">{system.uptime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Health Score:</span>
                                <span className="font-medium">{system.healthScore}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Last Update:</span>
                                <span className="font-medium">{system.lastUpdate.toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};