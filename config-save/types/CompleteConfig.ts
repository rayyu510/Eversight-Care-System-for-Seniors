// config/types/CompleteConfig.ts
// Base configuration interfaces

// System Configuration Types
export interface DatabaseConfig {
    primary: {
        type: 'postgresql' | 'mysql' | 'sqlite' | 'mssql';
        host?: string;
        port?: number;
        database: string;
        username?: string;
        password?: string;
        ssl?: boolean;
        pool?: {
            min: number;
            max: number;
            idle: number;
        };
    };
    backup?: {
        enabled: boolean;
        schedule: string; // cron format
        retention: number; // days
        location: string;
    };
    analytics?: {
        enabled: boolean;
        readReplica?: {
            host: string;
            port: number;
            database: string;
        };
    };
}

export interface AuthConfig {
    provider: 'local' | 'ldap' | 'saml' | 'oauth2';
    session: {
        duration: number; // minutes
        refreshToken: boolean;
        multiSession: boolean;
    };
    passwordPolicy: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSymbols: boolean;
        preventReuse: number;
        expiration: number; // days
    };
    mfa: {
        enabled: boolean;
        methods: Array<'totp' | 'sms' | 'email'>;
        required: boolean;
    };
    audit: {
        enabled: boolean;
        logLevel: 'basic' | 'detailed' | 'comprehensive';
        retention: number; // days
    };
}

export interface PerformanceConfig {
    caching: {
        enabled: boolean;
        provider?: 'memory' | 'redis' | 'memcached';
        ttl?: number; // seconds
        maxSize?: string; // e.g., '100MB'
    };
    rateLimit?: {
        enabled: boolean;
        windowMs: number;
        max: number;
        skipSuccessfulRequests: boolean;
    };
    compression?: {
        enabled: boolean;
        level?: number; // 1-9
        threshold?: string; // e.g., '1kb'
    };
    monitoring: {
        enabled: boolean;
        metrics?: Array<'cpu' | 'memory' | 'disk' | 'network' | 'database'>;
        alertThresholds?: {
            cpu: number; // percentage
            memory: number; // percentage
            disk: number; // percentage
        };
    };
}

export interface SystemConfig {
    database: DatabaseConfig;
    auth: AuthConfig;
    performance: PerformanceConfig;
}

// Functional Configuration Types
export interface GuardianProtectConfig {
    devices: {
        maxDevicesPerFacility: number;
        autoDiscovery: boolean;
        heartbeatInterval: number; // seconds
        offlineThreshold: number; // seconds
        batteryAlertThreshold: number; // percentage
    };
    alerts: {
        retentionPeriod: number; // days
        escalationRules: Array<{
            severity: 'low' | 'medium' | 'high' | 'critical';
            escalateAfter: number; // minutes
            notifyRoles: string[];
        }>;
        acknowledgmentTimeout: number; // minutes
    };
    monitoring: {
        realTimeUpdates: boolean;
        updateInterval: number; // seconds
        dataRetention: number; // days
        metricsCollection: boolean;
    };
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
        sound: boolean;
        desktop: boolean;
    };
}

export interface GuardianInsightConfig {
    analytics: {
        realTimeProcessing: boolean;
        batchSize: number;
        processingInterval: number; // minutes
        dataAggregation: Array<'hourly' | 'daily' | 'weekly' | 'monthly'>;
    };
    reports: {
        autoGeneration: boolean;
        schedule: {
            daily: boolean;
            weekly: boolean;
            monthly: boolean;
            quarterly: boolean;
        };
        deliveryMethods: Array<'email' | 'dashboard' | 'export'>;
        retention: number; // days
    };
    kpis: {
        refreshInterval: number; // minutes
        alertThresholds: {
            [key: string]: {
                warning: number;
                critical: number;
            };
        };
    };
    visualization: {
        chartTypes: Array<'line' | 'bar' | 'pie' | 'scatter' | 'heatmap'>;
        interactivity: boolean;
        exportFormats: Array<'png' | 'pdf' | 'svg'>;
    };
}

export interface GuardianCareProConfig {
    staffManagement: {
        maxStaffPerFacility: number;
        roleHierarchy: Array<{
            role: string;
            level: number;
            permissions: string[];
        }>;
        shiftPatterns: Array<{
            name: string;
            startTime: string;
            endTime: string;
            duration: number; // hours
        }>;
    };
    residents: {
        maxResidentsPerFacility: number;
        careLevel: Array<{
            level: string;
            staffRatio: string; // e.g., "1:4"
            requirements: string[];
        }>;
        assessmentSchedule: {
            initial: number; // days
            ongoing: number; // days
            comprehensive: number; // days
        };
    };
    scheduling: {
        advanceBooking: number; // days
        minStaffingLevels: {
            [shift: string]: number;
        };
        overtimeRules: {
            dailyThreshold: number; // hours
            weeklyThreshold: number; // hours
            approval: boolean;
        };
    };
}

