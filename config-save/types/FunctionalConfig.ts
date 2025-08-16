// config/types/FunctionalConfig.ts

// Guardian Protect Configuration
export interface DeviceManagementConfig {
    maxDevicesPerFacility: number;
    autoDiscovery: boolean;
    heartbeatInterval: number; // seconds
    offlineThreshold: number; // seconds
    batteryAlertThreshold: number; // percentage
    firmwareUpdatePolicy: 'automatic' | 'manual' | 'scheduled';
    deviceTypes: Array<'camera' | 'sensor' | 'wearable' | 'beacon' | 'call_button'>;
}

export interface AlertManagementConfig {
    retentionPeriod: number; // days
    escalationRules: Array<{
        severity: 'low' | 'medium' | 'high' | 'critical';
        escalateAfter: number; // minutes
        notifyRoles: string[];
        actions?: string[];
    }>;
    acknowledgmentTimeout: number; // minutes
    autoResolution?: {
        enabled: boolean;
        timeout: number; // minutes
        conditions: string[];
    };
    deduplication?: {
        enabled: boolean;
        windowMinutes: number;
        criteria: Array<'device' | 'location' | 'type'>;
    };
}

export interface MonitoringConfig {
    realTimeUpdates: boolean;
    updateInterval: number; // seconds
    dataRetention: number; // days
    metricsCollection: boolean;
    dashboardRefresh: number; // seconds
    historicalData?: {
        enabled: boolean;
        aggregationLevels: Array<'minute' | 'hour' | 'day' | 'week'>;
        retention: {
            raw: number; // days
            hourly: number; // days
            daily: number; // days
        };
    };
}

export interface NotificationConfig {
    email: boolean;
    sms: boolean;
    push: boolean;
    sound: boolean;
    desktop: boolean;
    webhook?: {
        enabled: boolean;
        endpoints: Array<{
            url: string;
            events: string[];
            authentication?: any;
        }>;
    };
    customChannels?: Array<{
        name: string;
        type: string;
        config: any;
    }>;
}

export interface GuardianProtectConfig {
    devices: DeviceManagementConfig;
    alerts: AlertManagementConfig;
    monitoring: MonitoringConfig;
    notifications: NotificationConfig;

    // Advanced features
    ai?: {
        enabled: boolean;
        falseAlarmReduction: boolean;
        predictiveAnalytics: boolean;
        behaviorLearning: boolean;
    };

    integration?: {
        nursecallSystems: Array<{
            type: string;
            endpoint: string;
            authentication: any;
        }>;
        securitySystems: Array<{
            type: string;
            endpoint: string;
            authentication: any;
        }>;
    };
}

// Guardian Insight Configuration
export interface AnalyticsConfig {
    realTimeProcessing: boolean;
    batchSize: number;
    processingInterval: number; // minutes
    dataAggregation: Array<'hourly' | 'daily' | 'weekly' | 'monthly'>;

    // Advanced analytics
    machineLearning?: {
        enabled: boolean;
        models: Array<'predictive' | 'classification' | 'clustering' | 'anomaly_detection'>;
        trainingSchedule: string; // cron format
        dataRequirements: {
            minimumRecords: number;
            timespan: number; // days
        };
    };
}

export interface ReportConfig {
    autoGeneration: boolean;
    schedule: {
        daily: boolean;
        weekly: boolean;
        monthly: boolean;
        quarterly: boolean;
        custom?: string; // cron format
    };
    deliveryMethods: Array<'email' | 'dashboard' | 'export' | 'api'>;
    retention: number; // days

    templates: Array<{
        name: string;
        type: 'operational' | 'compliance' | 'executive' | 'custom';
        format: 'pdf' | 'excel' | 'html' | 'json';
        sections: string[];
    }>;
}

export interface KPIConfig {
    refreshInterval: number; // minutes
    alertThresholds: {
        [key: string]: {
            warning: number;
            critical: number;
            unit?: string;
        };
    };

    customKPIs?: Array<{
        name: string;
        formula: string;
        description: string;
        category: string;
    }>;
}

export interface VisualizationConfig {
    chartTypes: Array<'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge' | 'table'>;
    interactivity: boolean;
    exportFormats: Array<'png' | 'pdf' | 'svg' | 'csv'>;

    dashboards: Array<{
        name: string;
        layout: string;
        widgets: Array<{
            type: string;
            config: any;
        }>;
        permissions: string[];
    }>;
}

