// Basic Facility Types - Following Eversight Architecture  
// src/core-foundation/types/facility.types.ts

export interface Facility {
  id: string;
  name: string;
  address: string;
  type: FacilityType;
  settings: FacilitySettings;
  rooms: Room[];
  residents: Resident[];
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum FacilityType {
  ASSISTED_LIVING = 'assisted_living',
  MEMORY_CARE = 'memory_care',
  NURSING_HOME = 'nursing_home',
  INDEPENDENT_LIVING = 'independent_living'
}

export interface FacilitySettings {
  guardianEnabled: boolean;
  emergencyProtocols: string[];
  visitorHours: {
    start: string;
    end: string;
  };
  maxVisitors: number;
  specialRequirements: string[];
}

export interface Room {
  id: string;
  number: string; // 101-130, 201-230 as per architecture
  floor: 'first' | 'second';
  type: 'single' | 'double' | 'suite';
  occupancy: number;
  maxOccupancy: number;
  amenities: string[];
  isAccessible: boolean;
  guardianCoverage: boolean;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  roomId: string;
  status: ResidentStatus;
  emergencyContacts: EmergencyContact[];
  medications: Medication[];
  careLevel: 'low' | 'medium' | 'high';
  guardianProfile: {
    fallRisk: 'low' | 'medium' | 'high';
    wanderingRisk: 'low' | 'medium' | 'high';
    specialNeeds: string[];
  };
  admissionDate: Date;
  isActive: boolean;
}

export enum ResidentStatus {
  ACTIVE = 'active',
  TEMPORARY_LEAVE = 'temporary_leave',
  DISCHARGED = 'discharged',
  DECEASED = 'deceased'
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  isPrimary: boolean;
  canMakeDecisions: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: Date;
  endDate?: Date;
  instructions: string;
  isActive: boolean;
}