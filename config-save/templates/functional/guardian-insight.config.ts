// config/templates/functional/guardian-insight.config.ts
export interface GuardianInsightConfig {
    analytics: {
        realTimeProcessing: boolean;
        batchSize: number;
        processingInterval: number; // minutes
        dataAggregation: Array<'hourly' | 'daily' | 'weekly' | 'monthly'>;
    };
    reports: {
        autoGeneration: boolean;
        schedule: {
            daily: boolean;
            weekly: boolean;
            monthly: boolean;
            quarterly: boolean;
        };
        deliveryMethods: Array<'email' | 'dashboard' | 'export'>;
        retention: number; // days
    };
    kpis: {
        refreshInterval: number; // minutes
        alertThresholds: {
            [key: string]: {
                warning: number;
                critical: number;
            };
        };
    };
    visualization: {
        chartTypes: Array<'line' | 'bar' | 'pie' | 'scatter' | 'heatmap'>;
        interactivity: boolean;
        exportFormats: Array<'png' | 'pdf' | 'svg'>;
    };
}

export const guardianInsightTemplates = {
    // Basic analytics setup
    basic: {
        analytics: {
            realTimeProcessing: false,
            batchSize: 1000,
            processingInterval: 60,
            dataAggregation: ['daily', 'weekly']
        },
        reports: {
            autoGeneration: true,
            schedule: {
                daily: false,
                weekly: true,
                monthly: true,
                quarterly: false
            },
            deliveryMethods: ['dashboard', 'email'],
            retention: 365
        },
        kpis: {
            refreshInterval: 30,
            alertThresholds: {
                'device_uptime': { warning: 95, critical: 90 },
                'response_time': { warning: 300, critical: 600 }
            }
        },
        visualization: {
            chartTypes: ['line', 'bar', 'pie'],
            interactivity: true,
            exportFormats: ['png', 'pdf']
        }
    },

    // Advanced analytics setup
    advanced: {
        analytics: {
            realTimeProcessing: true,
            batchSize: 5000,
            processingInterval: 15,
            dataAggregation: ['hourly', 'daily', 'weekly', 'monthly']
        },
        reports: {
            autoGeneration: true,
            schedule: {
                daily: true,
                weekly: true,
                monthly: true,
                quarterly: true
            },
            deliveryMethods: ['dashboard', 'email', 'export'],
            retention: 2555
        },
        kpis: {
            refreshInterval: 5,
            alertThresholds: {
                'device_uptime': { warning: 98, critical: 95 },
                'response_time': { warning: 120, critical: 300 },
                'alert_resolution_time': { warning: 15, critical: 30 }
            }
        },
        visualization: {
            chartTypes: ['line', 'bar', 'pie', 'scatter', 'heatmap'],
            interactivity: true,
            exportFormats: ['png', 'pdf', 'svg']
        }
    }
};