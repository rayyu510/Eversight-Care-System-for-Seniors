// config/templates/functional/guardian-insight-ml.config.ts
export interface GuardianInsightMLConfig extends GuardianInsightConfig {
    machineLearning: {
        enabled: boolean;
        models: {
            predictiveAnalytics: boolean;
            riskAssessment: boolean;
            resourceOptimization: boolean;
            patternRecognition: boolean;
        };
        training: {
            autoRetraining: boolean;
            retrainingInterval: number; // days
            minimumDataPoints: number;
            validationSplit: number; // percentage
        };
        inference: {
            batchSize: number;
            confidenceThreshold: number;
            fallbackToRules: boolean;
        };
    };
    dataScience: {
        experimentTracking: boolean;
        modelVersioning: boolean;
        abTesting: boolean;
        dataLineage: boolean;
    };
    computeResources: {
        gpuEnabled: boolean;
        maxCpuCores: number;
        maxMemoryGb: number;
        distributedComputing: boolean;
    };
}

export const guardianInsightMLTemplates = {
    // Research hospital with ML capabilities
    researchHospital: {
        ...guardianInsightTemplates.advanced,
        machineLearning: {
            enabled: true,
            models: {
                predictiveAnalytics: true,
                riskAssessment: true,
                resourceOptimization: true,
                patternRecognition: true
            },
            training: {
                autoRetraining: true,
                retrainingInterval: 7,
                minimumDataPoints: 10000,
                validationSplit: 20
            },
            inference: {
                batchSize: 1000,
                confidenceThreshold: 0.85,
                fallbackToRules: true
            }
        },
        dataScience: {
            experimentTracking: true,
            modelVersioning: true,
            abTesting: true,
            dataLineage: true
        },
        computeResources: {
            gpuEnabled: true,
            maxCpuCores: 16,
            maxMemoryGb: 64,
            distributedComputing: true
        }
    }
};