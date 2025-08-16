// Facility Information
export const facilityData = {
    id: 'sunrise-manor-001',
    name: 'Sunrise Manor',
    type: 'Long-term Care Facility',
    address: '123 Care Street, Healthcare City, HC 12345',
    residents: 127,
    staff: 32,
    capacity: 150,
    established: '1995',
    license: 'HC-LTC-2024-001'
};

// System Status
export const systemStatus = {
    overall: 97,
    lastUpdate: new Date().toLocaleTimeString(),
    devices: { online: 45, total: 48 },
    alerts: { active: 3, critical: 1, warning: 2, info: 0 },
    responseTime: "2.3 min",
    uptime: "99.8%"
};

// Guardian Protect Mock Data
export const guardianProtectData = {
    devices: [
        {
            id: 'dev-001',
            name: 'Kitchen Motion Sensor',
            type: 'motion',
            location: 'Kitchen',
            room: 'Kitchen',
            status: 'online',
            battery: 15,
            lastUpdate: '10 min ago',
            firmwareVersion: '2.1.4'
        },
        {
            id: 'dev-002',
            name: 'Dining Hall Pull Cord',
            type: 'emergency',
            location: 'Dining Hall',
            room: 'Dining Hall',
            status: 'online',
            battery: 23,
            lastUpdate: '5 min ago',
            firmwareVersion: '2.1.3'
        },
        {
            id: 'dev-003',
            name: 'Room 205 Wearable Device',
            type: 'wearable',
            location: 'Room 205',
            room: 'Room 205',
            status: 'critical',
            battery: 8,
            lastUpdate: '2 min ago',
            firmwareVersion: '2.1.4'
        }
    ],
    alerts: [
        {
            id: 'alert-001',
            type: 'critical',
            title: 'Critical Battery Warning',
            description: 'Kitchen Motion Sensor battery critically low (15%)',
            location: 'Kitchen',
            deviceId: 'dev-001',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            acknowledged: false,
            resolved: false
        }
    ],
    metrics: {
        safetyScore: 97,
        devicesOnline: 45,
        totalDevices: 48,
        responseTime: '2.3 min',
        coverage: '127 residents',
        emergencyTests: 'Last: 2 days ago'
    }
};

// Guardian Insight Mock Data
export const guardianInsightData = {
    aiInsights: [
        {
            id: 'insight-001',
            type: 'fall_risk',
            title: 'Increased Fall Risk Detected',
            description: 'Eleanor Johnson showing elevated fall risk patterns',
            confidence: 78,
            resident: 'Eleanor Johnson',
            room: 'Room 205',
            severity: 'high',
            recommendations: [
                'Schedule wellness check',
                'Review mobility aids',
                'Increase monitoring frequency'
            ]
        },
        {
            id: 'insight-002',
            type: 'sleep_pattern',
            title: 'Sleep Pattern Disruption',
            description: 'Robert Smith showing irregular sleep patterns',
            confidence: 65,
            resident: 'Robert Smith',
            room: 'Room 312',
            severity: 'medium',
            recommendations: [
                'Consult sleep specialist',
                'Review medication timing',
                'Environmental assessment'
            ]
        }
    ],
    predictions: [
        {
            id: 'pred-001',
            type: 'health_decline',
            resident: 'Robert Smith',
            probability: 65,
            timeframe: '5-10 days',
            factors: ['Decreased mobility', 'Medication adherence', 'Vital signs']
        }
    ],
    behaviorPatterns: {
        dailyActivity: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            activity: Math.floor(Math.random() * 100),
            optimal: 70 + Math.sin(i / 4) * 20
        })),
        anomalies: [
            'Sleep disruption detected',
            'Social isolation patterns',
            'Decreased meal participation'
        ]
    },
    environmentalData: {
        airQuality: 85,
        lighting: 92,
        temperature: 88,
        humidity: 76,
        noise: 82
    }
};

