// src/surveillance-center/types/index.ts

// ============================================================================
// RE-EXPORT ALL TYPE MODULES (avoiding conflicts)
// ============================================================================

// Import specific types to avoid conflicts
import type {
    CameraDevice as CameraDeviceBase,
    CameraConfiguration as CameraConfigurationBase,
    CameraCapabilities,
    CameraGroup,
    CameraStatus,
    CameraStream,
    CameraMaintenance,
    CameraPreset
} from './cameraTypes';

import type {
    SecurityEvent as SecurityEventBase,
    SecurityAlert,
    SecurityMetrics as SecurityMetricsBase,
    SecurityEventSource,
    SecurityDetection
} from './securityTypes';

// Re-export what we need
export type {
    CameraCapabilities,
    CameraGroup,
    CameraStatus,
    CameraStream,
    CameraMaintenance,
    CameraPreset
} from './cameraTypes';

export type {
    SecurityAlert,
    SecurityEventSource,
    SecurityDetection
} from './securityTypes';

// Export from analytics and storage without conflicts
export * from './analyticsTypes';
export * from './storageTypes';

// ============================================================================
// CORE TYPES NEEDED FOR BUILD COMPATIBILITY
// ============================================================================

// Define our own Camera interface to avoid conflicts
export interface Camera {
    id: string;
    name: string;
    location: {
        building: string;
        floor: string;
        room: string;
        zone: string;
        coordinates: {
            x: number;
            y: number;
        };
        description: string;
    };
    status: 'online' | 'offline' | 'maintenance' | 'error';
    type: 'fixed' | 'ptz' | 'dome' | 'bullet';
    resolution: string;
    fps: number;
    recording: boolean;
    stream: {
        primary: string;
        secondary?: string;
        rtsp?: string;
    };
    capabilities: {
        pan: boolean;
        tilt: boolean;
        zoom: boolean;
        infrared: boolean;
        audio: boolean;
    };
    health: {
        signal: number;
        temperature: number;
        uptime: number;
        lastPing: string;
    };
    settings: {
        brightness: number;
        contrast: number;
        saturation: number;
        exposure: 'auto' | 'manual';
        whiteBalance: 'auto' | 'manual';
        motionDetection: boolean;
        recordingQuality: 'low' | 'medium' | 'high' | 'ultra';
        nightVision: boolean;
        audioRecording: boolean;
    };
    metadata: {
        manufacturer: string;
        model: string;
        firmware: string;
        installation: string;
        lastMaintenance: string;
    };
}

// Define CameraLocation and CameraSettings as separate exports
export interface CameraLocation {
    building: string;
    floor: string;
    room: string;
    zone: string;
    coordinates: {
        x: number;
        y: number;
    };
    description: string;
}

export interface CameraSettings {
    brightness: number;
    contrast: number;
    saturation: number;
    exposure: 'auto' | 'manual';
    whiteBalance: 'auto' | 'manual';
    motionDetection: boolean;
    recordingQuality: 'low' | 'medium' | 'high' | 'ultra';
    nightVision: boolean;
    audioRecording: boolean;
}

// Analytics Types
export interface MotionEvent {
    id: string;
    cameraId: string;
    timestamp: string;
    confidence: number;
    bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    motion: {
        direction: string;
        speed: number;
        duration: number;
    };
    classification: 'person' | 'vehicle' | 'object' | 'unknown';
    processed: boolean;
}

export function isMotionEvent(event: any): event is MotionEvent {
    return event && typeof event.id === 'string' && typeof event.confidence === 'number';
}

export interface FacialRecognition {
    id: string;
    cameraId: string;
    timestamp: string;
    confidence: number;
    bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    identity: {
        personId?: string;
        name?: string;
        authorized: boolean;
        confidence: number;
    };
    biometrics: {
        age?: number;
        gender?: string;
        emotion?: string;
        glasses?: boolean;
        mask?: boolean;
    };
    processed: boolean;
}

