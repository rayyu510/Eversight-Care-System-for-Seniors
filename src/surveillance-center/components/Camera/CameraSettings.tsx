import {
    CameraDevice,
    CameraConfiguration,
    CameraPreset,
    CameraGroup,
    CameraStatus,
    CameraStream,
    CameraCapabilities,
    CameraMaintenance,
    MotionZone,
    PrivacyMask
} from '../../types/cameraTypes';

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
}

export interface CameraMetrics {
    uptime: number;
    bandwidth: number;
    storageUsed: number;
    recordingHours: number;
    motionEvents: number;
    aiDetections: number;
    lastMotionTime?: string;
}

class CameraService {
    private static instance: CameraService;

    static getInstance(): CameraService {
        if (!CameraService.instance) {
            CameraService.instance = new CameraService();
        }
        return CameraService.instance;
    }

    async getCameras(): Promise<CameraDevice[]> {
        return [
            {
                id: 'CAM_12345678',
                name: 'Main Entrance',
                type: 'dome',
                status: {
                    online: true,
                    recording: true,
                    motionDetection: true,
                    lastSeen: new Date().toISOString(),
                    health: 'excellent',
                    uptime: 99.5,
                    errorCount: 0,
                    warnings: []
                },
                location: {
                    building: 'Building A',
                    floor: 'Ground Floor',
                    room: 'Main Entrance',
                    coordinates: { x: 0, y: 0 },
                    description: 'Front door monitoring',
                    zone: 'Entrance',
                    accessible: true
                },
                stream: {
                    primaryUrl: 'rtsp://camera001.local/stream',
                    resolution: '1920x1080',
                    frameRate: 30,
                    bitrate: 6000,
                    codec: 'H.264',
                    protocol: 'rtsp',
                    quality: 'high',
                    audioEnabled: false,
                    latency: 200
                },
                capabilities: {
                    ptz: true,
                    zoom: true,
                    nightVision: true,
                    audioRecording: false,
                    motionDetection: true,
                    faceRecognition: true,
                    licenseRecognition: false,
                    thermalImaging: false,
                    weatherResistant: true,
                    varifocalLens: false,
                    digitalZoom: 4,
                    opticalZoom: 12
                },
                configuration: {
                    exposure: 'auto',
                    whiteBalance: 'auto',
                    brightness: 50,
                    contrast: 50,
                    saturation: 50,
                    sharpness: 50,
                    noiseReduction: true,
                    backlightCompensation: false,
                    privacyMasks: [],
                    motionZones: [
                        {
                            id: 'zone-001',
                            name: 'Main Detection Area',
                            coordinates: { x: 10, y: 10, width: 80, height: 80 },
                            sensitivity: 75,
                            enabled: true
                        }
                    ]
                },
                maintenance: {
                    lastMaintenance: '2024-07-15T09:00:00Z',
                    nextMaintenance: '2024-10-15T09:00:00Z',
                    maintenanceType: 'routine',
                    firmwareVersion: '2.1.4',
                    updateAvailable: false,
                    maintenanceHistory: []
                }
            },
            {
                id: 'CAM_87654321',
                name: 'Hallway Central',
                type: 'fixed',
                status: {
                    online: true,
                    recording: true,
                    motionDetection: true,
                    lastSeen: new Date().toISOString(),
                    health: 'good',
                    uptime: 98.8,
                    errorCount: 2,
                    warnings: ['Low light conditions detected']
                },
                location: {
                    building: 'Building A',
                    floor: 'Ground Floor',
                    room: 'Main Hallway',
                    coordinates: { x: 50, y: 25 },
                    description: 'Central hallway monitoring',
                    zone: 'Interior',
                    accessible: true
                },
                stream: {
                    primaryUrl: 'rtsp://camera002.local/stream',
                    resolution: '1920x1080',
                    frameRate: 25,
                    bitrate: 4000,
                    codec: 'H.264',
                    protocol: 'rtsp',
                    quality: 'high',
                    audioEnabled: true,
                    latency: 180
                },
                capabilities: {
                    ptz: false,
                    zoom: false,
                    nightVision: true,
                    audioRecording: true,
                    motionDetection: true,
                    faceRecognition: true,
                    licenseRecognition: false,
                    thermalImaging: false,
                    weatherResistant: false,
                    varifocalLens: false,
                    digitalZoom: 2,
                    opticalZoom: 1
                },
                configuration: {
                    exposure: 'auto',
                    whiteBalance: 'auto',
                    brightness: 45,
                    contrast: 55,
                    saturation: 50,
                    sharpness: 50,
                    noiseReduction: true,
                    backlightCompensation: false,
                    privacyMasks: [],
                    motionZones: []
                },
                maintenance: {
                    lastMaintenance: '2024-07-15T09:00:00Z',
                    nextMaintenance: '2024-10-15T09:00:00Z',
                    maintenanceType: 'routine',
                    firmwareVersion: '2.1.3',
                    updateAvailable: true,
                    maintenanceHistory: []
                }
            },
            {
                id: 'CAM_11223344',
                name: 'Emergency Exit',
                type: 'fixed',
                status: {
                    online: false,
                    recording: false,
                    motionDetection: false,
                    lastSeen: new Date(Date.now() - 3600000).toISOString(),
                    health: 'critical',
                    uptime: 87.2,
                    errorCount: 5,
                    warnings: ['Connection timeout', 'Firmware update required']
                },
                location: {
                    building: 'Building A',
                    floor: 'Ground Floor',
                    room: 'Emergency Exit',
                    coordinates: { x: 100, y: 50 },
                    description: 'Emergency exit monitoring',
                    zone: 'Exit',
                    accessible: true
                },
                stream: {
                    primaryUrl: 'rtsp://camera003.local/stream',
                    resolution: '1280x720',
                    frameRate: 15,
                    bitrate: 2000,
                    codec: 'H.264',
                    protocol: 'rtsp',
                    quality: 'medium',
                    audioEnabled: false,
                    latency: 300
                },
                capabilities: {
                    ptz: false,
                    zoom: false,
                    nightVision: false,
                    audioRecording: false,
                    motionDetection: true,
                    faceRecognition: false,
                    licenseRecognition: false,
                    thermalImaging: false,
                    weatherResistant: false,
                    varifocalLens: false,
                    digitalZoom: 1,
                    opticalZoom: 1
                },
                configuration: {
                    exposure: 'manual',
                    whiteBalance: 'auto',
                    brightness: 50,
                    contrast: 50,
                    saturation: 50,
                    sharpness: 50,
                    noiseReduction: false,
                    backlightCompensation: false,
                    privacyMasks: [],
                    motionZones: []
                },
                maintenance: {
                    lastMaintenance: '2024-05-15T09:00:00Z',
                    nextMaintenance: '2024-08-15T09:00:00Z',
                    maintenanceType: 'repair',
                    firmwareVersion: '1.9.2',
                    updateAvailable: true,
                    maintenanceHistory: []
                }
            }
        ];
    }

