// src/surveillance-center/utils/securityUtils.ts
import { SecurityEvent, AIDetection } from '../types';

export const getSecurityEventPriority = (event: SecurityEvent): number => {
    const severityScores = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1
    };

    const typeMultipliers = {
        intrusion: 1.5,
        unauthorized_access: 1.4,
        tampering: 1.3,
        camera_offline: 1.0,
        system_error: 0.8
    };

    const baseScore = severityScores[event.severity] || 1;
    const typeMultiplier = typeMultipliers[event.type] || 1;
    const escalationBonus = event.response.escalated ? 2 : 0;
    const unacknowledgedBonus = event.status !== 'acknowledged' ? 1 : 0;

    return baseScore * typeMultiplier + escalationBonus + unacknowledgedBonus;
};

export const sortEventsByPriority = (events: SecurityEvent[]): SecurityEvent[] => {
    return [...events].sort((a, b) => {
        const priorityA = getSecurityEventPriority(a);
        const priorityB = getSecurityEventPriority(b);

        if (priorityA !== priorityB) {
            return priorityB - priorityA; // Higher priority first
        }

        // If priorities are equal, sort by timestamp (newest first)
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
};

export const getDetectionConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
};

export const isHighConfidenceDetection = (detection: AIDetection): boolean => {
    return detection.confidence >= 0.8;
};

export const groupDetectionsByCamera = (detections: AIDetection[]): Record<string, AIDetection[]> => {
    return detections.reduce((groups, detection) => {
        const cameraId = detection.cameraId;
        if (!groups[cameraId]) {
            groups[cameraId] = [];
        }
        groups[cameraId].push(detection);
        return groups;
    }, {} as Record<string, AIDetection[]>);
};

export const calculateFalsePositiveRate = (
    totalDetections: number,
    falsePositives: number
): number => {
    if (totalDetections === 0) return 0;
    return (falsePositives / totalDetections) * 100;
};

export const getEventAgeInMinutes = (event: SecurityEvent): number => {
    return Math.floor((Date.now() - new Date(event.timestamp).getTime()) / (1000 * 60));
};

export const shouldEscalateSecurityEvent = (
    event: SecurityEvent,
    thresholdMinutes: number = 15
): boolean => {
    if (event.status === 'acknowledged' || event.status === 'resolved' || event.response.escalated) {
        return false;
    }

    const ageInMinutes = getEventAgeInMinutes(event);
    const criticalThreshold = event.severity === 'critical' ? thresholdMinutes / 2 : thresholdMinutes;

    return ageInMinutes >= criticalThreshold;
};

