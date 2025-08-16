// src/surveillance-center/types/analyticsTypes.ts
export interface AnalyticsDetection {
    id: string;
    type: 'motion' | 'person' | 'face' | 'object' | 'behavior' | 'anomaly' | 'vehicle' | 'license_plate';
    cameraId: string;
    timestamp: string;
    confidence: number;
    boundingBox: AnalyticsBoundingBox;
    metadata: AnalyticsMetadata;
    verified: boolean;
    falsePositive: boolean;
    verifiedBy?: string;
    verifiedAt?: string;
    tags: string[];
    relatedDetections: string[];
}

export interface AnalyticsBoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    normalized: boolean;
    confidence: number;
}

export interface AnalyticsMetadata {
    algorithm: string;
    version: string;
    processingTime: number;
    features: Record<string, any>;
    confidence_breakdown: Record<string, number>;
    model: {
        name: string;
        version: string;
        accuracy: number;
        trainingDate: string;
    };
    environmentalFactors: {
        lighting: 'poor' | 'fair' | 'good' | 'excellent';
        weather?: 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog';
        visibility: number;
        noiseLevel: number;
    };
}

export interface MotionAnalysis {
    id: string;
    cameraId: string;
    detectionId: string;
    startTime: string;
    endTime: string;
    intensity: number;
    direction: { x: number; y: number; magnitude: number; angle: number; };
    velocity: number;
    acceleration: number;
    area: number;
    duration: number;
    trajectory: TrajectoryPoint[];
    patterns: MotionPattern[];
    zones: string[];
}

export interface TrajectoryPoint {
    x: number;
    y: number;
    timestamp: string;
    velocity: number;
    confidence: number;
}

export interface MotionPattern {
    type: 'linear' | 'circular' | 'erratic' | 'stationary' | 'oscillating';
    confidence: number;
    duration: number;
    characteristics: Record<string, any>;
}

export interface FaceAnalysis {
    id: string;
    cameraId: string;
    detectionId: string;
    timestamp: string;
    faceId?: string;
    confidence: number;
    landmarks: FaceLandmark[];
    attributes: FaceAttributes;
    recognized: boolean;
    identity?: PersonIdentity;
    quality: FaceQuality;
    emotions: EmotionAnalysis[];
}

export interface FaceLandmark {
    type: 'eye_left' | 'eye_right' | 'nose' | 'mouth' | 'eyebrow_left' | 'eyebrow_right' | 'chin';
    coordinates: { x: number; y: number; };
    confidence: number;
    visible: boolean;
}

export interface FaceAttributes {
    age?: { value: number; confidence: number; };
    gender?: { value: 'male' | 'female' | 'unknown'; confidence: number; };
    ethnicity?: { value: string; confidence: number; };
    glasses?: { value: boolean; confidence: number; };
    mask?: { value: boolean; confidence: number; };
    beard?: { value: boolean; confidence: number; };
    mustache?: { value: boolean; confidence: number; };
    hairColor?: { value: string; confidence: number; };
    skinTone?: { value: string; confidence: number; };
}

export interface PersonIdentity {
    id: string;
    name?: string;
    confidence: number;
    lastSeen: string;
    totalSightings: number;
    aliases: string[];
    tags: string[];
    authorized: boolean;
    accessLevel: string;
    notes: string;
}

export interface FaceQuality {
    overall: number;
    sharpness: number;
    brightness: number;
    contrast: number;
    resolution: number;
    pose: {
        yaw: number;
        pitch: number;
        roll: number;
    };
    occlusion: {
        eyes: number;
        nose: number;
        mouth: number;
    };
}

export interface EmotionAnalysis {
    emotion: 'happy' | 'sad' | 'angry' | 'fear' | 'surprise' | 'disgust' | 'neutral' | 'contempt';
    confidence: number;
    intensity: number;
}