export interface GuardianInsightConfig {
    analytics: AnalyticsConfig;
    reports: ReportConfig;
    kpis: KPIConfig;
    visualization: VisualizationConfig;
}

// Guardian CarePro Configuration
export interface StaffManagementConfig {
    maxStaffPerFacility: number;
    roleHierarchy: Array<{
        role: string;
        level: number;
        permissions: string[];
        canDelegate?: boolean;
    }>;
    shiftPatterns: Array<{
        name: string;
        startTime: string;
        endTime: string;
        duration: number; // hours
        breakTimes?: Array<{
            start: string;
            duration: number; // minutes
        }>;
    }>;

    qualifications?: {
        required: Array<{
            role: string;
            certifications: string[];
            training: string[];
        }>;
        tracking: boolean;
        expirationAlerts: boolean;
    };
}

export interface ResidentManagementConfig {
    maxResidentsPerFacility: number;
    careLevel: Array<{
        level: string;
        staffRatio: string; // e.g., "1:4"
        requirements: string[];
        billingCode?: string;
    }>;
    assessmentSchedule: {
        initial: number; // days
        ongoing: number; // days
        comprehensive: number; // days
    };

    carePlans?: {
        templates: Array<{
            name: string;
            careLevel: string;
            activities: string[];
        }>;
        customization: boolean;
        approvalWorkflow: boolean;
    };
}

export interface SchedulingConfig {
    advanceBooking: number; // days
    minStaffingLevels: {
        [shift: string]: number;
    };
    overtimeRules: {
        dailyThreshold: number; // hours
        weeklyThreshold: number; // hours
        approval: boolean;
        rateMultiplier?: number;
    };

    constraints?: {
        maxConsecutiveShifts: number;
        minRestBetweenShifts: number; // hours
        preferredDaysOff: boolean;
        skillMatching: boolean;
    };
}

export interface GuardianCareProConfig {
    staffManagement: StaffManagementConfig;
    residents: ResidentManagementConfig;
    scheduling: SchedulingConfig;

    // Communication features
    communication?: {
        messaging: boolean;
        videoConferencing: boolean;
        familyPortal: boolean;
        notifications: {
            staffUpdates: boolean;
            familyUpdates: boolean;
            emergencyAlerts: boolean;
        };
    };
}

// Guardian CareTrack Configuration
export interface HealthMonitoringConfig {
    vitalSigns: {
        enabled: boolean;
        frequency: number; // minutes
        alertThresholds: {
            [vital: string]: {
                min: number;
                max: number;
                unit?: string;
            };
        };
        devices: Array<{
            type: string;
            model: string;
            integration: string;
        }>;
    };

    medications: {
        enabled: boolean;
        reminderSystem: boolean;
        adherenceTracking: boolean;
        pharmacyIntegration: boolean;

        safety?: {
            drugInteractionChecking: boolean;
            allergyWarnings: boolean;
            dosageValidation: boolean;
        };
    };
}

export interface ActivityTrackingConfig {
    enabled: boolean;
    types: Array<'exercise' | 'therapy' | 'social' | 'personal' | 'cognitive'>;
    goals: {
        daily: boolean;
        weekly: boolean;
        monthly: boolean;
        personalized: boolean;
    };

    sensors?: {
        wearables: boolean;
        environmental: boolean;
        location: boolean;
    };
}

export interface WellnessConfig {
    dashboardEnabled: boolean;
    metricsCollection: Array<'physical' | 'mental' | 'social' | 'cognitive'>;
    reportGeneration: boolean;

    assessments?: {
        standardized: Array<{
            name: string;
            frequency: string;
            scoring: string;
        }>;
        custom: boolean;
        reminders: boolean;
    };
}

export interface GuardianCareTrackConfig {
    healthMonitoring: HealthMonitoringConfig;
    activityTracking: ActivityTrackingConfig;
    wellness: WellnessConfig;

    // Integration with other systems
    integration?: {
        emr: {
            enabled: boolean;
            provider: string;
            endpoint?: string;
            syncFrequency: number; // minutes
        };
        labs: {
            enabled: boolean;
            providers: string[];
            autoImport: boolean;
        };
        pharmacy: {
            enabled: boolean;
            provider: string;
            endpoint?: string;
        };
    };
}

// Main functional configuration interface
export interface FunctionalConfig {
    guardianProtect?: GuardianProtectConfig;
    guardianInsight?: GuardianInsightConfig;
    guardianCarePro?: GuardianCareProConfig;
    guardianCareTrack?: GuardianCareTrackConfig;
}