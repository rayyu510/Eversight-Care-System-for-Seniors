import { EventType, EventPriority } from '../types';

// Event configuration constants only
export const EVENT_CONFIG = {
  DEFAULT_PRIORITY: EventPriority.MEDIUM,
  DEFAULT_TIMEOUT: 5000,
  MAX_RETRIES: 3,
  BATCH_SIZE: 100
};

export const EVENT_PATTERNS = {
  SYSTEM: /^system:/,
  AUTH: /^auth:/,
  GUARDIAN: /^guardian:/,
  USER: /^user:/,
  FACILITY: /^facility:/
};

export const CRITICAL_EVENTS = [
  EventType.GUARDIAN_FALL_DETECTED,
  EventType.EMERGENCY_ALERT_TRIGGERED,
  EventType.SYSTEM_ERROR
];

export const EVENT_TIMEOUTS = {
  [EventType.GUARDIAN_FALL_DETECTED]: 1000,
  [EventType.EMERGENCY_ALERT_TRIGGERED]: 500,
  [EventType.SYSTEM_ERROR]: 2000,
  [EventType.USER_LOGIN]: 5000,
  [EventType.USER_LOGOUT]: 3000
};
