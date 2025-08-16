import { useState, useEffect } from 'react';
import { SystemMonitoringService } from '../services/systemMonitoringService';
import { SystemStatus } from '../types/operationsTypes';

export const useSystemStatus = () => {
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSystemStatus = async () => {
            try {
                setLoading(true);
                const service = SystemMonitoringService.getInstance();
                const status = await service.getSystemStatus();
                setSystemStatus(status);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchSystemStatus();

        // Update every 30 seconds
        const interval = setInterval(fetchSystemStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    return { systemStatus, loading, error };
};