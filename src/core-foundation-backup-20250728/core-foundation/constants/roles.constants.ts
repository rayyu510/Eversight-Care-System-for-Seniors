import { UserRole } from '../types';

export const USER_ROLES: Record<UserRole, string> = {
  caregiver: '护理人员',
  family: '家属',
  admin: '行政人员', 
  emergency: '急救响应',
  resident: '居住者'
};

export const ROLE_PERMISSIONS = {
  caregiver: [
    'read_residents',
    'write_care_records',
    'read_health_data',
    'emergency_response',
    'guardian_protect_view',
    'guardian_insight_view',
    'guardian_caretrack_full',
    'guardian_carepro_view'
  ],
  family: [
    'read_resident_summary',
    'read_health_summary',
    'schedule_visits',
    'send_messages',
    'receive_notifications'
  ],
  admin: [
    'manage_users',
    'manage_facility',
    'view_reports',
    'manage_billing',
    'system_configuration',
    'all_guardian_modules'
  ],
  emergency: [
    'emergency_full_access',
    'facility_control',
    'all_cameras',
    'emergency_communications',
    'lockdown_procedures'
  ],
  resident: [
    'view_own_health',
    'ai_assistant',
    'family_communication',
    'schedule_preferences'
  ]
} as const;

export const MODULE_ACCESS = {
  'guardian-protect': ['caregiver', 'admin', 'emergency'],
  'guardian-insight': ['caregiver', 'admin'],
  'guardian-caretrack': ['caregiver', 'admin'],
  'guardian-carepro': ['caregiver', 'admin'],
  'configuration-center': ['admin'],
  'family-portal': ['family', 'admin'],
  'emergency-response': ['emergency', 'admin'],
  'reporting-analytics': ['admin', 'caregiver'],
  'communication': ['all'],
  'dashboard': ['all']
} as const;
