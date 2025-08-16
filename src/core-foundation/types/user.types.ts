// User Types - src/core-foundation/types/user.types.ts
// Following Eversight Modular Architecture

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: UserPermissions[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  // Basic roles
  ADMIN = 'admin',
  CAREGIVER = 'caregiver',
  NURSE = 'nurse',
  FAMILY = 'family',
  RESIDENT = 'resident',
  SUPERVISOR = 'supervisor',

  // Extended roles from your constants file
  SUPER_ADMIN = 'super_admin',
  FACILITY_ADMIN = 'facility_admin',
  CHARGE_NURSE = 'charge_nurse',
  STAFF_NURSE = 'staff_nurse',
  CNA = 'cna'
}

export enum UserPermissions {
  VIEW_RESIDENTS = 'view_residents',
  EDIT_RESIDENTS = 'edit_residents',
  VIEW_REPORTS = 'view_reports',
  MANAGE_USERS = 'manage_users',
  GUARDIAN_ACCESS = 'guardian_access',
  EMERGENCY_RESPONSE = 'emergency_response',
  FAMILY_PORTAL = 'family_portal'
}

export enum PermissionLevel {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface UserSettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
}