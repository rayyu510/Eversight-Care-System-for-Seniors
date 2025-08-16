// src/operations-center/components/Monitoring/ModuleHealthIndicators.tsx
import React from 'react';
import { Shield, Brain, Users, Pill, Monitor, Eye } from 'lucide-react';
import { ModuleHealth } from '../../types';

interface ModuleHealthIndicatorsProps {
    moduleHealth: ModuleHealth[];
    loading?: boolean;
}

export const ModuleHealthIndicators: React.FC<ModuleHealthIndicatorsProps> = ({
    moduleHealth,
    loading = false
}) => {
    const getModuleIcon = (moduleId: string) => {
        switch (moduleId) {
            case 'guardian-protect':
                return <Shield className="h-6 w-6 text-red-600" />;
            case 'guardian-insight':
                return <Brain className="h-6 w-6 text-indigo-600" />;
            case 'guardian-carepro':
                return <Users className="h-6 w-6 text-green-600" />;
            case 'guardian-caretrack':
                return <Pill className="h-6 w-6 text-orange-600" />;
            case 'operations-center':
                return <Monitor className="h-6 w-6 text-blue-600" />;
            case 'surveillance-center':
                return <Eye className="h-6 w-6 text-purple-600" />;
            default:
                return <Monitor className="h-6 w-6 text-gray-600" />;
        }
    };

    const getHealthColor = (status: string, score: number) => {
        if (status === 'critical' || score < 50) return 'text-red-600 bg-red-100';
        if (status === 'warning' || score < 80) return 'text-yellow-600 bg-yellow-100';
        if (status === 'healthy' || score >= 80) return 'text-green-600 bg-green-100';
        return 'text-gray-600 bg-gray-100';
    };

    const getHealthBarColor = (score: number) => {
        if (score < 50) return 'bg-red-500';
        if (score < 80) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    if (loading) {
        return (
            <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Module Health Indicators</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {moduleHealth.map(module => (
                    <div key={module.moduleId} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            {getModuleIcon(module.moduleId)}
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm">{module.moduleName}</h4>
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(module.status, module.performanceScore)}`}>
                                    {module.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Performance</span>
                                <span className="font-medium">{module.performanceScore}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${getHealthBarColor(module.performanceScore)}`}
                                    style={{ width: `${module.performanceScore}%` }}
                                ></div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-3">
                                <div>
                                    <span>Uptime:</span>
                                    <div className="font-medium text-gray-700">{module.uptime}</div>
                                </div>
                                <div>
                                    <span>Errors:</span>
                                    <div className="font-medium text-gray-700">{module.errorCount}</div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500">
                                Last check: {module.lastHealthCheck.toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
