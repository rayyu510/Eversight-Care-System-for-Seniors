import { SystemStatus, ModuleHealth, PerformanceMetrics } from '../types/operationsTypes';

/**
 * Formats system performance metrics into a readable string
 */
export const formatSystemMetrics = (metrics: PerformanceMetrics): string => {
    return `CPU: ${metrics.cpu}%, Memory: ${metrics.memory}%, Disk: ${metrics.disk}%, Network: ${metrics.network}%`;
};

/**
 * Calculates overall system health based on module health data
 */
export const calculateSystemHealth = (modules: ModuleHealth[]): number => {
    if (modules.length === 0) return 0;

    const totalUptime = modules.reduce((sum, module) => sum + module.uptime, 0);
    return Math.round(totalUptime / modules.length);
};

/**
 * Validates if a module is in healthy status
 */
export const validateModuleStatus = (module: ModuleHealth): boolean => {
    return module.status === 'healthy' && module.uptime > 95;
};

/**
 * Generates a comprehensive system report
 */
export const generateSystemReport = (systemStatus: SystemStatus): string => {
    const healthPercentage = calculateSystemHealth(systemStatus.modules);
    const healthyModules = systemStatus.modules.filter(m => validateModuleStatus(m)).length;

    return `System Health Report
===================
Overall Status: ${systemStatus.overall.toUpperCase()}
System Health: ${healthPercentage}%
Timestamp: ${systemStatus.timestamp.toISOString()}
Version: ${systemStatus.version}
Uptime: ${formatUptime(systemStatus.uptime)}

Module Summary:
- Total Modules: ${systemStatus.modules.length}
- Healthy Modules: ${healthyModules}
- Modules with Issues: ${systemStatus.modules.length - healthyModules}

Performance Metrics:
${formatSystemMetrics(systemStatus.performance)}
Response Time: ${systemStatus.performance.responseTime}ms
Throughput: ${systemStatus.performance.throughput} req/min

Module Details:
${systemStatus.modules.map(module =>
        `- ${module.name}: ${module.status} (${module.uptime}% uptime)`
    ).join('\n')}`;
};

/**
 * Formats uptime from milliseconds to human readable format
 */
export const formatUptime = (uptimeMs: number): string => {
    const seconds = Math.floor(uptimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
};

/**
 * Determines system status color based on health
 */
export const getSystemStatusColor = (status: SystemStatus['overall']): string => {
    switch (status) {
        case 'healthy':
            return 'green';
        case 'warning':
            return 'yellow';
        case 'critical':
            return 'red';
        default:
            return 'gray';
    }
};

/**
 * Calculates average response time across all modules
 */
export const calculateAverageResponseTime = (modules: ModuleHealth[]): number => {
    if (modules.length === 0) return 0;

    const totalResponseTime = modules.reduce((sum, module) => sum + module.metrics.responseTime, 0);
    return Math.round(totalResponseTime / modules.length);
};

/**
 * Gets modules that are experiencing issues
 */
export const getProblematicModules = (modules: ModuleHealth[]): ModuleHealth[] => {
    return modules.filter(module => !validateModuleStatus(module));
};

/**
 * Formats performance metrics for dashboard display
 */
export const formatMetricsForDisplay = (metrics: PerformanceMetrics): {
    cpu: string;
    memory: string;
    disk: string;
    network: string;
    responseTime: string;
    throughput: string;
} => {
    return {
        cpu: `${metrics.cpu}%`,
        memory: `${metrics.memory}%`,
        disk: `${metrics.disk}%`,
        network: `${metrics.network}%`,
        responseTime: `${metrics.responseTime}ms`,
        throughput: `${metrics.throughput} req/min`
    };
};

/**
 * Determines if system requires immediate attention
 */
export const requiresImmediateAttention = (systemStatus: SystemStatus): boolean => {
    if (systemStatus.overall === 'critical') return true;

    const problematicModules = getProblematicModules(systemStatus.modules);
    if (problematicModules.length > systemStatus.modules.length * 0.5) return true;

    const metrics = systemStatus.performance;
    if (metrics.cpu > 90 || metrics.memory > 90 || metrics.responseTime > 5000) return true;

    return false;
};

/**
 * Generates system health score (0-100)
 */
export const calculateSystemHealthScore = (systemStatus: SystemStatus): number => {
    const moduleHealth = calculateSystemHealth(systemStatus.modules);
    const performance = systemStatus.performance;

    // Performance score (inverse of resource usage)
    const performanceScore = Math.max(0, 100 - Math.max(
        performance.cpu,
        performance.memory,
        performance.disk
    ));

    // Response time score (0-100, where <100ms = 100, >1000ms = 0)
    const responseScore = Math.max(0, 100 - (performance.responseTime / 10));

    // Weighted average: 50% module health, 30% performance, 20% response time
    return Math.round(
        (moduleHealth * 0.5) +
        (performanceScore * 0.3) +
        (responseScore * 0.2)
    );
};

/**
 * Gets system status based on health score
 */
export const getSystemStatusFromScore = (score: number): SystemStatus['overall'] => {
    if (score >= 85) return 'healthy';
    if (score >= 60) return 'warning';
    return 'critical';
};

/**
 * Formats bytes to human readable format
 */
export const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
};
