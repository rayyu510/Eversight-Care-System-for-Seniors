// config/templates/functional/guardian-protect.config.ts
export interface GuardianProtectConfig {
    devices: {
        maxDevicesPerFacility: number;
        autoDiscovery: boolean;
        heartbeatInterval: number; // seconds
        offlineThreshold: number; // seconds
        batteryAlertThreshold: number; // percentage
    };
    alerts: {
        retentionPeriod: number; // days
        escalationRules: Array<{
            severity: 'low' | 'medium' | 'high' | 'critical';
            escalateAfter: number; // minutes
            notifyRoles: string[];
        }>;
        acknowledgmentTimeout: number; // minutes
    };
    monitoring: {
        realTimeUpdates: boolean;
        updateInterval: number; // seconds
        dataRetention: number; // days
        metricsCollection: boolean;
    };
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
        sound: boolean;
        desktop: boolean;
    };
}

export const guardianProtectTemplates = {
    // Small facility setup
    smallFacility: {
        devices: {
            maxDevicesPerFacility: 50,
            autoDiscovery: true,
            heartbeatInterval: 30,
            offlineThreshold: 120,
            batteryAlertThreshold: 20
        },
        alerts: {
            retentionPeriod: 90,
            escalationRules: [
                {
                    severity: 'critical',
                    escalateAfter: 5,
                    notifyRoles: ['nurse', 'supervisor']
                },
                {
                    severity: 'high',
                    escalateAfter: 15,
                    notifyRoles: ['nurse']
                }
            ],
            acknowledgmentTimeout: 30
        },
        monitoring: {
            realTimeUpdates: true,
            updateInterval: 10,
            dataRetention: 365,
            metricsCollection: true
        },
        notifications: {
            email: true,
            sms: false,
            push: true,
            sound: true,
            desktop: true
        }
    },

    // Large hospital setup
    largeHospital: {
        devices: {
            maxDevicesPerFacility: 1000,
            autoDiscovery: false, // Manual approval required
            heartbeatInterval: 15,
            offlineThreshold: 60,
            batteryAlertThreshold: 25
        },
        alerts: {
            retentionPeriod: 2555, // 7 years for compliance
            escalationRules: [
                {
                    severity: 'critical',
                    escalateAfter: 2,
                    notifyRoles: ['nurse', 'supervisor', 'administrator']
                },
                {
                    severity: 'high',
                    escalateAfter: 5,
                    notifyRoles: ['nurse', 'supervisor']
                },
                {
                    severity: 'medium',
                    escalateAfter: 15,
                    notifyRoles: ['nurse']
                }
            ],
            acknowledgmentTimeout: 15
        },
        monitoring: {
            realTimeUpdates: true,
            updateInterval: 5,
            dataRetention: 2555,
            metricsCollection: true
        },
        notifications: {
            email: true,
            sms: true,
            push: true,
            sound: true,
            desktop: true
        }
    }
};