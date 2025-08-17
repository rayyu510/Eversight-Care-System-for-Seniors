import { Alert } from './types';

// Update these lines to match your actual files in src/guardian-protect/data/

export const mockAlerts: Alert[] = [
    {
        id: 'ALERT-001',
        type: 'fall_detected',
        severity: 'critical',
        title: 'Fall Detected - Room 201',
        description: 'AI system detected a fall in Room 201. Resident appears to be on the floor near the bed.',
        location: 'Room 201',
        residentId: 'RES-201',
        timestamp: '2024-07-31 09:25:33',
        status: 'active',
        cameraIds: ['CAM-201'],
        responseTime: 0
    },
    // ... add more alerts as needed
];
