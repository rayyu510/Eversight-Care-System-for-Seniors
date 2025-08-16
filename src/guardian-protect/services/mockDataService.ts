// src/guardian-protect/services/mockDataService.ts
// Import the enhanced data at the top of your file:
import { enhancedMockDevices, enhancedMockAlerts, mockResidents, mockSystemStatistics } from './enhancedMockData';

// Add these new enhanced service methods:

// Enhanced Device Management Methods
export const getEnhancedDevices = async () => {
    await simulateDelay();
    return enhancedMockDevices;
};

// MISSING FUNCTION - Add this async version
export const getDevicesAsync = async () => {
    await simulateDelay();
    return enhancedMockDevices;
};

export const getDeviceById = async (deviceId: string) => {
    await simulateDelay();
    const device = enhancedMockDevices.find(d => d.id === deviceId);
    if (!device) {
        throw new Error(`Device with ID ${deviceId} not found`);
    }
    return device;
};

export const getDevicesByLocation = async () => {
    await simulateDelay();
    const locations: { [key: string]: any[] } = {};
    enhancedMockDevices.forEach(device => {
        if (!locations[device.location]) {
            locations[device.location] = [];
        }
        locations[device.location].push(device);
    });
    return locations;
};

export const getDevicesByType = async (deviceType?: string) => {
    await simulateDelay();
    if (!deviceType) return enhancedMockDevices;
    return enhancedMockDevices.filter(device => device.type === deviceType);
};

// MISSING FUNCTION - Add this for low battery devices
export const getLowBatteryDevices = async () => {
    await simulateDelay();
    return enhancedMockDevices.filter(device => device.batteryLevel < 30);
};

export const updateDeviceStatus = async (deviceId: string, status: string) => {
    await simulateDelay();
    const device = enhancedMockDevices.find(d => d.id === deviceId);
    if (device) {
        device.status = status as any;
        console.log(`Device ${deviceId} status updated to ${status}`);
    }
    return { success: true, deviceId, newStatus: status };
};

export const testDevice = async (deviceId: string) => {
    await simulateDelay(2000); // Longer delay for device testing

    const device = enhancedMockDevices.find(d => d.id === deviceId);
    if (!device) {
        throw new Error(`Device ${deviceId} not found`);
    }

    // Simulate test results
    const testResult = {
        deviceId,
        testPassed: Math.random() > 0.1, // 90% pass rate
        timestamp: new Date().toISOString(),
        details: {
            signalStrength: Math.floor(Math.random() * 30) + 70,
            batteryVoltage: (Math.random() * 0.5 + 3.0).toFixed(1) + 'V',
            responseTime: Math.floor(Math.random() * 100 + 50) + 'ms',
            firmwareVersion: device.firmware
        }
    };

    console.log(`Device test completed for ${deviceId}:`, testResult);
    return testResult;
};

export const updateDeviceSettings = async (deviceId: string, settings: any) => {
    await simulateDelay();

    const device = enhancedMockDevices.find(d => d.id === deviceId);
    if (!device) {
        throw new Error(`Device ${deviceId} not found`);
    }

    // Update device settings
    Object.assign(device, settings);

    console.log(`Device ${deviceId} settings updated:`, settings);
    return {
        success: true,
        deviceId,
        updatedSettings: settings,
        timestamp: new Date().toISOString()
    };
};

// Enhanced Alert Management Methods
export const getEnhancedAlerts = async () => {
    await simulateDelay();
    return enhancedMockAlerts;
};

// MISSING FUNCTION - Add this async version
export const getAlertsAsync = async () => {
    await simulateDelay();
    return enhancedMockAlerts;
};

// MISSING FUNCTION - Add this for active alerts only
export const getActiveAlertsAsync = async () => {
    await simulateDelay();
    return enhancedMockAlerts.filter(alert => alert.status === 'active');
};

export const getAlertsByStatus = async (status: string) => {
    await simulateDelay();
    return enhancedMockAlerts.filter(alert => alert.status === status);
};

