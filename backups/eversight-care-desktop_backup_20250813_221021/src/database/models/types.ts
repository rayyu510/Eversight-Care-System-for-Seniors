// ==========================================
// GUARDIAN ECOSYSTEM - TYPESCRIPT MODELS
// ==========================================
// File: src/database/models/types.ts

// ==========================================
// CORE FOUNDATION MODELS
// ==========================================

export interface User {
    id: number;
    uuid: string;
    username: string;
    email: string;
    password_hash?: string; // Optional for security
    role: 'admin' | 'caregiver' | 'family' | 'professional' | 'viewer';
    first_name: string;
    last_name: string;
    phone?: string;
    avatar_url?: string;
    timezone: string;
    language: string;
    is_active: boolean;
    last_login_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface CareRecipient {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    medical_record_number?: string;
    primary_caregiver_id?: number;
    care_level?: 'independent' | 'assisted' | 'memory_care' | 'skilled_nursing';
    mobility_status?: string;
    cognitive_status?: string;
    medical_conditions?: string[]; // JSON array
    medications?: string[]; // JSON array
    allergies?: string[]; // JSON array
    dietary_restrictions?: string[]; // JSON array
    is_active: boolean;
    created_at: Date;
    updated_at: Date;

    // Computed properties
    age?: number;
    full_name?: string;
}

export interface CareTeamMember {
    id: number;
    care_recipient_id: number;
    user_id: number;
    role: 'primary_caregiver' | 'family_member' | 'nurse' | 'doctor' | 'therapist' | 'social_worker' | 'aide';
    relationship?: string;
    permissions?: string[]; // JSON array
    start_date: Date;
    end_date?: Date;
    is_active: boolean;
    created_at: Date;

    // Relations
    user?: User;
    care_recipient?: CareRecipient;
}

export interface Alert {
    id: number;
    uuid: string;
    care_recipient_id: number;
    module: 'protect' | 'insight' | 'carepro' | 'caretrack';
    alert_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    data?: any; // JSON data specific to alert type
    location?: string;
    triggered_at: Date;
    acknowledged_at?: Date;
    acknowledged_by?: number;
    resolved_at?: Date;
    resolved_by?: number;
    status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
    created_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    acknowledged_by_user?: User;
    resolved_by_user?: User;
}

export interface Device {
    id: number;
    uuid: string;
    care_recipient_id: number;
    device_type: 'sensor' | 'wearable' | 'camera' | 'beacon' | 'tablet';
    device_model?: string;
    device_name: string;
    location?: string;
    room?: string;
    battery_level?: number;
    signal_strength?: number;
    firmware_version?: string;
    last_heartbeat?: Date;
    configuration?: any; // JSON configuration
    is_active: boolean;
    installed_at: Date;
    created_at: Date;
    updated_at: Date;

    // Relations
    care_recipient?: CareRecipient;
}

// ==========================================
// GUARDIAN PROTECT MODELS
// ==========================================

export interface SafetyEvent {
    id: number;
    uuid: string;
    care_recipient_id: number;
    device_id?: number;
    event_type: 'fall' | 'wandering' | 'medication_missed' | 'emergency_button' | 'door_open' | 'motion_detected';
    severity: 'low' | 'medium' | 'high' | 'critical';
    location?: string;
    room?: string;
    description?: string;
    sensor_data?: any; // JSON sensor readings
    image_url?: string;
    video_url?: string;
    response_time?: number; // seconds
    responded_by?: number;
    resolution_notes?: string;
    occurred_at: Date;
    resolved_at?: Date;
    status: 'open' | 'investigating' | 'resolved' | 'false_positive';
    created_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    device?: Device;
    responder?: User;
}

export interface SensorReading {
    id: number;
    device_id: number;
    care_recipient_id: number;
    sensor_type: 'motion' | 'door' | 'temperature' | 'humidity' | 'light' | 'sound';
    value: number;
    unit?: string;
    location?: string;
    room?: string;
    metadata?: any; // JSON additional data
    recorded_at: Date;
    created_at: Date;

    // Relations
    device?: Device;
    care_recipient?: CareRecipient;
}

export interface EmergencyResponse {
    id: number;
    care_recipient_id: number;
    response_type: 'fall' | 'medical' | 'wandering' | 'fire' | 'security';
    priority_order: number;
    contact_type: 'family' | 'professional' | 'emergency_services' | 'facility';
    contact_name: string;
    contact_phone: string;
    contact_email?: string;
    response_instructions?: string;
    is_active: boolean;
    created_at: Date;

    // Relations
    care_recipient?: CareRecipient;
}

// ==========================================
// GUARDIAN INSIGHT MODELS
// ==========================================

export interface BehaviorPattern {
    id: number;
    care_recipient_id: number;
    pattern_type: 'sleep' | 'activity' | 'social' | 'eating' | 'medication' | 'bathroom';
    pattern_name: string;
    description?: string;
    baseline_data?: any; // JSON baseline metrics
    current_data?: any; // JSON current metrics
    variance_threshold: number;
    trend?: 'improving' | 'stable' | 'declining' | 'concerning';
    confidence_score?: number; // 0.0 to 1.0
    last_analyzed?: Date;
    date_range_start: Date;
    date_range_end: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;

