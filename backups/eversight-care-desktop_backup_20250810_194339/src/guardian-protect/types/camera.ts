// Add these interfaces to your existing types or create new file
export interface CameraDevice {
    id: string;
    name: string;
    location: {
        room: string;
        x: number;
        y: number;
        floor: string;
    };
    status: 'online' | 'offline' | 'maintenance';
    streamUrl: string;
    isRecording: boolean;
    hasMotionDetection: boolean;
    lastActivity: string;
    permissions: {
        view: boolean;
        record: boolean;
        audio: boolean;
    };
    specifications?: {
        resolution: string;
        fieldOfView: number;
        nightVision: boolean;
        audioCapture: boolean;
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
    confidence: number;
    responseTime?: number;
    acknowledgedBy?: string;
    resolvedBy?: string;
    notes?: string;
    videoClipUrl?: string;
}

export interface FloorPlan {
    id: string;
    name: string;
    imageUrl: string;
    scale: number;
    dimensions: {
        width: number;
        height: number;
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
        x: number;
        y: number;
        width: number;
        height: number;
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