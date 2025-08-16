// Development/demo data
export class MockDataService {
    async getSystemHealth() {
        return {
            overall: 97,
            modules: {
                operations: 99,
                surveillance: 96,
                guardianProtect: 98,
                guardianInsight: 95
            }
        };
    }

    async getActiveUsers() {
        return 47;
    }

    async getCameraStatus() {
        return { online: 22, total: 24 };
    }

    async getAlerts() {
        return [
            { id: 1, type: 'maintenance', message: 'Camera 7 maintenance required' },
            { id: 2, type: 'battery', message: 'Motion sensor battery low' },
            { id: 3, type: 'sync', message: 'System sync complete' }
        ];
    }
}

export const mockDataService = new MockDataService();