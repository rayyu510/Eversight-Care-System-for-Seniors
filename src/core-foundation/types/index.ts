// Update your src/core-foundation/types/index.ts EventType enum to include missing values:

export enum EventType {
    ALERT = 'alert',
    DEVICE_STATUS = 'device_status',
    USER_ACTION = 'user_action',
    SYSTEM = 'system',
    // Add missing Guardian-specific events:
    GUARDIAN_FALL_DETECTED = 'guardian_fall_detected',
    EMERGENCY_ALERT_TRIGGERED = 'emergency_alert_triggered',
    SYSTEM_ERROR = 'system_error',
    USER_LOGIN = 'user_login',
    USER_LOGOUT = 'user_logout'
}

export enum EventPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

// Also add the missing User interface:
export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'caregiver' | 'family' | 'user';
    firstName: string;
    lastName: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Update AuthSession to include user reference:
export interface AuthSession {
    id: string;
    userId: string;
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: Date | string;  // Allow both Date and string
    createdAt: Date | string;  // Allow both Date and string
    lastActivity: Date | string;  // Allow both Date and string
}