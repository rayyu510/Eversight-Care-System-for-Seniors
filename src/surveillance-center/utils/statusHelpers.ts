export const getCameraStatusString = (status: any): string => {
    if (typeof status === 'string') {
        return status;
    }
    if (typeof status === 'object' && status !== null) {
        return status.online ? 'online' : 'offline';
    }
    return 'unknown';
};

export const isCameraOnline = (status: any): boolean => {
    if (typeof status === 'string') {
        return status === 'online';
    }
    if (typeof status === 'object' && status !== null) {
        return status.online === true;
    }
    return false;
};