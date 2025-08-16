// src/operations-center/types/index.ts
import type {
    PerformanceMetric,
    SystemMetrics,
    MetricHistory,
    PerformanceThreshold,
    CapacityPrediction,
    ResponseTimeMetric
} from './metricsTypes';



// Export all types from individual files with explicit re-exports to resolve naming conflicts
export * from './systemTypes';


// Explicitly re-export from alertTypes, excluding SystemAlert to avoid conflict
export type {
    AlertRule,
    AlertCondition,
    AlertAction,
    RetryPolicy,
    EscalationRule,
    AlertSchedule,
    SuppressionRule,
    AlertStats,
    AlertTrend,
    AlertTemplate,
    AlertVariable,
    AlertNotification,
    AlertComment,
    AlertWorkflow,
    WorkflowStep,
    WorkflowTrigger,
    AlertDashboard,
    AlertWidget,
    AlertFilter,
    DashboardLayout,
    AlertMetrics,
    AlertConfiguration
} from './alertTypes';

// Re-export SystemAlert from alertTypes with a different name to avoid conflict
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
// Operations Center Configuration Interface
export interface OperationsCenterConfig {
    refreshInterval: number;
    alertThresholds: {
        responseTime: number;
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number;
    };
    autoEscalation: {
        enabled: boolean;
        timeThreshold: number;
        escalationLevels: string[];
    };
    notifications: {
        email: boolean;
        sms: boolean;
        slack: boolean;
        inApp: boolean;
    };
}

// Additional Operations Center specific types
export interface OperationsCenterState {
    isConnected: boolean;
    lastUpdate: string;
    activeAlerts: number;
    systemHealth: number;
    emergencyMode: boolean;
}

export interface OperationsCenterPermissions {
    canViewMetrics: boolean;
    canManageAlerts: boolean;
    canControlSystems: boolean;
    canActivateEmergency: boolean;
    canConfigureSettings: boolean;
}

export interface OperationsCenterUser {
    id: string;
    name: string;
    role: 'operator' | 'manager' | 'admin' | 'emergency';
    permissions: OperationsCenterPermissions;
    lastLogin: string;
    isActive: boolean;
}

// Default configuration
export const DEFAULT_OPERATIONS_CONFIG: OperationsCenterConfig = {
    refreshInterval: 30000, // 30 seconds
    alertThresholds: {
        responseTime: 2000, // 2 seconds
        cpuUsage: 80, // 80%
        memoryUsage: 85, // 85%
        diskUsage: 90 // 90%
    },
    autoEscalation: {
        enabled: true,
        timeThreshold: 900000, // 15 minutes
        escalationLevels: ['team-lead', 'manager', 'director']
    },
    notifications: {
        email: true,
        sms: true,
        slack: true,
        inApp: true
    }
};

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

export interface PerformanceMetrics {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
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