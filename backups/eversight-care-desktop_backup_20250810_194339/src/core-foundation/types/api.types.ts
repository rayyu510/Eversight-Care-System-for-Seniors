// API Types - src/core-foundation/types/api.types.ts
// Following Eversight Modular Architecture

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata: APIMetadata;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  module?: string;
}

export interface APIMetadata {
  timestamp: Date;
  version: string;
  requestId: string;
  moduleSource: string;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  permissions: string[];
  validation: any;
  handler: (req: any) => Promise<APIResponse<any>>;
}

export interface ModuleEvent {
  type: string;
  source: string;
  target?: string;
  payload: any;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export enum EventTypes {
  GUARDIAN_FALL_DETECTED = 'guardian.fall.detected',
  FAMILY_ACCESS_REQUESTED = 'family.access.requested',
  EMERGENCY_ALERT_TRIGGERED = 'emergency.alert.triggered',
  CARE_RECORD_UPDATED = 'caretrack.record.updated',
  USER_PERMISSION_CHANGED = 'security.permission.changed'
}