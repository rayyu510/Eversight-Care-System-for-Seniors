// src/surveillance-center/types/securityTypes.ts

export type SecurityEventType =
    | 'intrusion'
    | 'unauthorized_access'
    | 'suspicious_behavior'
    | 'emergency'
    | 'system_breach'
    | 'policy_violation'
    | 'motion_detected'
    | 'face_detected'
    | 'perimeter_breach'
    | 'access_denied'
    | 'equipment_failure'
    | 'maintenance_alert';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityAttachment {
    id: string;
    name: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'log';
    url: string;
    size: number;
    uploadedAt: Date;
    uploadedBy: string;
    description?: string;
    metadata?: Record<string, any>;
}

export interface EventTypeCount {
    type: SecurityEventType;
    count: number;
    percentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}

export interface ResponseMetrics {
    averageResponseTime: number;
    medianResponseTime: number;
    fastestResponse: number;
    slowestResponse: number;
    totalResponses: number;
    successRate: number;
    escalationRate: number;
    resolvedWithinSLA: number;
    responseTimeByType: Record<SecurityEventType, number>;
    responseTimeByHour: Array<{
        hour: number;
        averageTime: number;
        count: number;
    }>;
}

export interface SecurityEvent {
    id: string;
    type: SecurityEventType;
    severity: SecuritySeverity;
    title: string;
    description: string;
    source: SecurityEventSource;
    location: SecurityLocation;
    timestamp: Date;
    status?: string; // ✅ Add missing status property
    detection?: SecurityDetection; // ✅ Add missing detection property
    response?: SecurityResponse; // ✅ Add missing response property
    acknowledgedAt?: Date;
    acknowledgedBy?: string;
    acknowledged?: boolean; // ✅ Add missing boolean property
    resolvedAt?: Date;
    resolvedBy?: string;
    resolved?: boolean; // ✅ Add missing boolean property
    escalated?: boolean;
    escalatedAt?: Date;
    escalatedTo?: string;
    assignedTo?: string; // ✅ Add missing property
    estimatedImpact?: SecurityImpact; // ✅ Add missing property
    metadata?: Record<string, any>;
    attachments?: SecurityAttachment[];
}

// ✅ Add SecurityEventSource interface
export interface SecurityEventSource {
    type: 'camera' | 'sensor' | 'system' | 'manual' | 'ai_analytics' | 'ai_analysis'; // ✅ Add ai_analysis
    sourceId: string;
    location: {
        building: string;
        floor: string;
        room: string;
        zone: string;
        coordinates?: { x: number; y: number };
        description?: string;
    };
    timestamp: string;
    reliability: number;
}

export interface SecurityLocation {
    building: string;
    floor: string;
    room: string;
    zone: string;
    coordinates?: { x: number; y: number; z?: number; };
    description: string;
}

export interface SecurityDetection {
    confidence: number;
    method: 'motion' | 'face_recognition' | 'behavior_analysis' | 'manual_trigger' | 'sensor_trigger' | 'ai_anomaly';
    boundingBox?: BoundingBox;
    description: string;
    evidence: SecurityEvidence[];
    relatedDetections: string[];
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    normalized: boolean;
}

export interface SecurityEvidence {
    id: string;
    type: 'video' | 'image' | 'audio' | 'sensor_data' | 'log_entry';
    url: string;
    timestamp: string;
    duration?: number;
    fileSize: number;
    checksum: string;
    chainOfCustody: CustodyRecord[];
}

export interface CustodyRecord {
    handedBy: string;
    receivedBy: string;
    timestamp: string;
    reason: string;
    verified: boolean;
}

