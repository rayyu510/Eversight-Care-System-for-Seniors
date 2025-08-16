// File: src/surveillance-center/types/completeTypes.ts (UPDATE WITH ALL MISSING TYPES)

// Fix all missing type exports that are causing import errors
export interface BehaviorAnalysis {
    id: string;
    cameraId: string;
    type?: string;
    behaviorType?: string; // ADD MISSING
    severity?: 'low' | 'medium' | 'high'; // ADD MISSING  
    description?: string; // ADD MISSING
    confidence: number;
    startTime?: Date; // ADD MISSING
    endTime?: Date;
    duration?: number; // ADD MISSING
    metadata: Record<string, any>;
    detectionType: 'normal' | 'suspicious' | 'alert';
    processed: boolean;
}

export interface FacialRecognition {
    id: string;
    personId?: string;
    confidence: number;
    timestamp: string;
    cameraId: string;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    recognized: boolean;
    personName?: string;
}

export interface DetectionEvent {
    id: string;
    cameraId: string;
    type: 'motion' | 'person' | 'vehicle' | 'intrusion';
    confidence: number;
    timestamp: string;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    metadata?: Record<string, any>;
}

export interface MotionDetectionEvent {
    id: string;
    cameraId: string;
    timestamp: string;
    confidence: number;
    zone?: string;
    duration: number;
    severity: 'low' | 'medium' | 'high';
    recordingTriggered?: boolean; // ADD MISSING
}

export interface AIDetection {
    id: string;
    type: string;
    cameraId: string;
    timestamp: string;
    confidence: number;
    details: string;
    description?: string; // ADD MISSING
    severity: 'low' | 'medium' | 'high';
    videoUrl?: string;
    imageUrl?: string; // ADD MISSING
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

// Update VideoMetadata with all missing properties
export interface VideoMetadata {
    duration: number;
    fps: number;
    codec: string;
    bitrate: number;
    resolution: string;
    audioTrack: boolean;
    fileHash: string;
    createdBy: string;
    createdAt: Date;
    modifiedAt?: Date;
    tags?: string[];
    triggerEvent?: string;
    checksum?: string; // ADD MISSING
    thumbnail?: string;
    preview?: string;
}

// Update StorageQuality to match service usage
export interface StorageQuality {
    level: string;
    bitrate: number;
    frameRate: number;
    resolution: string;
    audioEnabled: boolean;
    audioQuality?: string; // ADD MISSING
    compressionType: string;
    targetFileSize?: number; // ADD MISSING
}

// Update ArchiveJob with all missing properties
// Define ArchiveDestination type
export type ArchiveDestination =
    | { type: 'local'; path: string }
    | { type: 'cloud'; provider: string; bucket: string }
    | { type: 'external'; deviceId: string; label?: string };

export interface ArchiveJob {
    id: string;
    name?: string; // ADD MISSING
    type: string;
    startTime: Date;
    endTime?: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'failed'; // Remove 'running'
    progress: number;
    destination: ArchiveDestination;
    filesProcessed?: number; // ADD MISSING
    totalFiles?: number; // ADD MISSING
    bytesProcessed?: number; // ADD MISSING
    totalBytes?: number; // ADD MISSING
    cameras?: string[]; // ADD MISSING
    dateRange?: { // ADD MISSING
        start: string;
        end: string;
    };
    startedAt?: string; // ADD MISSING
    completedAt?: string; // ADD MISSING
}

// Define RetentionPolicyType
export type RetentionPolicyType = 'time' | 'event' | 'manual';

// Update RetentionPolicy with missing properties
export interface RetentionPolicy {
    id: string;
    name: string;
    description?: string;
    type: RetentionPolicyType;
    duration: number;
    conditions: any[];
    priority?: string | number; // Allow both types
    autoDelete: boolean;
    retentionDays?: number; // ADD MISSING
    cameraIds?: string[]; // ADD MISSING
    enabled?: boolean; // ADD MISSING
}

// Update StorageStatistics with missing properties
export interface StorageStatistics {
    totalStorage: number;
    usedStorage: number;
    availableStorage: number;
    compressionRatio: number;
    retentionCompliance: number;
    activeRecordings?: number;
    archiveJobs?: number;
    totalSize?: number; // ADD MISSING
}

// Add missing constants and configurations
export interface SurveillanceConfig {
    maxCameras: number;
    defaultQuality: string;
    retentionDays: number;
    aiEnabled: boolean;
}

export interface SurveillanceState {
    cameras: any[];
    recordings: any[];
    alerts: any[];
    isOnline: boolean;
}

export interface SurveillancePermissions {
    view: boolean;
    control: boolean;
    configure: boolean;
    manage: boolean;
    admin: boolean;
}

export interface SurveillanceUser {
    id: string;
    name: string;
    email: string;
    role: 'viewer' | 'operator' | 'admin';
    permissions: SurveillancePermissions;
    lastLogin?: Date;
    active: boolean;
}

export interface DetectionZone {
    id: string;
    name: string;
    coordinates: Array<{ x: number; y: number }>;
    sensitivity: number;
    enabled: boolean;
    type: 'motion' | 'intrusion' | 'loitering';
}

export interface StreamProfile {
    id: string;
    name: string;
    resolution: string;
    bitrate: number;
    frameRate: number;
    codec: 'H.264' | 'H.265' | 'MJPEG';
    quality: 'low' | 'medium' | 'high';
}

// Add missing constants
export const SURVEILLANCE_CONSTANTS = {
    MAX_CAMERAS: 50,
    DEFAULT_QUALITY: 'high',
    RETENTION_DAYS: 30
};

export const DEFAULT_SURVEILLANCE_CONFIG: SurveillanceConfig = {
    maxCameras: 50,
    defaultQuality: 'high',
    retentionDays: 30,
    aiEnabled: true
};

export const STREAM_QUALITY_PRESETS = {
    low: { bitrate: 500, resolution: '640x480' },
    medium: { bitrate: 2000, resolution: '1280x720' },
    high: { bitrate: 6000, resolution: '1920x1080' }
};

// Add validation helpers
export const isCameraEvent = (obj: any): boolean => {
    return obj && typeof obj.cameraId === 'string';
};

export const isSecurityEvent = (obj: any): boolean => {
    return obj && typeof obj.severity === 'string';
};

export const isAnalyticsDetection = (obj: any): boolean => {
    return obj && typeof obj.confidence === 'number';
};

export const isMotionEvent = (obj: any): boolean => {
    return obj && obj.type === 'motion';
};

export const VALIDATION_PATTERNS = {
    cameraId: /^CAM_[A-Z0-9]{8}$/,
    ipAddress: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
};

export const CONFIDENCE_THRESHOLDS = {
    low: 0.5,
    medium: 0.7,
    high: 0.9
};

export const PERFORMANCE_LIMITS = {
    maxConcurrentStreams: 24,
    maxRecordingDuration: 86400
};

export const ERROR_CODES = {
    CAMERA_OFFLINE: 'CAM_001',
    STREAM_ERROR: 'STR_001',
    STORAGE_FULL: 'STO_001'
};

// Add SurveillanceError class
export class SurveillanceError extends Error {
    code: string;

    constructor(message: string, code: string) {
        super(message);
        this.code = code;
        this.name = 'SurveillanceError';
    }
}
