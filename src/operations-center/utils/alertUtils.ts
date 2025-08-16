// src/operations-center/utils/alertUtils.ts
import { SystemAlert } from '../types';

export const getAlertPriorityScore = (alert: SystemAlert): number => {
    const severityScores = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1
    };

    const typeMultipliers = {
        system: 1.2,
        security: 1.5,
        performance: 1.0,
        maintenance: 0.8
    };

    const baseScore = severityScores[alert.severity] || 1;
    const typeMultiplier = typeMultipliers[alert.type] || 1;
    const escalationBonus = (alert.status === 'active') ? 2 : 0;
    const unacknowledgedBonus = (alert.status === 'active') ? 1 : 0;

    return baseScore * typeMultiplier + escalationBonus + unacknowledgedBonus;
};

export const sortAlertsByPriority = (alerts: SystemAlert[]): SystemAlert[] => {
    return [...alerts].sort((a, b) => {
        const scoreA = getAlertPriorityScore(a);
        const scoreB = getAlertPriorityScore(b);

        if (scoreA !== scoreB) {
            return scoreB - scoreA; // Higher score first
        }

        // If scores are equal, sort by timestamp (newest first)
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
};

export const groupAlertsByType = (alerts: SystemAlert[]): Record<string, SystemAlert[]> => {
    return alerts.reduce((groups, alert) => {
        const type = alert.type;
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(alert);
        return groups;
    }, {} as Record<string, SystemAlert[]>);
};

export const getAlertAgeInMinutes = (alert: SystemAlert): number => {
    return Math.floor((Date.now() - new Date(alert.timestamp).getTime()) / (1000 * 60));
};

export const shouldEscalateAlert = (alert: SystemAlert, thresholdMinutes: number = 30): boolean => {
    if (alert.status === 'acknowledged' || alert.status === 'resolved') {
        return false;
    }

    const ageInMinutes = getAlertAgeInMinutes(alert);
    const criticalThreshold = alert.severity === 'critical' ? thresholdMinutes / 2 : thresholdMinutes;

    return ageInMinutes >= criticalThreshold;
};