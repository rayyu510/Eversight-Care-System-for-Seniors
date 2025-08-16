import { useState, useEffect } from 'react';
import { CameraDevice } from '../types/cameraTypes';
import { CameraService } from '../services/cameraService';

export const useCameraFeeds = () => {
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCameras = async () => {
            try {
                const cameraService = CameraService.getInstance();
                const cameraData = await cameraService.getCameras();
                setCameras(cameraData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load cameras');
            } finally {
                setLoading(false);
            }
        };

        loadCameras();
    }, []);

    const refreshCameras = async () => {
        setLoading(true);
        try {
            const cameraService = CameraService.getInstance();
            const cameraData = await cameraService.getCameras();
            setCameras(cameraData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh cameras');
        } finally {
            setLoading(false);
        }
    };

    return {
        cameras,
        loading,
        error,
        refreshCameras
    };
};
