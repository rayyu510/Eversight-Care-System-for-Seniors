import {
    Resident,
    Camera,
    Alert,
    EmergencyResponse,
    StaffMember,
    HeatMapPoint
} from './types';
import { mockResidents } from './mockResidents';
import { mockCameras } from './mockCameras';
import { mockAlerts } from './mockAlerts';
import { mockEmergencyResponses } from './mockEmergencyResponses';
import { mockStaff } from './mockStaff';
import { mockHeatMapData } from './mockHeatMapData';

export class MockDataService {
    private static instance: MockDataService;
    private updateInterval: NodeJS.Timeout | null = null;
    private subscribers: ((data: any) => void)[] = [];

    static getInstance(): MockDataService {
        if (!MockDataService.instance) {
            MockDataService.instance = new MockDataService();
        }
        return MockDataService.instance;
    }

    // ... rest of the service methods from the previous artifact

    getResidents(): Resident[] {
        return mockResidents;
    }

    getCameras(): Camera[] {
        return mockCameras;
    }

    getAlerts(): Alert[] {
        return mockAlerts;
    }

    // ... other methods
}

export const mockDataService = MockDataService.getInstance();