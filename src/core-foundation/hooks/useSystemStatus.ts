// Platform-wide status
import { useState, useEffect } from 'react';
import { mockDataService } from '../services/mockDataService';

export const useSystemStatus = () => {
    const [status, setStatus] = useState({
        health: 97,
        users: 47,
        cameras: { online: 22, total: 24 },
        alerts: 3
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const [health, users, cameras, alerts] = await Promise.all([
                    mockDataService.getSystemHealth(),
                    mockDataService.getActiveUsers(),
                    mockDataService.getCameraStatus(),
                    mockDataService.getAlerts()
                ]);

                setStatus({
                    health: health.overall,
                    users,
                    cameras,
                    alerts: alerts.length
                });
            } catch (error) {
                console.error('Failed to fetch system status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();

        // Update every 30 seconds
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    return { status, loading };
};