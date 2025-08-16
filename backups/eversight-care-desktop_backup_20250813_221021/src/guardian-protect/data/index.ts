// src/guardian-protect/data/index.ts

// Types
export interface Resident {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    roomNumber: string;
    floor: 1 | 2;
    riskLevel: string;
    medicalConditions: string[];
    emergencyContact: any;
    admissionDate: string;
    lastActivity: string;
    currentLocation: string;
}

export interface Camera {
    id: string;
    name: string;
    location: string;
    floor: number;
    type: string;
    status: string;
    coverage: string;
    lastPing: string;
    recordingStatus: string;
}

export interface Alert {
    id: string;
    type: string;
    severity: string;
    title: string;
    description: string;
    location: string;
    residentId?: string;
    timestamp: string;
    status: string;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
    resolvedBy?: string;
    resolvedAt?: string;
    responseTime?: number;
    cameraIds: string[];
    notes?: string;
}

export interface EmergencyResponse {
    id: string;
    type: string;
    status: string;
    priority: string;
    title: string;
    description: string;
    location: string;
    alertId?: string;
    residentId?: string;
    dispatchedAt: string;
    dispatchedBy: string;
    assignedTeam: string[];
    protocols: string[];
    equipment: string[];
    notes: string[];
}

export interface StaffMember {
    id: string;
    name: string;
    role: string;
    shift: string;
    department: string;
    status: string;
    location: string;
    contactNumber: string;
    certifications: string[];
    lastActivity: string;
}

// Mock Data
const mockResidents: Resident[] = [
    {
        id: 'RES-101',
        firstName: 'Margaret',
        lastName: 'Johnson',
        age: 78,
        roomNumber: '101',
        floor: 1,
        riskLevel: 'medium',
        medicalConditions: ['Arthritis'],
        emergencyContact: { name: 'Robert Johnson', phone: '555-1234' },
        admissionDate: '2024-03-15',
        lastActivity: '2024-07-31 08:45',
        currentLocation: 'Dining Room'
    },
    {
        id: 'RES-102',
        firstName: 'Harold',
        lastName: 'Williams',
        age: 82,
        roomNumber: '102',
        floor: 1,
        riskLevel: 'high',
        medicalConditions: ['Parkinson\'s Disease'],
        emergencyContact: { name: 'Susan Williams', phone: '555-5678' },
        admissionDate: '2024-01-22',
        lastActivity: '2024-07-31 09:15',
        currentLocation: 'Room 102'
    }
];

const mockCameras: Camera[] = [
    {
        id: 'CAM-101',
        name: 'Room 101 Monitor',
        location: 'Room 101',
        floor: 1,
        type: 'room',
        status: 'online',
        coverage: 'Full Room',
        lastPing: '2024-07-31 09:30:15',
        recordingStatus: 'recording'
    },
    {
        id: 'CAM-H01',
        name: 'Main Hallway',
        location: 'Hallway Floor 1',
        floor: 1,
        type: 'hallway',
        status: 'online',
        coverage: 'Hallway',
        lastPing: '2024-07-31 09:30:18',
        recordingStatus: 'recording'
    }
];

const mockAlerts: Alert[] = [
    {
        id: 'ALERT-001',
        type: 'fall_detected',
        severity: 'critical',
        title: 'Fall Detected - Room 101',
        description: 'AI detected a fall in Room 101',
        location: 'Room 101',
        residentId: 'RES-101',
        timestamp: '2024-07-31 09:25:33',
        status: 'active',
        cameraIds: ['CAM-101'],
        responseTime: 0
    }
];

const mockEmergencyResponses: EmergencyResponse[] = [
    {
        id: 'RESP-001',
        type: 'fall_response',
        status: 'dispatched',
        priority: 'critical',
        title: 'Fall Response - Room 101',
        description: 'Response for fall in Room 101',
        location: 'Room 101',
        alertId: 'ALERT-001',
        dispatchedAt: '2024-07-31 09:25:45',
        dispatchedBy: 'Sarah Johnson, RN',
        assignedTeam: ['Dr. Wells', 'Nurse Adams'],
        protocols: ['Fall Assessment'],
        equipment: ['First Aid Kit'],
        notes: ['Team dispatched']
    }
];

const mockStaff: StaffMember[] = [
    {
        id: 'STAFF-001',
        name: 'Dr. Patricia Wells',
        role: 'doctor',
        shift: 'day',
        department: 'Medical',
        status: 'on_duty',
        location: 'Nurses Station',
        contactNumber: 'EXT-1001',
        certifications: ['MD'],
        lastActivity: '2024-07-31 09:27:15'
    }
];

// Simple Mock Data Service
export class MockDataService {
    private static instance: MockDataService;
    private subscribers: Function[] = [];
    private interval: any = null;

