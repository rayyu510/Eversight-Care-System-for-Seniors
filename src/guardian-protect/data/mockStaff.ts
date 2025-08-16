import { StaffMember } from './types';

export const mockStaff: StaffMember[] = [
    {
        id: 'STAFF-001',
        name: 'Dr. Patricia Wells',
        role: 'doctor',
        shift: 'day',
        department: 'Medical',
        status: 'emergency_response',
        location: 'Room 201',
        contactNumber: 'EXT-1001',
        certifications: ['MD', 'Geriatric Medicine', 'Emergency Medicine'],
        lastActivity: '2024-07-31 09:27:15'
    },
    // ... add more staff members as needed
];