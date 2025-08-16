// config/templates/mobile/mobile-app.config.ts
export interface MobileAppConfig {
    platform: {
        ios: boolean;
        android: boolean;
        crossPlatform: 'react-native' | 'flutter' | 'ionic';
    };
    features: {
        offlineMode: boolean;
        pushNotifications: boolean;
        biometricAuth: boolean;
        voiceCommands: boolean;
        augmentedReality: boolean;
    };
    synchronization: {
        strategy: 'real-time' | 'periodic' | 'manual';
        conflictResolution: 'server-wins' | 'client-wins' | 'manual';
        cacheSize: string; // e.g., '100MB'
    };
    security: {
        appPinning: boolean;
        rootDetection: boolean;
        dataEncryption: boolean;
        sessionTimeout: number; // minutes
    };
}

export const mobileAppTemplates = {
    // Nurse mobile app
    nurseApp: {
        platform: {
            ios: true,
            android: true,
            crossPlatform: 'react-native'
        },
        features: {
            offlineMode: true,
            pushNotifications: true,
            biometricAuth: true,
            voiceCommands: false,
            augmentedReality: false
        },
        synchronization: {
            strategy: 'real-time',
            conflictResolution: 'server-wins',
            cacheSize: '50MB'
        },
        security: {
            appPinning: true,
            rootDetection: true,
            dataEncryption: true,
            sessionTimeout: 15
        }
    }
};