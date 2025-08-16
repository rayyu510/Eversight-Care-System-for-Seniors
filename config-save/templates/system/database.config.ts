// config/templates/system/database.config.ts
export interface DatabaseConfig {
    primary: {
        type: 'postgresql' | 'mysql' | 'sqlite' | 'mssql';
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
        ssl: boolean;
        pool: {
            min: number;
            max: number;
            idle: number;
        };
    };
    backup?: {
        enabled: boolean;
        schedule: string; // cron format
        retention: number; // days
        location: string;
    };
    analytics?: {
        enabled: boolean;
        readReplica?: {
            host: string;
            port: number;
            database: string;
        };
    };
}

export const databaseTemplates = {
    // Small clinic (SQLite)
    smallClinic: {
        primary: {
            type: 'sqlite',
            database: './data/eversight.db',
            pool: { min: 1, max: 5, idle: 10000 }
        },
        backup: {
            enabled: true,
            schedule: '0 2 * * *', // Daily at 2 AM
            retention: 30,
            location: './backups/'
        }
    },

    // Medium facility (PostgreSQL)
    mediumFacility: {
        primary: {
            type: 'postgresql',
            host: 'localhost',
            port: 5432,
            database: 'eversight_care',
            username: '${DB_USERNAME}',
            password: '${DB_PASSWORD}',
            ssl: true,
            pool: { min: 2, max: 20, idle: 30000 }
        },
        backup: {
            enabled: true,
            schedule: '0 1 * * *',
            retention: 90,
            location: '/var/backups/eversight/'
        },
        analytics: {
            enabled: true
        }
    },

    // Large hospital (PostgreSQL with read replica)
    largeHospital: {
        primary: {
            type: 'postgresql',
            host: '${DB_PRIMARY_HOST}',
            port: 5432,
            database: 'eversight_care',
            username: '${DB_USERNAME}',
            password: '${DB_PASSWORD}',
            ssl: true,
            pool: { min: 5, max: 100, idle: 60000 }
        },
        backup: {
            enabled: true,
            schedule: '0 0 * * *',
            retention: 365,
            location: '${BACKUP_LOCATION}'
        },
        analytics: {
            enabled: true,
            readReplica: {
                host: '${DB_REPLICA_HOST}',
                port: 5432,
                database: 'eversight_care'
            }
        }
    }
};