// src/surveillance-center/hooks/index.ts
export { useAIDetections } from './useAIDetections';
export { useSecurityMetrics } from './useSecurityMetrics';
export { useVideoStorage } from './useVideoStorage';

// Create useCameraFeeds hook with correct imports
import { useState, useEffect, useCallback } from 'react';
import { CameraDevice } from '../types/cameraTypes'; // Fixed import - use CameraDevice instead of Camera
import { CameraService } from '../services/cameraService';

export interface CameraFeedsHookReturn {
    cameras: CameraDevice[];
    loading: boolean;
    error: string | null;
    onlineCameras: CameraDevice[];
    offlineCameras: CameraDevice[];
    recordingCameras: CameraDevice[];
    stats: CameraStats;
    refreshCameras: () => Promise<void>;
    getCameraById: (id: string) => CameraDevice | null;
    updateCameraConfiguration: (cameraId: string, config: any) => Promise<boolean>;
    controlCamera: (cameraId: string, action: string, params?: any) => Promise<boolean>;
    takeSnapshot: (cameraId: string) => Promise<string>;
    startRecording: (cameraId: string, duration?: number) => Promise<string>;
    stopRecording: (cameraId: string, recordingId: string) => Promise<boolean>;
}

export interface CameraStats {
    total: number;
    online: number;
    offline: number;
    recording: number;
    maintenance: number;
    errors: number;
    averageUptime: number;
    totalBandwidth: number;
    healthDistribution: {
        excellent: number;
        good: number;
        warning: number;
        critical: number;
    };
}