export interface GuardianCareTrackConfig {
    healthMonitoring: {
        vitalSigns: {
            enabled: boolean;
            frequency: number; // minutes
            alertThresholds: {
                [vital: string]: {
                    min: number;
                    max: number;
                };
            };
        };
        medications: {
            enabled: boolean;
            reminderSystem: boolean;
            adherenceTracking: boolean;
            pharmacyIntegration: boolean;
        };
    };
    activityTracking: {
        enabled: boolean;
        types: Array<'exercise' | 'therapy' | 'social' | 'personal'>;
        goals: {
            daily: boolean;
            weekly: boolean;
            monthly: boolean;
        };
    };
    wellness: {
        dashboardEnabled: boolean;
        metricsCollection: Array<'physical' | 'mental' | 'social' | 'cognitive'>;
        reportGeneration: boolean;
    };
}

export interface FunctionalConfig {
    guardianProtect?: GuardianProtectConfig;
    guardianInsight?: GuardianInsightConfig;
    guardianCarePro?: GuardianCareProConfig;
    guardianCareTrack?: GuardianCareTrackConfig;
}

// Deployment Configuration Types
export interface CloudConfig {
    provider: 'aws' | 'azure' | 'gcp';
    region: string;
    environment: 'development' | 'staging' | 'production';
    compute: {
        instanceType: string;
        minInstances: number;
        maxInstances: number;
        autoScaling: boolean;
    };
    storage: {
        type: 'ssd' | 'hdd';
        size: string;
        backup: boolean;
        encryption: boolean;
    };
    network: {
        vpc: boolean;
        ssl: boolean;
        cdn: boolean;
        firewall: boolean;
    };
}

export interface OnPremiseConfig {
    architecture: 'single-server' | 'multi-server' | 'cluster';
    hardware: {
        cpu: string;
        memory: string;
        storage: string;
        network: string;
    };
    os: {
        type: 'linux' | 'windows';
        version: string;
        containerization: 'docker' | 'kubernetes' | 'none';
    };
    backup: {
        strategy: 'local' | 'remote' | 'hybrid';
        frequency: string;
        retention: number;
    };
}

export interface DeploymentConfig {
    type: 'cloud' | 'onpremise' | 'hybrid';
    cloud?: CloudConfig;
    onPremise?: OnPremiseConfig;
}

// Facility Configuration Types
export interface FacilityConfig {
    type: 'hospital' | 'clinic' | 'assisted_living' | 'nursing_home' | 'rehabilitation';
    size: 'small' | 'medium' | 'large' | 'enterprise';
    specialties: string[];
    compliance: Array<'hipaa' | 'hitech' | 'gdpr' | 'pipeda'>;
    modules: {
        guardianProtect: boolean;
        guardianInsight: boolean;
        guardianCarePro: boolean;
        guardianCareTrack: boolean;
    };
    location?: {
        country: string;
        state?: string;
        city?: string;
        timezone: string;
    };
    contact?: {
        name: string;
        email: string;
        phone: string;
    };
}

// Feature Flags Configuration
export interface FeatureFlag {
    name: string;
    enabled: boolean;
    rolloutPercentage?: number;
    conditions?: {
        userRoles?: string[];
        facilityTypes?: string[];
        environments?: string[];
    };
    metadata?: {
        description: string;
        owner: string;
        createdAt: Date;
        expiresAt?: Date;
    };
}

export interface FeatureFlagsConfig {
    flags: FeatureFlag[];
    defaultEnabled: boolean;
    remoteConfig?: {
        enabled: boolean;
        endpoint: string;
        refreshInterval: number; // minutes
    };
}

// Security Configuration Types
export interface SecurityConfig {
    encryption: {
        atRest: boolean;
        inTransit: boolean;
        algorithm: string;
        keyManagement: 'local' | 'hsm' | 'cloud';
    };
    network: {
        firewall: boolean;
        intrusion: {
            detection: boolean;
            prevention: boolean;
        };
        vpn: {
            required: boolean;
            type: 'ipsec' | 'ssl' | 'wireguard';
        };
    };
    compliance: {
        hipaa: boolean;
        gdpr: boolean;
        auditLogging: boolean;
        dataRetention: number; // days
    };
}

// Mobile Configuration Types
export interface MobileConfig {
    enabled: boolean;
    platforms: Array<'ios' | 'android'>;
    features: {
        offlineMode: boolean;
        pushNotifications: boolean;
        biometricAuth: boolean;
        voiceCommands: boolean;
    };
    security: {
        appPinning: boolean;
        rootDetection: boolean;
        sessionTimeout: number; // minutes
    };
}

// Complete Configuration Interface
export interface CompleteConfig {
    // Core configuration sections
    facility: FacilityConfig;
    system: SystemConfig;
    functional: FunctionalConfig;
    deployment: DeploymentConfig;

    // Optional advanced configurations
    security?: SecurityConfig;
    mobile?: MobileConfig;
    featureFlags?: FeatureFlagsConfig;

    // Metadata
    metadata: {
        version: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        environment: string;
    };

    // Custom configurations for specific implementations
    customizations?: {
        [key: string]: any;
    };
}

// Validation and utility types
export interface ValidationResult {
    isValid: boolean;
    errors: Array<{
        path: string;
        message: string;
        severity: 'error' | 'warning';
    }>;
    warnings: Array<{
        path: string;
        message: string;
    }>;
}

export interface ConfigurationTemplate {
    name: string;
    description: string;
    category: 'facility' | 'system' | 'functional' | 'deployment';
    config: Partial<CompleteConfig>;
    requirements?: {
        modules: string[];
        compliance: string[];
        minimumVersion: string;
    };
}

// Export all types for easy importing
export * from './CompleteConfig';