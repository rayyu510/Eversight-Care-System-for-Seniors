// Events Types - src/core-foundation/types/events.types.ts
// Following Eversight Modular Architecture

export enum EventType {
  GUARDIAN_FALL_DETECTED = 'guardian.fall.detected',
  FAMILY_ACCESS_REQUESTED = 'family.access.requested',
  EMERGENCY_ALERT_TRIGGERED = 'emergency.alert.triggered',
  CARE_RECORD_UPDATED = 'caretrack.record.updated',
  USER_PERMISSION_CHANGED = 'security.permission.changed',
  SYSTEM_ERROR = 'system.error',
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout'
}

export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface SystemEvent {
  id: string;
  type: EventType;
  source: string;
  target?: string;
  payload: EventPayload;
  timestamp: Date;
  priority: EventPriority;
  moduleSource: string;
}

export interface EventPayload {
  [key: string]: any;
}

export interface EventTarget {
  module: string;
  component?: string;
  action: string;
}