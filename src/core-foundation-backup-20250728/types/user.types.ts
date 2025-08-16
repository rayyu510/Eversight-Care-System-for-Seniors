// User and role management types
export type UserRole = 'caregiver' | 'family' | 'admin' | 'emergency' | 'resident';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  facilityId: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  user: User;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'zh';
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  emergencyAlerts: boolean;
  careUpdates: boolean;
  systemMessages: boolean;
}

export interface DashboardPreferences {
  layout: 'simple' | 'standard' | 'advanced' | 'expert';
  widgets: string[];
  defaultView: string;
}
