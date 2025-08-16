// src/surveillance-center/types/storageTypes.ts

// ============================================================================
// CORE STORAGE INTERFACES
// ============================================================================

export interface VideoStorage {
    id: string;
    cameraId: string;
    filename: string;
    filePath: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    fileSize: number;
    resolution: string;
    codec: string;
    quality: StorageQuality | null;
    metadata: VideoMetadata;
    retention: VideoRetention;
    status: VideoStorageStatus;
    segments?: VideoSegment[]; // ✅ Add missing interface
    thumbnails?: VideoThumbnail[]; // ✅ Add missing interface
    createdAt?: Date;
    modifiedAt?: Date;
}

// ✅ Add missing VideoSegment interface
export interface VideoSegment {
    id: string;
    segmentNumber: number;
    startTime: string;
    duration: number;
    fileSize: number;
    checksum: string;
    status: string;
    location: string;
}

// ✅ Add missing VideoThumbnail interface
export interface VideoThumbnail {
    id: string;
    timestamp: number;
    filename: string;
    fileSize: number;
    resolution: string;
    type: string;
    checksum: string;
}

export interface VideoMetadata {
    codec: string;
    frameCount: number;
    checksum: string;
    createdBy: string;
    tags: string[];
    recordingType?: string; // ✅ Add missing property
    triggerEvent?: string;
    annotations?: VideoAnnotation[];
    encrypted?: boolean;
    compressionRatio?: number;
    frameRate?: number;
    bitrate?: number;
    audioEnabled?: boolean;
    audioCodec?: string;
    gpsLocation?: GPSLocation;
    weather?: WeatherInfo;
    lighting?: string;
}

export interface VideoAnnotation {
    id: string;
    timestamp: Date;
    type: 'detection' | 'event' | 'manual' | 'system';
    data: Record<string, any>; // ✅ Add missing data property
    createdBy: string;
    createdAt: string;
    verified?: boolean;
    verifiedBy?: string;
    tags?: string[];
    importance?: 'low' | 'medium' | 'high';
}

export interface VideoRetention {
    policy: RetentionPolicyType;
    retainUntil?: string; // ✅ Add missing property
    autoDelete?: boolean;
    archiveAfter?: string;
    legalHold?: boolean; // ✅ Add missing property
    accessLevel?: string;
    retentionReason?: string;
    dataClassification?: DataClassification;
    complianceRequirements?: string[];
}

export interface VideoStorageStatus {
    stored: boolean;
    archived: boolean;
    corrupted: boolean;
    accessible: boolean;
    processing: boolean;
    lastVerified: string;
    verificationHash?: string;
    backupStatus?: BackupStatus;
    replicationStatus?: ReplicationStatus;
}

export interface BackupStatus {
    backed_up: boolean;
    backup_location: string;
    backup_time?: string;
    backup_type: string;
    verification_status: string;
}

export interface ReplicationStatus {
    replicated: boolean;
    replication_sites: string[];
    replica_locations?: string[]; // ✅ Add missing property
    replication_time?: string; // ✅ Add missing property
    last_replication: string;
    replication_health: string;
    consistency?: string;
    sync_status?: string;
}

export interface StorageQuality {
    level: 'low' | 'medium' | 'high' | 'ultra';
    bitrate: number;
    frameRate: number;
    resolution: string;
    audioEnabled: boolean;
    audioQuality?: 'low' | 'medium' | 'high';
    compressionType: string;
    targetFileSize?: number;
}

export interface StorageStatistics {
    totalCapacity: number;
    usedSpace: number;
    availableSpace: number;
    totalSize?: number; // ✅ Add missing property
    usedSize?: number; // ✅ Add missing property 
    videoCount: number;
    averageFileSize: number;
    oldestRecording: Date;
    newestRecording: Date;
    oldestVideo?: string; // ✅ Add for compatibility
    newestVideo?: string; // ✅ Add for compatibility
    compressionRatio: number;
    dailyGrowthRate: number;
    retentionCompliance?: number;
    storageEfficiency?: number;
    growthRate?: number;
    projectedCapacity?: ProjectedCapacity;
    performanceMetrics?: PerformanceMetrics;
}