export interface SecurityResponse {
    required: boolean;
    priority: 'low' | 'medium' | 'high' | 'emergency';
    assignedTo?: string;
    estimatedResponseTime?: number;
    actualResponseTime?: number;
    escalationRules: EscalationRule[];
    actions: SecurityAction[];
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface EscalationRule {
    id: string;
    condition: string;
    timeLimit: number;
    escalateTo: string;
    notificationMethod: 'email' | 'sms' | 'call' | 'push' | 'pager';
    autoEscalate: boolean;
}

export interface SecurityAction {
    id: string;
    type: 'notify' | 'lock_down' | 'evacuate' | 'investigate' | 'monitor' | 'alert_authorities';
    description: string;
    assignedTo: string;
    dueBy?: string;
    completed: boolean;
    completedAt?: string;
    result?: string;
    evidence?: string[];
}

export interface SecurityEventMetadata {
    tags: string[];
    attachments: string[];
    relatedEvents: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    lastAccessed: string;
    accessLog: AccessRecord[];
    classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface AccessRecord {
    userId: string;
    timestamp: string;
    action: 'view' | 'edit' | 'delete' | 'export' | 'share';
    ipAddress: string;
    userAgent: string;
}

export interface SecurityImpact {
    level: 'minimal' | 'low' | 'medium' | 'high' | 'critical';
    affectedSystems: string[];
    affectedPersons: number;
    financialImpact?: number;
    reputationalRisk: 'low' | 'medium' | 'high';
    complianceImpact: string[];
}

export interface SecurityAlert {
    id: string;
    eventId: string;
    type: 'security_breach' | 'system_failure' | 'maintenance_required' | 'emergency' | 'policy_violation' | 'suspicious_activity';
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
    resolved: boolean;
    resolvedBy?: string;
    resolvedAt?: string;
    actions: SecurityAlertAction[];
    notifications: NotificationRecord[];
    escalated: boolean;
    escalatedTo?: string[];
}

export interface SecurityAlertAction {
    id: string;
    type: 'notify' | 'escalate' | 'automate' | 'manual' | 'investigate';
    target: string;
    parameters: Record<string, any>;
    completed: boolean;
    completedAt?: string;
    result?: string;
    error?: string;
}

export interface NotificationRecord {
    id: string;
    method: 'email' | 'sms' | 'push' | 'call' | 'webhook';
    recipient: string;
    sentAt: string;
    delivered: boolean;
    deliveredAt?: string;
    error?: string;
}

export interface SecurityMetrics {
    totalEvents: number;
    activeAlerts: number;
    resolvedToday: number;
    averageResponseTime: number;
    performanceIndicators?: SecurityKPIs;
    systemHealth: number;
    trends: SecurityTrend[];
    topEventTypes: EventTypeCount[];
    responseMetrics: ResponseMetrics;
    timestamp: Date;
    // ✅ Add missing properties used in components
    timeRange?: string;
    openEvents?: number;
    resolvedEvents?: number; // ✅ Add missing property
    criticalEvents?: number;
    averageResolutionTime?: number;
    falsePositiveRate?: number;
    escalationRate?: number;
    complianceScore?: number; // ✅ Add missing property
    systemVulnerabilities?: SecurityVulnerability[]; // ✅ Add missing property
    activeUsers?: number; // ✅ Add missing property
    trendData?: any[];
}

export interface SecurityKPIs {
    alertResolutionRate: number;
    falsePositiveRate: number;
    averageDetectionTime: number;
    systemUptime: number;
    operatorEfficiency: number;
    incidentEscalationRate: number;
}

export interface SecurityVulnerability {
    id: string;
    type: 'software' | 'hardware' | 'configuration' | 'process' | 'human';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    affectedSystems: string[];
    cvssScore?: number;
    exploitability: 'theoretical' | 'functional' | 'high' | 'proof_of_concept';
    mitigationSteps: string[];
    discovered: string;
    discoveredBy: string;
    status: 'open' | 'mitigating' | 'resolved' | 'accepted';
    dueDate?: string;
    assignedTo?: string;
}

export interface SecurityKPI {
    metric: string;
    value: number;
    target: number;
    unit: string;
    trend: 'improving' | 'stable' | 'declining';
    period: string;
    lastUpdated: string;
    threshold: {
        warning: number;
        critical: number;
    };
}

export interface SecurityTrend {
    metric: string;
    period: string;
    data: Array<{
        timestamp: string;
        value: number;
    }>;
}

export interface SecurityPolicy {
    id: string;
    name: string;
    description: string;
    version: string;
    effective: string;
    expires?: string;
    status: 'draft' | 'active' | 'deprecated' | 'archived';
    rules: SecurityRule[];
    exceptions: PolicyException[];
    compliance: ComplianceRequirement[];
}

export interface SecurityRule {
    id: string;
    type: 'access' | 'behavior' | 'system' | 'data' | 'network';
    condition: string;
    action: 'allow' | 'deny' | 'alert' | 'log' | 'escalate';
    priority: number;
    enabled: boolean;
    parameters: Record<string, any>;
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

export interface ComplianceRequirement {
    standard: string;
    requirement: string;
    status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
    evidence: string[];
    lastAssessed: string;
    nextAssessment: string;
}

export interface SecurityIncident {
    id: string;
    eventIds: string[];
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
    declaredAt: string;
    declaredBy: string;
    incidentCommander?: string;
    team: IncidentTeamMember[];
    timeline: IncidentTimelineEntry[];
    impact: SecurityImpact;
    rootCause?: string;
    lessonsLearned?: string[];
    preventionMeasures?: string[];
}

export interface IncidentTeamMember {
    userId: string;
    role: 'commander' | 'investigator' | 'analyst' | 'coordinator' | 'specialist';
    assignedAt: string;
    status: 'active' | 'standby' | 'offline';
}

export interface IncidentTimelineEntry {
    id: string;
    timestamp: string;
    type: 'detection' | 'containment' | 'investigation' | 'communication' | 'resolution';
    description: string;
    performedBy: string;
    evidence?: string[];
}

// Security-specific constants
export const SECURITY_EVENT_TYPES = {
    INTRUSION: 'intrusion',
    UNAUTHORIZED_ACCESS: 'unauthorized_access',
    SUSPICIOUS_BEHAVIOR: 'suspicious_behavior',
    EMERGENCY: 'emergency',
    SYSTEM_BREACH: 'system_breach',
    POLICY_VIOLATION: 'policy_violation'
} as const;

export const SECURITY_SEVERITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
} as const;

export const SECURITY_EVENT_STATUS = {
    OPEN: 'open',
    INVESTIGATING: 'investigating',
    RESOLVED: 'resolved',
    CLOSED: 'closed'
} as const;

export const SECURITY_ALERT_TYPES = {
    SECURITY_BREACH: 'security_breach',
    SYSTEM_FAILURE: 'system_failure',
    MAINTENANCE_REQUIRED: 'maintenance_required',
    EMERGENCY: 'emergency',
    POLICY_VIOLATION: 'policy_violation',
    SUSPICIOUS_ACTIVITY: 'suspicious_activity'
} as const;