export const getAlertsBySeverity = async (severity: string) => {
    await simulateDelay();
    return enhancedMockAlerts.filter(alert => alert.severity === severity);
};

export const acknowledgeAlert = async (alertId: string, userId?: string) => {
    await simulateDelay();

    const alert = enhancedMockAlerts.find(a => a.id === alertId);
    if (alert) {
        alert.status = 'acknowledged' as any;
        alert.acknowledgedAt = new Date().toISOString();
        alert.acknowledgedBy = userId || 'Unknown User';
    }

    console.log(`Alert ${alertId} acknowledged by ${userId || 'system'}`);
    return {
        success: true,
        alertId,
        acknowledgedBy: userId || 'system',
        timestamp: new Date().toISOString()
    };
};

export const resolveAlert = async (alertId: string, userId?: string, resolution?: string) => {
    await simulateDelay();

    const alert = enhancedMockAlerts.find(a => a.id === alertId);
    if (alert) {
        alert.status = 'resolved' as any;
        alert.resolvedAt = new Date().toISOString();
        alert.resolvedBy = userId || 'Unknown User';
    }

    console.log(`Alert ${alertId} resolved by ${userId || 'system'}: ${resolution || 'No details'}`);
    return {
        success: true,
        alertId,
        resolvedBy: userId || 'system',
        resolution: resolution || 'No details provided',
        timestamp: new Date().toISOString()
    };
};

export const dismissAlert = async (alertId: string, userId?: string) => {
    await simulateDelay();

    const alert = enhancedMockAlerts.find(a => a.id === alertId);
    if (alert) {
        alert.status = 'dismissed' as any;
    }

    console.log(`Alert ${alertId} dismissed by ${userId || 'system'}`);
    return {
        success: true,
        alertId,
        dismissedBy: userId || 'system',
        timestamp: new Date().toISOString()
    };
};

// System Statistics and Analytics
export const getSystemStatistics = async () => {
    await simulateDelay();
    return mockSystemStatistics;
};

export const getDashboardMetrics = async () => {
    await simulateDelay();

    const devices = enhancedMockDevices;
    const alerts = enhancedMockAlerts;

    return {
        devices: {
            total: devices.length,
            online: devices.filter(d => d.status === 'online').length,
            offline: devices.filter(d => d.status === 'offline').length,
            warning: devices.filter(d => d.status === 'warning').length,
            lowBattery: devices.filter(d => d.batteryLevel < 30).length
        },
        alerts: {
            total: alerts.length,
            active: alerts.filter(a => a.status === 'active').length,
            critical: alerts.filter(a => a.severity === 'critical').length,
            high: alerts.filter(a => a.severity === 'high').length,
            resolved: alerts.filter(a => a.status === 'resolved').length
        },
        system: {
            uptime: "99.8%",
            lastUpdate: new Date().toISOString(),
            averageResponseTime: "120ms",
            dataPoints: devices.length * 24 * 60 // Assuming 1 data point per minute
        }
    };
};

// MISSING FUNCTION - Add the dashboard summary function
export const getDashboardSummary = async () => {
    await simulateDelay();

    const devices = enhancedMockDevices;
    const alerts = enhancedMockAlerts;
    const activeAlerts = alerts.filter(a => a.status === 'active');
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active');

    const deviceStats = {
        online: devices.filter(d => d.status === 'online').length,
        offline: devices.filter(d => d.status === 'offline').length,
        warning: devices.filter(d => d.status === 'warning').length,
        lowBattery: devices.filter(d => d.batteryLevel < 30).length
    };

    const alertStats = {
        active: activeAlerts.length,
        critical: criticalAlerts.length,
        resolved: alerts.filter(a => a.status === 'resolved').length,
        acknowledged: alerts.filter(a => a.status === 'acknowledged').length
    };

    return {
        overview: {
            totalDevices: devices.length,
            onlineDevices: devices.filter(d => d.status === 'online').length,
            totalAlerts: activeAlerts.length,
            criticalAlerts: criticalAlerts.length,
            systemHealth: criticalAlerts.length === 0 ? 'Good' : 'Attention Required'
        },
        recentActivity: {
            lastHour: Math.floor(Math.random() * 25) + 15,
            last24Hours: Math.floor(Math.random() * 200) + 150,
            weeklyTrend: 'stable'
        },
        deviceStatus: deviceStats,
        alertsSummary: alertStats,
        // Add these for backward compatibility with tests
        devices: deviceStats,
        alerts: alertStats
    };
};

