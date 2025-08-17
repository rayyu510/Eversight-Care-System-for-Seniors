// src/guardian-protect/services/cameraService.ts
export interface CameraDevice {
    id: string;
    name: string;
    location: {
        room: string;
        x: number; // X coordinate on floor plan (percentage)
        y: number; // Y coordinate on floor plan (percentage)
        floor: string;
    };
    status: 'online' | 'offline' | 'maintenance';
    streamUrl: string;
    recordingUrl?: string;
    isRecording: boolean;
    hasMotionDetection: boolean;
    lastActivity: string;
    permissions: {
        view: boolean;
        record: boolean;
        audio: boolean;
    };
    specifications: {
        resolution: string;
        fieldOfView: number;
        nightVision: boolean;
        audioCapture: boolean;
    };
    installation: {
        installedDate: string;
        lastMaintenance: string;
        warrantyExpiry: string;
    };
}

export interface FallIncident {
    id: string;
    timestamp: string;
    severity: 'critical' | 'high' | 'medium';
    cameraId: string;
    location: {
        room: string;
        x: number;
        y: number;
        description: string;
        floor: string;
    };
    status: 'active' | 'acknowledged' | 'resolved' | 'false_positive';
    confidence: number; // AI confidence percentage
    responseTime?: number;
    acknowledgedBy?: string;
    resolvedBy?: string;
    notes?: string;
    videoClipUrl?: string;
    alertsSent: string[]; // List of alert methods used
}

export interface FloorPlan {
    id: string;
    name: string;
    imageUrl: string;
    scale: number; // pixels per meter
    dimensions: {
        width: number; // in meters
        height: number; // in meters
    };
    rooms: Room[];
    metadata: {
        createdDate: string;
        lastUpdated: string;
        version: string;
    };
}

export interface Room {
    id: string;
    name: string;
    type: 'bedroom' | 'bathroom' | 'kitchen' | 'living_room' | 'hallway' | 'entrance' | 'dining_room' | 'office';
    coordinates: {
        x: number; // percentage
        y: number; // percentage
        width: number; // percentage
        height: number; // percentage
    };
    riskLevel: 'low' | 'medium' | 'high';
    monitoringProfile: {
        fallDetectionEnabled: boolean;
        motionSensitivity: 'low' | 'medium' | 'high';
        alertThreshold: number;
        quietHours?: {
            start: string;
            end: string;
        };
    };
}

export interface CameraStreamPermission {
    userId: string;
    cameraId: string;
    permissions: {
        view: boolean;
        record: boolean;
        audio: boolean;
        export: boolean;
    };
    timeRestrictions?: {
        allowedHours: {
            start: string;
            end: string;
        };
        allowedDays: string[];
    };
    expiryDate?: string;
}

export interface RealTimeAlert {
    id: string;
    type: 'fall_detected' | 'motion_detected' | 'camera_offline' | 'emergency_button';
    timestamp: string;
    cameraId?: string;
    location: {
        room: string;
        coordinates: { x: number; y: number };
    };
    severity: 'critical' | 'high' | 'medium' | 'low';
    message: string;
    autoResolve: boolean;
    escalationRules: {
        timeoutMinutes: number;
        escalateToContacts: string[];
    };
}

// Camera and Floor Plan Service Implementation
export class CameraService {
    private cameras: Map<string, CameraDevice> = new Map();
    private floorPlans: Map<string, FloorPlan> = new Map();
    private fallIncidents: Map<string, FallIncident> = new Map();
    private activeStreams: Map<string, MediaStream> = new Map();
    private permissions: Map<string, CameraStreamPermission> = new Map();

    constructor() {
        this.initializeMockData();
    }

    // Camera Management
    async getCamerasAsync(): Promise<CameraDevice[]> {
        return Array.from(this.cameras.values());
    }

    async getCameraByIdAsync(cameraId: string): Promise<CameraDevice | null> {
        return this.cameras.get(cameraId) || null;
    }

    async getCamerasByRoomAsync(roomName: string): Promise<CameraDevice[]> {
        return Array.from(this.cameras.values()).filter(
            camera => camera.location.room === roomName
        );
    }

