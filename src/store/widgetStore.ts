import { create } from 'zustand';

interface WidgetStore {
    alerts: Array<{
        id: number;
        type: string;
        message: string;
        video: boolean;
        timestamp: string;
        actionStatus: 'pending' | 'assigned' | 'resolved';
        assignedTo?: string;
    }>;
    videoFeeds: Array<{
        id: string;
        name: string;
        type: 'commonArea' | 'residentRoom';
        status: 'online' | 'offline';
        lastEvent?: { type: string; timestamp: string };
    }>;
    healthMetrics: Array<{ name: string; value: number }>;
    staffing: { ratio: string; expiringCertifications: number; shortages: number };
    operations: { maintenanceIssues: number; housekeepingStatus: string; cameraIssues: number };
    compliance: { documentationStatus: string; pendingReports: number; videoAccessLogs: number };
    financials: { revenue: number; billingIssues: number };
    userRole: string;
    assignAlert: (alertId: number, staff: string) => void;
}

export const useWidgetStore = create<WidgetStore>((set) => ({
    alerts: [
        {
            id: 1,
            type: 'fall',
            message: 'Fall Detected in Room 204, Camera 12',
            video: true,
            timestamp: '2025-08-23T15:00:00-07:00',
            actionStatus: 'pending',
        },
        {
            id: 2,
            type: 'wandering',
            message: 'Wandering in Memory Care Hallway, Camera 5',
            video: true,
            timestamp: '2025-08-23T14:55:00-07:00',
            actionStatus: 'assigned',
            assignedTo: 'Nurse Jane',
        },
        {
            id: 3,
            type: 'medicationError',
            message: 'Medication Error in Room 108',
            video: false,
            timestamp: '2025-08-23T14:50:00-07:00',
            actionStatus: 'pending',
        },
    ],
    videoFeeds: [
        { id: 'commonArea1', name: 'Dining Hall', type: 'commonArea', status: 'online', lastEvent: { type: 'motion', timestamp: '2025-08-23T14:45:00-07:00' } },
        { id: 'commonArea2', name: 'Lobby', type: 'commonArea', status: 'online' },
        { id: 'room204', name: 'Room 204', type: 'residentRoom', status: 'online', lastEvent: { type: 'fall', timestamp: '2025-08-23T15:00:00-07:00' } },
        { id: 'memoryCareHall1', name: 'Memory Care Hallway', type: 'commonArea', status: 'offline' },
    ],
    healthMetrics: [
        { name: 'incidents', value: 3 },
        { name: 'therapyAttendance', value: 85 },
        { name: 'infectionCases', value: 1 },
    ],
    staffing: { ratio: '1:5', expiringCertifications: 2, shortages: 1 },
    operations: { maintenanceIssues: 1, housekeepingStatus: '90% Complete', cameraIssues: 1 },
    compliance: { documentationStatus: '95% Complete', pendingReports: 2, videoAccessLogs: 10 },
    financials: { revenue: 12500, billingIssues: 2 },
    userRole: 'manager', // Simulated role
    assignAlert: (alertId, staff) =>
        set((state) => ({
            alerts: state.alerts.map((alert) =>
                alert.id === alertId ? { ...alert, actionStatus: 'assigned', assignedTo: staff } : alert
            ),
        })),
}));