// src/operations-center/utils/systemUtils.ts
// System utility functions with correct export names

export function formatSystemUptime(uptimeSeconds: number): string {
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Alias for backward compatibility
export const formatUptime = formatSystemUptime;

export function calculateSystemLoad(cpuUsage: number, memoryUsage: number, diskUsage: number): number {
    // Calculate weighted system load
    const cpuWeight = 0.4;
    const memoryWeight = 0.4;
    const diskWeight = 0.2;

    return (cpuUsage * cpuWeight + memoryUsage * memoryWeight + diskUsage * diskWeight);
}

export function getSystemHealthStatus(systemLoad: number): 'healthy' | 'warning' | 'critical' | 'failure' {
    if (systemLoad < 60) return 'healthy';
    if (systemLoad < 80) return 'warning';
    if (systemLoad < 95) return 'critical';
    return 'failure';
}

export function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatCpuUsage(usage: number): string {
    return `${usage.toFixed(1)}%`;
}

export function formatMemoryUsage(used: number, total: number): string {
    const percentage = (used / total) * 100;
    return `${formatBytes(used)} / ${formatBytes(total)} (${percentage.toFixed(1)}%)`;
}

export function getSystemStatusIcon(status: string): string {
    switch (status) {
        case 'healthy': return '✅';
        case 'warning': return '⚠️';
        case 'critical': return '🔴';
        case 'failure': return '❌';
        default: return '❓';
    }
}

export function getSystemStatusColor(status: string): string {
    switch (status) {
        case 'healthy': return '#10B981'; // green-500
        case 'warning': return '#F59E0B'; // amber-500
        case 'critical': return '#EF4444'; // red-500
        case 'failure': return '#DC2626'; // red-600
        default: return '#6B7280'; // gray-500
    }
}

export function validateSystemConfig(config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config) {
        errors.push('Configuration is required');
        return { valid: false, errors };
    }

    if (typeof config.maxCpuUsage !== 'number' || config.maxCpuUsage <= 0 || config.maxCpuUsage > 100) {
        errors.push('maxCpuUsage must be a number between 1 and 100');
    }

    if (typeof config.maxMemoryUsage !== 'number' || config.maxMemoryUsage <= 0 || config.maxMemoryUsage > 100) {
        errors.push('maxMemoryUsage must be a number between 1 and 100');
    }

    if (typeof config.maxDiskUsage !== 'number' || config.maxDiskUsage <= 0 || config.maxDiskUsage > 100) {
        errors.push('maxDiskUsage must be a number between 1 and 100');
    }

    return { valid: errors.length === 0, errors };
}

export function generateSystemReport(systemData: any): string {
    const timestamp = new Date().toISOString();
    const uptime = formatSystemUptime(systemData.uptime || 0);
    const load = calculateSystemLoad(
        systemData.cpu?.usage || 0,
        systemData.memory?.usage || 0,
        systemData.disk?.usage || 0
    );
    const status = getSystemHealthStatus(load);

    return `
System Health Report
Generated: ${timestamp}

Status: ${status.toUpperCase()}
Uptime: ${uptime}
System Load: ${load.toFixed(1)}%

CPU Usage: ${formatCpuUsage(systemData.cpu?.usage || 0)}
Memory: ${formatMemoryUsage(systemData.memory?.used || 0, systemData.memory?.total || 1)}
Disk Usage: ${formatBytes(systemData.disk?.used || 0)} / ${formatBytes(systemData.disk?.total || 1)}

Active Modules: ${systemData.modules?.active || 0}
Total Modules: ${systemData.modules?.total || 0}
Error Count: ${systemData.errors?.count || 0}
Warning Count: ${systemData.warnings?.count || 0}
  `.trim();
}

export function getAlertAgeInMinutes(alertTimestamp: string): number {
    const now = new Date();
    const alertTime = new Date(alertTimestamp);
    const diffMs = now.getTime() - alertTime.getTime();
    return Math.floor(diffMs / (1000 * 60));
}

// Additional system utility functions
export function getSystemPerformanceLevel(load: number): 'optimal' | 'good' | 'degraded' | 'poor' {
    if (load < 40) return 'optimal';
    if (load < 70) return 'good';
    if (load < 90) return 'degraded';
    return 'poor';
}

export function formatSystemMetric(value: number, unit: string, precision: number = 1): string {
    return `${value.toFixed(precision)} ${unit}`;
}

export function calculateResourceEfficiency(used: number, available: number): number {
    if (available === 0) return 0;
    return Math.max(0, Math.min(100, (used / available) * 100));
}

export function getRecommendedAction(status: string, load: number): string {
    switch (status) {
        case 'healthy':
            return 'System operating normally';
        case 'warning':
            return 'Monitor system closely, consider load balancing';
        case 'critical':
            return 'Immediate attention required, scale resources';
        case 'failure':
            return 'Emergency response needed, check system components';
        default:
            return 'Unknown status, investigate system state';
    }
}

export function isSystemHealthy(metrics: any): boolean {
    const load = calculateSystemLoad(
        metrics.cpu?.usage || 0,
        metrics.memory?.usage || 0,
        metrics.disk?.usage || 0
    );
    return getSystemHealthStatus(load) === 'healthy';
}

export function getSystemAlerts(metrics: any): Array<{ type: string; message: string; severity: string }> {
    const alerts = [];

    if (metrics.cpu?.usage > 80) {
        alerts.push({
            type: 'cpu',
            message: `High CPU usage: ${metrics.cpu.usage.toFixed(1)}%`,
            severity: 'warning'
        });
    }

    if (metrics.memory?.usage > 85) {
        alerts.push({
            type: 'memory',
            message: `High memory usage: ${metrics.memory.usage.toFixed(1)}%`,
            severity: 'warning'
        });
    }

    if (metrics.disk?.usage > 90) {
        alerts.push({
            type: 'disk',
            message: `High disk usage: ${metrics.disk.usage.toFixed(1)}%`,
            severity: 'critical'
        });
    }

    return alerts;
}