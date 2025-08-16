// src/operations-center/services/metricsService.ts
// Metrics service for operations center performance monitoring

import { PerformanceMetric, SystemMetrics, MetricHistory, CapacityPrediction, ResponseTimeMetric } from '../types/metricsTypes';

export class MetricsService {
    private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/metrics/performance`);
            if (!response.ok) throw new Error('Failed to fetch performance metrics');

            return await response.json();
        } catch (error) {
            console.error('Error fetching performance metrics:', error);
            return this.getMockPerformanceMetrics();
        }
    }

    async getCurrentMetrics(): Promise<SystemMetrics> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/metrics/current`);
            if (!response.ok) throw new Error('Failed to fetch current metrics');

            return await response.json();
        } catch (error) {
            console.error('Error fetching current metrics:', error);
            return this.getMockCurrentMetrics();
        }
    }

    async getMetricHistory(metricName: string, timeRange: string): Promise<PerformanceMetric[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/metrics/history?metric=${metricName}&range=${timeRange}`);
            if (!response.ok) throw new Error('Failed to fetch metric history');

            return await response.json();
        } catch (error) {
            console.error('Error fetching metric history:', error);
            return this.getMockMetricHistory(metricName, timeRange);
        }
    }

    async getSystemHealth(): Promise<{ score: number; status: string; issues: string[] }> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/metrics/health`);
            if (!response.ok) throw new Error('Failed to fetch system health');

            return await response.json();
        } catch (error) {
            console.error('Error fetching system health:', error);
            return {
                score: 97,
                status: 'healthy',
                issues: ['Camera offline: CAM-23', 'High disk usage: Storage-01']
            };
        }
    }

    async getCapacityPredictions(): Promise<CapacityPrediction[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/metrics/capacity`);
            if (!response.ok) throw new Error('Failed to fetch capacity predictions');

            return await response.json();
        } catch (error) {
            console.error('Error fetching capacity predictions:', error);
            return this.getMockCapacityPredictions();
        }
    }

    async getResponseTimeMetrics(): Promise<ResponseTimeMetric[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/metrics/response-times`);
            if (!response.ok) throw new Error('Failed to fetch response time metrics');

            return await response.json();
        } catch (error) {
            console.error('Error fetching response time metrics:', error);
            return this.getMockResponseTimeMetrics();
        }
    }

    async recordMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/operations/metrics/record`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...metric,
                    timestamp: new Date().toISOString()
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Error recording metric:', error);
            return false;
        }
    }

    // Mock data methods for development
    private getMockPerformanceMetrics(): PerformanceMetric[] {
        return [
            {
                id: 'cpu_usage_001',
                name: 'CPU Usage',
                value: 45.2,
                unit: '%',
                timestamp: new Date().toISOString(),
                category: 'cpu',
                status: 'good',
                trend: 'stable',
                target: 80,
                threshold: { warning: 70, critical: 85 }
            },
            {
                id: 'memory_usage_001',
                name: 'Memory Usage',
                value: 68.5,
                unit: '%',
                timestamp: new Date().toISOString(),
                category: 'memory',
                status: 'good',
                trend: 'up',
                target: 80,
                threshold: { warning: 75, critical: 90 }
            },
            {
                id: 'disk_usage_001',
                name: 'Disk Usage',
                value: 73.8,
                unit: '%',
                timestamp: new Date().toISOString(),
                category: 'disk',
                status: 'warning',
                trend: 'up',
                target: 80,
                threshold: { warning: 70, critical: 85 }
            },
            {
                id: 'network_throughput_001',
                name: 'Network Throughput',
                value: 245.6,
                unit: 'Mbps',
                timestamp: new Date().toISOString(),
                category: 'network',
                status: 'good',
                trend: 'stable',
                target: 1000,
                threshold: { warning: 800, critical: 950 }
            },
            {
                id: 'system_temperature_001',
                name: 'System Temperature',
                value: 42.3,
                unit: '°C',
                timestamp: new Date().toISOString(),
                category: 'system',
                status: 'good',
                trend: 'stable',
                target: 65,
                threshold: { warning: 60, critical: 70 }
            }
        ];
    }

    private getMockCurrentMetrics(): SystemMetrics {
        return {
            cpu: {
                usage: 45.2,
                cores: 8,
                load: [1.2, 1.5, 1.8]
            },
            memory: {
                used: 17179869184, // 16GB
                total: 25769803776, // 24GB
                percentage: 68.5
            },
            disk: {
                used: 805306368000, // 750GB
                total: 1099511627776, // 1TB
                percentage: 73.8
            },
            network: {
                inbound: 125000000, // 125 MB/s
                outbound: 89000000   // 89 MB/s
            },
            system: {
                uptime: 2592000, // 30 days in seconds
                temperature: 42.3,
                health: 97
            }
        };
    }

    private getMockMetricHistory(metricName: string, timeRange: string): PerformanceMetric[] {
        const now = new Date();
        const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 1;
        const interval = timeRange === '24h' ? 1 : timeRange === '7d' ? 6 : 0.25; // hours

        const history: PerformanceMetric[] = [];

        for (let i = hours; i >= 0; i -= interval) {
            const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
            const baseValue = metricName.includes('cpu') ? 45 :
                metricName.includes('memory') ? 68 :
                    metricName.includes('disk') ? 74 : 245;

            const variation = (Math.random() - 0.5) * 20; // ±10 variation
            const value = Math.max(0, baseValue + variation);

            history.push({
                id: `${metricName}_${i}`,
                name: metricName,
                value: Math.round(value * 10) / 10,
                unit: metricName.includes('network') ? 'Mbps' : '%',
                timestamp: timestamp.toISOString(),
                category: metricName.includes('cpu') ? 'cpu' :
                    metricName.includes('memory') ? 'memory' :
                        metricName.includes('disk') ? 'disk' : 'network',
                status: value < 70 ? 'good' : value < 85 ? 'warning' : 'critical',
                trend: 'stable'
            });
        }

        return history;
    }

    private getMockCapacityPredictions(): CapacityPrediction[] {
        return [
            {
                metric: 'disk_usage',
                current: 73.8,
                predicted: 85.0,
                timeToCapacity: 45, // days
                confidence: 87.5,
                trend: 'increasing'
            },
            {
                metric: 'memory_usage',
                current: 68.5,
                predicted: 79.2,
                timeToCapacity: 120, // days
                confidence: 92.1,
                trend: 'increasing'
            },
            {
                metric: 'network_capacity',
                current: 245.6,
                predicted: 289.4,
                timeToCapacity: 180, // days
                confidence: 78.3,
                trend: 'increasing'
            }
        ];
    }

    private getMockResponseTimeMetrics(): ResponseTimeMetric[] {
        return [
            {
                endpoint: '/api/surveillance/cameras',
                averageTime: 234,
                minTime: 89,
                maxTime: 1205,
                requestCount: 15420,
                errorRate: 0.8,
                timestamp: new Date().toISOString()
            },
            {
                endpoint: '/api/guardian/devices',
                averageTime: 156,
                minTime: 67,
                maxTime: 892,
                requestCount: 8745,
                errorRate: 0.3,
                timestamp: new Date().toISOString()
            },
            {
                endpoint: '/api/operations/alerts',
                averageTime: 89,
                minTime: 34,
                maxTime: 456,
                requestCount: 12389,
                errorRate: 0.1,
                timestamp: new Date().toISOString()
            },
            {
                endpoint: '/api/analytics/predictions',
                averageTime: 1245,
                minTime: 567,
                maxTime: 3421,
                requestCount: 2134,
                errorRate: 2.1,
                timestamp: new Date().toISOString()
            }
        ];
    }
}

export const metricsService = new MetricsService();