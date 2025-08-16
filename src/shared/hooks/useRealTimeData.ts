// src/shared/hooks/useRealTimeData.ts
import { useEffect, useState } from 'react';
import { websocketService } from '../services/websocketService';

export function useRealTimeAlerts() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const handleNewAlert = (alert: any) => {
            setAlerts(prev => [alert, ...prev]);
        };

        const handleAlertResolved = (alertId: string) => {
            setAlerts(prev => prev.filter(alert => alert.id !== alertId));
        };

        websocketService.subscribe('new_alert', handleNewAlert);
        websocketService.subscribe('alert_resolved', handleAlertResolved);

        return () => {
            websocketService.unsubscribe('new_alert', handleNewAlert);
            websocketService.unsubscribe('alert_resolved', handleAlertResolved);
        };
    }, []);

    return alerts;
}

export function useRealTimeDeviceStatus() {
    const [deviceUpdates, setDeviceUpdates] = useState<any>({});

    useEffect(() => {
        const handleDeviceUpdate = (update: any) => {
            setDeviceUpdates(prev => ({
                ...prev,
                [update.deviceId]: update
            }));
        };

        websocketService.subscribe('device_update', handleDeviceUpdate);

        return () => {
            websocketService.unsubscribe('device_update', handleDeviceUpdate);
        };
    }, []);

    return deviceUpdates;
}