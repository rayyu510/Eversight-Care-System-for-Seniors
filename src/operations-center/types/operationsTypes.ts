export interface SystemStatus {
    overall: 'healthy' | 'warning' | 'critical';
    timestamp: Date;
    modules: ModuleHealth[];
    performance: PerformanceMetrics;
    uptime: number;
    version: string;
}

export interface ModuleHealth {
    id: string;
    name: string;
    status: 'healthy' | 'warning' | 'critical' | 'offline';
    uptime: number;
    lastCheck: Date;
    metrics: {
        cpu: number;
        memory: number;
        responseTime: number;
    };
}

export interface PerformanceMetrics {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    responseTime: number;
    throughput: number;
}

export interface SystemAlert {
    id: string;
    type: 'system' | 'security' | 'performance' | 'health';
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'performance' | 'security' | 'maintenance' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    source: string;
    acknowledged: boolean;
    resolvedAt?: Date;
    resolvedBy?: string;
}

export interface EmergencyProtocol {
    id: string;
    name: string;
    type: 'fire' | 'medical' | 'security' | 'evacuation';
    status: 'inactive' | 'active' | 'testing';
    activatedAt?: Date;
    activatedBy?: string;
    steps: ProtocolStep[];
}

export interface ProtocolStep {
    id: string;
    order: number;
    description: string;
    completed: boolean;
    completedAt?: Date;
    assignedTo?: string;
}

export interface SystemConfiguration {
    alertThresholds: {
        cpu: number;
        memory: number;
        disk: number;
        responseTime: number;
    };
    emergencyContacts: EmergencyContact[];
    maintenanceWindows: MaintenanceWindow[];
}

export interface EmergencyContact {
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    priority: number;
}

export interface MaintenanceWindow {
    id: string;
    name: string;
    startTime: Date;
    endTime: Date;
    modules: string[];
    description: string;
}

export interface ModuleIntegrationStatus {
    moduleId: string;
    connected: boolean;
    lastHeartbeat: Date;
    version: string;
    dataQuality: 'good' | 'degraded' | 'poor';
}

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertCategory = 'performance' | 'security' | 'maintenance' | 'error';