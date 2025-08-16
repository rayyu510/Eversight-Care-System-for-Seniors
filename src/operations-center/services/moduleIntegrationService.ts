// src/operations-center/services/moduleIntegrationService.ts
import { ModuleIntegrationStatus } from '../types/operationsTypes';

export class ModuleIntegrationService {
    private static instance: ModuleIntegrationService;
    private connectedModules: Map<string, ModuleIntegrationStatus> = new Map();

    public static getInstance(): ModuleIntegrationService {
        if (!ModuleIntegrationService.instance) {
            ModuleIntegrationService.instance = new ModuleIntegrationService();
        }
        return ModuleIntegrationService.instance;
    }

    async registerModule(moduleId: string, version: string): Promise<void> {
        const status: ModuleIntegrationStatus = {
            moduleId,
            connected: true,
            lastHeartbeat: new Date(),
            version,
            dataQuality: 'good'
        };

        this.connectedModules.set(moduleId, status);
        console.log(`Module ${moduleId} registered successfully`);
    }

    async getModuleStatus(moduleId: string): Promise<ModuleIntegrationStatus | null> {
        return this.connectedModules.get(moduleId) || null;
    }

    async getAllModuleStatuses(): Promise<ModuleIntegrationStatus[]> {
        return Array.from(this.connectedModules.values());
    }

    async updateHeartbeat(moduleId: string): Promise<void> {
        const status = this.connectedModules.get(moduleId);
        if (status) {
            status.lastHeartbeat = new Date();
            this.connectedModules.set(moduleId, status);
        }
    }

    async disconnectModule(moduleId: string): Promise<void> {
        const status = this.connectedModules.get(moduleId);
        if (status) {
            status.connected = false;
            this.connectedModules.set(moduleId, status);
        }
    }

    async getConnectedModulesCount(): Promise<number> {
        return Array.from(this.connectedModules.values())
            .filter(status => status.connected).length;
    }

    async getModuleHealth(): Promise<{ [key: string]: 'good' | 'degraded' | 'poor' }> {
        const health: { [key: string]: 'good' | 'degraded' | 'poor' } = {};

        for (const [moduleId, status] of this.connectedModules) {
            if (!status.connected) {
                health[moduleId] = 'poor';
            } else {
                const timeSinceHeartbeat = Date.now() - status.lastHeartbeat.getTime();
                if (timeSinceHeartbeat > 60000) { // 1 minute
                    health[moduleId] = 'poor';
                } else if (timeSinceHeartbeat > 30000) { // 30 seconds
                    health[moduleId] = 'degraded';
                } else {
                    health[moduleId] = status.dataQuality;
                }
            }
        }

        return health;
    }
}