export interface ProjectedCapacity {
    timeToFull: number;
    recommendedExpansion: number;
    growthTrend: string;
    seasonalFactors: Record<string, number>;
}

export interface PerformanceMetrics {
    readThroughput: number;
    writeThroughput: number;
    iops: number;
    latency: {
        read: number;
        write: number;
        delete: number;
    };
    errorRate: number;
    availability: number;
}

export interface ArchiveJob {
    id: string;
    type?: string; // ✅ Add missing property
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    startTime: Date;
    endTime?: Date;
    destination: ArchiveDestination;
    videoIds?: string[]; // ✅ Add missing property
    progress?: number;
    performance?: ArchivePerformance;
    validation?: ArchiveValidation;
    warnings?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    error?: string;
}

export interface ArchiveDestination {
    type: 'local' | 'cloud' | 'network';
    path: string;
    location?: string; // ✅ Add missing property
    credentials?: ArchiveCredentials;
    encryption?: boolean;
    compression?: boolean;
    redundancy?: number;
    access_tier?: string;
    settings?: Record<string, any>;
}

export interface ArchiveCredentials {
    username?: string;
    password?: string;
    accessKey?: string;
    secretKey?: string;
    token?: string;
}

export interface ArchivePerformance {
    throughput: number;
    estimatedCompletion: string;
    averageSpeed: number;
    filesProcessed: number;
    totalFiles: number;
    bytesTransferred: number;
    errorCount: number;
    retryCount: number;
}

export interface ArchiveValidation {
    checksumVerification: boolean;
    integrityCheck: boolean;
    accessibilityTest: boolean;
    validationStatus: string;
    validationErrors: string[];
    validationTime: string;
}

export interface RetentionPolicy {
    id: string;
    name: string;
    description?: string;
    version?: string;
    retentionDays?: number; // ✅ Add missing property
    autoArchive?: boolean;
    archiveAfterDays?: number;
    autoDelete?: boolean;
    deleteAfterDays?: number;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    conditions: RetentionCondition[];
    exceptions?: PolicyException[];
    compliance?: ComplianceInfo;
    enforcement?: EnforcementSettings;
    actions: RetentionAction[];
    schedule?: RetentionSchedule;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: string;
}

export interface RetentionCondition {
    field: string;
    operator: string;
    value: string;
    priority?: number; // ✅ Add missing property
    weight?: number;
    logical_operator?: string;
}

export interface PolicyException {
    id: string;
    ruleId: string;
    reason: string;
    approvedBy: string;
    approvedAt: string;
    expires?: string;
    conditions: string[];
}

export interface ComplianceInfo {
    regulations: string[];
    requirements: ComplianceRequirement[];
    auditTrail: any[];
    lastAssessment: string;
    nextAssessment: string;
    complianceScore: number;
}

export interface ComplianceRequirement {
    regulation: string;
    requirement: string;
    status: string;
    evidence: string[];
    gaps: string[];
    remediation: string[];
}

export interface EnforcementSettings {
    enabled: boolean;
    strictMode: boolean;
    warningPeriod: number;
    gracePeriod: number;
    automaticEnforcement: boolean;
    notifications: any[];
    escalation: any[];
}

export interface RetentionAction {
    type: 'delete' | 'archive' | 'migrate' | 'notify';
    target: string;
    parameters: Record<string, any>;
    schedule?: RetentionSchedule;
}

export interface RetentionSchedule {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    timezone: string;
    enabled: boolean;
}

