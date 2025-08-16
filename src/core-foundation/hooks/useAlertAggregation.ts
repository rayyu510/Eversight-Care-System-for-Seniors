// Cross-module alerts
import { useState, useEffect } from 'react';
import { mockDataService } from '../services/mockDataService';

export const useAlertAggregation = () => {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const alertData = await mockDataService.getAlerts();
                setAlerts(alertData);
            } catch (error) {
                console.error('Failed to fetch alerts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();

        // Update every 10 seconds
        const interval = setInterval(fetchAlerts, 10000);
        return () => clearInterval(interval);
    }, []);

    return { alerts, loading };
};