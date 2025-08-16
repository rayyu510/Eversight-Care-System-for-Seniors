// Guardian System Types - Preparing for Phase 2 Guardian Modules
// Following Eversight Modular Architecture Proposal

export interface GuardianEvent {
  id: string;
  type: 'fall_detected' | 'wandering' | 'behavior_anomaly' | 'area_violation';
  residentId: string;
  location: GuardianLocation;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  videoFeedId?: string;
  aiConfidence: number;
  responseRequired: boolean;
}

export interface GuardianLocation {
  floor: 'first' | 'second' | 'outdoor';
  room?: string; // 101-130 (1st floor), 201-230 (2nd floor)
  area: 'room' | 'hallway' | 'common_area' | 'activity_center' | 'service_area';
  coordinates?: { x: number; y: number };
  cameraId: string;
}

export interface GuardianAlert {
  id: string;
  eventId: string;
  status: 'pending' | 'acknowledged' | 'responding' | 'resolved';
  assignedTo?: string;
  responseTime?: number;
  actions: GuardianAction[];
}

export interface GuardianAction {
  id: string;
  type: 'view_video' | 'dispatch_staff' | 'call_emergency' | 'family_notify';
  timestamp: Date;
  userId: string;
  result?: string;
}

export interface GuardianConfig {
  fallDetectionEnabled: boolean;
  wanderingDetectionEnabled: boolean;
  behaviorAnalysisEnabled: boolean;
  alertThresholds: {
    fall: number;
    wandering: number;
    behavior: number;
  };
  responseTeams: string[];
  emergencyContacts: string[];
}