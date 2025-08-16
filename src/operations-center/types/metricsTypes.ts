// src/operations-center/types/metricsTypes.ts
// Complete metrics types for operations center

export interface PerformanceMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    timestamp: string;
    category: 'cpu' | 'memory' | 'disk' | 'network' | 'system';
    status: 'good' | 'warning' | 'critical';
    trend: 'up' | 'down' | 'stable';
    target?: number;
    threshold?: {
        warning: number;
        critical: number;
    };
}

export interface SystemMetrics {
    cpu: {
        usage: number; // percentage
        cores: number;
        load: [number, number, number]; // 1, 5, 15 minute load averages
    };
    memory: {
        used: number; // bytes
        total: number; // bytes
        percentage: number;
    };
    disk: {
        used: number; // bytes
        total: number; // bytes
        percentage: number;
    };
    network: {
        inbound: number; // bytes/sec
        outbound: number; // bytes/sec
    };
    system: {
        uptime: number; // seconds
        temperature: number; // celsius
        health: number; // percentage
    };
}

export interface MetricHistory {
    metric: string;
    timeRange: string;
    data: {
        timestamp: string;
        value: number;
    }[];
    aggregation: 'avg' | 'min' | 'max' | 'sum';
}

export interface PerformanceThreshold {
    metricName: string;
    warningLevel: number;
    criticalLevel: number;
    unit: string;
    enabled: boolean;
}

export interface SystemAlert {
    id: string;
    type: 'performance' | 'system' | 'security' | 'application';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    metric?: string;
    value?: number;
    threshold?: number;
    timestamp: string;
    status: 'active' | 'acknowledged' | 'resolved';
    source: string;
    actions?: string[];
}

export interface CapacityPrediction {
    metric: string;
    current: number;
    predicted: number;
    timeToCapacity: number; // days
    confidence: number; // percentage
    trend: 'increasing' | 'decreasing' | 'stable';
}

export interface ResponseTimeMetric {
    endpoint: string;
    averageTime: number;
    minTime: number;
    maxTime: number;
    requestCount: number;
    errorRate: number;
    timestamp: string;
}

export interface MetricDataPoint {
    timestamp: string;
    value: number;
    label?: string;
}

export interface SystemResourceMetrics {
    cpu: {
        usage: number;
        cores: number;
        temperature?: number;
    };
    memory: {
        used: number;
        total: number;
        available: number;
    };
    disk: {
        used: number;
        total: number;
        readSpeed: number;
        writeSpeed: number;
    };
    network: {
        inbound: number;
        outbound: number;
        latency: number;
    };
}

// ALSO ADD THE MISSING PERFORMANCEMETRICS TYPE:

export interface PerformanceMetrics {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    timestamp: string;
}