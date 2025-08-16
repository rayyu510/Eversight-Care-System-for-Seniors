// config/templates/functional/guardian-protect-advanced.config.ts
import { GuardianProtectConfig } from '../functional/guardian-protect.config';

export interface GuardianProtectAdvancedConfig extends GuardianProtectConfig {
    ai: {
        enabled: boolean;
        predictiveMaintenance: boolean;
        anomalyDetection: boolean;
        falseAlarmReduction: boolean;
    };
    integration: {
        nursecallSystems: Array<{
            type: string;
            endpoint: string;
            authentication: any;
        }>;
        emrSystems: Array<{
            type: 'epic' | 'cerner' | 'allscripts' | 'custom';
            endpoint: string;
            authentication: any;
        }>;
        mobilityDevices: {
            wheelchairs: boolean;
            walkers: boolean;
            beds: boolean;
            lifts: boolean;
        };
    };
    compliance: {
        hipaa: {
            enabled: boolean;
            auditLevel: 'basic' | 'enhanced' | 'comprehensive';
            dataRetention: number; // days
        };
        fda: {
            enabled: boolean;
            deviceClassification: '510k' | 'pma' | 'exempt';
            reportingRequired: boolean;
        };
    };
    customAlerts: Array<{
        name: string;
        conditions: any;
        actions: string[];
        priority: number;
    }>;
}

// Ensure the correct path and file exist; adjust the import if needed
import { guardianProtectTemplates } from '../functional/guardian-protect.config';
// If the file does not exist, create it with the required exports:
// export const guardianProtectTemplates = { largeHospital: {/* ... */} };

export const guardianProtectAdvancedTemplates = {
    // AI-enhanced hospital setup
    aiEnhancedHospital: {
        ...guardianProtectTemplates.largeHospital,
        ai: {
            enabled: true,
            predictiveMaintenance: true,
            anomalyDetection: true,
            falseAlarmReduction: true
        },
        integration: {
            nursecallSystems: [
                {
                    type: 'rauland',
                    endpoint: 'https://nursecall.hospital.com/api',
                    authentication: { type: 'oauth2' }
                }
            ],
            emrSystems: [
                {
                    type: 'epic',
                    endpoint: 'https://epic.hospital.com/fhir',
                    authentication: { type: 'certificate' }
                }
            ],
            mobilityDevices: {
                wheelchairs: true,
                walkers: true,
                beds: true,
                lifts: true
            }
        },
        compliance: {
            hipaa: {
                enabled: true,
                auditLevel: 'comprehensive',
                dataRetention: 2555
            },
            fda: {
                enabled: true,
                deviceClassification: '510k',
                reportingRequired: true
            }
        },
        customAlerts: [
            {
                name: 'mass_evacuation',
                conditions: {
                    deviceCount: { gte: 10 },
                    alertType: 'emergency',
                    timeWindow: 300
                },
                actions: ['notify_administration', 'activate_pa_system'],
                priority: 1
            }
        ]
    }
};