    // Relations
    care_recipient?: CareRecipient;
}

export interface ActivityLog {
    id: number;
    care_recipient_id: number;
    activity_type: 'wake_up' | 'breakfast' | 'medication' | 'exercise' | 'social' | 'rest' | 'sleep';
    activity_name?: string;
    location?: string;
    room?: string;
    duration_minutes?: number;
    quality_rating?: number; // 1-5
    mood_rating?: number; // 1-5
    notes?: string;
    caregiver_id?: number;
    device_detected: boolean;
    started_at: Date;
    ended_at?: Date;
    created_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    caregiver?: User;
}

export interface HealthMetric {
    id: number;
    care_recipient_id: number;
    metric_type: 'weight' | 'blood_pressure' | 'heart_rate' | 'temperature' | 'oxygen_saturation' | 'blood_sugar';
    value: number;
    unit: string;
    device_id?: number;
    measured_by?: number;
    measurement_context?: 'routine' | 'symptom_check' | 'post_medication' | 'emergency';
    notes?: string;
    is_abnormal: boolean;
    measured_at: Date;
    created_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    device?: Device;
    measurer?: User;
}

export interface CognitiveAssessment {
    id: number;
    care_recipient_id: number;
    assessment_type: 'mmse' | 'moca' | 'clock_draw' | 'word_recall' | 'orientation';
    score?: number;
    max_score?: number;
    percentage?: number;
    assessor_id: number;
    assessment_notes?: string;
    recommendations?: string;
    administered_at: Date;
    created_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    assessor?: User;
}

// ==========================================
// GUARDIAN CAREPRO MODELS
// ==========================================

export interface CarePlan {
    id: number;
    uuid: string;
    care_recipient_id: number;
    plan_name: string;
    plan_type: 'medical' | 'therapy' | 'daily_living' | 'social' | 'comprehensive';
    created_by: number;
    approved_by?: number;
    start_date: Date;
    end_date?: Date;
    goals?: string[]; // JSON array
    interventions?: string[]; // JSON array
    success_metrics?: string[]; // JSON array
    review_frequency?: 'weekly' | 'monthly' | 'quarterly';
    next_review_date?: Date;
    status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';
    created_at: Date;
    updated_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    creator?: User;
    approver?: User;
    tasks?: CareTask[];
}

export interface CareTask {
    id: number;
    uuid: string;
    care_plan_id?: number;
    care_recipient_id: number;
    task_name: string;
    task_type: 'medication' | 'therapy' | 'personal_care' | 'social' | 'medical' | 'assessment';
    description?: string;
    instructions?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigned_to?: number;
    frequency?: 'once' | 'daily' | 'weekly' | 'as_needed';
    estimated_duration?: number; // minutes
    required_skills?: string[]; // JSON array
    due_date?: Date;
    due_time?: string;
    completed_at?: Date;
    completed_by?: number;
    completion_notes?: string;
    quality_rating?: number; // 1-5
    status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'overdue';
    created_at: Date;
    updated_at: Date;

    // Relations
    care_plan?: CarePlan;
    care_recipient?: CareRecipient;
    assignee?: User;
    completer?: User;
}

export interface ProfessionalService {
    id: number;
    care_recipient_id: number;
    service_type: 'nursing' | 'physical_therapy' | 'occupational_therapy' | 'speech_therapy' | 'social_work' | 'medical';
    provider_name: string;
    provider_license?: string;
    provider_phone?: string;
    provider_email?: string;
    service_frequency?: string;
    service_duration?: number; // minutes
    hourly_rate?: number;
    certification_required: boolean;
    start_date: Date;
    end_date?: Date;
    notes?: string;
    is_active: boolean;
    created_at: Date;

    // Relations
    care_recipient?: CareRecipient;
}

export interface Medication {
    id: number;
    care_recipient_id: number;
    medication_name: string;
    generic_name?: string;
    dosage: string;
    form?: 'tablet' | 'liquid' | 'injection' | 'patch';
    frequency: string;
    route?: 'oral' | 'topical' | 'injection';
    prescribing_doctor?: string;
    pharmacy?: string;
    start_date: Date;
    end_date?: Date;
    instructions?: string;
    side_effects?: string;
    interactions?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    administrations?: MedicationAdministration[];
}

export interface MedicationAdministration {
    id: number;
    medication_id: number;
    care_recipient_id: number;
    administered_by: number;
    scheduled_time: Date;
    actual_time?: Date;
    dosage_given?: string;
    status: 'given' | 'refused' | 'missed' | 'held' | 'partial';
    reason?: string;
    side_effects_observed?: string;
    notes?: string;
    created_at: Date;

