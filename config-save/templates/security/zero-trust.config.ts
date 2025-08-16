// config/templates/security/zero-trust.config.ts
export interface ZeroTrustConfig {
    identity: {
        multiFactorAuthentication: {
            required: boolean;
            methods: Array<'totp' | 'sms' | 'email' | 'biometric' | 'hardware'>;
            adaptiveAuth: boolean;
        };
        privilegedAccess: {
            justInTime: boolean;
            approvalWorkflow: boolean;
            sessionRecording: boolean;
        };
    };
    network: {
        microSegmentation: boolean;
        encryptionInTransit: boolean;
        networkMonitoring: boolean;
        vpnRequired: boolean;
    };
    data: {
        encryptionAtRest: boolean;
        dataClassification: boolean;
        dataLossPrevention: boolean;
        backupEncryption: boolean;
    };
    devices: {
        deviceCompliance: boolean;
        certificateBasedAuth: boolean;
        deviceEncryption: boolean;
        remoteLock: boolean;
    };
    monitoring: {
        behaviorAnalytics: boolean;
        threatDetection: boolean;
        incidentResponse: boolean;
        forensics: boolean;
    };
}

export const zeroTrustTemplates = {
    // Healthcare zero trust implementation
    healthcare: {
        identity: {
            multiFactorAuthentication: {
                required: true,
                methods: ['totp', 'biometric'],
                adaptiveAuth: true
            },
            privilegedAccess: {
                justInTime: true,
                approvalWorkflow: true,
                sessionRecording: true
            }
        },
        network: {
            microSegmentation: true,
            encryptionInTransit: true,
            networkMonitoring: true,
            vpnRequired: true
        },
        data: {
            encryptionAtRest: true,
            dataClassification: true,
            dataLossPrevention: true,
            backupEncryption: true
        },
        devices: {
            deviceCompliance: true,
            certificateBasedAuth: true,
            deviceEncryption: true,
            remoteLock: true
        },
        monitoring: {
            behaviorAnalytics: true,
            threatDetection: true,
            incidentResponse: true,
            forensics: true
        }
    }
};