export interface StorageConfiguration {
    id?: string;
    name?: string;
    type?: StorageType;
    capacity?: number;
    location?: string;
    redundancy?: RedundancyLevel;
    compression?: CompressionSettings;
    encryption?: EncryptionSettings;
    backup?: BackupSettings;
    monitoring?: MonitoringSettings;
    maxFileSize?: number;
    maxDuration?: number; // ✅ Add missing property
    defaultQuality?: StorageQuality;
    defaultRetention?: number;
    compressionEnabled?: boolean;
    encryptionEnabled?: boolean;
    checksumEnabled?: boolean;
    autoArchiveEnabled?: boolean;
    redundancyLevel?: number;
    backupEnabled?: boolean;
    replicationEnabled?: boolean;
    tiering?: StorageTiering;
    optimization?: StorageOptimization;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface StorageAlert {
    id: string;
    type: 'capacity' | 'performance' | 'error' | 'maintenance';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    source: string;
    timestamp: Date;
    acknowledged: boolean;
    resolved: boolean;
    metadata?: Record<string, any>;
}

export interface MotionEvent {
    id: string;
    cameraId: string;
    videoId?: string; // ✅ Add missing property
    timestamp: Date;
    intensity: number;
    duration: number;
    zone?: string;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
        normalized?: boolean;  // ✅ Make it optional
    };
    recordingTriggered?: boolean;
    thumbnailUrl?: string;
    videoUrl?: string;
    confidence?: number;
    zones?: string[];
    objectCount?: number;
    velocity?: number;
    direction?: number;
    metadata?: Record<string, any>;
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface DataClassification {
    level: string;
    categories: string[];
    regulations: string[];
    handlingInstructions: string[];
    accessRestrictions: AccessRestriction[];
}

export interface AccessRestriction {
    type: string;
    value: string;
    granted: boolean;
    expires?: string;
}

export interface GPSLocation {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
}

export interface WeatherInfo {
    temperature: number;
    humidity: number;
    condition: string;
    visibility: number;
    windSpeed: number;
}

export interface StorageTiering {
    enabled: boolean;
    policies: TieringPolicy[];
    automatic: boolean;
    costOptimization: boolean;
}

export interface TieringPolicy {
    name: string;
    condition: string;
    source_tier: string;
    target_tier: string;
    age_threshold: number;
    access_threshold: number;
}

export interface StorageOptimization {
    deduplication: boolean;
    compression: string;
    indexing: boolean;
    caching: CachingSettings;
    prefetching: boolean;
}

export interface CachingSettings {
    enabled: boolean;
    size: number;
    policy: string;
    ttl: number;
    predictive: boolean;
}

export interface CompressionSettings {
    enabled: boolean;
    algorithm: 'h264' | 'h265' | 'vp9' | 'av1';
    quality: 'low' | 'medium' | 'high' | 'lossless';
    bitrate?: number;
    targetSize?: number;
    keyFrameInterval?: number;
}

export interface EncryptionSettings {
    enabled: boolean;
    algorithm: 'aes256' | 'chacha20' | 'rsa2048';
    keyRotation: boolean;
    rotationInterval?: number;
    encryptInTransit: boolean;
    encryptAtRest: boolean;
}

export interface BackupSettings {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
    retention: number;
    destinations: string[];
    compression: boolean;
    encryption: boolean;
    verification: boolean;
}


export interface MonitoringSettings {
    enabled: boolean;
    healthChecks: boolean;
    performanceMetrics: boolean;
    alertThresholds: {
        diskUsage: number;
        errorRate: number;
        responseTime: number;
    };
    notifications: {
        email: boolean;
        sms: boolean;
        webhook?: string;
    };
}

// ============================================================================
// ENUMS AND TYPES
// ============================================================================

export type StorageType = 'local' | 'network' | 'cloud' | 'hybrid';
export type RedundancyLevel = 'none' | 'mirror' | 'raid5' | 'raid6' | 'distributed';

export type RetentionPolicyType =
    | 'standard_30_days'
    | 'motion_7_days'
    | 'extended_90_days'
    | 'permanent'
    | 'custom';

export type VideoFormat = 'mp4' | 'avi' | 'mov' | 'mkv' | 'webm';

// ============================================================================
// CONSTANTS
// ============================================================================

export const STORAGE_CONSTANTS = {
    MAX_FILE_SIZE: 10737418240, // 10GB
    MAX_DURATION: 86400, // 24 hours
    DEFAULT_RETENTION_DAYS: 30,
    COMPRESSION_RATIOS: {
        HIGH: 0.3,
        MEDIUM: 0.5,
        LOW: 0.7
    }
} as const;

export const VIDEO_FORMATS = {
    MP4: 'mp4',
    AVI: 'avi',
    MOV: 'mov',
    MKV: 'mkv',
    WEBM: 'webm'
} as const;

export const STORAGE_TIERS = {
    HOT: 'hot',
    WARM: 'warm',
    COLD: 'cold',
    ARCHIVE: 'archive'
} as const;