export interface FaceRecognitionResult {
    id: string;
    cameraId: string;
    timestamp: string;
    detections: FacialRecognition[];
    totalFaces: number;
    authorizedFaces: number;
    unknownFaces: number;
    confidence: number;
}

export interface BehaviorAnalysis {
    id: string;
    cameraId: string;
    timestamp: string;
    confidence: number;
    behavior: {
        type: 'normal' | 'suspicious' | 'aggressive' | 'fall' | 'loitering' | 'running';
        duration: number;
        intensity: number;
        location: {
            x: number;
            y: number;
        };
    };
    subject: {
        trackId: string;
        classification: 'person' | 'group' | 'object';
        count: number;
    };
    risk: {
        level: 'low' | 'medium' | 'high' | 'critical';
        factors: string[];
        score: number;
    };
    processed: boolean;
}

export interface BehaviorAnalysisResult {
    id: string;
    cameraId: string;
    timestamp: string;
    analyses: BehaviorAnalysis[];
    totalBehaviors: number;
    suspiciousBehaviors: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
}

// Storage Types
export interface VideoStorage {
    id: string;
    name: string;
    type: 'local' | 'network' | 'cloud';
    location: string;
    capacity: {
        total: number;
        used: number;
        available: number;
        percentage: number;
    };
    status: 'healthy' | 'warning' | 'critical' | 'offline';
    performance: {
        readSpeed: number;
        writeSpeed: number;
        iops: number;
        latency: number;
    };
    retention: {
        policy: string;
        days: number;
        autoDelete: boolean;
    };
    redundancy: {
        level: 'none' | 'mirror' | 'raid5' | 'raid6';
        healthy: boolean;
    };
    metadata: {
        filesystem: string;
        mounted: boolean;
        lastCheck: string;
    };
}

export interface StorageQuality {
    resolution: string;
    bitrate: number;
    fps: number;
    compression: string;
    size: number; // MB per hour
}

export interface StorageStatistics {
    totalSpace: number;
    usedSpace: number;
    availableSpace: number;
    usagePercentage: number;
    dailyUsage: number;
    weeklyTrend: number[];
    retentionCompliance: number;
}

export interface ArchiveJob {
    id: string;
    name: string;
    type: 'manual' | 'scheduled' | 'policy';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    source: {
        cameras: string[];
        dateRange: {
            start: string;
            end: string;
        };
        quality: StorageQuality;
    };
    destination: ArchiveDestination;
    progress: {
        filesProcessed: number;
        totalFiles: number;
        bytesProcessed: number;
        totalBytes: number;
        percentage: number;
    };
    schedule: {
        startedAt?: string;
        completedAt?: string;
        estimatedCompletion?: string;
        duration?: number;
    };
    error?: {
        code: string;
        message: string;
        timestamp: string;
    };
}

export interface ArchiveDestination {
    type: 'local' | 'network' | 'cloud' | 'tape';
    location: string;
    credentials?: {
        username?: string;
        token?: string;
    };
    encryption: boolean;
    compression: boolean;
}

export interface RetentionPolicy {
    id: string;
    name: string;
    description: string;
    type: 'time_based' | 'size_based' | 'event_based';
    rules: {
        duration?: number; // days
        maxSize?: number; // GB
        events?: string[];
        priority: 'low' | 'medium' | 'high' | 'critical';
    };
    cameras: string[];
    active: boolean;
    compliance: {
        hipaa: boolean;
        gdpr: boolean;
        sox: boolean;
    };
    created: string;
    lastModified: string;
}

