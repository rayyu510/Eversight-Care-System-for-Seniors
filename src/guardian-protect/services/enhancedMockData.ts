// src/guardian-protect/services/enhancedMockData.ts
// Enhanced Mock Data for Guardian Protect

export const enhancedMockDevices = [
    {
        id: "1",
        name: "Living Room Motion Sensor",
        status: "online" as const,
        batteryLevel: 85,
        type: "motion_sensor" as const,
        location: "Living Room",
        signalStrength: 92,
        firmware: "v2.1.3",
        installedDate: "2024-01-15",
        lastMaintenance: "2024-07-20",
        sensitivity: "Medium",
        range: "5 meters",
        eventsToday: 12,
        lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        manufacturer: "Guardian Tech",
        model: "GT-MS-300",
        serialNumber: "GT300-001-2024"
    },
    {
        id: "2",
        name: "Front Door Sensor",
        status: "online" as const,
        batteryLevel: 25,
        type: "door_sensor" as const,
        location: "Front Door",
        signalStrength: 88,
        firmware: "v2.0.8",
        installedDate: "2024-02-10",
        lastMaintenance: "2024-06-15",
        openEvents: 8,
        lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        manufacturer: "Guardian Tech",
        model: "GT-DS-200",
        serialNumber: "GT200-002-2024"
    },
    {
        id: "3",
        name: "Bedroom Camera",
        status: "online" as const,
        batteryLevel: 78,
        type: "camera" as const,
        location: "Bedroom",
        signalStrength: 95,
        firmware: "v3.1.2",
        installedDate: "2024-03-05",
        lastMaintenance: "2024-08-01",
        resolution: "1080p",
        nightVision: true,
        recording: true,
        storageUsed: "45%",
        lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        manufacturer: "Guardian Vision",
        model: "GV-CAM-1080",
        serialNumber: "GV1080-003-2024"
    },
    {
        id: "4",
        name: "Kitchen Motion Sensor",
        status: "warning" as const,
        batteryLevel: 15,
        type: "motion_sensor" as const,
        location: "Kitchen",
        signalStrength: 67,
        firmware: "v2.1.1",
        installedDate: "2024-01-20",
        lastMaintenance: "2024-05-30",
        sensitivity: "High",
        range: "4 meters",
        eventsToday: 24,
        lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        manufacturer: "Guardian Tech",
        model: "GT-MS-300",
        serialNumber: "GT300-004-2024"
    },
    {
        id: "5",
        name: "Bathroom Emergency Button",
        status: "online" as const,
        batteryLevel: 92,
        type: "emergency_button" as const,
        location: "Bathroom",
        signalStrength: 85,
        firmware: "v1.5.4",
        installedDate: "2024-02-28",
        lastMaintenance: "2024-07-10",
        testMode: false,
        lastTest: "2024-08-01",
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        manufacturer: "Guardian Emergency",
        model: "GE-BTN-500",
        serialNumber: "GE500-005-2024"
    },
    {
        id: "6",
        name: "Hallway Camera",
        status: "offline" as const,
        batteryLevel: 0,
        type: "camera" as const,
        location: "Hallway",
        signalStrength: 0,
        firmware: "v3.0.9",
        installedDate: "2024-04-12",
        lastMaintenance: "2024-06-20",
        resolution: "720p",
        nightVision: false,
        recording: false,
        storageUsed: "12%",
        lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        manufacturer: "Guardian Vision",
        model: "GV-CAM-720",
        serialNumber: "GV720-006-2024"
    }
];

export const enhancedMockAlerts = [
    {
        id: "a1",
        title: "Critical Battery Warning",
        description: "Kitchen Motion Sensor battery critically low (15%). Replace immediately to maintain monitoring coverage.",
        status: "active" as const,
        severity: "critical" as const,
        deviceId: "4",
        triggeredAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        location: "Kitchen",
        type: "battery_warning",
        autoResolved: false,
        emergencyContacted: true,
        estimatedResolution: "30 minutes",
        priority: 1,
        acknowledgedAt: null,
        acknowledgedBy: null,
        resolvedAt: null,
        resolvedBy: null
    },
    {
        id: "a2",
        title: "Device Offline",
        description: "Hallway Camera has been offline for 4 hours. Check power connection and network connectivity.",
        status: "active" as const,
        severity: "high" as const,
        deviceId: "6",
        triggeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        location: "Hallway",
        type: "device_offline",
        autoResolved: false,
        emergencyContacted: false,
        estimatedResolution: "1 hour",
        priority: 2,
        acknowledgedAt: null,
        acknowledgedBy: null,
        resolvedAt: null,
        resolvedBy: null
    },
    {
        id: "a3",
        title: "Low Battery Alert",
        description: "Front Door Sensor battery below 30% (25%). Schedule replacement within next week.",
        status: "acknowledged" as const,
        severity: "medium" as const,
        deviceId: "2",
        triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        acknowledgedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        acknowledgedBy: "Caregiver Sarah",
        location: "Front Door",
        type: "battery_warning",
        autoResolved: false,
        emergencyContacted: false,
        estimatedResolution: "2-3 days",
        priority: 3,
        resolvedAt: null,
        resolvedBy: null
    },
    {
        id: "a4",
        title: "Motion Pattern Anomaly",
        description: "Unusual activity pattern detected. No motion in living room for 3 hours during typical active time (14:00-17:00).",
        status: "active" as const,
        severity: "high" as const,
        deviceId: "1",
        triggeredAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        location: "Living Room",
        type: "pattern_anomaly",
        autoResolved: false,
        emergencyContacted: true,
        estimatedResolution: "15 minutes",
        priority: 2,
        acknowledgedAt: null,
        acknowledgedBy: null,
        resolvedAt: null,
        resolvedBy: null
    },
    {
        id: "a5",
        title: "System Health Check Complete",
        description: "Weekly automated system health check completed successfully. All devices tested and verified operational.",
        status: "resolved" as const,
        severity: "low" as const,
        deviceId: "all",
        triggeredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        resolvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        resolvedBy: "System Automated",
        location: "All Locations",
        type: "system_maintenance",
        autoResolved: true,
        emergencyContacted: false,
        priority: 4,
        acknowledgedAt: null,
        acknowledgedBy: null
    }
];