    // Relations
    medication?: Medication;
    care_recipient?: CareRecipient;
    administrator?: User;
}

// ==========================================
// GUARDIAN CARETRACK MODELS
// ==========================================

export interface Appointment {
    id: number;
    uuid: string;
    care_recipient_id: number;
    appointment_type: 'medical' | 'therapy' | 'social' | 'personal_care' | 'assessment';
    title: string;
    description?: string;
    provider_name?: string;
    provider_phone?: string;
    location?: string;
    address?: string;
    scheduled_start: Date;
    scheduled_end: Date;
    actual_start?: Date;
    actual_end?: Date;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    transportation_needed: boolean;
    transportation_arranged: boolean;
    reminder_sent: boolean;
    created_by: number;
    notes?: string;
    outcome_notes?: string;
    created_at: Date;
    updated_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    creator?: User;
}

export interface CareCommunication {
    id: number;
    care_recipient_id: number;
    from_user_id: number;
    to_user_id?: number;
    to_role?: string;
    communication_type: 'note' | 'update' | 'concern' | 'question' | 'instruction' | 'alert';
    subject?: string;
    message: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    is_urgent: boolean;
    read_at?: Date;
    responded_at?: Date;
    response_message?: string;
    attachments?: string[]; // JSON array
    related_alert_id?: number;
    related_task_id?: number;
    created_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    from_user?: User;
    to_user?: User;
    related_alert?: Alert;
    related_task?: CareTask;
}

export interface CareShift {
    id: number;
    care_recipient_id: number;
    caregiver_id: number;
    shift_type: 'day' | 'evening' | 'night' | 'overnight' | 'weekend';
    scheduled_start: Date;
    scheduled_end: Date;
    actual_start?: Date;
    actual_end?: Date;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    tasks_assigned?: number[]; // JSON array of task IDs
    tasks_completed?: number[]; // JSON array of completed task IDs
    hourly_rate?: number;
    total_hours?: number;
    break_minutes: number;
    notes?: string;
    supervisor_approval: boolean;
    created_at: Date;
    updated_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    caregiver?: User;
}

export interface ProgressNote {
    id: number;
    care_recipient_id: number;
    author_id: number;
    note_type: 'daily' | 'incident' | 'assessment' | 'family_communication' | 'medical' | 'behavioral';
    title?: string;
    content: string;
    tags?: string[]; // JSON array
    mood?: string;
    behavior?: string;
    physical_condition?: string;
    cognitive_status?: string;
    social_interaction?: string;
    goals_progress?: string;
    concerns?: string;
    recommendations?: string;
    is_private: boolean;
    visibility: 'team' | 'family' | 'professional' | 'private';
    note_date: Date;
    created_at: Date;
    updated_at: Date;

    // Relations
    care_recipient?: CareRecipient;
    author?: User;
}

// ==========================================
// SYSTEM MODELS
// ==========================================

export interface SystemSetting {
    id: number;
    category: string;
    setting_key: string;
    setting_value: string;
    data_type: 'string' | 'number' | 'boolean' | 'json';
    description?: string;
    is_user_configurable: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface AuditLog {
    id: number;
    user_id?: number;
    care_recipient_id?: number;
    module: string;
    action: string;
    table_name?: string;
    record_id?: number;
    old_values?: any; // JSON
    new_values?: any; // JSON
    ip_address?: string;
    user_agent?: string;
    timestamp: Date;

    // Relations
    user?: User;
    care_recipient?: CareRecipient;
}

export interface FileStorage {
    id: number;
    uuid: string;
    original_filename: string;
    stored_filename: string;
    file_path: string;
    file_size?: number;
    mime_type?: string;
    file_category?: 'document' | 'image' | 'video' | 'audio' | 'report';
    related_table?: string;
    related_id?: number;
    uploaded_by: number;
    is_public: boolean;
    created_at: Date;

    // Relations
    uploader?: User;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
}

// ==========================================
// DASHBOARD & ANALYTICS TYPES
// ==========================================

export interface DashboardStats {
    totalCareRecipients: number;
    activeAlerts: number;
    todaysTasks: number;
    upcomingAppointments: number;
    recentActivity: ActivityLog[];
    alertsByModule: Record<string, number>;
    tasksByStatus: Record<string, number>;
}

export interface AnalyticsData {
    timeRange: {
        start: Date;
        end: Date;
    };
    metrics: {
        safetyEvents: number;
        completedTasks: number;
        medicationCompliance: number;
        averageResponseTime: number;
    };
    trends: {
        alertsOverTime: Array<{ date: string; count: number }>;
        taskCompletionRate: Array<{ date: string; rate: number }>;
        healthMetricsAverage: Array<{ date: string; metric: string; value: number }>;
    };
}

// ==========================================
// FORM VALIDATION TYPES
// ==========================================

export interface ValidationError {
    field: string;
    message: string;
}

export interface FormState<T = any> {
    data: T;
    errors: ValidationError[];
    isValid: boolean;
    isSubmitting: boolean;
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
    alertTypes: string[];
    quietHours: {
        enabled: boolean;
        start: string;
        end: string;
    };
}