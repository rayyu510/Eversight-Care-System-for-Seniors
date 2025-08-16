// src/surveillance-center/services/securityService.ts
// Fixed Security Service with proper SecurityEvent structure

import { SecurityEvent, SecurityKPIs, SecurityKPI, SecurityIncident, SecurityMetrics } from '../types';

export class SecurityService {
    private static instance: SecurityService;
    private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    public static getInstance(): SecurityService {
        if (!SecurityService.instance) {
            SecurityService.instance = new SecurityService();
        }
        return SecurityService.instance;
    }

    async getSecurityEvents(filters?: {
        severity?: string;
        status?: string;
        timeRange?: string;
    }): Promise<SecurityEvent[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.severity) params.append('severity', filters.severity);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.timeRange) params.append('timeRange', filters.timeRange);

            const response = await fetch(`${this.baseUrl}/api/surveillance/security/events?${params}`);
            if (!response.ok) throw new Error('Failed to fetch security events');

            return await response.json();
        } catch (error) {
            console.error('Error fetching security events:', error);
            return this.getMockSecurityEvents();
        }
    }

    async getSecurityKPIs(): Promise<SecurityKPIs> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/security/kpis`);
            if (!response.ok) throw new Error('Failed to fetch security KPIs');

            return await response.json();
        } catch (error) {
            console.error('Error fetching security KPIs:', error);
            return {
                alertResolutionRate: 87.5,
                falsePositiveRate: 12.3,
                averageDetectionTime: 45,
                systemUptime: 99.2,
                camerasOnline: 22,
                totalCameras: 24
            };
        }
    }

    async acknowledgeEvent(eventId: string, userId: string, notes?: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/security/events/${eventId}/acknowledge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, notes })
            });

            return response.ok;
        } catch (error) {
            console.error('Error acknowledging event:', error);
            return false;
        }
    }

    async resolveEvent(eventId: string, userId: string, resolution: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/security/events/${eventId}/resolve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, resolution })
            });

            return response.ok;
        } catch (error) {
            console.error('Error resolving event:', error);
            return false;
        }
    }

    private getMockSecurityEvents(): SecurityEvent[] {
        return [
            {
                id: 'sec_evt_001',
                title: 'Unauthorized Access Detected',
                description: 'Motion detected in restricted area after hours',
                type: 'intrusion',
                severity: 'high',
                status: 'acknowledged',
                location: {
                    building: 'Main Building',
                    floor: '2nd Floor',
                    room: 'Server Room',
                    zone: 'Restricted Area',
                    coordinates: { x: 150, y: 200 },
                    description: 'Server room entrance'
                },
                timestamp: new Date(Date.now() - 300000).toISOString(),
                source: {
                    type: 'camera',
                    sourceId: 'camera_12',
                    location: {
                        building: 'Main Building',
                        floor: '2nd Floor',
                        room: 'Server Room',
                        zone: 'Restricted Area',
                        coordinates: { x: 150, y: 200 },
                        description: 'Server room entrance'
                    },
                    timestamp: new Date(Date.now() - 300000).toISOString(),
                    reliability: 0.92
                },
                detection: {
                    method: 'ai',
                    confidence: 0.89,
                    algorithm: 'motion_detection_v2',
                    parameters: { sensitivity: 0.8, threshold: 0.7 }
                },
                response: {
                    assignedTo: 'security_team_1',
                    actions: ['camera_review', 'alert_sent', 'security_dispatch'],
                    timeline: [
                        {
                            timestamp: new Date(Date.now() - 280000).toISOString(),
                            action: 'Event detected',
                            user: 'system'
                        },
                        {
                            timestamp: new Date(Date.now() - 240000).toISOString(),
                            action: 'Alert sent to security team',
                            user: 'system'
                        },
                        {
                            timestamp: new Date(Date.now() - 180000).toISOString(),
                            action: 'Acknowledged by security officer',
                            user: 'officer_johnson',
                            notes: 'Investigating incident'
                        }
                    ],
                    escalated: false,
                    notificationsSent: ['security_team', 'supervisor']
                },
                metadata: {
                    cameras: ['camera_12', 'camera_13'],
                    recordings: ['rec_20240815_001.mp4'],
                    screenshots: ['screenshot_001.jpg'],
                    reports: [],
                    relatedEvents: []
                },
                estimatedImpact: 'medium'
            },
            {
                id: 'sec_evt_002',
                title: 'Suspicious Behavior Pattern',
                description: 'Individual loitering in parking area for extended period',
                type: 'suspicious_behavior',
                severity: 'medium',
                status: 'investigating',
                location: {
                    building: 'Parking Structure',
                    floor: 'Level 1',
                    room: 'Parking Area A',
                    zone: 'Visitor Parking',
                    coordinates: { x: 300, y: 450 },
                    description: 'North parking area'
                },
                timestamp: new Date(Date.now() - 900000).toISOString(),
                source: {
                    type: 'ai_analysis',
                    sourceId: 'camera_08',
                    location: {
                        building: 'Parking Structure',
                        floor: 'Level 1',
                        room: 'Parking Area A',
                        zone: 'Visitor Parking',
                        coordinates: { x: 300, y: 450 },
                        description: 'North parking area'
                    },
                    timestamp: new Date(Date.now() - 900000).toISOString(),
                    reliability: 0.78
                },
                detection: {
                    method: 'ai',
                    confidence: 0.73,
                    algorithm: 'behavior_analysis_v1',
                    parameters: { loitering_threshold: 300, confidence_min: 0.7 }
                },
                response: {
                    assignedTo: 'security_team_2',
                    actions: ['behavioral_analysis', 'camera_tracking', 'patrol_dispatch'],
                    timeline: [
                        {
                            timestamp: new Date(Date.now() - 880000).toISOString(),
                            action: 'Suspicious behavior detected',
                            user: 'system'
                        },
                        {
                            timestamp: new Date(Date.now() - 840000).toISOString(),
                            action: 'Analysis initiated',
                            user: 'ai_system'
                        },
                        {
                            timestamp: new Date(Date.now() - 600000).toISOString(),
                            action: 'Security team notified',
                            user: 'system'
                        }
                    ],
                    escalated: false,
                    notificationsSent: ['security_team']
                },
                metadata: {
                    cameras: ['camera_08', 'camera_09'],
                    recordings: ['rec_20240815_002.mp4'],
                    screenshots: ['screenshot_002.jpg', 'screenshot_003.jpg'],
                    reports: [],
                    relatedEvents: []
                },
                estimatedImpact: 'low'
            }
        ];
    }

    async getSecurityMetrics(): Promise<SecurityMetrics> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/security/metrics`);
            if (!response.ok) throw new Error('Failed to fetch security metrics');

            return await response.json();
        } catch (error) {
            console.error('Error fetching security metrics:', error);
            return {
                activeAlerts: 3,
                totalEvents: 47,
                systemHealth: 97,
                responseTime: 2.3,
                detectionAccuracy: 94.2,
                falsePositives: 8
            };
        }
    }

    async createSecurityEvent(eventData: Partial<SecurityEvent>): Promise<SecurityEvent> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/security/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) throw new Error('Failed to create security event');
            return await response.json();
        } catch (error) {
            console.error('Error creating security event:', error);

            // Return mock event for development
            const mockEvent: SecurityEvent = {
                id: `sec_evt_${Date.now()}`,
                title: eventData.title || 'Security Event',
                description: eventData.description || 'Security event description',
                type: eventData.type || 'system_alert',
                severity: eventData.severity || 'medium',
                status: 'active',
                location: eventData.location || {
                    building: 'Main Building',
                    floor: '1st Floor',
                    room: 'Lobby',
                    zone: 'Main Area',
                    coordinates: { x: 0, y: 0 },
                    description: 'Main lobby area'
                },
                timestamp: new Date().toISOString(),
                source: {
                    type: 'manual',
                    sourceId: 'manual_input',
                    location: eventData.location || {
                        building: 'Main Building',
                        floor: '1st Floor',
                        room: 'Lobby',
                        zone: 'Main Area',
                        coordinates: { x: 0, y: 0 },
                        description: 'Main lobby area'
                    },
                    timestamp: new Date().toISOString(),
                    reliability: 1.0
                },
                detection: {
                    method: 'manual',
                    confidence: 1.0
                },
                response: {
                    actions: [],
                    timeline: [{
                        timestamp: new Date().toISOString(),
                        action: 'Event created',
                        user: 'system'
                    }],
                    escalated: false,
                    notificationsSent: []
                },
                metadata: {
                    cameras: [],
                    recordings: [],
                    screenshots: [],
                    reports: [],
                    relatedEvents: []
                },
                estimatedImpact: eventData.estimatedImpact || 'low'
            };

            return mockEvent;
        }
    }

    async getIncidents(): Promise<SecurityIncident[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/security/incidents`);
            if (!response.ok) throw new Error('Failed to fetch security incidents');

            return await response.json();
        } catch (error) {
            console.error('Error fetching security incidents:', error);
            return this.getMockIncidents();
        }
    }

    private getMockIncidents(): SecurityIncident[] {
        return [
            {
                id: 'incident_001',
                title: 'Unauthorized Access Investigation',
                description: 'Investigation into after-hours access in restricted areas',
                severity: 'high',
                status: 'investigating',
                assignedTo: 'security_lead',
                events: ['sec_evt_001', 'sec_evt_003'],
                timeline: [
                    {
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                        action: 'Incident created',
                        user: 'security_supervisor'
                    },
                    {
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        action: 'Investigation started',
                        user: 'security_lead',
                        notes: 'Reviewing camera footage and access logs'
                    }
                ],
                created: new Date(Date.now() - 7200000).toISOString(),
                updated: new Date(Date.now() - 3600000).toISOString()
            }
        ];
    }
}

export const securityService = new SecurityService();