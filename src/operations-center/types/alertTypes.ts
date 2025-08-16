// src/operations-center/types/alertTypes.ts
export interface SystemAlert {
    id: string;
    type: 'system' | 'security' | 'medical' | 'device' | 'performance';
    severity: 'info' | 'warning' | 'error' | 'critical';
    title: string;
    message: string;
    source: string;
    timestamp: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
    resolved: boolean;
    resolvedBy?: string;
    resolvedAt?: string;
    escalated: boolean;
    escalationLevel: number;
    metadata: Record<string, any>;
}

export interface AlertRule {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    conditions: AlertCondition[];
    actions: AlertAction[];
    escalationRules: EscalationRule[];
    schedule?: AlertSchedule;
    suppressionRules?: SuppressionRule[];
}

export interface AlertCondition {
    id: string;
    metric: string;
    operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte' | 'contains' | 'matches';
    value: number | string;
    duration?: number; // in seconds
    aggregation?: 'avg' | 'max' | 'min' | 'sum' | 'count';
    timeWindow?: number; // in seconds
}

export interface AlertAction {
    id: string;
    type: 'notification' | 'email' | 'sms' | 'webhook' | 'escalate' | 'script';
    target: string;
    delay?: number; // in seconds
    parameters?: Record<string, any>;
    retryPolicy?: RetryPolicy;
}

export interface RetryPolicy {
    maxRetries: number;
    retryInterval: number; // in seconds
    backoffMultiplier: number;
}

export interface EscalationRule {
    id: string;
    level: number;
    delay: number; // in seconds
    conditions: string[]; // condition IDs that must be met
    actions: AlertAction[];
    autoResolve: boolean;
}

export interface AlertSchedule {
    enabled: boolean;
    timeZone: string;
    schedule: {
        [key: string]: { // day of week
            enabled: boolean;
            start: string; // HH:MM format
            end: string; // HH:MM format
        };
    };
}

export interface SuppressionRule {
    id: string;
    name: string;
    enabled: boolean;
    conditions: AlertCondition[];
    duration: number; // in seconds
    reason: string;
}

export interface AlertStats {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    bySource: Record<string, number>;
    acknowledged: number;
    resolved: number;
    escalated: number;
    averageResponseTime: number; // in minutes
    averageResolutionTime: number; // in minutes
    topSources: Array<{ source: string; count: number; }>;
    trend: AlertTrend;
}

export interface AlertTrend {
    period: '1h' | '24h' | '7d' | '30d';
    data: Array<{
        timestamp: string;
        total: number;
        critical: number;
        error: number;
        warning: number;
        info: number;
    }>;
}

export interface AlertTemplate {
    id: string;
    name: string;
    description: string;
    type: string;
    severity: string;
    titleTemplate: string;
    messageTemplate: string;
    defaultActions: AlertAction[];
    variables: AlertVariable[];
}

export interface AlertVariable {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object';
    required: boolean;
    defaultValue?: any;
    description: string;
}

export interface AlertNotification {
    id: string;
    alertId: string;
    type: 'email' | 'sms' | 'push' | 'webhook';
    recipient: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    sentAt?: string;
    deliveredAt?: string;
    errorMessage?: string;
    retryCount: number;
}

export interface AlertComment {
    id: string;
    alertId: string;
    userId: string;
    userName: string;
    comment: string;
    timestamp: string;
    attachments?: string[];
}

export interface AlertWorkflow {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    triggers: WorkflowTrigger[];
    enabled: boolean;
}

export interface WorkflowStep {
    id: string;
    name: string;
    type: 'action' | 'condition' | 'delay' | 'approval';
    configuration: Record<string, any>;
    nextSteps: string[]; // step IDs
    timeout?: number; // in seconds
}

export interface WorkflowTrigger {
    type: 'alert_created' | 'alert_acknowledged' | 'alert_escalated' | 'alert_resolved';
    conditions: AlertCondition[];
}

export interface AlertDashboard {
    id: string;
    name: string;
    description: string;
    widgets: AlertWidget[];
    layout: DashboardLayout;
    refreshInterval: number; // in seconds
    permissions: string[];
}

export interface AlertWidget {
    id: string;
    type: 'count' | 'trend' | 'list' | 'map' | 'chart';
    title: string;
    configuration: Record<string, any>;
    position: { x: number; y: number; width: number; height: number; };
    filters: AlertFilter[];
}

export interface AlertFilter {
    field: string;
    operator: string;
    value: any;
}

export interface DashboardLayout {
    columns: number;
    rows: number;
    cellHeight: number;
    margin: number;
}

export interface AlertMetrics {
    mttr: number; // Mean Time To Resolution in minutes
    mtta: number; // Mean Time To Acknowledgment in minutes
    alertVolume: number; // alerts per hour
    falsePositiveRate: number; // percentage
    escalationRate: number; // percentage
    autoResolvedRate: number; // percentage
    topAlertSources: Array<{ source: string; count: number; percentage: number; }>;
    responseTimeDistribution: Array<{ range: string; count: number; }>;
}

export interface AlertConfiguration {
    globalSettings: {
        defaultSeverity: string;
        autoAcknowledge: boolean;
        autoResolve: boolean;
        maxEscalationLevel: number;
        alertRetention: number; // in days
    };
    notificationSettings: {
        emailEnabled: boolean;
        smsEnabled: boolean;
        pushEnabled: boolean;
        webhookEnabled: boolean;
        defaultRecipients: string[];
    };
    suppressionSettings: {
        enabled: boolean;
        maxSuppressionTime: number; // in hours
        similarAlertThreshold: number;
    };
    escalationSettings: {
        enabled: boolean;
        defaultEscalationDelay: number; // in minutes
        maxEscalationRetries: number;
    };
}