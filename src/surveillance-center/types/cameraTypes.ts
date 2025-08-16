// src/surveillance-center/types/cameraTypes.ts

// Basic coordinate interface
export interface Coordinates {
    x: number;
    y: number;
}

export interface MotionZone {
    id: string;
    name: string;
    coordinates: { x: number; y: number; width: number; height: number };
    sensitivity: number;
    enabled: boolean;
}

export interface PrivacyMask {
    id: string;
    name: string;
    coordinates: { x: number; y: number; width: number; height: number };
    enabled: boolean;
}

// Camera Status - Unified object format
export interface CameraStatus {
    online: boolean;
    recording: boolean;
    motionDetection: boolean;
    lastSeen: string;
    health: 'excellent' | 'good' | 'warning' | 'critical';
    uptime: number;
    errorCount: number;
    warnings: string[];
}

// Camera Location
export interface CameraLocation {
    building: string;
    floor: string;
    room: string;
    coordinates: Coordinates;
    description: string;
    zone: string;
    accessible: boolean;
}

// Camera Stream
export interface CameraStream {
    primaryUrl: string;
    resolution: string;
    frameRate: number;
    bitrate: number;
    codec: string;
    protocol: string;
    quality: 'low' | 'medium' | 'high' | 'ultra';
    audioEnabled: boolean;
    latency: number;
}

// Camera Capabilities
export interface CameraCapabilities {
    ptz: boolean;
    zoom: boolean;
    nightVision: boolean;
    audioRecording: boolean;
    motionDetection: boolean;
    faceRecognition: boolean;
    licenseRecognition: boolean;
    thermalImaging: boolean;
    weatherResistant: boolean;
    varifocalLens: boolean;
    digitalZoom: number;
    opticalZoom: number;
}

// Camera Configuration
export interface CameraConfiguration {
    exposure: 'auto' | 'manual';
    whiteBalance: 'auto' | 'manual';
    brightness: number;
    contrast: number;
    saturation: number;
    sharpness: number;
    noiseReduction: boolean;
    backlightCompensation: boolean;
    privacyMasks: PrivacyMask[];
    motionZones: MotionZone[];
}

// Camera Maintenance
export interface CameraMaintenance {
    lastMaintenance: string;
    nextMaintenance: string;
    maintenanceType: 'routine' | 'repair' | 'upgrade';
    firmwareVersion: string;
    updateAvailable: boolean;
    maintenanceHistory: any[];
}

// Main Camera Device interface (replaces the old Camera interface)
export interface CameraDevice {
    id: string;
    name: string;
    type: 'fixed' | 'dome' | 'bullet' | 'ptz';
    status: CameraStatus;
    location: CameraLocation;
    stream: CameraStream;
    capabilities: CameraCapabilities;
    configuration: CameraConfiguration;
    maintenance: CameraMaintenance;
}

// Camera Control interface
export interface CameraControl {
    cameraId: string;
    action: 'pan' | 'tilt' | 'zoom' | 'preset' | 'snapshot' | 'record' | 'stop_record';
    parameters?: {
        pan?: number;
        tilt?: number;
        zoom?: number;
        presetId?: string;
        duration?: number;
    };
    timestamp?: string;
}

// Camera Preset
export interface CameraPreset {
    id: string;
    cameraId: string;
    name: string;
    position: {
        pan: number;
        tilt: number;
        zoom: number;
    };
    createdBy: string;
    createdAt: string;
    isDefault: boolean;
}

// Camera Group
export interface CameraGroup {
    id: string;
    name: string;
    description: string;
    cameraIds: string[];
    permissions: string[];
    createdBy: string;
    createdAt: string;
    settings: {
        syncRecording: boolean;
        sharedSettings: boolean;
        autoFailover: boolean;
    };
}

// Helper functions for backward compatibility
export const getCameraStatusString = (status: CameraStatus): string => {
    if (!status.online) return 'offline';
    if (status.health === 'critical' || status.health === 'warning') return 'maintenance';
    return 'online';
};

export const createCameraStatus = (statusString: string): CameraStatus => {
    const baseStatus: CameraStatus = {
        online: statusString === 'online',
        recording: statusString === 'online',
        motionDetection: statusString === 'online',
        lastSeen: new Date().toISOString(),
        health: statusString === 'online' ? 'excellent' : 'critical',
        uptime: statusString === 'online' ? 99.5 : 0,
        errorCount: statusString === 'online' ? 0 : 1,
        warnings: statusString === 'online' ? [] : ['Camera offline']
    };
    return baseStatus;
};

// Detection Event interfaces
export interface DetectionEvent {
    id: string;
    cameraId: string;
    timestamp: Date;
    type: 'motion' | 'face_recognition' | 'object_detection' | 'license_plate';
    confidence: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    metadata: {
        processed: boolean;
        [key: string]: any;
    };
}

export interface MotionDetectionEvent {
    id: string;
    cameraId: string;
    timestamp: Date;
    zone: string;
    intensity: number;
    duration: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

// Export legacy Camera type for backward compatibility
export type Camera = CameraDevice;