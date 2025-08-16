import { EmergencyResponse } from './types';

export const mockEmergencyResponses: EmergencyResponse[] = [
    {
        id: 'RESP-001',
        type: 'fall_response',
        status: 'dispatched',
        priority: 'critical',
        title: 'Fall Response - Room 201',
        description: 'Immediate response needed for fall detected in Room 201',
        location: 'Room 201',
        alertId: 'ALERT-001',
        residentId: 'RES-201',
        dispatchedAt: '2024-07-31 09:25:45',
        dispatchedBy: 'Sarah Johnson, RN',
        assignedTeam: ['Dr. Patricia Wells', 'Nurse Jennifer Adams', 'CNA Mike Thompson'],
        estimatedArrival: '2024-07-31 09:27:00',
        protocols: ['Fall Assessment Protocol', 'Injury Evaluation', 'Family Notification'],
        equipment: ['First Aid Kit', 'Portable X-Ray', 'Wheelchair'],
        notes: [
            '09:25:45 - Response team dispatched',
            '09:26:30 - Team en route to Room 201'
        ]
    },
    // ... add more responses as needed
];