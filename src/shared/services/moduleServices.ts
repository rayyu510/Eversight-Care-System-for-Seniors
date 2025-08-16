import { apiService } from './apiService';
import {
    guardianProtectData,
    guardianInsightData,
    guardianCareProData,
    guardianCareTrackData,
    operationsCenterData,
    surveillanceCenterData
} from '../data/mockData';

// Guardian Protect Service
export class GuardianProtectService {
    async getDevices() {
        return await apiService.get('/guardian-protect/devices', guardianProtectData.devices);
    }

    async getAlerts() {
        return await apiService.get('/guardian-protect/alerts', guardianProtectData.alerts);
    }

    async acknowledgeAlert(alertId: string) {
        return await apiService.post(`/guardian-protect/alerts/${alertId}/acknowledge`, { alertId });
    }

    async testAllDevices() {
        return await apiService.post('/guardian-protect/test-devices', { timestamp: new Date() });
    }
}

// Guardian Insight Service
export class GuardianInsightService {
    async getAIInsights() {
        return await apiService.get('/guardian-insight/ai-insights', guardianInsightData.aiInsights);
    }

    async getPredictions() {
        return await apiService.get('/guardian-insight/predictions', guardianInsightData.predictions);
    }

    async getBehaviorPatterns() {
        return await apiService.get('/guardian-insight/behavior-patterns', guardianInsightData.behaviorPatterns);
    }
}

// Guardian CarePro Service
export class GuardianCareProService {
    async getResidents() {
        return await apiService.get('/guardian-carepro/residents', guardianCareProData.residents);
    }

    async getStaff() {
        return await apiService.get('/guardian-carepro/staff', guardianCareProData.staff);
    }

    async getCarePlans() {
        return await apiService.get('/guardian-carepro/care-plans', guardianCareProData.carePlans);
    }
}

// Guardian CareTrack Service
export class GuardianCareTrackService {
    async getMedications() {
        return await apiService.get('/guardian-caretrack/medications', guardianCareTrackData.medications);
    }

    async getTreatments() {
        return await apiService.get('/guardian-caretrack/treatments', guardianCareTrackData.treatments);
    }

    async getCompliance() {
        return await apiService.get('/guardian-caretrack/compliance', guardianCareTrackData.compliance);
    }
}

// Operations Center Service
export class OperationsCenterService {
    async getSystemsStatus() {
        return await apiService.get('/operations/systems-status', operationsCenterData.systemsStatus);
    }

    async getActiveIncidents() {
        return await apiService.get('/operations/incidents', operationsCenterData.activeIncidents);
    }
}

// Surveillance Center Service
export class SurveillanceCenterService {
    async getCameras() {
        return await apiService.get('/surveillance/cameras', surveillanceCenterData.cameras);
    }

    async getDetections() {
        return await apiService.get('/surveillance/detections', surveillanceCenterData.detections);
    }
}

// Export service instances
export const guardianProtectService = new GuardianProtectService();
export const guardianInsightService = new GuardianInsightService();
export const guardianCareProService = new GuardianCareProService();
export const guardianCareTrackService = new GuardianCareTrackService();
export const operationsCenterService = new OperationsCenterService();
export const surveillanceCenterService = new SurveillanceCenterService();