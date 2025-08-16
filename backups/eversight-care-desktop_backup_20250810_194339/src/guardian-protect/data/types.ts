export interface Resident {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    roomNumber: string;
    floor: 1 | 2;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    medicalConditions: string[];
    fallHistory: FallIncident[];
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    admissionDate: string;
    lastActivity: string;
    currentLocation: string;
}

export interface FallIncident {
    id: string;
    date: string;
    time: string;
    location: string;
    severity: 'minor' | 'moderate' | 'severe';
    description: string;
    responseTime: number;
}

export interface Camera {
    id: string;
    name: string;
    location: string;
    floor: 1 | 2 | 0;
    type: 'room' | 'hallway' | 'common' | 'outdoor';
    status: 'online' | 'offline' | 'maintenance';
    coverage: string;
    lastPing: string;
    recordingStatus: 'recording' | 'standby' | 'error';
}

export interface Alert {
    id: string;
    type: 'fall_detected' | 'wandering' | 'medical_emergency' | 'security_breach' | 'equipment_failure' | 'medication_reminder';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    location: string;
    residentId?: string;
    timestamp: string;
    status: 'active' | 'acknowledged' | 'resolved' | 'escalated';
    acknowledgedBy?: string;
    acknowledgedAt?: string;
    resolvedBy?: string;
    resolvedAt?: string;
    responseTime?: number;
    cameraIds: string[];
    notes?: string;
}

export interface EmergencyResponse {
    id: string;
    type: 'fall_response' | 'medical_emergency' | 'fire_emergency' | 'security_incident' | 'evacuation';
    status: 'dispatched' | 'en_route' | 'on_scene' | 'resolved' | 'escalated';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    location: string;
    alertId?: string;
    residentId?: string;
    dispatchedAt: string;
    dispatchedBy: string;
    assignedTeam: string[];
    estimatedArrival?: string;
    arrivedAt?: string;
    resolvedAt?: string;
    protocols: string[];
    equipment: string[];
    notes: string[];
}

export interface StaffMember {
    id: string;
    name: string;
    role: 'doctor' | 'nurse' | 'cna' | 'therapist' | 'security' | 'maintenance' | 'admin';
    shift: 'day' | 'evening' | 'night';
    department: string;
    status: 'on_duty' | 'off_duty' | 'break' | 'emergency_response';
    location: string;
    contactNumber: string;
    certifications: string[];
    lastActivity: string;
}

export interface HeatMapPoint {
    x: number;
    y: number;
    intensity: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    incidentCount: number;
    lastIncident?: string;
    location: string;
}