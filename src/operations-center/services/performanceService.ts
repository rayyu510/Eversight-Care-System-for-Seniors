// src/operations-center/services/performanceService.ts
// Fix import errors - use correct type names

import { PerformanceMetric, MetricDataPoint, SystemResourceMetrics } from '../types/metricsTypes';
export class PerformanceService {
    private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/performance/metrics`);
            if (!response.ok) throw new Error('Failed to fetch performance metrics');

            return await response.json();
        } catch (error) {
            console.error('Error fetching performance metrics:', error);
            return this.getMockPerformanceMetrics();
        }
    }

    async getSystemResourceMetrics(): Promise<SystemResourceMetrics> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/performance/resources`);
            if (!response.ok) throw new Error('Failed to fetch system resource metrics');

            return await response.json();
        } catch (error) {
            console.error('Error fetching system resource metrics:', error);
            return this.getMockSystemResourceMetrics();
        }
    }

    async getMetricDataPoints(metricName: string, timeRange: string): Promise<MetricDataPoint[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/performance/data?metric=${metricName}&range=${timeRange}`);
            if (!response.ok) throw new Error('Failed to fetch metric data points');

            return await response.json();
        } catch (error) {
            console.error('Error fetching metric data points:', error);
            return this.getMockMetricDataPoints(metricName);
        }
    }

    private getMockPerformanceMetrics(): PerformanceMetric[] {
        return [
            {
                id: 'cpu_001',
                name: 'CPU Usage',
                value: 45.2,
                unit: '%',
                timestamp: new Date().toISOString(),
                category: 'cpu',
                status: 'good',
                trend: 'stable'
            },
            {
                id: 'memory_001',
                name: 'Memory Usage',
                value: 68.5,
                unit: '%',
                timestamp: new Date().toISOString(),
                category: 'memory',
                status: 'good',
                trend: 'up'
            }
        ];
    }

    private getMockSystemResourceMetrics(): SystemResourceMetrics {
        return {
            cpu: {
                usage: 45.2,
                cores: 8,
                temperature: 42.3
            },
            memory: {
                used: 17179869184, // 16GB
                total: 25769803776, // 24GB
                available: 8589934592 // 8GB
            },
            disk: {
                used: 805306368000, // 750GB
                total: 1099511627776, // 1TB
                readSpeed: 150,
                writeSpeed: 120
            },
            network: {
                inbound: 125000000, // 125 MB/s
                outbound: 89000000, // 89 MB/s
                latency: 15
            }
        };
    }

    private getMockMetricDataPoints(metricName: string): MetricDataPoint[] {
        const now = new Date();
        const points: MetricDataPoint[] = [];

        for (let i = 24; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
            const baseValue = metricName.includes('cpu') ? 45 : 68;
            const variation = (Math.random() - 0.5) * 20;

            points.push({
                timestamp: timestamp.toISOString(),
                value: Math.max(0, baseValue + variation),
                label: metricName
            });
        }

        return points;
    }
}

export const performanceService = new PerformanceService();