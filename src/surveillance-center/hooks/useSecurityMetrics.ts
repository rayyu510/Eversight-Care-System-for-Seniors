// src/surveillance-center/hooks/useSecurityMetrics.ts
import { useState, useEffect, useCallback } from 'react';
import { SecurityMetrics, SecurityEvent, SecurityAlert } from '../types/securityTypes';

// Service interface
interface SecurityServiceInterface {
    getSecurityEvents: (filters?: any) => Promise<SecurityEvent[]>;
    getSecurityMetrics: () => Promise<SecurityMetrics>;
    acknowledgeEvent: (eventId: string, acknowledgedBy: string, notes: string) => Promise<void>;
    resolveEvent: (eventId: string, resolvedBy: string, resolution: string) => Promise<void>;
    createSecurityEvent: (alertData: any) => Promise<SecurityEvent>;
}

// Enhanced mock service with more realistic data and better error handling
class LocalSecurityService implements SecurityServiceInterface {
    private mockEvents: SecurityEvent[] = [];
    private mockMetrics: SecurityMetrics | null = null;

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData() {
        // Generate more comprehensive mock data
        this.mockEvents = this.generateMockEvents();
        this.mockMetrics = this.generateMockMetrics();
    }

    private generateMockEvents(): SecurityEvent[] {
        const events = [];
        const types = ['motion_detection', 'facial_recognition', 'behavior_analysis', 'perimeter_breach'];
        const severities = ['low', 'medium', 'high', 'critical'];
        const statuses = ['open', 'investigating', 'resolved', 'dismissed'];
        const locations = ['Lobby', 'Hallway A', 'Dining Room', 'Garden', 'Entrance', 'Exit'];

        for (let i = 1; i <= 15; i++) {
            const createdAt = new Date(Date.now() - Math.random() * 86400000 * 7); // Last 7 days
            events.push({
                id: `event-${i}`,
                type: types[Math.floor(Math.random() * types.length)],
                severity: severities[Math.floor(Math.random() * severities.length)],
                title: `Security Event ${i}`,
                timestamp: createdAt.toISOString(),
                cameraId: `CAM-${String(Math.floor(Math.random() * 24) + 1).padStart(3, '0')}`,
                description: `Automated security detection - ${types[Math.floor(Math.random() * types.length)].replace('_', ' ')}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                confidence: Number((Math.random() * 0.3 + 0.7).toFixed(2)),
                location: locations[Math.floor(Math.random() * locations.length)],
                source: 'surveillance_system',
                responseTime: Math.random() * 10,
                metadata: {
                    createdAt: createdAt.toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1
                },
                response: {
                    actualResponseTime: Math.random() * 300 + 60
                }
            } as unknown as SecurityEvent);
        }
        return events;
    }

    private generateMockMetrics(): SecurityMetrics {
        const totalEvents = this.mockEvents.length;
        const resolvedEvents = this.mockEvents.filter(e => e.status === 'resolved').length;
        const openEvents = this.mockEvents.filter(e => e.status === 'open' || e.status === 'investigating').length;
        const criticalEvents = this.mockEvents.filter(e => e.severity === 'critical').length;

        return {
            totalEvents,
            resolvedEvents,
            openEvents,
            criticalEvents,
            avgResponseTime: 2.3,
            systemHealth: Math.floor(Math.random() * 10) + 90,
            camerasOnline: 22,
            totalCameras: 24,
            detectionAccuracy: Number((Math.random() * 10 + 90).toFixed(1)),
            falsePositiveRate: Number((Math.random() * 5).toFixed(1)),
            coverage: Number((Math.random() * 5 + 95).toFixed(1)),
            uptime: Number((Math.random() * 2 + 98).toFixed(1)),
            lastUpdated: new Date().toISOString(),
            complianceScore: Math.floor(Math.random() * 20) + 80,
            systemVulnerabilities: []
        } as unknown as SecurityMetrics;
    }

    async getSecurityEvents(filters?: any): Promise<SecurityEvent[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));

        let filteredEvents = [...this.mockEvents];

        // Apply filters if provided
        if (filters) {
            if (filters.severities && filters.severities.length > 0) {
                filteredEvents = filteredEvents.filter(event =>
                    filters.severities.includes(event.severity)
                );
            }
            if (filters.statuses && filters.statuses.length > 0) {
                filteredEvents = filteredEvents.filter(event =>
                    filters.statuses.includes(event.status)
                );
            }
            if (filters.types && filters.types.length > 0) {
                filteredEvents = filteredEvents.filter(event =>
                    filters.types.includes(event.type)
                );
            }
        }

        return filteredEvents;
    }

    async getSecurityMetrics(): Promise<SecurityMetrics> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 50));

        // Update metrics with current data
        this.mockMetrics = this.generateMockMetrics();
        return this.mockMetrics!;
    }

    async acknowledgeEvent(eventId: string, acknowledgedBy: string, notes: string): Promise<void> {
        console.log(`✅ Event ${eventId} acknowledged by ${acknowledgedBy}: ${notes}`);
        // Update the event in mock data
        const eventIndex = this.mockEvents.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            this.mockEvents[eventIndex] = {
                ...this.mockEvents[eventIndex],
                status: 'investigating',
                acknowledgedBy,
                acknowledgedAt: new Date().toISOString()
            } as unknown as SecurityEvent;
        }
    }

    async resolveEvent(eventId: string, resolvedBy: string, resolution: string): Promise<void> {
        console.log(`✅ Event ${eventId} resolved by ${resolvedBy}: ${resolution}`);
        // Update the event in mock data
        const eventIndex = this.mockEvents.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
            this.mockEvents[eventIndex] = {
                ...this.mockEvents[eventIndex],
                status: 'resolved',
                resolution,
                resolvedBy,
                resolvedAt: new Date().toISOString()
            } as unknown as SecurityEvent;
        }
    }

    async createSecurityEvent(alertData: any): Promise<SecurityEvent> {
        const newEvent = {
            id: `event-${Date.now()}`,
            type: alertData.type,
            severity: alertData.severity,
            title: alertData.title || 'Emergency Alert',
            timestamp: new Date().toISOString(),
            cameraId: 'CAM-EMERGENCY',
            description: alertData.description,
            status: 'open',
            confidence: 1.0,
            location: alertData.location.description,
            source: 'emergency_system',
            responseTime: 0,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: 1
            },
            response: {
                actualResponseTime: 0
            }
        } as unknown as SecurityEvent;

        // Add to mock data
        this.mockEvents.unshift(newEvent);
        console.log(`🚨 New emergency alert created: ${newEvent.id}`);

        return newEvent;
    }
}

// Initialize the service after class declaration
let securityService: SecurityServiceInterface;

try {
    // Attempt to use the real service
    const { securityService: realService } = require('../services/securityService');
    securityService = realService;
} catch (error) {
    // Fall back to local mock service if real service is not available
    console.warn('Real security service not available, using mock service:', error);
    securityService = new LocalSecurityService();
}

// Ensure service is initialized
if (!securityService) {
    securityService = new LocalSecurityService();
}

export interface SecurityMetricsHookReturn {
    metrics: SecurityMetrics | null;
    events: SecurityEvent[];
    alerts: SecurityAlert[];
    loading: boolean;
    error: string | null;
    summary: SecuritySummary | null;
    acknowledgeAlert: (alertId: string, acknowledgedBy?: string) => Promise<boolean>;
    resolveAlert: (alertId: string, resolvedBy?: string) => Promise<boolean>;
    assignEvent: (eventId: string, assignedTo: string) => Promise<boolean>;
    resolveEvent: (eventId: string, resolution: string, resolvedBy?: string) => Promise<boolean>;
    triggerEmergencyAlert: (type: string, severity: string, description: string, location: string) => Promise<string | null>;
    refreshSecurityData: () => void;
    filterEvents: (filters: SecurityEventFilters) => void;
    exportSecurityReport: (format: 'pdf' | 'excel' | 'json') => Promise<string>;
}

export interface SecuritySummary {
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    criticalEvents: number;
    unacknowledgedAlerts: number;
    openEvents: number;
    totalEvents: number;
    totalAlerts: number;
    complianceScore: number;
    systemVulnerabilities: number;
    responseTime: {
        average: number;
        target: number;
        trend: 'improving' | 'stable' | 'declining';
    };
    summary: string;
    recommendations: string[];
    recentTrends: SecurityTrend[];
}

export interface SecurityEventFilters {
    types?: string[];
    severities?: string[];
    statuses?: string[];
    dateRange?: { start: string; end: string; };
    assignedTo?: string;
    sources?: string[];
    locations?: string[];
}

export interface SecurityTrend {
    metric: string;
    current: number;
    previous: number;
    change: number;
    direction: 'up' | 'down' | 'stable';
    period: string;
}

export const useSecurityMetrics = (
    timeRange: '1h' | '24h' | '7d' | '30d' = '24h',
    autoRefresh: boolean = true
): SecurityMetricsHookReturn => {
    const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
    const [events, setEvents] = useState<SecurityEvent[]>([]);
    const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<SecurityEventFilters>({});

    const fetchSecurityData = useCallback(async (appliedFilters?: SecurityEventFilters) => {
        try {
            setLoading(true);
            setError(null);

            // Fix: Remove unused currentFilters variable
            // const currentFilters = appliedFilters || filters;

            // Fix: Use Promise.all with proper destructuring and state setting
            const [eventsResponse, metricsResponse] = await Promise.all([
                securityService.getSecurityEvents(appliedFilters),
                securityService.getSecurityMetrics()
            ]);

            // Fix: Use functional state updates to avoid type conflicts
            setMetrics(() => metricsResponse);
            setEvents(() => eventsResponse);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch security metrics';
            setError(errorMessage);
            console.error('Error fetching security data:', err);
        } finally {
            setLoading(false);
        }
    }, [timeRange, filters]);

    const acknowledgeAlert = useCallback(async (alertId: string, acknowledgedBy: string = 'current-user'): Promise<boolean> => {
        try {
            await securityService.acknowledgeEvent(alertId, acknowledgedBy, 'Alert acknowledged');

            setAlerts(prev => prev.map(alert =>
                alert.id === alertId
                    ? {
                        ...alert,
                        acknowledged: true,
                        acknowledgedBy,
                        acknowledgedAt: new Date().toISOString()
                    }
                    : alert
            ));

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to acknowledge alert';
            setError(errorMessage);
            console.error('Error acknowledging alert:', err);
            return false;
        }
    }, []);

    const resolveAlert = useCallback(async (alertId: string, resolvedBy: string = 'current-user'): Promise<boolean> => {
        try {
            await securityService.resolveEvent(alertId, resolvedBy, 'Alert resolved');

            setAlerts(prev => prev.map(alert =>
                alert.id === alertId
                    ? {
                        ...alert,
                        resolved: true,
                        resolvedBy,
                        resolvedAt: new Date().toISOString()
                    }
                    : alert
            ));

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to resolve alert';
            setError(errorMessage);
            console.error('Error resolving alert:', err);
            return false;
        }
    }, []);

    const assignEvent = useCallback(async (eventId: string, assignedTo: string): Promise<boolean> => {
        try {
            await securityService.acknowledgeEvent(eventId, assignedTo, 'Event assigned');

            setEvents(prev => prev.map(event =>
                event.id === eventId
                    ? { ...event, assignedTo }
                    : event
            ));

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to assign event';
            setError(errorMessage);
            console.error('Error assigning event:', err);
            return false;
        }
    }, []);

    const resolveEvent = useCallback(async (
        eventId: string,
        resolution: string,
        resolvedBy: string = 'current-user'
    ): Promise<boolean> => {
        try {
            await securityService.resolveEvent(eventId, resolvedBy, resolution);

            setEvents(prev => prev.map(event =>
                event.id === eventId
                    ? {
                        ...event,
                        status: 'resolved',
                        resolution,
                        resolvedAt: new Date()
                    }
                    : event
            ));

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to resolve event';
            setError(errorMessage);
            console.error('Error resolving event:', err);
            return false;
        }
    }, []);

    const triggerEmergencyAlert = useCallback(async (
        type: string,
        severity: string,
        description: string,
        location: string
    ): Promise<string | null> => {
        try {
            const alertData = {
                type: type as any,
                severity: severity as any,
                title: 'Emergency Alert',
                description,
                location: {
                    building: location,
                    floor: '',
                    room: '',
                    zone: '',
                    coordinates: { x: 0, y: 0 },
                    description: location
                }
            };

            const newEvent = await securityService.createSecurityEvent(alertData);

            // Refresh data to show new alert
            await fetchSecurityData();

            return newEvent.id;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to trigger emergency alert';
            setError(errorMessage);
            console.error('Error triggering emergency alert:', err);
            return null;
        }
    }, [fetchSecurityData]);

    const filterEvents = useCallback((newFilters: SecurityEventFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        fetchSecurityData(newFilters);
    }, [fetchSecurityData]);

    const exportSecurityReport = useCallback(async (format: 'pdf' | 'excel' | 'json'): Promise<string> => {
        try {
            const reportData = {
                metrics,
                events,
                alerts,
                timeRange,
                filters,
                summary: getSecuritySummary(),
                exportedAt: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            return url;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to export security report';
            setError(errorMessage);
            throw err;
        }
    }, [metrics, events, alerts, timeRange, filters]);

    const getSecuritySummary = useCallback((): SecuritySummary | null => {
        if (!metrics || !events || !alerts) return null;

        const criticalEvents = events.filter(e => e.severity === 'critical').length;
        const highSeverityEvents = events.filter(e => e.severity === 'high').length;
        const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;
        const unresolvedAlerts = alerts.filter(a => !a.resolved).length;
        const openEvents = events.filter(e => e.status === 'open' || e.status === 'investigating').length;

        // Determine threat level based on multiple factors
        let threatLevel: 'low' | 'medium' | 'high' | 'critical';
        if (criticalEvents > 0 || unresolvedAlerts > 5) {
            threatLevel = 'critical';
        } else if (highSeverityEvents > 2 || unacknowledgedAlerts > 3) {
            threatLevel = 'high';
        } else if (unacknowledgedAlerts > 1 || openEvents > 5) {
            threatLevel = 'medium';
        } else {
            threatLevel = 'low';
        }

        // Calculate response time metrics
        const resolvedEvents = events.filter(e => e.status === 'resolved');
        const responseTimes = resolvedEvents
            .filter(e => e.response?.actualResponseTime)
            .map(e => e.response!.actualResponseTime!);

        const averageResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
            : 0;

        const targetResponseTime = 300; // 5 minutes in seconds
        const responseTimeTrend = averageResponseTime <= targetResponseTime ? 'improving' : 'declining';

        // Generate recommendations based on current state
        const recommendations: string[] = [];
        if (criticalEvents > 0) {
            recommendations.push('Immediate attention required for critical security events');
        }
        if (unacknowledgedAlerts > 2) {
            recommendations.push('Review and acknowledge pending security alerts');
        }
        if (averageResponseTime > targetResponseTime) {
            recommendations.push('Improve response time procedures and staffing');
        }
        if (metrics.complianceScore < 85) {
            recommendations.push('Address compliance gaps identified in security audit');
        }
        // Fix: Safe check for systemVulnerabilities
        if (Array.isArray(metrics.systemVulnerabilities) && metrics.systemVulnerabilities.length > 0) {
            recommendations.push('Prioritize remediation of identified system vulnerabilities');
        }

        // Calculate recent trends
        const now = new Date();
        const previousPeriod = new Date(now.getTime() - (timeRange === '1h' ? 3600000 : timeRange === '24h' ? 86400000 : timeRange === '7d' ? 604800000 : 2592000000));

        const currentPeriodEvents = events.filter(e => new Date(e.metadata.createdAt) >= previousPeriod);
        const previousPeriodEvents = events.filter(e => {
            const eventDate = new Date(e.metadata.createdAt);
            return eventDate >= new Date(previousPeriod.getTime() - (now.getTime() - previousPeriod.getTime())) && eventDate < previousPeriod;
        });

        const recentTrends: SecurityTrend[] = [
            {
                metric: 'Total Events',
                current: currentPeriodEvents.length,
                previous: previousPeriodEvents.length,
                change: currentPeriodEvents.length - previousPeriodEvents.length,
                direction: currentPeriodEvents.length > previousPeriodEvents.length ? 'up' :
                    currentPeriodEvents.length < previousPeriodEvents.length ? 'down' : 'stable',
                period: timeRange
            },
            {
                metric: 'Critical Events',
                current: currentPeriodEvents.filter(e => e.severity === 'critical').length,
                previous: previousPeriodEvents.filter(e => e.severity === 'critical').length,
                change: currentPeriodEvents.filter(e => e.severity === 'critical').length -
                    previousPeriodEvents.filter(e => e.severity === 'critical').length,
                direction: currentPeriodEvents.filter(e => e.severity === 'critical').length >
                    previousPeriodEvents.filter(e => e.severity === 'critical').length ? 'up' :
                    currentPeriodEvents.filter(e => e.severity === 'critical').length <
                        previousPeriodEvents.filter(e => e.severity === 'critical').length ? 'down' : 'stable',
                period: timeRange
            }
        ];

        // Generate summary message
        let summary: string;
        switch (threatLevel) {
            case 'critical':
                summary = 'CRITICAL: Immediate security attention required - multiple high-priority incidents detected';
                break;
            case 'high':
                summary = 'HIGH ALERT: Elevated security concerns require prompt investigation and response';
                break;
            case 'medium':
                summary = 'MONITORING: Security systems active with some pending alerts requiring attention';
                break;
            default:
                summary = 'NORMAL: Security systems operating within normal parameters';
        }

        return {
            threatLevel,
            criticalEvents,
            unacknowledgedAlerts,
            openEvents,
            totalEvents: events.length,
            totalAlerts: alerts.length,
            complianceScore: metrics.complianceScore,
            systemVulnerabilities: Array.isArray(metrics.systemVulnerabilities) ? metrics.systemVulnerabilities.length : 0,
            responseTime: {
                average: averageResponseTime,
                target: targetResponseTime,
                trend: responseTimeTrend
            },
            summary,
            recommendations,
            recentTrends
        };
    }, [metrics, events, alerts, timeRange]);

    const refreshSecurityData = useCallback(() => {
        fetchSecurityData();
    }, [fetchSecurityData]);

    useEffect(() => {
        fetchSecurityData();

        if (autoRefresh) {
            // Set up periodic refresh every 60 seconds for security data
            const interval = setInterval(() => {
                fetchSecurityData();
            }, 60000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [fetchSecurityData, autoRefresh]);

    // Set up real-time security monitoring
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(async () => {
            try {
                // Fix: Use functional state updates for lines 405 and 408
                const eventsData = await securityService.getSecurityEvents();
                setEvents(() => eventsData);

                const metricsData = await securityService.getSecurityMetrics();
                setMetrics(() => metricsData);
            } catch (error) {
                console.error('Error fetching security events:', error);
            }
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [autoRefresh]);

    return {
        metrics,
        events,
        alerts,
        loading,
        error,
        summary: getSecuritySummary(),
        acknowledgeAlert,
        resolveAlert,
        assignEvent,
        resolveEvent,
        triggerEmergencyAlert,
        refreshSecurityData,
        filterEvents,
        exportSecurityReport
    };
};