    static getInstance(): MockDataService {
        if (!MockDataService.instance) {
            MockDataService.instance = new MockDataService();
        }
        return MockDataService.instance;
    }

    subscribe(callback: Function): Function {
        this.subscribers.push(callback);
        return () => {
            const index = this.subscribers.indexOf(callback);
            if (index > -1) this.subscribers.splice(index, 1);
        };
    }

    private notify(data: any): void {
        this.subscribers.forEach(callback => callback(data));
    }

    startRealTimeSimulation(): void {
        if (this.interval) return;
        this.interval = setInterval(() => {
            if (Math.random() < 0.3) {
                const newAlert: Alert = {
                    id: `ALERT-${Date.now()}`,
                    type: 'wandering',
                    severity: 'medium',
                    title: 'Simulated Alert',
                    description: 'Auto-generated alert',
                    location: 'Hallway',
                    timestamp: new Date().toISOString(),
                    status: 'active',
                    cameraIds: ['CAM-H01']
                };
                mockAlerts.unshift(newAlert);
                this.notify({ type: 'new_alert', data: newAlert });
            }
        }, 5000);
    }

    stopRealTimeSimulation(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    getResidents(): Resident[] { return mockResidents; }
    getCameras(): Camera[] { return mockCameras; }
    getAlerts(): Alert[] { return mockAlerts; }
    getEmergencyResponses(): EmergencyResponse[] { return mockEmergencyResponses; }
    getStaff(): StaffMember[] { return mockStaff; }

    getHeatMapData(floor: number): any[] {
        return [
            { x: 25, y: 15, intensity: 0.8, riskLevel: 'high', incidentCount: 3, location: 'Hallway' },
            { x: 10, y: 30, intensity: 0.6, riskLevel: 'medium', incidentCount: 1, location: 'Room Area' }
        ];
    }

    acknowledgeAlert(alertId: string, userId: string): void {
        const alert = mockAlerts.find(a => a.id === alertId);
        if (alert) {
            alert.status = 'acknowledged';
            alert.acknowledgedBy = userId;
            alert.acknowledgedAt = new Date().toISOString();
            this.notify({ type: 'alert_acknowledged', data: alert });
        }
    }

    resolveAlert(alertId: string, userId: string, notes?: string): void {
        const alert = mockAlerts.find(a => a.id === alertId);
        if (alert) {
            alert.status = 'resolved';
            alert.resolvedBy = userId;
            alert.resolvedAt = new Date().toISOString();
            if (notes) alert.notes = notes;
            this.notify({ type: 'alert_resolved', data: alert });
        }
    }

    createEmergencyResponse(alertId: string, type: string, priority: string, dispatchedBy: string, assignedTeam: string[]): EmergencyResponse {
        const response: EmergencyResponse = {
            id: `RESP-${Date.now()}`,
            type,
            status: 'dispatched',
            priority,
            title: `Response for ${alertId}`,
            description: 'Emergency response created',
            location: 'Unknown',
            alertId,
            dispatchedAt: new Date().toISOString(),
            dispatchedBy,
            assignedTeam,
            protocols: ['Standard Protocol'],
            equipment: ['Emergency Kit'],
            notes: ['Response created']
        };
        mockEmergencyResponses.unshift(response);
        this.notify({ type: 'response_created', data: response });
        return response;
    }

    updateResponseStatus(responseId: string, status: string, notes?: string): void {
        const response = mockEmergencyResponses.find(r => r.id === responseId);
        if (response) {
            response.status = status;
            if (notes) response.notes.push(notes);
            this.notify({ type: 'response_updated', data: response });
        }
    }

    simulateFallDetection(residentId: string, location: string): Alert {
        const alert: Alert = {
            id: `ALERT-FALL-${Date.now()}`,
            type: 'fall_detected',
            severity: 'critical',
            title: `SIMULATION: Fall - ${location}`,
            description: 'Simulated fall for testing',
            location,
            residentId,
            timestamp: new Date().toISOString(),
            status: 'active',
            cameraIds: ['CAM-101']
        };
        mockAlerts.unshift(alert);
        this.notify({ type: 'fall_detected', data: alert });
        return alert;
    }

    simulateWanderingAlert(residentId: string, location: string): Alert {
        const alert: Alert = {
            id: `ALERT-WANDER-${Date.now()}`,
            type: 'wandering',
            severity: 'high',
            title: `SIMULATION: Wandering - ${location}`,
            description: 'Simulated wandering for testing',
            location,
            residentId,
            timestamp: new Date().toISOString(),
            status: 'active',
            cameraIds: ['CAM-H01']
        };
        mockAlerts.unshift(alert);
        this.notify({ type: 'wandering_detected', data: alert });
        return alert;
    }
}

export const mockDataService = MockDataService.getInstance();
export { mockResidents, mockCameras, mockAlerts, mockEmergencyResponses, mockStaff };