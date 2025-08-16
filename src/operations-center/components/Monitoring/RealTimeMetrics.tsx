// src/operations-center/components/Monitoring/RealTimeMetrics.tsx
import React, { useState, useEffect } from 'react';
import { Activity, Cpu, MemoryStick, HardDrive, Network, Clock } from 'lucide-react';
import { SystemMetrics } from '../../types';

interface RealTimeMetricsProps {
    metrics: SystemMetrics | null;
    refreshInterval?: number;
    loading?: boolean;
}

export const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({
    metrics,
    refreshInterval = 5000,
    loading = false
}) => {
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date());
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    const getUsageColor = (usage: number, type: 'cpu' | 'memory' | 'disk') => {
        const thresholds = {
            cpu: { warning: 70, critical: 90 },
            memory: { warning: 80, critical: 95 },
            disk: { warning: 85, critical: 95 }
        };

        const threshold = thresholds[type];
        if (usage >= threshold.critical) return 'text-red-600 bg-red-500';
        if (usage >= threshold.warning) return 'text-yellow-600 bg-yellow-500';
        return 'text-green-600 bg-green-500';
    };

    if (loading || !metrics) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Real-Time Metrics</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* CPU Usage */}
                <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Cpu className="h-5 w-5 text-blue-600" />
                        <span className="text-xs text-gray-500">CPU</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.cpuUsage}%</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${getUsageColor(metrics.cpuUsage, 'cpu').split(' ')[1]}`}
                            style={{ width: `${metrics.cpuUsage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Memory Usage */}
                <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <MemoryStick className="h-5 w-5 text-green-600" />
                        <span className="text-xs text-gray-500">Memory</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.memoryUsage}%</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${getUsageColor(metrics.memoryUsage, 'memory').split(' ')[1]}`}
                            style={{ width: `${metrics.memoryUsage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Disk Usage */}
                <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <HardDrive className="h-5 w-5 text-purple-600" />
                        <span className="text-xs text-gray-500">Disk</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.diskUsage}%</div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${getUsageColor(metrics.diskUsage, 'disk').split(' ')[1]}`}
                            style={{ width: `${metrics.diskUsage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Network Latency */}
                <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Network className="h-5 w-5 text-orange-600" />
                        <span className="text-xs text-gray-500">Network</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.networkLatency}ms</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {metrics.networkLatency < 50 ? 'Excellent' :
                            metrics.networkLatency < 100 ? 'Good' :
                                metrics.networkLatency < 200 ? 'Fair' : 'Poor'}
                    </div>
                </div>

                {/* Active Connections */}
                <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Activity className="h-5 w-5 text-indigo-600" />
                        <span className="text-xs text-gray-500">Connections</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.activeConnections}</div>
                    <div className="text-xs text-gray-500 mt-1">Active users</div>
                </div>

                {/* Requests per Minute */}
                <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Activity className="h-5 w-5 text-red-600" />
                        <span className="text-xs text-gray-500">Requests</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics.requestsPerMinute}</div>
                    <div className="text-xs text-gray-500 mt-1">per minute</div>
                </div>
            </div>
        </div>
    );
};