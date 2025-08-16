export const EVENT_TYPES = {
  SYSTEM_STARTUP: 'system.startup',
  SYSTEM_SHUTDOWN: 'system.shutdown', 
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  GUARDIAN_FALL_DETECTED: 'guardian.protect.fall.detected',
  EMERGENCY_ALERT_TRIGGERED: 'emergency.alert.triggered'
} as const;
