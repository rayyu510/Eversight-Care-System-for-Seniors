// src/operations-center/types/systemTypes.ts
export interface SystemStatus {
    id: string;
    name: string;
    status: 'operational' | 'maintenance' | 'error' | 'offline';
    uptime: string;
    lastUpdate: Date;
    version: string;
    healthScore: number;
}

export interface SystemMetrics {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    activeConnections: number;
    requestsPerMinute: number;
}

export interface ModuleHealth {
    moduleId: string;
    moduleName: string;
    status: 'healthy' | 'warning' | 'critical' | 'offline';
    uptime: string;
    lastHealthCheck: Date;
    errorCount: number;
    performanceScore: number;
}

// src/operations-center/types/alertTypes.ts
export interface SystemAlert {
    id: string;
    type: 'system' | 'security' | 'performance' | 'maintenance';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    source: string;
    timestamp: Date;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    resolved: boolean;
    resolvedBy?: string;
    resolvedAt?: Date;
    escalated: boolean;
    escalationLevel: number;
    affectedSystems: string[];
}

export interface AlertSummary {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    unacknowledged: number;
    resolved: number;
}