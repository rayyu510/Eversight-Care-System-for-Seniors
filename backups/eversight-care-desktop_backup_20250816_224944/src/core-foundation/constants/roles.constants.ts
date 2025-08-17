import { UserRole, PermissionLevel } from '../types/user.types';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: [
    'manage_all',
    'view_all',
    'edit_all',
    'delete_all',
    'system_config'
  ],
  [UserRole.FACILITY_ADMIN]: [
    'manage_facility',
    'view_residents',
    'edit_residents',
    'manage_staff',
    'view_reports'
  ],
  [UserRole.CHARGE_NURSE]: [
    'view_residents',
    'edit_care_plans',
    'medication_management',
    'supervise_staff'
  ],
  [UserRole.STAFF_NURSE]: [
    'view_residents',
    'edit_care_records',
    'medication_administration'
  ],
  [UserRole.CNA]: [
    'view_residents',
    'basic_care_recording'
  ],
  // ADD MISSING BASIC ROLES:
  [UserRole.ADMIN]: [
    'manage_all',
    'view_all',
    'edit_all'
  ],
  [UserRole.CAREGIVER]: [
    'view_residents',
    'basic_care_recording'
  ],
  [UserRole.NURSE]: [
    'view_residents',
    'edit_care_records',
    'medication_administration'
  ],
  [UserRole.RESIDENT]: [
    'view_own_info'
  ],
  [UserRole.SUPERVISOR]: [
    'view_residents',
    'supervise_staff',
    'view_reports'
  ],
  [UserRole.FAMILY]: [
    'view_family_member',
    'receive_updates'
  ]
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.FACILITY_ADMIN]: 80,
  [UserRole.CHARGE_NURSE]: 60,
  [UserRole.STAFF_NURSE]: 40,
  [UserRole.CNA]: 20,
  // ADD MISSING BASIC ROLES:
  [UserRole.ADMIN]: 90,
  [UserRole.CAREGIVER]: 30,
  [UserRole.NURSE]: 50,
  [UserRole.RESIDENT]: 5,
  [UserRole.SUPERVISOR]: 70,
  [UserRole.FAMILY]: 10
};

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Administrator',
  [UserRole.FACILITY_ADMIN]: 'Facility Administrator',
  [UserRole.CHARGE_NURSE]: 'Charge Nurse',
  [UserRole.STAFF_NURSE]: 'Staff Nurse',
  [UserRole.CNA]: 'Certified Nursing Assistant',
  // ADD MISSING BASIC ROLES:
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.CAREGIVER]: 'Caregiver',
  [UserRole.NURSE]: 'Nurse',
  [UserRole.RESIDENT]: 'Resident',
  [UserRole.SUPERVISOR]: 'Supervisor',
  [UserRole.FAMILY]: 'Family Member'
};