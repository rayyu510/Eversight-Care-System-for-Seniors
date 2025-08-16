// src/operations-center/components/Dashboard/PerformanceMetrics.tsx
// MINIMAL FIXES - Preserve exact structure, only fix the property access issues

import React from 'react';
import { usePerformanceMetrics } from '../../hooks';
import { PerformanceMetric } from '../../types/metricsTypes';

interface PerformanceMetricsProps {
    className?: string;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ className = '' }) => {
    // FIX 1: Get both metrics and currentMetrics from the hook
    const { metrics, loading, error } = usePerformanceMetrics();
    if (loading) {
        return (
            <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
                <div className="text-red-600">
                    <h3 className="text-lg font-medium mb-2">Performance Metrics Error</h3>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // FIX 2: Use the metrics array instead of trying to access nested properties
    if (!metrics || metrics.length === 0) {
        return (
            <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                <p className="text-gray-500">No metrics data available</p>
            </div>
        );
    }

    // FIX 3: Fix the getStatusColor function to handle threshold objects properly
    const getStatusColor = (metric: PerformanceMetric) => {
        if (!metric.threshold) return 'bg-green-500';

        const criticalThreshold = typeof metric.threshold === 'object'
            ? metric.threshold.critical
            : Number(metric.threshold);
        const warningThreshold = typeof metric.threshold === 'object'
            ? metric.threshold.warning
            : Number(metric.threshold) * 0.8;

        if (metric.value > criticalThreshold) return 'bg-red-500';
        if (metric.value > warningThreshold) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStatusTextColor = (metric: PerformanceMetric) => {
        if (!metric.threshold) return 'text-green-600';

        const criticalThreshold = typeof metric.threshold === 'object'
            ? metric.threshold.critical
            : Number(metric.threshold);
        const warningThreshold = typeof metric.threshold === 'object'
            ? metric.threshold.warning
            : Number(metric.threshold) * 0.8;

        if (metric.value > criticalThreshold) return 'text-red-600';
        if (metric.value > warningThreshold) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getTrendIcon = (metric: PerformanceMetric): string => {
        // FIX 4: Handle threshold object properly
        const thresholdValue = typeof metric.threshold === 'object'
            ? metric.threshold.critical
            : (metric.threshold || 50);

        if (metric.value > thresholdValue) {
            return '📈'; // High usage
        } else if (metric.value < thresholdValue * 0.5) {
            return '📉'; // Low usage
        }
        return '➡️'; // Stable
    };

    const getProgressBarWidth = (metric: PerformanceMetric): number => {
        // FIX 5: Handle threshold object properly
        const thresholdValue = typeof metric.threshold === 'object'
            ? metric.threshold.critical
            : metric.threshold;

        if (thresholdValue) {
            return Math.min(100, (metric.value / thresholdValue) * 100);
        }
        return metric.value; // Assume value is already a percentage
    };

    return (
        <div className={`bg-white rounded-lg shadow ${className}`}>
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Performance Metrics</h3>

                <div className="space-y-6">
                    {metrics.map((metric) => (
                        <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(metric)}`} />
                                    <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
                                    <span className="text-gray-500 text-xs">
                                        {getTrendIcon(metric)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-semibold text-gray-900">
                                        {metric.value.toFixed(1)}{metric.unit}
                                    </span>
                                    {metric.threshold && (
                                        <div className="text-xs text-gray-500">
                                            Threshold: {typeof metric.threshold === 'object' ? metric.threshold.critical : metric.threshold}{metric.unit}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(metric)}`}
                                    style={{ width: `${getProgressBarWidth(metric)}%` }}
                                />
                            </div>

                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                                <span>0{metric.unit}</span>
                                <span>{typeof metric.threshold === 'object' ? metric.threshold.critical : (metric.threshold || 100)}{metric.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-sm font-medium text-gray-500">Critical</div>
                            <div className="text-lg font-semibold text-red-600">
                                {metrics.filter(m => m.status === 'critical').length}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium text-gray-500">Warning</div>
                            <div className="text-lg font-semibold text-yellow-600">
                                {metrics.filter(m => m.status === 'warning').length}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium text-gray-500">Good</div>
                            <div className="text-lg font-semibold text-green-600">
                                {metrics.filter(m => m.status === 'good').length}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium text-gray-500">Avg Load</div>
                            <div className="text-lg font-semibold text-gray-900">
                                {(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};