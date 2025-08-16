// config/templates/deployment/cloud.config.ts
export interface CloudConfig {
    provider: 'aws' | 'azure' | 'gcp';
    region: string;
    environment: 'development' | 'staging' | 'production';
    compute: {
        instanceType: string;
        minInstances: number;
        maxInstances: number;
        autoScaling: boolean;
    };
    storage: {
        type: 'ssd' | 'hdd';
        size: string;
        backup: boolean;
        encryption: boolean;
    };
    network: {
        vpc: boolean;
        ssl: boolean;
        cdn: boolean;
        firewall: boolean;
    };
}

export const cloudTemplates = {
    // AWS small deployment
    awsSmall: {
        provider: 'aws',
        region: 'us-east-1',
        environment: 'production',
        compute: {
            instanceType: 't3.medium',
            minInstances: 1,
            maxInstances: 3,
            autoScaling: true
        },
        storage: {
            type: 'ssd',
            size: '100GB',
            backup: true,
            encryption: true
        },
        network: {
            vpc: true,
            ssl: true,
            cdn: false,
            firewall: true
        }
    },

    // Azure enterprise deployment
    azureEnterprise: {
        provider: 'azure',
        region: 'East US',
        environment: 'production',
        compute: {
            instanceType: 'Standard_D4s_v3',
            minInstances: 2,
            maxInstances: 10,
            autoScaling: true
        },
        storage: {
            type: 'ssd',
            size: '500GB',
            backup: true,
            encryption: true
        },
        network: {
            vpc: true,
            ssl: true,
            cdn: true,
            firewall: true
        }
    }
};