// Guardian CarePro Mock Data
export const guardianCareProData = {
    residents: [
        {
            id: 'res-001',
            name: 'Eleanor Johnson',
            room: 'Room 205',
            age: 78,
            admissionDate: '2023-03-15',
            primaryDiagnosis: 'Dementia',
            riskScores: {
                heartAttack: 45,
                stroke: 62,
                diabetes: 85,
                fall: 78
            },
            careLevel: 'High',
            familyContacts: [
                { name: 'Sarah Johnson', relationship: 'Daughter', phone: '555-0123' }
            ]
        },
        {
            id: 'res-002',
            name: 'Robert Smith',
            room: 'Room 312',
            age: 85,
            admissionDate: '2022-11-20',
            primaryDiagnosis: 'Cardiac Disease',
            riskScores: {
                heartAttack: 78,
                stroke: 45,
                diabetes: 23,
                fall: 55
            },
            careLevel: 'Medium',
            familyContacts: [
                { name: 'Michael Smith', relationship: 'Son', phone: '555-0456' }
            ]
        }
    ],
    staff: [
        {
            id: 'staff-001',
            name: 'Dr. Sarah Wilson',
            role: 'Physician',
            shift: 'Day',
            status: 'on-duty',
            performance: 4.9,
            certifications: ['MD', 'Geriatrics'],
            contact: 'ext. 2101'
        },
        {
            id: 'staff-002',
            name: 'Mike Rodriguez',
            role: 'RN',
            shift: 'Night',
            status: 'on-duty',
            performance: 4.7,
            certifications: ['RN', 'CPR'],
            contact: 'ext. 2205'
        }
    ],
    carePlans: [
        {
            id: 'cp-001',
            residentId: 'res-001',
            goals: ['Maintain cognitive function', 'Prevent falls', 'Social engagement'],
            interventions: ['Daily cognitive exercises', 'Mobility assessment', 'Family visits'],
            reviewDate: '2024-09-01',
            status: 'active'
        }
    ]
};

// Guardian CareTrack Mock Data
export const guardianCareTrackData = {
    medications: [
        {
            id: 'med-001',
            residentId: 'res-001',
            medication: 'Donepezil',
            dosage: '10mg',
            frequency: 'Daily',
            times: ['8:00 AM'],
            prescriber: 'Dr. Wilson',
            startDate: '2024-01-15',
            refillsRemaining: 2,
            adherenceRate: 94
        },
        {
            id: 'med-002',
            residentId: 'res-002',
            medication: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Daily',
            times: ['8:00 PM'],
            prescriber: 'Dr. Wilson',
            startDate: '2023-11-20',
            refillsRemaining: 0,
            adherenceRate: 89
        }
    ],
    treatments: [
        {
            id: 'treat-001',
            residentId: 'res-001',
            type: 'Physical Therapy',
            provider: 'PT Sarah',
            frequency: '3x/week',
            nextSession: '2024-08-13T10:00:00',
            progress: 'Improving',
            goals: ['Maintain mobility', 'Strength building']
        }
    ],
    vitals: [
        {
            id: 'vital-001',
            residentId: 'res-001',
            timestamp: new Date(),
            bloodPressure: { systolic: 142, diastolic: 88 },
            heartRate: 78,
            temperature: 98.6,
            oxygenSaturation: 96,
            weight: 165,
            recordedBy: 'staff-002'
        }
    ],
    compliance: {
        overall: 92,
        byResident: {
            'res-001': 94,
            'res-002': 89
        },
        trends: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
            compliance: 88 + Math.random() * 10
        }))
    }
};

// Operations Center Mock Data
export const operationsCenterData = {
    systemsStatus: [
        { name: 'Guardian Protect', status: 'operational', uptime: '99.8%' },
        { name: 'Guardian Insight', status: 'operational', uptime: '99.5%' },
        { name: 'Guardian CarePro', status: 'maintenance', uptime: '98.2%' },
        { name: 'Guardian CareTrack', status: 'operational', uptime: '99.9%' },
        { name: 'Surveillance Center', status: 'operational', uptime: '99.7%' }
    ],
    activeIncidents: [
        {
            id: 'inc-001',
            type: 'device_failure',
            description: 'Motion sensor offline in Room 205',
            severity: 'medium',
            assignedTo: 'Maintenance Team',
            eta: '30 minutes'
        }
    ],
    performance: {
        responseTime: '2.3 min',
        alertsResolved: 45,
        systemHealth: 97,
        staffEfficiency: 94
    }
};

// Surveillance Center Mock Data
export const surveillanceCenterData = {
    cameras: [
        {
            id: 'cam-001',
            name: 'Main Entrance',
            location: 'Lobby',
            status: 'online',
            resolution: '1080p',
            lastMaintenance: '2024-07-15',
            aiFeatures: ['Motion Detection', 'Facial Recognition']
        },
        {
            id: 'cam-002',
            name: 'Dining Hall Camera',
            location: 'Dining Hall',
            status: 'online',
            resolution: '4K',
            lastMaintenance: '2024-07-20',
            aiFeatures: ['Motion Detection', 'Fall Detection']
        }
    ],
    detections: [
        {
            id: 'det-001',
            type: 'motion',
            camera: 'cam-001',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            confidence: 95,
            description: 'Person detected in lobby area'
        }
    ],
    analytics: {
        totalCameras: 26,
        onlineCameras: 24,
        aiDetections: 18,
        securityScore: 94,
        storageUsed: 67
    }
};