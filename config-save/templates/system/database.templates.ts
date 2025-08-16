// config/templates/system/database.templates.ts
import { DatabaseConfig } from '../../types';

export const databaseTemplates: Record<string, DatabaseConfig> = {
    smallClinic: {
        primary: {
            type: 'sqlite',
            database: './data/eversight.db',
            pool: { min: 1, max: 5, idle: 10000 }
        },
        backup: {
            enabled: true,
            schedule: '0 2 * * *',
            retention: 30,
            location: './backups/'
        }
    },

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
        }
    },

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