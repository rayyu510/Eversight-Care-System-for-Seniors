// src/surveillance-center/components/Dashboard/SecurityMetrics.tsx
import React from 'react';
import { useSecurityMetrics } from '../../hooks';

export const SecurityMetrics: React.FC = () => {
    const { metrics, loading } = useSecurityMetrics();

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Security Metrics</h3>
                <p className="text-sm text-gray-600">Security system performance metrics</p>
            </div>

            <div className="p-6">
                {metrics ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{metrics.totalEvents}</div>
                            <div className="text-sm text-blue-800">Total Events</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{metrics.resolvedEvents}</div>
                            <div className="text-sm text-green-800">Resolved Events</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{metrics.activeUsers}</div>
                            <div className="text-sm text-yellow-800">Active Users</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{metrics.complianceScore}%</div>
                            <div className="text-sm text-purple-800">Compliance Score</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <div className="text-4xl mb-4">🔒</div>
                        <div className="text-lg font-medium">Security Metrics</div>
                        <div className="text-sm">Loading security data...</div>
                    </div>
                )}
            </div>
        </div>
    );
};