    async getCameraById(id: string): Promise<CameraDevice | null> {
        const cameras = await this.getCameras();
        return cameras.find(camera => camera.id === id) || null;
    }

    async updateCameraConfiguration(cameraId: string, configuration: Partial<CameraConfiguration>): Promise<boolean> {
        console.log(`Updating camera ${cameraId} configuration:`, configuration);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }

    async controlCamera(control: CameraControl): Promise<boolean> {
        console.log(`Camera control:`, control);

        const camera = await this.getCameraById(control.cameraId);
        if (!camera) {
            throw new Error(`Camera ${control.cameraId} not found`);
        }

        if ((control.action === 'pan' || control.action === 'tilt') && !camera.capabilities.ptz) {
            throw new Error('Camera does not support PTZ controls');
        }

        if (control.action === 'zoom' && !camera.capabilities.zoom) {
            throw new Error('Camera does not support zoom');
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }

    async restartCamera(cameraId: string): Promise<boolean> {
        console.log(`Restarting camera: ${cameraId}`);
        const camera = await this.getCameraById(cameraId);
        if (!camera) {
            throw new Error(`Camera ${cameraId} not found`);
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
    }

    async getCameraGroups(): Promise<CameraGroup[]> {
        return [
            {
                id: 'GRP_12345678',
                name: 'Main Areas',
                description: 'Primary surveillance areas',
                cameraIds: ['CAM_12345678', 'CAM_87654321'],
                permissions: ['view', 'control'],
                createdBy: 'admin',
                createdAt: '2024-01-15T10:00:00Z',
                settings: {
                    syncRecording: false,
                    sharedSettings: false,
                    autoFailover: true
                }
            },
            {
                id: 'GRP_87654321',
                name: 'Security Points',
                description: 'Entry and exit points',
                cameraIds: ['CAM_12345678', 'CAM_11223344'],
                permissions: ['view', 'control', 'manage'],
                createdBy: 'security_manager',
                createdAt: '2024-02-01T14:30:00Z',
                settings: {
                    syncRecording: true,
                    sharedSettings: true,
                    autoFailover: false
                }
            }
        ];
    }

    async createCameraGroup(group: Omit<CameraGroup, 'id' | 'createdAt'>): Promise<string> {
        const id = `GRP_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        console.log('Creating camera group:', { id, ...group });
        await new Promise(resolve => setTimeout(resolve, 500));
        return id;
    }

    async updateCameraGroup(groupId: string, updates: Partial<CameraGroup>): Promise<boolean> {
        console.log(`Updating camera group ${groupId}:`, updates);
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }

    async deleteCameraGroup(groupId: string): Promise<boolean> {
        console.log(`Deleting camera group: ${groupId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }

    async takeSnapshot(cameraId: string): Promise<string> {
        console.log(`Taking snapshot from camera: ${cameraId}`);
        const camera = await this.getCameraById(cameraId);
        if (!camera) {
            throw new Error(`Camera ${cameraId} not found`);
        }

        if (!camera.status.online) {
            throw new Error(`Camera ${cameraId} is offline`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        return `https://api.surveillance.local/snapshots/${cameraId}-${Date.now()}.jpg`;
    }

    async startRecording(cameraId: string, duration?: number): Promise<string> {
        console.log(`Starting recording on camera: ${cameraId}, duration: ${duration}s`);
        const camera = await this.getCameraById(cameraId);
        if (!camera) {
            throw new Error(`Camera ${cameraId} not found`);
        }

        if (!camera.status.online) {
            throw new Error(`Camera ${cameraId} is offline`);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        return `REC_${cameraId}_${Date.now()}`;
    }

    async stopRecording(cameraId: string, recordingId: string): Promise<boolean> {
        console.log(`Stopping recording: ${recordingId} on camera: ${cameraId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }

    async getCameraMetrics(cameraId: string, timeRange: '1h' | '24h' | '7d' = '24h'): Promise<CameraMetrics> {
        const camera = await this.getCameraById(cameraId);
        if (!camera) {
            throw new Error(`Camera ${cameraId} not found`);
        }

        return {
            uptime: camera.status.uptime || 0,
            bandwidth: camera.stream.bitrate / 1000,
            storageUsed: Math.random() * 50,
            recordingHours: 720,
            motionEvents: Math.floor(Math.random() * 200),
            aiDetections: Math.floor(Math.random() * 50),
            lastMotionTime: new Date(Date.now() - Math.random() * 3600000).toISOString()
        };
    }

    async getCameraPresets(cameraId: string): Promise<CameraPreset[]> {
        const camera = await this.getCameraById(cameraId);
        if (!camera || !camera.capabilities.ptz) {
            return [];
        }

        return [
            {
                id: 'PRESET_001',
                cameraId,
                name: 'Main View',
                position: { pan: 0, tilt: 0, zoom: 1 },
                createdBy: 'admin',
                createdAt: '2024-01-15T10:00:00Z',
                isDefault: true
            },
            {
                id: 'PRESET_002',
                cameraId,
                name: 'Entrance Focus',
                position: { pan: 45, tilt: -10, zoom: 3 },
                createdBy: 'security_operator',
                createdAt: '2024-02-01T14:30:00Z',
                isDefault: false
            }
        ];
    }

    async createCameraPreset(preset: Omit<CameraPreset, 'id' | 'createdAt'>): Promise<string> {
        const id = `PRESET_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        console.log('Creating camera preset:', { id, ...preset });
        await new Promise(resolve => setTimeout(resolve, 500));
        return id;
    }

    async updateCameraPreset(presetId: string, updates: Partial<CameraPreset>): Promise<boolean> {
        console.log(`Updating camera preset ${presetId}:`, updates);
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }

    async deleteCameraPreset(presetId: string): Promise<boolean> {
        console.log(`Deleting camera preset: ${presetId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }

    async gotoPreset(cameraId: string, presetId: string): Promise<boolean> {
        return this.controlCamera({
            cameraId,
            action: 'preset',
            parameters: { presetId }
        });
    }

    subscribe(event: string, callback: Function): () => void {
        console.log(`Subscribing to camera event: ${event}`);
        return () => {
            console.log(`Unsubscribing from camera event: ${event}`);
        };
    }

    disconnect(): void {
        console.log('Disconnecting camera service');
    }
}

// Export both the class and an instance for backward compatibility
export { CameraService };
export const cameraService = CameraService.getInstance();
export default CameraService;