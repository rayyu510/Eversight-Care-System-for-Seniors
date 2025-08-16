import { SystemStatus, PerformanceMetrics, ModuleHealth } from '../types/operationsTypes';

export class SystemMonitoringService {
    private static instance: SystemMonitoringService;

    public static getInstance(): SystemMonitoringService {
        if (!SystemMonitoringService.instance) {
            SystemMonitoringService.instance = new SystemMonitoringService();
        }
        return SystemMonitoringService.instance;
    }

    async getSystemStatus(): Promise<SystemStatus> {
        return {
            overall: 'healthy',
            timestamp: new Date(),
            modules: await this.getModuleHealth(),
            performance: await this.getPerformanceMetrics(),
            uptime: Date.now() - (Date.now() - 86400000),
            version: '2.2.0',
        };
    }

    async getModuleHealth(): Promise<ModuleHealth[]> {
        return [
            {
                id: 'operations-center',
                name: 'Operations Center',
                status: 'healthy',
                uptime: 99.9,
                lastCheck: new Date(),
                metrics: { cpu: 15, memory: 45, responseTime: 120 },
            },
            {
                id: 'surveillance-center',
                name: 'Surveillance Center',
                status: 'healthy',
                uptime: 98.5,
                lastCheck: new Date(),
                metrics: { cpu: 25, memory: 62, responseTime: 150 },
            }
        ];
    }

    async getPerformanceMetrics(): Promise<PerformanceMetrics> {
        return {
            cpu: 20,
            memory: 55,
            disk: 35,
            network: 12,
            responseTime: 135,
            throughput: 1200,
        };
    }
}