export interface BehaviorAnalysis {
    id: string;
    cameraId: string;
    timestamp: Date;
    behaviorType: 'normal' | 'suspicious' | 'aggressive' | 'loitering' | 'crowd_formation';
    confidence: number;
    duration: number;
    subjects: AnalysisSubject[];
    patterns: BehaviorPattern[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    location: AnalysisLocation;
    metadata: Record<string, any>;
}

export interface AnalysisSubject {
    id: string;
    type: 'person' | 'vehicle' | 'object';
    position: BoundingBox;
    trajectory: TrajectoryPoint[];
    attributes: SubjectAttributes;
}
export interface AnalysisLocation {
    zone: string;
    coordinates: { x: number; y: number };
    area: string;
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TrajectoryPoint {
    x: number;
    y: number;
    timestamp: string;
}
export interface SubjectAttributes {
    age?: number;
    gender?: string;
    clothing?: string[];
    accessories?: string[];
    height?: number;
}


export interface AccessLevel {
    level: number;
    permissions: string[];
    restrictions: string[];
}

export interface FacialFeatures {
    encoding: number[];
    landmarks: FacialLandmark[];
    quality: number;
    pose: FacePose;
}

export interface FacialLandmark {
    type: string;
    x: number;
    y: number;
}

export interface FacePose {
    yaw: number;
    pitch: number;
    roll: number;
}

export interface Identity {
    id: string;
    name: string;
    department?: string;
    clearanceLevel?: string;
    photo?: string;
}

export interface BehaviorPattern {
    type: string;
    severity: number;
    description: string;
    indicators: string[];
}

export interface ContextualFactor {
    factor: string;
    value: any;
    weight: number;
    influence: 'positive' | 'negative' | 'neutral';
}

export interface BehaviorPrediction {
    outcome: string;
    probability: number;
    timeframe: number;
    confidence: number;
    mitigationFactors: string[];
}

export interface InterventionRecommendation {
    type: 'immediate' | 'preventive' | 'monitoring' | 'alert';
    action: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    timeframe: number;
    resources: string[];
    expectedOutcome: string;
}

export interface ObjectAnalysis {
    id: string;
    cameraId: string;
    detectionId: string;
    timestamp: string;
    objectType: 'person' | 'vehicle' | 'bag' | 'weapon' | 'package' | 'animal' | 'unknown';
    subtype?: string;
    confidence: number;
    attributes: ObjectAttributes;
    tracking: ObjectTracking;
    classification: ObjectClassification;
}

export interface ObjectAttributes {
    size: { width: number; height: number; depth?: number; };
    color: { primary: string; secondary?: string; confidence: number; };
    shape: string;
    material?: string;
    brand?: string;
    model?: string;
    condition: 'new' | 'used' | 'damaged' | 'unknown';
    suspicious: boolean;
    abandoned: boolean;
    authorized: boolean;
}

export interface ObjectTracking {
    trackId: string;
    firstSeen: string;
    lastSeen: string;
    trajectory: TrajectoryPoint[];
    velocity: number;
    direction: number;
    zones: string[];
    dwell_time: number;
}

export interface ObjectClassification {
    category: string;
    subcategory?: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    threatAssessment: ThreatAssessment;
    compliance: ComplianceCheck[];
}

export interface ThreatAssessment {
    level: 'minimal' | 'low' | 'moderate' | 'high' | 'severe';
    indicators: string[];
    mitigations: string[];
    escalationRequired: boolean;
}

export interface ComplianceCheck {
    regulation: string;
    status: 'compliant' | 'violation' | 'unknown';
    details: string;
    action_required: boolean;
}

export interface AnalyticsRule {
    id: string;
    name: string;
    description: string;
    type: 'motion' | 'face' | 'behavior' | 'object' | 'custom' | 'composite';
    enabled: boolean;
    priority: number;
    conditions: AnalyticsCondition[];
    actions: AnalyticsAction[];
    schedule: AnalyticsSchedule;
    targets: AnalyticsTarget;
    performance: RulePerformance;
}

export interface AnalyticsCondition {
    id: string;
    type: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'matches' | 'in_range';
    value: any;
    field: string;
    weight: number;
    logical_operator: 'AND' | 'OR' | 'NOT';
}

export interface AnalyticsAction {
    id: string;
    type: 'alert' | 'record' | 'notify' | 'escalate' | 'execute' | 'track' | 'classify';
    parameters: Record<string, any>;
    enabled: boolean;
    delay: number;
    conditions: string[];
    retries: number;
    timeout: number;
}

export interface AnalyticsSchedule {
    enabled: boolean;
    timezone: string;
    timeRanges: AnalyticsTimeRange[];
    exceptions: AnalyticsScheduleException[];
    holidays: Holiday[];
    recurring: RecurringSchedule;
}

export interface AnalyticsTimeRange {
    start: string;
    end: string;
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    enabled: boolean;
}

export interface AnalyticsScheduleException {
    date: string;
    type: 'exclude' | 'include';
    reason: string;
    timeRanges?: AnalyticsTimeRange[];
    approvedBy: string;
}

export interface Holiday {
    name: string;
    date: string;
    type: 'national' | 'regional' | 'company' | 'custom';
    recurring: boolean;
}

export interface RecurringSchedule {
    pattern: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    interval: number;
    endDate?: string;
    occurrences?: number;
}

export interface AnalyticsTarget {
    cameraIds: string[];
    zones: string[];
    groups: string[];
    excludeCameras: string[];
    excludeZones: string[];
    geofences: Geofence[];
}

export interface Geofence {
    id: string;
    name: string;
    type: 'polygon' | 'circle' | 'rectangle';
    coordinates: number[][];
    radius?: number;
    enabled: boolean;
}

export interface RulePerformance {
    totalTriggers: number;
    falsePositives: number;
    truePositives: number;
    accuracy: number;
    avgProcessingTime: number;
    lastTriggered?: string;
    performance_trend: 'improving' | 'stable' | 'declining';
}

export interface AnalyticsReport {
    id: string;
    name: string;
    type: 'detection_summary' | 'performance_analysis' | 'trend_report' | 'compliance_report' | 'custom';
    timeRange: {
        start: string;
        end: string;
        timezone: string;
    };
    filters: AnalyticsFilter[];
    metrics: ReportMetric[];
    visualizations: ReportVisualization[];
    schedule?: ReportSchedule;
    recipients: ReportRecipient[];
    format: 'pdf' | 'excel' | 'json' | 'csv' | 'html';
}

export interface AnalyticsFilter {
    field: string;
    operator: string;
    value: any;
    label: string;
}

export type AIDetection = {
    id: string;
    cameraId: string;
    type: string;
    confidence: number;
    timestamp: string;
    boundingBox?: { x: number; y: number; width: number; height: number };
    description?: string;
    imageUrl?: string;
    metadata?: Record<string, any>;
};

export interface FacialRecognition {
    id: string;
    cameraId: string;
    timestamp: Date;
    personId?: string;
    confidence: number;
    boundingBox: BoundingBox;
    features: FacialFeatures;
    matchedIdentity?: Identity;
    accessLevel?: AccessLevel;
    metadata: Record<string, any>;
}

export type MotionEvent = {
    id: string;
    cameraId: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    intensity: number;
    area: number;
    zones: string[];
    thumbnailUrl?: string;
    videoUrl?: string;
};
export interface ReportMetric {
    name: string;
    value: number;
    unit: string;
    change: number;
    trend: 'up' | 'down' | 'stable';
    benchmark?: number;
}

export interface ReportVisualization {
    type: 'chart' | 'table' | 'heatmap' | 'timeline' | 'map';
    title: string;
    data: any;
    configuration: Record<string, any>;
}

export interface ReportSchedule {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string;
    timezone: string;
    enabled: boolean;
    lastGenerated?: string;
    nextGeneration?: string;
}

export interface ReportRecipient {
    type: 'user' | 'group' | 'email' | 'webhook';
    identifier: string;
    delivery_method: 'email' | 'portal' | 'api' | 'file_share';
    format_preference: string;
}

// Analytics-specific constants
export const ANALYTICS_DETECTION_TYPES = {
    MOTION: 'motion',
    PERSON: 'person',
    FACE: 'face',
    OBJECT: 'object',
    BEHAVIOR: 'behavior',
    ANOMALY: 'anomaly',
    VEHICLE: 'vehicle',
    LICENSE_PLATE: 'license_plate'
} as const;

export const BEHAVIOR_TYPES = {
    NORMAL: 'normal',
    SUSPICIOUS: 'suspicious',
    AGGRESSIVE: 'aggressive',
    FALL: 'fall',
    LOITERING: 'loitering',
    RUNNING: 'running',
    FIGHTING: 'fighting',
    VANDALISM: 'vandalism'
} as const;

export const ANALYTICS_CONFIDENCE_LEVELS = {
    LOW: 0.5,
    MEDIUM: 0.7,
    HIGH: 0.85,
    VERY_HIGH: 0.95
} as const;