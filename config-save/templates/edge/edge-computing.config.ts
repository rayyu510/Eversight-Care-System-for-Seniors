// config/templates/edge/edge-computing.config.ts
export interface EdgeComputingConfig {
    deployment: {
        edgeNodes: number;
        processingCapacity: string;
        storageCapacity: string;
        connectivity: 'wifi' | '4g' | '5g' | 'ethernet';
    };
    processing: {
        localAnalytics: boolean;
        realTimeProcessing: boolean;
        aiInference: boolean;
        dataFiltering: boolean;
    };
    synchronization: {
        cloudSync: boolean;
        syncFrequency: number; // minutes
        priorityData: string[];
        compressionEnabled: boolean;
    };
    failover: {
        autonomousMode: boolean;
        gracefulDegradation: boolean;
        alertGeneration: boolean;
    };
}

export const edgeComputingTemplates = {
    // Distributed hospital campus
    hospitalCampus: {
        deployment: {
            edgeNodes: 5,
            processingCapacity: '8 cores, 16GB RAM',
            storageCapacity: '1TB',
            connectivity: 'ethernet'
        },
        processing: {
            localAnalytics: true,
            realTimeProcessing: true,
            aiInference: true,
            dataFiltering: true
        },
        synchronization: {
            cloudSync: true,
            syncFrequency: 5,
            priorityData: ['critical_alerts', 'emergency_events'],
            compressionEnabled: true
        },
        failover: {
            autonomousMode: true,
            gracefulDegradation: true,
            alertGeneration: true
        }
    }
};