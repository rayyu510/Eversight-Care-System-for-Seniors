// src/surveillance-center/index.ts
// Export all types from the new type system

// ============================================================================
// CAMERA DOMAIN TYPES (Updated naming)
// ============================================================================
export type {
    CameraDevice as Camera,              // Alias for backward compatibility
    CameraConfiguration as CameraSettings, // Alias for backward compatibility
    CameraCapabilities,
    CameraGroup,
    //  CameraEvent,
    CameraStatus,
    CameraLocation,
    CameraStream,
    CameraMaintenance,
    CameraPreset,
    //   CameraLayout,
    PrivacyMask,
    MotionZone
} from './types/cameraTypes';

// Export CameraControl interface from service
export type { CameraControl, CameraMetrics } from './services/cameraService';

// ============================================================================
// ANALYTICS DOMAIN TYPES (Provide aliases for backward compatibility)
// ============================================================================
export type {
    AnalyticsDetection as AIDetection,    // Alias for backward compatibility
    MotionAnalysis as MotionDetection,    // Alias for backward compatibility
    FaceAnalysis as FacialRecognition,    // Alias for backward compatibility
    BehaviorAnalysis,                     // Keep same name
    AnalyticsRule,
    AnalyticsCondition,
    AnalyticsAction,
    AnalyticsSchedule,
    ObjectAnalysis,
    AnalyticsMetadata,
    AnalyticsBoundingBox
} from './types/analyticsTypes';

// ============================================================================
// SECURITY DOMAIN TYPES
// ============================================================================
export type {
    SecurityEvent,
    SecurityAlert,
    SecurityMetrics,
    SecurityEventSource,
    SecurityDetection,
    SecurityResponse,
    SecurityVulnerability,
    SecurityKPI,
    SecurityIncident,
    SecurityPolicy
} from './types/securityTypes';

// ============================================================================
// STORAGE DOMAIN TYPES
// ============================================================================
export type {
    VideoStorage,
    VideoMetadata,
    StorageStatistics,
    RetentionPolicy,
    ArchiveJob,
    StorageAlert,
    StorageConfiguration,
    MotionEvent,
    StorageQuality
} from './types/storageTypes';

// ============================================================================
// SURVEILLANCE CONFIGURATION TYPES
// ============================================================================
export type {
    SurveillanceConfig,
    SurveillanceState,
    SurveillancePermissions,
    SurveillanceUser,
    DetectionZone,
    StreamProfile
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================
export {
    SURVEILLANCE_CONSTANTS,
    DEFAULT_SURVEILLANCE_CONFIG,
    STREAM_QUALITY_PRESETS
} from './types';

// ============================================================================
// SERVICES
// ============================================================================
export { CameraService } from './services/cameraService';
export { SecurityService } from './services/securityService';
export { AIAnalyticsService } from './services/aiAnalyticsService';
export { VideoStorageService } from './services/videoStorageService';

// ============================================================================
// HOOKS
// ============================================================================
export {
    useCameraFeeds,
    useCameraMetrics,
    useCameraPresets,
    useAIDetections,
    useSecurityMetrics,
    useVideoStorage
} from './hooks';

// Export hook return types for external use
export type {
    CameraFeedsHookReturn,
    CameraStats
} from './hooks';
export type {
    SecurityMetricsHookReturn,
    SecuritySummary,
    SecurityEventFilters
} from './hooks/useSecurityMetrics';

// ============================================================================
// COMPONENTS (if needed for external use)
// ============================================================================
// Uncomment these when components are ready
// export { SurveillanceDashboard } from './components/Dashboard/SurveillanceDashboard';
// export { CameraGrid } from './components/Dashboard/CameraGrid';
// export { AIDetectionPanel } from './components/Dashboard/AIDetectionPanel';
// export { SecurityMetrics as SecurityMetricsComponent } from './components/Dashboard/SecurityMetrics';

// ============================================================================
// UTILITIES
// ============================================================================
export {
    isCameraEvent,
    isSecurityEvent,
    isAnalyticsDetection,
    isMotionEvent,
    VALIDATION_PATTERNS,
    CONFIDENCE_THRESHOLDS,
    PERFORMANCE_LIMITS,
    ERROR_CODES
} from './types';

// ============================================================================
// TYPE GUARDS AND HELPERS
// ============================================================================
export type { SurveillanceError } from './types';

// Backward compatibility aliases for commonly used types
export type { AnalyticsDetection } from './types/analyticsTypes';
import type { AnalyticsDetection } from './types/analyticsTypes';
export type AIAnalyticsDetection = AnalyticsDetection;
// Removed circular type alias for CameraDevice

// Re-export specific constants that might be used externally
export const CAMERA_TYPES = {
    INDOOR: 'indoor',
    OUTDOOR: 'outdoor',
    PTZ: 'ptz',
    DOME: 'dome',
    FIXED: 'fixed',
    THERMAL: 'thermal'
} as const;

export const DETECTION_TYPES = {
    MOTION: 'motion',
    PERSON: 'person',
    FACE: 'face',
    OBJECT: 'object',
    BEHAVIOR: 'behavior',
    ANOMALY: 'anomaly',
    VEHICLE: 'vehicle',
    LICENSE_PLATE: 'license_plate'
} as const;

export const SECURITY_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
} as const;