export const mockResidents = [
    {
        id: "r1",
        name: "Eleanor Johnson",
        age: 78,
        medicalConditions: ["Type 2 Diabetes", "Mild Cognitive Impairment", "Hypertension"],
        emergencyContacts: [
            {
                id: "ec1",
                name: "Sarah Johnson",
                relation: "Daughter",
                phone: "(555) 123-4567",
                email: "sarah.johnson@email.com",
                primary: true,
                address: "123 Oak Street, Same City"
            },
            {
                id: "ec2",
                name: "Dr. Williams",
                relation: "Primary Care Physician",
                phone: "(555) 987-6543",
                email: "dr.williams@healthcare.com",
                primary: false,
                address: "Medical Center, 456 Health Ave"
            },
            {
                id: "ec3",
                name: "Michael Johnson",
                relation: "Son",
                phone: "(555) 234-5678",
                email: "michael.j@email.com",
                primary: false,
                address: "789 Pine Street, Next City"
            }
        ],
        careLevel: "Independent with Monitoring",
        preferences: {
            quietHours: "22:00-07:00",
            privacyMode: false,
            alertSensitivity: "Medium",
            emergencyProtocol: "Standard",
            medicationReminders: true,
            activityTracking: true
        },
        activityPatterns: {
            wakeTime: "07:00",
            bedTime: "22:30",
            mealTimes: ["08:00", "12:30", "18:00"],
            activeRooms: ["Living Room", "Kitchen", "Bedroom", "Bathroom"],
            typicalDayPattern: {
                morning: "07:00-12:00",
                afternoon: "12:00-17:00",
                evening: "17:00-22:00",
                night: "22:00-07:00"
            }
        },
        healthMetrics: {
            lastCheckup: "2024-07-15",
            nextCheckup: "2024-10-15",
            medications: [
                { name: "Metformin", dosage: "500mg", frequency: "2x daily" },
                { name: "Lisinopril", dosage: "10mg", frequency: "1x daily" }
            ],
            allergies: ["Penicillin", "Shellfish"]
        }
    }
];

export const mockDeviceHistory = {
    "1": [
        { date: "2024-08-09", events: 45, batteryLevel: 85, signalStrength: 92, uptime: 100 },
        { date: "2024-08-08", events: 52, batteryLevel: 86, signalStrength: 89, uptime: 100 },
        { date: "2024-08-07", events: 38, batteryLevel: 87, signalStrength: 91, uptime: 98 },
        { date: "2024-08-06", events: 41, batteryLevel: 88, signalStrength: 94, uptime: 100 },
        { date: "2024-08-05", events: 35, batteryLevel: 89, signalStrength: 88, uptime: 100 }
    ]
};

export const mockSystemStatistics = {
    deviceStats: {
        total: enhancedMockDevices.length,
        online: enhancedMockDevices.filter(d => d.status === 'online').length,
        offline: enhancedMockDevices.filter(d => d.status === 'offline').length,
        warning: enhancedMockDevices.filter(d => d.status === 'warning').length,
        lowBattery: enhancedMockDevices.filter(d => d.batteryLevel < 30).length,
        critical: enhancedMockDevices.filter(d => d.batteryLevel < 10).length
    },
    alertStats: {
        total: enhancedMockAlerts.length,
        active: enhancedMockAlerts.filter(a => a.status === 'active').length,
        acknowledged: enhancedMockAlerts.filter(a => a.status === 'acknowledged').length,
        resolved: enhancedMockAlerts.filter(a => a.status === 'resolved').length,
        critical: enhancedMockAlerts.filter(a => a.severity === 'critical').length,
        high: enhancedMockAlerts.filter(a => a.severity === 'high').length
    }
};