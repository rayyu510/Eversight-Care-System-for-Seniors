// src/operations-center/hooks/usePerformanceMetrics.ts
// Fixed hook to include currentMetrics property

import { useState, useEffect } from 'react';
import { metricsService } from '../services/metricsService';
import { PerformanceMetric, SystemMetrics } from '../types/metricsTypes';

interface UsePerformanceMetricsReturn {
    metrics: PerformanceMetric[];
    currentMetrics: SystemMetrics;
    loading: boolean;
    error: any;
    refreshMetrics: () => Promise<void>;
    getMetricHistory: (metricName: string, timeRange: string) => Promise<PerformanceMetric[]>;
}

export const usePerformanceMetrics = (): UsePerformanceMetricsReturn => {
    const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
    const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics>({
        cpu: { usage: 0, cores: 0, load: [0, 0, 0] },
        memory: { used: 0, total: 0, percentage: 0 },
        disk: { used: 0, total: 0, percentage: 0 },
        network: { inbound: 0, outbound: 0 },
        system: { uptime: 0, temperature: 0, health: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError(null);

            const [metricsData, currentData] = await Promise.all([
                metricsService.getPerformanceMetrics(),
                metricsService.getCurrentMetrics()
            ]);

            setMetrics(metricsData);
            setCurrentMetrics(currentData);
        } catch (err) {
            setError(err);
            console.error('Error fetching performance metrics:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshMetrics = async () => {
        await fetchMetrics();
    };

    const getMetricHistory = async (metricName: string, timeRange: string) => {
        try {
            return await metricsService.getMetricHistory(metricName, timeRange);
        } catch (err) {
            console.error('Error fetching metric history:', err);
            return [];
        }
    };

    useEffect(() => {
        fetchMetrics();

        // Set up real-time updates every 30 seconds
        const interval = setInterval(fetchMetrics, 30000);

        return () => clearInterval(interval);
    }, []);

    return {
        metrics,
        currentMetrics,
        loading,
        error,
        refreshMetrics,
        getMetricHistory
    };
};