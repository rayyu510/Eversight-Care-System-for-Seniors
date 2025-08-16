import { CameraStatus, getCameraStatusString, createCameraStatus } from '../types/cameraTypes';

// Type guard to check if something is a CameraStatus object
export const isCameraStatusObject = (value: any): value is CameraStatus => {
    return value &&
        typeof value === 'object' &&
        typeof value.online === 'boolean' &&
        typeof value.recording === 'boolean' &&
        typeof value.health === 'string';
};

// Convert any status format to our standard CameraStatus object
export const normalizeCameraStatus = (status: string | CameraStatus): CameraStatus => {
    if (typeof status === 'string') {
        return createCameraStatus(status);
    }
    return status;
};

// Convert CameraStatus object to string for display
export const cameraStatusToString = (status: CameraStatus): string => {
    return getCameraStatusString(status);
};