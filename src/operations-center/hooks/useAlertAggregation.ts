import { useState, useEffect } from 'react';

export interface SystemAlert {
    id: string;
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: Date;
    source: string;
    acknowledged: boolean;
    resolved: boolean;
}

export const useAlertAggregation = () => {
    const [alerts, setAlerts] = useState<SystemAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const acknowledgeAlert = async (alertId: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, acknowledged: true } : alert
        ));
    };

    const resolveAlert = async (alertId: string, userId?: string, resolution?: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, resolved: true } : alert
        ));
    };

    const escalateAlert = async (alertId: string) => {
        console.log(`Escalating alert: ${alertId}`);
    };

    return {
        alerts,
        loading,
        error,
        acknowledgeAlert,
        resolveAlert,
        escalateAlert
    };
};