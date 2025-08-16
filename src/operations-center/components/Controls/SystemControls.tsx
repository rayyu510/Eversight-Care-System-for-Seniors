// src/operations-center/components/Controls/SystemControls.tsx
import React, { useState } from 'react';
import { Power, RefreshCw, Settings, Pause, Play, RotateCcw } from 'lucide-react';
import { SystemStatus } from '../../types';

interface SystemControlsProps {
    systems: SystemStatus[];
    onSystemAction: (systemId: string, action: string) => Promise<boolean>;
    loading?: boolean;
}

export const SystemControls: React.FC<SystemControlsProps> = ({
    systems,
    onSystemAction,
    loading = false
}) => {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleSystemAction = async (systemId: string, action: string) => {
        const actionKey = `${systemId}-${action}`;
        setActionLoading(actionKey);
        try {
            await onSystemAction(systemId, action);
        } finally {
            setActionLoading(null);
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'restart':
                return <RefreshCw className="h-4 w-4" />;
            case 'pause':
                return <Pause className="h-4 w-4" />;
            case 'resume':
                return <Play className="h-4 w-4" />;
            case 'reset':
                return <RotateCcw className="h-4 w-4" />;
            case 'shutdown':
                return <Power className="h-4 w-4" />;
            default:
                return <Settings className="h-4 w-4" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'restart':
                return 'bg-blue-600 hover:bg-blue-700';
            case 'pause':
                return 'bg-yellow-600 hover:bg-yellow-700';
            case 'resume':
                return 'bg-green-600 hover:bg-green-700';
            case 'reset':
                return 'bg-purple-600 hover:bg-purple-700';
            case 'shutdown':
                return 'bg-red-600 hover:bg-red-700';
            default:
                return 'bg-gray-600 hover:bg-gray-700';
        }
    };

    const getAvailableActions = (system: SystemStatus) => {
        switch (system.status) {
            case 'operational':
                return ['pause', 'restart', 'shutdown'];
            case 'maintenance':
                return ['resume', 'restart'];
            case 'error':
                return ['restart', 'reset'];
            case 'offline':
                return ['restart'];
            default:
                return ['restart'];
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">System Controls</h3>

            <div className="space-y-4">
                {systems.map(system => (
                    <div key={system.id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${system.status === 'operational' ? 'bg-green-500' :
                                    system.status === 'maintenance' ? 'bg-yellow-500' :
                                        system.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                                    }`}></div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{system.name}</h4>
                                    <p className="text-sm text-gray-600">
                                        {system.status} • Health: {system.healthScore}% • v{system.version}
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                {getAvailableActions(system).map(action => (
                                    <button
                                        key={action}
                                        onClick={() => handleSystemAction(system.id, action)}
                                        disabled={loading || actionLoading === `${system.id}-${action}`}
                                        className={`flex items-center space-x-1 px-3 py-1 rounded text-sm text-white transition-colors ${getActionColor(action)} ${actionLoading === `${system.id}-${action}` ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {actionLoading === `${system.id}-${action}` ? (
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                        ) : (
                                            getActionIcon(action)
                                        )}
                                        <span className="capitalize">{action}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Uptime:</span>
                                <div>{system.uptime}</div>
                            </div>
                            <div>
                                <span className="font-medium">Last Update:</span>
                                <div>{system.lastUpdate.toLocaleTimeString()}</div>
                            </div>
                            <div>
                                <span className="font-medium">Health Score:</span>
                                <div>{system.healthScore}%</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};