export const useCameraFeeds = (autoRefresh: boolean = true): CameraFeedsHookReturn => {
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cameraService = CameraService.getInstance();

    const refreshCameras = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedCameras = await cameraService.getCameras();
            setCameras(fetchedCameras);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cameras';
            setError(errorMessage);
            console.error('Error fetching cameras:', err);
        } finally {
            setLoading(false);
        }
    }, [cameraService]);

    const getCameraById = useCallback((id: string): CameraDevice | null => {
        return cameras.find(camera => camera.id === id) || null;
    }, [cameras]);

    const updateCameraConfiguration = useCallback(async (cameraId: string, config: any): Promise<boolean> => {
        try {
            const success = await cameraService.updateCameraConfiguration(cameraId, config);
            if (success) {
                await refreshCameras(); // Refresh to get updated data
            }
            return success;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update camera configuration';
            setError(errorMessage);
            return false;
        }
    }, [cameraService, refreshCameras]);

    const controlCamera = useCallback(async (cameraId: string, action: string, params?: any): Promise<boolean> => {
        try {
            const success = await cameraService.controlCamera({
                cameraId,
                action: action as any,
                parameters: params
            });
            return success;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to control camera';
            setError(errorMessage);
            return false;
        }
    }, [cameraService]);

    const takeSnapshot = useCallback(async (cameraId: string): Promise<string> => {
        try {
            const snapshotUrl = await cameraService.takeSnapshot(cameraId);
            return snapshotUrl;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to take snapshot';
            setError(errorMessage);
            throw err;
        }
    }, [cameraService]);

    const startRecording = useCallback(async (cameraId: string, duration?: number): Promise<string> => {
        try {
            const recordingId = await cameraService.startRecording(cameraId, duration);
            await refreshCameras(); // Refresh to show recording status
            return recordingId;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
            setError(errorMessage);
            throw err;
        }
    }, [cameraService, refreshCameras]);

    const stopRecording = useCallback(async (cameraId: string, recordingId: string): Promise<boolean> => {
        try {
            const success = await cameraService.stopRecording(cameraId, recordingId);
            if (success) {
                await refreshCameras(); // Refresh to show updated recording status
            }
            return success;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
            setError(errorMessage);
            return false;
        }
    }, [cameraService, refreshCameras]);

    // Computed properties for filtered camera lists
    const onlineCameras = cameras.filter(camera => camera.status.online);
    const offlineCameras = cameras.filter(camera => !camera.status.online);
    const recordingCameras = cameras.filter(camera => camera.status.recording);

    // Calculate camera statistics
    const getCameraStats = useCallback((): CameraStats => {
        const total = cameras.length;
        const online = onlineCameras.length;
        const offline = offlineCameras.length;
        const recording = recordingCameras.length;
        const maintenance = cameras.filter(camera =>
            camera.status.health === 'warning' || camera.status.health === 'critical'
        ).length;
        const errors = cameras.reduce((sum, camera) => sum + camera.status.errorCount, 0);

        const averageUptime = total > 0
            ? cameras.reduce((sum, camera) => sum + (camera.status.uptime || 0), 0) / total
            : 0;

        const totalBandwidth = cameras.reduce((sum, camera) => sum + camera.stream.bitrate, 0) / 1000; // Convert to Mbps

        const healthDistribution = cameras.reduce((acc, camera) => {
            acc[camera.status.health]++;
            return acc;
        }, {
            excellent: 0,
            good: 0,
            warning: 0,
            critical: 0
        });

        return {
            total,
            online,
            offline,
            recording,
            maintenance,
            errors,
            averageUptime,
            totalBandwidth,
            healthDistribution
        };
    }, [cameras, onlineCameras, offlineCameras, recordingCameras]);

    useEffect(() => {
        refreshCameras();

        if (autoRefresh) {
            // Set up periodic refresh every 30 seconds
            const interval = setInterval(() => {
                refreshCameras();
            }, 30000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [refreshCameras, autoRefresh]);

    // Set up real-time camera status updates
    useEffect(() => {
        if (!autoRefresh) return;

        const handleCameraUpdate = (updatedCamera: CameraDevice) => {
            setCameras(prev => prev.map(camera =>
                camera.id === updatedCamera.id ? updatedCamera : camera
            ));
        };

        const handleCameraStatusChange = ({ cameraId, status }: { cameraId: string; status: any }) => {
            setCameras(prev => prev.map(camera =>
                camera.id === cameraId ? { ...camera, status: { ...camera.status, ...status } } : camera
            ));
        };

        // Subscribe to real-time camera updates
        const unsubscribeUpdate = cameraService.subscribe('camera_update', handleCameraUpdate);
        const unsubscribeStatus = cameraService.subscribe('camera_status_change', handleCameraStatusChange);

        return () => {
            unsubscribeUpdate();
            unsubscribeStatus();
        };
    }, [cameraService, autoRefresh]);

    return {
        cameras,
        loading,
        error,
        onlineCameras,
        offlineCameras,
        recordingCameras,
        stats: getCameraStats(),
        refreshCameras,
        getCameraById,
        updateCameraConfiguration,
        controlCamera,
        takeSnapshot,
        startRecording,
        stopRecording
    };
};

// Export additional utility hooks

export const useCameraMetrics = (cameraId: string, timeRange: '1h' | '24h' | '7d' = '24h') => {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cameraService = CameraService.getInstance();

    const fetchMetrics = useCallback(async () => {
        if (!cameraId) return;

        setLoading(true);
        try {
            const cameraMetrics = await cameraService.getCameraMetrics(cameraId, timeRange);
            setMetrics(cameraMetrics);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch camera metrics';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [cameraService, cameraId, timeRange]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    return {
        metrics,
        loading,
        error,
        refreshMetrics: fetchMetrics
    };
};

export const useCameraPresets = (cameraId: string) => {
    const [presets, setPresets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cameraService = CameraService.getInstance();

    const fetchPresets = useCallback(async () => {
        if (!cameraId) return;

        setLoading(true);
        try {
            const cameraPresets = await cameraService.getCameraPresets(cameraId);
            setPresets(cameraPresets);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch camera presets';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [cameraService, cameraId]);

    const gotoPreset = useCallback(async (presetId: string): Promise<boolean> => {
        try {
            const success = await cameraService.gotoPreset(cameraId, presetId);
            return success;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to goto preset';
            setError(errorMessage);
            return false;
        }
    }, [cameraService, cameraId]);

    const createPreset = useCallback(async (name: string, position: any): Promise<string | null> => {
        try {
            const presetId = await cameraService.createCameraPreset({
                cameraId,
                name,
                position,
                createdBy: 'current-user',
                isDefault: false
            });
            await fetchPresets(); // Refresh presets list
            return presetId;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create preset';
            setError(errorMessage);
            return null;
        }
    }, [cameraService, cameraId, fetchPresets]);

    const deletePreset = useCallback(async (presetId: string): Promise<boolean> => {
        try {
            const success = await cameraService.deleteCameraPreset(presetId);
            if (success) {
                await fetchPresets(); // Refresh presets list
            }
            return success;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete preset';
            setError(errorMessage);
            return false;
        }
    }, [cameraService, fetchPresets]);

    useEffect(() => {
        fetchPresets();
    }, [fetchPresets]);

    return {
        presets,
        loading,
        error,
        gotoPreset,
        createPreset,
        deletePreset,
        refreshPresets: fetchPresets
    };
};