// Security Types (ensuring all required properties, using inline location)
export interface SecurityEvent {
    id: string;
    title: string;
    description: string;
    type: 'intrusion' | 'suspicious_behavior' | 'unauthorized_access' | 'equipment_failure' | 'system_alert';
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
    location: {
        building: string;
        floor: string;
        room: string;
        zone: string;
        coordinates: {
            x: number;
            y: number;
        };
        description: string;
    };
    timestamp: string;
    source: {
        type: 'camera' | 'ai_analysis' | 'motion_sensor' | 'access_control' | 'manual';
        sourceId: string;
        location: {
            building: string;
            floor: string;
            room: string;
            zone: string;
            coordinates: {
                x: number;
                y: number;
            };
            description: string;
        };
        timestamp: string;
        reliability: number;
    };
    detection: {
        method: 'ai' | 'motion' | 'manual' | 'scheduled';
        confidence: number;
        algorithm?: string;
        parameters?: Record<string, any>;
    };
    response: {
        assignedTo?: string;
        actions: string[];
        timeline: {
            timestamp: string;
            action: string;
            user: string;
            notes?: string;
        }[];
        escalated: boolean;
        notificationsSent: string[];
    };
    metadata: {
        cameras: string[];
        recordings: string[];
        screenshots: string[];
        reports: string[];
        relatedEvents: string[];
    };
    estimatedImpact: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================================
// SECURITY AND ANALYTICS INTERFACES
// ============================================================================

// Security Metrics Interface (for the SecurityMetrics.tsx component)
export interface SecurityMetrics {
    activeAlerts: number;
    totalEvents: number;
    systemHealth: number;
    responseTime: number;
    detectionAccuracy: number;
    falsePositives: number;
}

// Security KPIs Interface (for security service)
export interface SecurityKPIs {
    alertResolutionRate: number;
    falsePositiveRate: number;
    averageDetectionTime: number;
    systemUptime: number;
    camerasOnline: number;
    totalCameras: number;
}

// Individual Security KPI
export interface SecurityKPI {
    name: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    target?: number;
    status: 'good' | 'warning' | 'critical';
}

export interface SecurityIncident {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'investigating' | 'resolved' | 'closed';
    assignedTo?: string;
    events: string[];
    timeline: {
        timestamp: string;
        action: string;
        user: string;
        notes?: string;
    }[];
    created: string;
    updated: string;
    resolved?: string;
}

// Analytics Detection Types
export interface AIDetection {
    id: string;
    cameraId: string;
    timestamp: string;
    type: 'motion' | 'face' | 'behavior' | 'object' | 'anomaly';
    confidence: number;
    data: MotionEvent | FacialRecognition | BehaviorAnalysis;
    processed: boolean;
    archived: boolean;
}

// ============================================================================
// SURVEILLANCE SYSTEM CONFIGURATION TYPES (from working version)
// ============================================================================

export interface SurveillanceConfig {
    id: string;
    name: string;
    version: string;
    cameras: {
        maxCameras: number;
        defaultQuality: string;
        recordingEnabled: boolean;
        motionDetectionEnabled: boolean;
        aiAnalyticsEnabled: boolean;
    };
    storage: {
        maxStorageGB: number;
        retentionDays: number;
        compressionEnabled: boolean;
        encryptionEnabled: boolean;
    };
    security: {
        accessControlEnabled: boolean;
        auditLoggingEnabled: boolean;
        alertsEnabled: boolean;
        emergencyResponseEnabled: boolean;
    };
    analytics: {
        faceRecognitionEnabled: boolean;
        behaviorAnalysisEnabled: boolean;
        objectDetectionEnabled: boolean;
        reportingEnabled: boolean;
    };
    networking: {
        streamingProtocol: string;
        bandwidthLimitMbps: number;
        redundancyEnabled: boolean;
    };
    maintenance: {
        autoUpdatesEnabled: boolean;
        healthChecksEnabled: boolean;
        backupSchedule: string;
        monitoringEnabled: boolean;
    };
    createdAt: Date;
    updatedAt?: Date;
    createdBy: string;
}

export interface SurveillanceState {
    systemStatus: 'online' | 'offline' | 'maintenance' | 'error';
    cameraCount: {
        total: number;
        online: number;
        offline: number;
        recording: number;
    };
    storage: {
        usedGB: number;
        availableGB: number;
        percentUsed: number;
    };
    alerts: {
        active: number;
        critical: number;
        unacknowledged: number;
    };
    performance: {
        systemLoad: number;
        memoryUsage: number;
        networkThroughput: number;
        errorRate: number;
    };
    lastUpdated: Date;
    uptime: number;
    version: string;
}

export interface DetectionZone {
    id: string;
    name: string;
    description?: string;
    type: 'motion' | 'intrusion' | 'loitering' | 'crowd' | 'vehicle' | 'restricted';
    coordinates: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    sensitivity: number;
    enabled: boolean;
    schedule?: {
        alwaysActive: boolean;
        timeRanges?: Array<{
            days: string[];
            startTime: string;
            endTime: string;
        }>;
    };
    actions: {
        recordVideo: boolean;
        sendAlert: boolean;
        notifyPersonnel: boolean;
        triggerAlarm: boolean;
    };
    thresholds: {
        minDuration: number;
        maxDuration: number;
        confidenceLevel: number;
    };
    metadata: {
        cameraId: string;
        createdBy: string;
        createdAt: Date;
        updatedAt?: Date;
    };
}

export interface StreamProfile {
    id: string;
    name: string;
    description?: string;
    quality: 'low' | 'medium' | 'high' | 'ultra';
    resolution: string;
    frameRate: number;
    bitrate: number;
    codec: string;
    audioEnabled: boolean;
    audioQuality?: 'low' | 'medium' | 'high';
    adaptiveBitrate: boolean;
    encryption: boolean;
    compression: {
        enabled: boolean;
        algorithm: string;
        quality: number;
    };
    network: {
        protocol: 'rtsp' | 'rtmp' | 'webrtc' | 'hls';
        port?: number;
        multicast?: boolean;
        bufferSize: number;
    };
    usage: 'live' | 'recording' | 'backup' | 'mobile';
    isDefault: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

// ============================================================================
// TYPE GUARDS AND VALIDATION (from working version)
// ============================================================================

export function isCameraEvent(obj: any): obj is any {
    return obj && typeof obj.cameraId === 'string' && obj.timestamp;
}

export function isSecurityEvent(obj: any): obj is any {
    return obj && typeof obj.type === 'string' && obj.severity;
}

export function isAnalyticsDetection(obj: any): obj is AIDetection {
    return obj && typeof obj.confidence === 'number' && obj.boundingBox;
}

// ============================================================================
// CONSTANTS (from working version)
// ============================================================================

export const SURVEILLANCE_CONSTANTS = {
    MAX_CAMERAS: 1000,
    MAX_STORAGE_TB: 100,
    DEFAULT_RETENTION_DAYS: 30,
    MAX_CONCURRENT_STREAMS: 50,
    DEFAULT_FRAME_RATE: 30,
    MIN_CONFIDENCE_THRESHOLD: 0.5,
    MAX_DETECTION_ZONES: 10,
    SESSION_TIMEOUT_MINUTES: 30
} as const;

export const STREAM_QUALITY_PRESETS = {
    LOW: {
        resolution: '640x480',
        frameRate: 15,
        bitrate: 500,
        codec: 'H.264'
    },
    MEDIUM: {
        resolution: '1280x720',
        frameRate: 25,
        bitrate: 2000,
        codec: 'H.264'
    },
    HIGH: {
        resolution: '1920x1080',
        frameRate: 30,
        bitrate: 4000,
        codec: 'H.264'
    },
    ULTRA: {
        resolution: '3840x2160',
        frameRate: 30,
        bitrate: 8000,
        codec: 'H.265'
    }
} as const;

export interface SurveillancePermissions {
    userId: string;
    role: 'admin' | 'operator' | 'viewer' | 'security' | 'maintenance';
    permissions: {
        cameras: {
            view: boolean;
            control: boolean;
            configure: boolean;
            delete: boolean;
        };
        recordings: {
            view: boolean;
            download: boolean;
            delete: boolean;
            export: boolean;
        };
        alerts: {
            view: boolean;
            acknowledge: boolean;
            resolve: boolean;
            create: boolean;
        };
        system: {
            configure: boolean;
            maintenance: boolean;
            users: boolean;
            reports: boolean;
        };
    };
    restrictions: {
        timeBasedAccess?: {
            allowedHours: string[];
            timezone: string;
        };
        locationBasedAccess?: {
            allowedZones: string[];
            allowedBuildings: string[];
        };
        dataAccess?: {
            maxRetentionDays: number;
            allowedCameras: string[];
        };
    };
    grantedAt: Date;
    grantedBy: string;
    expiresAt?: Date;
}

// 2. DEFAULT_SURVEILLANCE_CONFIG (add this constant)
export const DEFAULT_SURVEILLANCE_CONFIG: Partial<SurveillanceConfig> = {
    cameras: {
        maxCameras: 100,
        defaultQuality: 'high',
        recordingEnabled: true,
        motionDetectionEnabled: true,
        aiAnalyticsEnabled: false
    },
    storage: {
        maxStorageGB: 1000,
        retentionDays: 30,
        compressionEnabled: true,
        encryptionEnabled: true
    },
    security: {
        accessControlEnabled: true,
        auditLoggingEnabled: true,
        alertsEnabled: true,
        emergencyResponseEnabled: true
    },
    analytics: {
        faceRecognitionEnabled: false,
        behaviorAnalysisEnabled: false,
        objectDetectionEnabled: true,
        reportingEnabled: true
    }
};

// 3. VALIDATION_PATTERNS (add this constant)
export const VALIDATION_PATTERNS = {
    CAMERA_ID: /^CAM_[A-Z0-9]{8}$/,
    EVENT_ID: /^EVT_[A-Z0-9]{8}$/,
    USER_ID: /^USR_[A-Z0-9]{8}$/,
    IP_ADDRESS: /^(\d{1,3}\.){3}\d{1,3}$/,
    MAC_ADDRESS: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
} as const;

// 4. SurveillanceError (add this interface)
export interface SurveillanceError {
    code: string;
    message: string;
    timestamp: Date;
    source: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    metadata?: Record<string, any>;
}

export interface SurveillanceUser {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'admin' | 'operator' | 'viewer' | 'security' | 'maintenance';
    department?: string;
    permissions: SurveillancePermissions;
    preferences: {
        defaultDashboard: string;
        alertNotifications: boolean;
        emailNotifications: boolean;
        smsNotifications: boolean;
        theme: 'light' | 'dark' | 'auto';
        language: string;
        timezone: string;
    };
    security: {
        lastLogin?: Date;
        lastPasswordChange: Date;
        mfaEnabled: boolean;
        loginAttempts: number;
        lockedUntil?: Date;
    };
    status: 'active' | 'inactive' | 'suspended' | 'pending';
    createdAt: Date;
    updatedAt?: Date;
    createdBy: string;
}

// 2. CONFIDENCE_THRESHOLDS (add this constant)
export const CONFIDENCE_THRESHOLDS = {
    MOTION_DETECTION: 0.7,
    FACE_RECOGNITION: 0.8,
    OBJECT_DETECTION: 0.6,
    BEHAVIOR_ANALYSIS: 0.75,
    LICENSE_PLATE: 0.85
} as const;

// 3. PERFORMANCE_LIMITS (add this constant)
export const PERFORMANCE_LIMITS = {
    MAX_CPU_USAGE: 80,
    MAX_MEMORY_USAGE: 85,
    MAX_DISK_USAGE: 90,
    MAX_NETWORK_LATENCY: 500,
    MIN_FRAME_RATE: 10
} as const;

// 4. ERROR_CODES (add this constant)
export const ERROR_CODES = {
    CAMERA_OFFLINE: 'CAM_001',
    STORAGE_FULL: 'STG_001',
    NETWORK_ERROR: 'NET_001',
    AUTH_FAILED: 'AUTH_001',
    CONFIG_ERROR: 'CFG_001'
} as const;