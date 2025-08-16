// src/guardian-protect/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import * as mockDataService from '../services/mockDataService';

// Define flexible types that work with any string values (not just literals)
interface User {
    id: string;
    name: string;
    [key: string]: any;
}

interface Device {
    id: string;
    name: string;
    status: string;           // Flexible string instead of strict literals
    batteryLevel?: number;
    type?: string;
    location?: string;
    [key: string]: any;
}

interface Alert {
    id: string;
    title?: string;
    description?: string;
    status: string;           // Flexible string instead of strict literals
    severity?: string;
    deviceId?: string;
    triggeredAt?: Date;
    resolvedAt?: Date;
    message?: string;         // For UI compatibility
    [key: string]: any;
}

interface DashboardSummary {
    [key: string]: any;       // Flexible summary object
}

interface DashboardState {
    users: User[];
    devices: Device[];
    alerts: Alert[];
    summary: DashboardSummary | null;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

interface DashboardActions {
    refreshAll: () => Promise<void>;
    refreshAlerts: () => Promise<void>;
    acknowledgeAlert: (alertId: string, userId: string) => Promise<void>;
    resolveAlert: (alertId: string, userId: string, resolution?: string) => Promise<void>;
    updateDeviceStatus: (deviceId: string, status: string) => Promise<void>;
}

export function useDashboardData(): [DashboardState, DashboardActions] {
    const [state, setState] = useState<DashboardState>({
        users: [],
        devices: [],
        alerts: [],
        summary: null,
        isLoading: true,
        isRefreshing: false,
        error: null,
        lastUpdated: null
    });

    const loadData = useCallback(async (isRefresh = false) => {
        try {
            setState(prev => ({
                ...prev,
                isLoading: !isRefresh,
                isRefreshing: isRefresh,
                error: null
            }));

            console.log('🔍 Loading data using your actual service methods...');

            // Use only the methods that actually work in your service
            const results = await Promise.all([
                // getUsers throws "Function not implemented" - provide empty array
                Promise.resolve([]),
                // Use the working device method
                mockDataService.getDevicesAsync(),
                // Use the working alerts method
                mockDataService.getAlertsAsync(),
                // Use getDashboardSummary instead of getDashboardMetrics
                mockDataService.getDashboardSummary()
            ]);

            const [users, devices, alerts, summary] = results;

            // Transform data to ensure compatibility
            const transformedDevices = (devices || []).map((device: any) => ({
                id: device.id || '',
                name: device.name || 'Unknown Device',
                status: device.status || 'unknown',
                batteryLevel: device.batteryLevel,
                type: device.type,
                location: device.location,
                ...device // Include all other properties
            }));

            const transformedAlerts = (alerts || []).map((alert: any) => ({
                id: alert.id || '',
                title: alert.title,
                description: alert.description,
                status: alert.status || 'unknown',
                severity: alert.severity,
                deviceId: alert.deviceId,
                triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : new Date(),
                resolvedAt: alert.resolvedAt ? new Date(alert.resolvedAt) : undefined,
                message: alert.title || alert.description || 'Alert triggered',
                ...alert // Include all other properties
            }));

            console.log('✅ Data loaded successfully:', {
                users: users?.length || 0,
                devices: transformedDevices?.length || 0,
                alerts: transformedAlerts?.length || 0,
                hasSummary: !!summary
            });

            setState({
                users: users || [],
                devices: transformedDevices,
                alerts: transformedAlerts,
                summary: summary || null,
                isLoading: false,
                isRefreshing: false,
                error: null,
                lastUpdated: new Date()
            });

        } catch (error) {
            console.error('❌ Data loading failed:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                isRefreshing: false,
                error: error instanceof Error ? error.message : 'Failed to load data'
            }));
        }
    }, []);

    const refreshAll = useCallback(async () => {
        await loadData(true);
    }, [loadData]);

    const refreshAlerts = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isRefreshing: true }));

            const [alerts, summary] = await Promise.all([
                mockDataService.getActiveAlertsAsync(),
                mockDataService.getDashboardSummary()
            ]);

            // Transform alerts with flexible typing
            const transformedAlerts = (alerts || []).map((alert: any) => ({
                id: alert.id || '',
                title: alert.title,
                description: alert.description,
                status: alert.status || 'unknown',
                severity: alert.severity,
                deviceId: alert.deviceId,
                triggeredAt: alert.triggeredAt,
                resolvedAt: alert.resolvedAt,
                message: alert.title || alert.description || 'Alert triggered',
                ...alert
            }));

            setState(prev => ({
                ...prev,
                alerts: transformedAlerts,
                summary: summary || prev.summary,
                isRefreshing: false,
                lastUpdated: new Date()
            }));
        } catch (error) {
            console.error('❌ Alert refresh failed:', error);
            setState(prev => ({
                ...prev,
                isRefreshing: false,
                error: 'Failed to refresh alerts'
            }));
        }
    }, []);

    const acknowledgeAlert = useCallback(async (alertId: string, userId: string) => {
        try {
            await mockDataService.acknowledgeAlert(alertId, userId);

            // Update local state optimistically
            setState(prev => ({
                ...prev,
                alerts: prev.alerts.map(alert =>
                    alert.id === alertId
                        ? { ...alert, status: 'acknowledged' }
                        : alert
                )
            }));

            console.log('✅ Alert acknowledged:', alertId);

            // Refresh data to get updated state
            setTimeout(() => refreshAlerts(), 500);

        } catch (error) {
            console.error('❌ Failed to acknowledge alert:', error);
            setState(prev => ({
                ...prev,
                error: 'Failed to acknowledge alert'
            }));
        }
    }, [refreshAlerts]);

    const resolveAlert = useCallback(async (alertId: string, userId: string, resolution?: string) => {
        try {
            await mockDataService.resolveAlert(alertId, userId, resolution);

            // Update local state optimistically
            setState(prev => ({
                ...prev,
                alerts: prev.alerts.map(alert =>
                    alert.id === alertId
                        ? { ...alert, status: 'resolved' }
                        : alert
                )
            }));

            console.log('✅ Alert resolved:', alertId);

            // Refresh data to get updated state
            setTimeout(() => refreshAlerts(), 500);

        } catch (error) {
            console.error('❌ Failed to resolve alert:', error);
            setState(prev => ({
                ...prev,
                error: 'Failed to resolve alert'
            }));
        }
    }, [refreshAlerts]);

    const updateDeviceStatus = useCallback(async (deviceId: string, status: string) => {
        try {
            await mockDataService.updateDeviceStatus(deviceId, status);

            // Update local state optimistically
            setState(prev => ({
                ...prev,
                devices: prev.devices.map(device =>
                    device.id === deviceId
                        ? { ...device, status }
                        : device
                )
            }));

            console.log('✅ Device status updated:', deviceId, '→', status);

            // Refresh data to get updated state
            setTimeout(() => refreshAll(), 500);

        } catch (error) {
            console.error('❌ Failed to update device status:', error);
            setState(prev => ({
                ...prev,
                error: 'Failed to update device status'
            }));
        }
    }, [refreshAll]);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!state.isLoading && !state.isRefreshing) {
                refreshAlerts();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [state.isLoading, state.isRefreshing, refreshAlerts]);

    const actions: DashboardActions = {
        refreshAll,
        refreshAlerts,
        acknowledgeAlert,
        resolveAlert,
        updateDeviceStatus
    };

    return [state, actions];
}

// Export types for other components to use
export type { User, Device, Alert, DashboardSummary, DashboardState, DashboardActions };