export const getActivitySummary = async (period = 'today') => {
    await simulateDelay();

    // Generate mock activity data based on devices
    const roomActivity: { [key: string]: number } = {};
    enhancedMockDevices.forEach(device => {
        if (device.type === 'motion_sensor') {
            roomActivity[device.location] = device.eventsToday || Math.floor(Math.random() * 50) + 10;
        }
    });

    return {
        period,
        totalMotionEvents: Object.values(roomActivity).reduce((sum, count) => sum + count, 0),
        roomActivity,
        peakActivityHours: ["08:00-09:00", "12:00-13:00", "18:00-19:00"],
        quietPeriods: ["02:00-06:00", "14:00-16:00"],
        anomalies: enhancedMockAlerts
            .filter(alert => alert.type === 'pattern_anomaly' && alert.status === 'active')
            .map(alert => ({
                time: new Date(alert.triggeredAt).toLocaleTimeString(),
                type: "Extended inactivity",
                duration: "3 hours",
                location: alert.location
            }))
    };
};

export const getDeviceHistory = async (deviceId: string, days = 7) => {
    await simulateDelay();

    const device = enhancedMockDevices.find(d => d.id === deviceId);
    if (!device) {
        throw new Error(`Device ${deviceId} not found`);
    }

    // Generate mock history data
    const history = [];
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        history.push({
            date: date.toISOString().split('T')[0],
            batteryLevel: Math.max(device.batteryLevel - (days - i) * 2, 10),
            signalStrength: Math.max(device.signalStrength - Math.floor(Math.random() * 10), 60),
            events: device.type === 'motion_sensor' ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 20),
            uptime: Math.random() > 0.05 ? 100 : Math.floor(Math.random() * 50) + 50, // 95% uptime simulation
            alerts: Math.random() > 0.8 ? 1 : 0 // 20% chance of daily alert
        });
    }

    return history;
};

// Resident Management
export const getResidents = async () => {
    await simulateDelay();
    return mockResidents;
};

export const getResidentById = async (residentId: string) => {
    await simulateDelay();
    const resident = mockResidents.find(r => r.id === residentId);
    if (!resident) {
        throw new Error(`Resident with ID ${residentId} not found`);
    }
    return resident;
};

// Emergency and Safety
export const triggerEmergencyProtocol = async (protocolType: string, deviceId?: string) => {
    await simulateDelay();

    console.log(`Emergency protocol '${protocolType}' triggered${deviceId ? ` for device ${deviceId}` : ''}`);

    return {
        success: true,
        protocolType,
        deviceId,
        timestamp: new Date().toISOString(),
        actions: [
            "Primary caregiver notified",
            "Emergency contacts alerted",
            "System monitoring intensified",
            "Response team dispatched if needed"
        ],
        estimatedResponseTime: "2-5 minutes"
    };
};

export const getEmergencyContacts = async (residentId?: string) => {
    await simulateDelay();

    if (residentId) {
        const resident = mockResidents.find(r => r.id === residentId);
        return resident?.emergencyContacts || [];
    }

    // Return all emergency contacts
    return mockResidents.flatMap(resident =>
        resident.emergencyContacts.map(contact => ({
            ...contact,
            residentId: resident.id,
            residentName: resident.name
        }))
    );
};

// Utility function for simulating realistic delays
const simulateDelay = (ms = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};