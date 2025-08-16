// src/shared/services/realApiService.ts
import { httpClient } from './httpClient';

export class RealGuardianProtectService {
    async getDevices() {
        const response = await httpClient.get('/guardian-protect/devices');
        return response.data;
    }

    async getAlerts() {
        const response = await httpClient.get('/guardian-protect/alerts');
        return response.data;
    }

    async acknowledgeAlert(alertId: string) {
        const response = await httpClient.post(`/guardian-protect/alerts/${alertId}/acknowledge`);
        return response.data;
    }

    async resolveAlert(alertId: string) {
        const response = await httpClient.post(`/guardian-protect/alerts/${alertId}/resolve`);
        return response.data;
    }

    async testAllDevices() {
        const response = await httpClient.post('/guardian-protect/test-devices');
        return response.data;
    }

    async updateDeviceStatus(deviceId: string, status: string) {
        const response = await httpClient.put(`/guardian-protect/devices/${deviceId}/status`, { status });
        return response.data;
    }
}

// Export real services (switch between mock and real based on environment)
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// TODO: Import GuardianProtectService from the appropriate mock service file
// import { GuardianProtectService } from './mockApiService';

export const guardianProtectService = USE_MOCK_DATA
    ? /* new GuardianProtectService() */ undefined // Replace undefined with the correct mock service instance
    : new RealGuardianProtectService();