    async getCamerasByStatusAsync(status: CameraDevice['status']): Promise<CameraDevice[]> {
        return Array.from(this.cameras.values()).filter(
            camera => camera.status === status
        );
    }

    async updateCameraStatusAsync(cameraId: string, status: CameraDevice['status']): Promise<boolean> {
        const camera = this.cameras.get(cameraId);
        if (camera) {
            camera.status = status;
            camera.lastActivity = new Date().toISOString();
            this.cameras.set(cameraId, camera);
            return true;
        }
        return false;
    }

    // Floor Plan Management
    async getFloorPlansAsync(): Promise<FloorPlan[]> {
        return Array.from(this.floorPlans.values());
    }

    async getFloorPlanByIdAsync(floorPlanId: string): Promise<FloorPlan | null> {
        return this.floorPlans.get(floorPlanId) || null;
    }

    async updateFloorPlanAsync(floorPlan: FloorPlan): Promise<boolean> {
        floorPlan.metadata.lastUpdated = new Date().toISOString();
        this.floorPlans.set(floorPlan.id, floorPlan);
        return true;
    }

    // Fall Incident Management
    async getFallIncidentsAsync(): Promise<FallIncident[]> {
        return Array.from(this.fallIncidents.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    async getActiveFallIncidentsAsync(): Promise<FallIncident[]> {
        return Array.from(this.fallIncidents.values()).filter(
            incident => incident.status === 'active'
        );
    }

    async acknowledgeFallIncidentAsync(
        incidentId: string,
        acknowledgedBy: string,
        notes?: string
    ): Promise<boolean> {
        const incident = this.fallIncidents.get(incidentId);
        if (incident && incident.status === 'active') {
            incident.status = 'acknowledged';
            incident.acknowledgedBy = acknowledgedBy;
            incident.responseTime = Math.floor(
                (new Date().getTime() - new Date(incident.timestamp).getTime()) / 1000
            );
            if (notes) incident.notes = notes;
            this.fallIncidents.set(incidentId, incident);
            return true;
        }
        return false;
    }

    async resolveFallIncidentAsync(
        incidentId: string,
        resolvedBy: string,
        notes?: string
    ): Promise<boolean> {
        const incident = this.fallIncidents.get(incidentId);
        if (incident && (incident.status === 'active' || incident.status === 'acknowledged')) {
            incident.status = 'resolved';
            incident.resolvedBy = resolvedBy;
            if (notes) incident.notes = notes;
            this.fallIncidents.set(incidentId, incident);
            return true;
        }
        return false;
    }

    async markFalsePositiveAsync(incidentId: string, notes?: string): Promise<boolean> {
        const incident = this.fallIncidents.get(incidentId);
        if (incident) {
            incident.status = 'false_positive';
            if (notes) incident.notes = notes;
            this.fallIncidents.set(incidentId, incident);
            return true;
        }
        return false;
    }

    // Real-time Stream Management
    async requestCameraStreamAsync(
        cameraId: string,
        userId: string
    ): Promise<{ streamUrl: string; permissions: CameraStreamPermission } | null> {
        const camera = this.cameras.get(cameraId);
        const permission = this.permissions.get(`${userId}-${cameraId}`);

        if (camera && permission && permission.permissions.view && camera.status === 'online') {
            // In real implementation, this would establish actual stream connection
            return {
                streamUrl: camera.streamUrl,
                permissions: permission
            };
        }
        return null;
    }

    async stopCameraStreamAsync(cameraId: string, userId: string): Promise<boolean> {
        const streamKey = `${userId}-${cameraId}`;
        const stream = this.activeStreams.get(streamKey);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            this.activeStreams.delete(streamKey);
            return true;
        }
        return false;
    }

    // Camera Recording Management
    async startRecordingAsync(cameraId: string, duration?: number): Promise<boolean> {
        const camera = this.cameras.get(cameraId);
        if (camera && camera.status === 'online') {
            camera.isRecording = true;
            this.cameras.set(cameraId, camera);

            // Auto-stop recording after duration (if specified)
            if (duration) {
                setTimeout(() => {
                    this.stopRecordingAsync(cameraId);
                }, duration * 1000);
            }
            return true;
        }
        return false;
    }

    async stopRecordingAsync(cameraId: string): Promise<boolean> {
        const camera = this.cameras.get(cameraId);
        if (camera) {
            camera.isRecording = false;
            this.cameras.set(cameraId, camera);
            return true;
        }
        return false;
    }

    // Emergency Response
    async triggerEmergencyAlertAsync(
        cameraId: string,
        location: { room: string; x: number; y: number },
        severity: 'critical' | 'high' = 'critical'
    ): Promise<string> {
        const alertId = `emergency-${Date.now()}`;

        // Create emergency incident
        const incident: FallIncident = {
            id: alertId,
            timestamp: new Date().toISOString(),
            severity,
            cameraId,
            location: {
                ...location,
                description: `Emergency alert triggered in ${location.room}`,
                floor: 'main-floor'
            },
            status: 'active',
            confidence: 100,
            alertsSent: ['emergency_services', 'primary_contact', 'caregiver']
        };

        this.fallIncidents.set(alertId, incident);

        // Start emergency recording
        await this.startRecordingAsync(cameraId, 300); // 5 minutes

        return alertId;
    }

    // Analytics and Reporting
    async getCameraAnalyticsAsync(cameraId: string, days: number = 7): Promise<{
        totalIncidents: number;
        falsePositives: number;
        responseTime: number;
        uptimePercentage: number;
        motionEvents: number;
    }> {
        const camera = this.cameras.get(cameraId);
        if (!camera) {
            throw new Error('Camera not found');
        }

        const incidents = Array.from(this.fallIncidents.values()).filter(
            incident => incident.cameraId === cameraId
        );

        const recentIncidents = incidents.filter(incident => {
            const incidentDate = new Date(incident.timestamp);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            return incidentDate >= cutoffDate;
        });

        const falsePositives = recentIncidents.filter(
            incident => incident.status === 'false_positive'
        ).length;

        const resolvedIncidents = recentIncidents.filter(
            incident => incident.status === 'resolved' && incident.responseTime
        );

        const avgResponseTime = resolvedIncidents.length > 0
            ? resolvedIncidents.reduce((sum, incident) => sum + (incident.responseTime || 0), 0) / resolvedIncidents.length
            : 0;

        return {
            totalIncidents: recentIncidents.length,
            falsePositives,
            responseTime: Math.round(avgResponseTime),
            uptimePercentage: camera.status === 'online' ? 98.5 : 85.2, // Mock data
            motionEvents: Math.floor(Math.random() * 50) + 10 // Mock data
        };
    }

    // Permission Management
    async grantCameraPermissionAsync(
        userId: string,
        cameraId: string,
        permissions: Partial<CameraStreamPermission['permissions']>
    ): Promise<boolean> {
        const permissionKey = `${userId}-${cameraId}`;
        const existingPermission = this.permissions.get(permissionKey);

        const newPermission: CameraStreamPermission = {
            userId,
            cameraId,
            permissions: {
                view: false,
                record: false,
                audio: false,
                export: false,
                ...existingPermission?.permissions,
                ...permissions
            }
        };

        this.permissions.set(permissionKey, newPermission);
        return true;
    }

    async revokeCameraPermissionAsync(userId: string, cameraId: string): Promise<boolean> {
        const permissionKey = `${userId}-${cameraId}`;
        return this.permissions.delete(permissionKey);
    }

    // Initialize mock data for development
    private initializeMockData(): void {
        // Mock Floor Plan
        const mainFloorPlan: FloorPlan = {
            id: 'main-floor',
            name: 'Main Floor - Assisted Living Unit',
            imageUrl: '/api/floorplan/main-floor.svg',
            scale: 50,
            dimensions: { width: 15, height: 12 },
            rooms: [
                {
                    id: 'living-room',
                    name: 'Living Room',
                    type: 'living_room',
                    coordinates: { x: 10, y: 10, width: 40, height: 30 },
                    riskLevel: 'medium',
                    monitoringProfile: {
                        fallDetectionEnabled: true,
                        motionSensitivity: 'medium',
                        alertThreshold: 85
                    }
                },
                {
                    id: 'kitchen',
                    name: 'Kitchen',
                    type: 'kitchen',
                    coordinates: { x: 55, y: 10, width: 35, height: 25 },
                    riskLevel: 'high',
                    monitoringProfile: {
                        fallDetectionEnabled: true,
                        motionSensitivity: 'high',
                        alertThreshold: 80
                    }
                },
                {
                    id: 'bedroom-1',
                    name: 'Master Bedroom',
                    type: 'bedroom',
                    coordinates: { x: 10, y: 50, width: 25, height: 30 },
                    riskLevel: 'medium',
                    monitoringProfile: {
                        fallDetectionEnabled: true,
                        motionSensitivity: 'low',
                        alertThreshold: 90,
                        quietHours: { start: '22:00', end: '07:00' }
                    }
                },
                {
                    id: 'bathroom',
                    name: 'Bathroom',
                    type: 'bathroom',
                    coordinates: { x: 40, y: 50, width: 15, height: 20 },
                    riskLevel: 'high',
                    monitoringProfile: {
                        fallDetectionEnabled: true,
                        motionSensitivity: 'high',
                        alertThreshold: 75
                    }
                },
                {
                    id: 'hallway',
                    name: 'Hallway',
                    type: 'hallway',
                    coordinates: { x: 35, y: 35, width: 30, height: 10 },
                    riskLevel: 'low',
                    monitoringProfile: {
                        fallDetectionEnabled: true,
                        motionSensitivity: 'medium',
                        alertThreshold: 90
                    }
                }
            ],
            metadata: {
                createdDate: '2025-01-15T10:00:00Z',
                lastUpdated: '2025-08-09T14:30:00Z',
                version: '2.1'
            }
        };

        this.floorPlans.set('main-floor', mainFloorPlan);

        // Mock Cameras
        const mockCameras: CameraDevice[] = [
            {
                id: 'cam-001',
                name: 'Living Room Camera - Main View',
                location: { room: 'Living Room', x: 25, y: 25, floor: 'main-floor' },
                status: 'online',
                streamUrl: 'rtsp://192.168.1.101:554/stream1',
                recordingUrl: '/recordings/cam-001/',
                isRecording: true,
                hasMotionDetection: true,
                lastActivity: '2 minutes ago',
                permissions: { view: true, record: true, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 120,
                    nightVision: true,
                    audioCapture: true
                },
                installation: {
                    installedDate: '2025-01-15T09:00:00Z',
                    lastMaintenance: '2025-07-01T10:00:00Z',
                    warrantyExpiry: '2027-01-15T00:00:00Z'
                }
            },
            {
                id: 'cam-002',
                name: 'Kitchen Camera - Island View',
                location: { room: 'Kitchen', x: 70, y: 20, floor: 'main-floor' },
                status: 'online',
                streamUrl: 'rtsp://192.168.1.102:554/stream1',
                recordingUrl: '/recordings/cam-002/',
                isRecording: true,
                hasMotionDetection: true,
                lastActivity: '5 minutes ago',
                permissions: { view: true, record: true, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 110,
                    nightVision: true,
                    audioCapture: false
                },
                installation: {
                    installedDate: '2025-01-15T09:30:00Z',
                    lastMaintenance: '2025-07-01T10:30:00Z',
                    warrantyExpiry: '2027-01-15T00:00:00Z'
                }
            },
            {
                id: 'cam-003',
                name: 'Bedroom Camera - Privacy Mode',
                location: { room: 'Master Bedroom', x: 22, y: 65, floor: 'main-floor' },
                status: 'online',
                streamUrl: 'rtsp://192.168.1.103:554/stream1',
                recordingUrl: '/recordings/cam-003/',
                isRecording: false,
                hasMotionDetection: true,
                lastActivity: '1 hour ago',
                permissions: { view: true, record: false, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 100,
                    nightVision: true,
                    audioCapture: false
                },
                installation: {
                    installedDate: '2025-01-15T10:00:00Z',
                    lastMaintenance: '2025-07-01T11:00:00Z',
                    warrantyExpiry: '2027-01-15T00:00:00Z'
                }
            },
            {
                id: 'cam-004',
                name: 'Bathroom Camera - Fall Detection',
                location: { room: 'Bathroom', x: 47, y: 60, floor: 'main-floor' },
                status: 'offline',
                streamUrl: 'rtsp://192.168.1.104:554/stream1',
                recordingUrl: '/recordings/cam-004/',
                isRecording: false,
                hasMotionDetection: true,
                lastActivity: '3 hours ago',
                permissions: { view: false, record: false, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 130,
                    nightVision: true,
                    audioCapture: false
                },
                installation: {
                    installedDate: '2025-01-15T10:30:00Z',
                    lastMaintenance: '2025-06-15T11:00:00Z',
                    warrantyExpiry: '2027-01-15T00:00:00Z'
                }
            },
            {
                id: 'cam-005',
                name: 'Hallway Camera - Motion Tracking',
                location: { room: 'Hallway', x: 50, y: 40, floor: 'main-floor' },
                status: 'online',
                streamUrl: 'rtsp://192.168.1.105:554/stream1',
                recordingUrl: '/recordings/cam-005/',
                isRecording: true,
                hasMotionDetection: true,
                lastActivity: '1 minute ago',
                permissions: { view: true, record: true, audio: false },
                specifications: {
                    resolution: '1920x1080',
                    fieldOfView: 140,
                    nightVision: true,
                    audioCapture: false
                },
                installation: {
                    installedDate: '2025-01-15T11:00:00Z',
                    lastMaintenance: '2025-07-01T11:30:00Z',
                    warrantyExpiry: '2027-01-15T00:00:00Z'
                }
            }
        ];

        mockCameras.forEach(camera => this.cameras.set(camera.id, camera));

        // Mock Fall Incidents
        const mockIncidents: FallIncident[] = [
            {
                id: 'fall-001',
                timestamp: '2025-08-10T14:23:15Z',
                severity: 'critical',
                cameraId: 'cam-002',
                location: {
                    room: 'Kitchen',
                    x: 65,
                    y: 25,
                    description: 'Near kitchen island, possible slip on wet floor',
                    floor: 'main-floor'
                },
                status: 'active',
                confidence: 94,
                videoClipUrl: '/recordings/incidents/fall-001.mp4',
                alertsSent: ['emergency_contact', 'caregiver', 'monitoring_center']
            },
            {
                id: 'fall-002',
                timestamp: '2025-08-10T09:15:32Z',
                severity: 'high',
                cameraId: 'cam-001',
                location: {
                    room: 'Living Room',
                    x: 30,
                    y: 20,
                    description: 'By the coffee table, resident got up too quickly',
                    floor: 'main-floor'
                },
                status: 'resolved',
                confidence: 87,
                responseTime: 45,
                acknowledgedBy: 'Nurse Sarah',
                resolvedBy: 'Dr. Johnson',
                notes: 'Resident confirmed safe, minor stumble while reaching for remote',
                videoClipUrl: '/recordings/incidents/fall-002.mp4',
                alertsSent: ['caregiver']
            },
            {
                id: 'fall-003',
                timestamp: '2025-08-09T21:45:12Z',
                severity: 'medium',
                cameraId: 'cam-003',
                location: {
                    room: 'Master Bedroom',
                    x: 20,
                    y: 70,
                    description: 'Getting out of bed, possible false positive',
                    floor: 'main-floor'
                },
                status: 'false_positive',
                confidence: 76,
                notes: 'Normal movement getting out of bed, AI sensitivity needs adjustment',
                videoClipUrl: '/recordings/incidents/fall-003.mp4',
                alertsSent: []
            }
        ];

        mockIncidents.forEach(incident => this.fallIncidents.set(incident.id, incident));

        // Mock Permissions
        this.permissions.set('user-001-cam-001', {
            userId: 'user-001',
            cameraId: 'cam-001',
            permissions: { view: true, record: true, audio: false, export: true }
        });
        this.permissions.set('user-001-cam-002', {
            userId: 'user-001',
            cameraId: 'cam-002',
            permissions: { view: true, record: true, audio: false, export: true }
        });
        this.permissions.set('user-001-cam-003', {
            userId: 'user-001',
            cameraId: 'cam-003',
            permissions: { view: true, record: false, audio: false, export: false },
            timeRestrictions: {
                allowedHours: { start: '07:00', end: '22:00' },
                allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            }
        });
    }
}

// Export singleton instance
export const cameraService = new CameraService();