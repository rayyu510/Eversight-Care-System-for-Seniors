// src/surveillance-center/utils/cameraUtils.ts
// Fixed Camera Utils with proper Camera type import

import { Camera, CameraLocation, CameraSettings } from '../types';

export const formatCameraStatus = (status: Camera['status']): string => {
    const statusMap = {
        online: 'Online',
        offline: 'Offline',
        maintenance: 'Maintenance',
        error: 'Error'
    };
    return statusMap[status] || 'Unknown';
};

export const getCameraStatusColor = (status: Camera['status']): string => {
    const colorMap = {
        online: 'text-green-600',
        offline: 'text-red-600',
        maintenance: 'text-yellow-600',
        error: 'text-red-800'
    };
    return colorMap[status] || 'text-gray-600';
};

export const calculateCameraUptime = (camera: Camera): number => {
    if (!camera.health.uptime) return 0;
    return Math.round((camera.health.uptime / (24 * 60 * 60)) * 100) / 100; // Days
};

export const formatCameraResolution = (resolution: string): string => {
    const resolutionMap: Record<string, string> = {
        '1920x1080': '1080p',
        '1280x720': '720p',
        '3840x2160': '4K',
        '2560x1440': '1440p'
    };
    return resolutionMap[resolution] || resolution;
};

export const getCameraCapabilityIcon = (capability: keyof Camera['capabilities']): string => {
    const iconMap = {
        pan: '↔️',
        tilt: '↕️',
        zoom: '🔍',
        infrared: '🌙',
        audio: '🔊'
    };
    return iconMap[capability] || '❓';
};

export const validateCameraSettings = (settings: Partial<CameraSettings>): string[] => {
    const errors: string[] = [];

    if (settings.brightness !== undefined && (settings.brightness < 0 || settings.brightness > 100)) {
        errors.push('Brightness must be between 0 and 100');
    }

    if (settings.contrast !== undefined && (settings.contrast < 0 || settings.contrast > 100)) {
        errors.push('Contrast must be between 0 and 100');
    }

    if (settings.saturation !== undefined && (settings.saturation < 0 || settings.saturation > 100)) {
        errors.push('Saturation must be between 0 and 100');
    }

    return errors;
};

export const generateCameraStreamUrl = (camera: Camera, quality: 'primary' | 'secondary' = 'primary'): string => {
    if (quality === 'secondary' && camera.stream.secondary) {
        return camera.stream.secondary;
    }
    return camera.stream.primary;
};

export const formatCameraLocation = (location: CameraLocation): string => {
    return `${location.building} - ${location.floor} - ${location.room}`;
};

export const calculateCameraHealthScore = (camera: Camera): number => {
    const { signal, temperature, uptime } = camera.health;

    // Signal strength (0-100)
    const signalScore = Math.min(signal, 100);

    // Temperature score (optimal around 20-30°C)
    const tempScore = temperature > 60 ? 0 : temperature < 10 ? 50 : 100;

    // Uptime score (percentage)
    const uptimeScore = Math.min(uptime / (24 * 60 * 60) * 100, 100);

    return Math.round((signalScore * 0.4 + tempScore * 0.3 + uptimeScore * 0.3));
};

export const getCameraTypeIcon = (type: Camera['type']): string => {
    const typeMap = {
        fixed: '📹',
        ptz: '🎥',
        dome: '🔵',
        bullet: '📷'
    };
    return typeMap[type] || '📹';
};

export const formatBitrate = (bitrate: number): string => {
    if (bitrate >= 1000) {
        return `${(bitrate / 1000).toFixed(1)} Mbps`;
    }
    return `${bitrate} Kbps`;
};

export const calculateStorageRequired = (camera: Camera, hours: number): number => {
    // Estimate storage in GB based on resolution and bitrate
    const bitrateKbps = camera.resolution === '1920x1080' ? 4000 :
        camera.resolution === '3840x2160' ? 8000 : 2000;

    const bytesPerSecond = (bitrateKbps * 1000) / 8; // Convert to bytes
    const bytesPerHour = bytesPerSecond * 3600;
    const totalBytes = bytesPerHour * hours;

    return Math.round((totalBytes / (1024 * 1024 * 1024)) * 100) / 100; // GB
};

export const isCameraOnline = (camera: Camera): boolean => {
    return camera.status === 'online';
};

export const getCameraRecordingStatus = (camera: Camera): 'recording' | 'stopped' | 'scheduled' => {
    if (camera.recording) return 'recording';
    if (camera.settings.motionDetection) return 'scheduled';
    return 'stopped';
};

export const formatLastPing = (lastPing: string): string => {
    const pingTime = new Date(lastPing);
    const now = new Date();
    const diffMs = now.getTime() - pingTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
};

export const getCameraAlerts = (camera: Camera): string[] => {
    const alerts: string[] = [];

    if (camera.status === 'offline') alerts.push('Camera offline');
    if (camera.health.temperature > 60) alerts.push('High temperature');
    if (camera.health.signal < 50) alerts.push('Weak signal');
    if (!camera.recording && camera.settings.motionDetection) alerts.push('Recording disabled');

    return alerts;
};