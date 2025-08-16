// Facility and resident management types
export interface Facility {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  currentOccupancy: number;
  floorPlans: FloorPlan[];
  rooms: Room[];
  settings: FacilitySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface FloorPlan {
  id: string;
  name: string;
  level: number;
  imageUrl: string;
  rooms: string[]; // Room IDs
  emergencyExits: EmergencyExit[];
  cameras: Camera[];
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite' | 'common' | 'medical';
  capacity: number;
  currentOccupancy: number;
  residents: string[]; // Resident IDs
  cameras: string[]; // Camera IDs
  sensors: Sensor[];
  status: 'available' | 'occupied' | 'maintenance' | 'emergency';
  location: {
    floor: number;
    x: number;
    y: number;
  };
}

export interface Resident {
  id: string;
  facilityId: string;
  roomId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  medicalRecordNumber: string;
  emergencyContacts: EmergencyContact[];
  familyMembers: string[]; // User IDs
  careLevel: 'independent' | 'assisted' | 'memory' | 'skilled';
  healthProfile: HealthProfile;
  admissionDate: Date;
  status: 'active' | 'temporary_out' | 'discharged' | 'deceased';
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface HealthProfile {
  allergies: string[];
  medications: Medication[];
  conditions: MedicalCondition[];
  mobility: 'independent' | 'walker' | 'wheelchair' | 'bedridden';
  cognition: 'normal' | 'mild_impairment' | 'moderate_impairment' | 'severe_impairment';
  fallRisk: 'low' | 'medium' | 'high' | 'critical';
  dietRestrictions: string[];
  dnr: boolean;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  prescribedBy: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface MedicalCondition {
  name: string;
  icd10Code: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosisDate: Date;
  isActive: boolean;
}

export interface Camera {
  id: string;
  name: string;
  roomId: string;
  type: 'fixed' | 'ptz' | 'thermal';
  status: 'online' | 'offline' | 'maintenance';
  streamUrl: string;
  hasAudio: boolean;
  hasNightVision: boolean;
  fieldOfView: {
    angle: number;
    direction: number;
  };
  location: {
    x: number;
    y: number;
    height: number;
  };
}

export interface Sensor {
  id: string;
  type: 'motion' | 'door' | 'bed' | 'bathroom' | 'fall' | 'temperature' | 'humidity';
  status: 'active' | 'inactive' | 'error';
  value: number | boolean | string;
  unit?: string;
  lastReading: Date;
  batteryLevel?: number;
}

export interface EmergencyExit {
  id: string;
  name: string;
  location: {
    x: number;
    y: number;
  };
  isAccessible: boolean;
  leadsTo: string;
}

export interface FacilitySettings {
  timezone: string;
  businessHours: {
    start: string;
    end: string;
  };
  emergencyProcedures: EmergencyProcedure[];
  visitorPolicies: VisitorPolicy[];
  compliance: ComplianceSettings;
}

export interface EmergencyProcedure {
  type: 'fire' | 'medical' | 'security' | 'natural_disaster' | 'evacuation';
  title: string;
  description: string;
  steps: string[];
  contacts: string[];
  isActive: boolean;
}

export interface VisitorPolicy {
  type: 'general' | 'family' | 'medical' | 'vendor';
  allowedHours: {
    start: string;
    end: string;
  };
  requiresApproval: boolean;
  maxDuration: number; // minutes
  restrictions: string[];
}

export interface ComplianceSettings {
  dataRetentionDays: number;
  auditLogRetentionDays: number;
  requireMFA: boolean;
  passwordPolicy: PasswordPolicy;
  sessionTimeoutMinutes: number;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // days
  preventReuse: number; // number of previous passwords
}
