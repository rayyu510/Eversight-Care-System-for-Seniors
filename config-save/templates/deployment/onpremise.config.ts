// config/templates/deployment/onpremise.config.ts
export interface OnPremiseConfig {
    architecture: 'single-server' | 'multi-server' | 'cluster';
    hardware: {
        cpu: string;
        memory: string;
        storage: string;
        network: string;
    };
    os: {
        type: 'linux' | 'windows';
        version: string;
        containerization: 'docker' | 'kubernetes' | 'none';
    };
    backup: {
        strategy: 'local' | 'remote' | 'hybrid';
        frequency: string;
        retention: number;
    };
}

export const onPremiseTemplates = {
    // Single server setup
    singleServer: {
        architecture: 'single-server',
        hardware: {
            cpu: '8 cores',
            memory: '32GB',
            storage: '1TB SSD',
            network: '1Gbps'
        },
        os: {
            type: 'linux',
            version: 'Ubuntu 22.04',
            containerization: 'docker'
        },
        backup: {
            strategy: 'local',
            frequency: 'daily',
            retention: 30
        }
    },

    // High availability cluster
    haCluster: {
        architecture: 'cluster',
        hardware: {
            cpu: '16 cores per node',
            memory: '64GB per node',
            storage: '2TB SSD per node',
            network: '10Gbps'
        },
        os: {
            type: 'linux',
            version: 'Ubuntu 22.04',
            containerization: 'kubernetes'
        },
        backup: {
            strategy: 'hybrid',
            frequency: 'hourly',
            retention: 365
        }
    }
};