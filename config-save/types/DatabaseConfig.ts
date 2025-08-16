// config/types/DatabaseConfig.ts

export interface DatabaseConnectionConfig {
    type: 'postgresql' | 'mysql' | 'sqlite' | 'mssql';
    host?: string;
    port?: number;
    database: string;
    username?: string;
    password?: string;
    ssl?: boolean;
    pool?: {
        min: number;
        max: number;
        idle: number;
    };
}

export interface DatabaseBackupConfig {
    enabled: boolean;
    schedule: string; // cron format
    retention: number; // days
    location: string;
    compression?: boolean;
    encryption?: boolean;
}

export interface DatabaseAnalyticsConfig {
    enabled: boolean;
    readReplica?: {
        host: string;
        port: number;
        database: string;
        username?: string;
        password?: string;
    };
    dataWarehouse?: {
        enabled: boolean;
        provider: 'redshift' | 'bigquery' | 'snowflake';
        endpoint?: string;
    };
}

export interface DatabaseConfig {
    primary: DatabaseConnectionConfig;
    backup?: DatabaseBackupConfig;
    analytics?: DatabaseAnalyticsConfig;
    migrations?: {
        enabled: boolean;
        autoRun: boolean;
        directory: string;
    };
    monitoring?: {
        enabled: boolean;
        slowQueryThreshold: number; // milliseconds
        connectionPoolMonitoring: boolean;
    };
}

// Database-specific configurations
export interface PostgreSQLConfig extends DatabaseConnectionConfig {
    type: 'postgresql';
    extensions?: string[];
    searchPath?: string[];
    sslMode?: 'disable' | 'require' | 'verify-ca' | 'verify-full';
}

export interface MySQLConfig extends DatabaseConnectionConfig {
    type: 'mysql';
    charset?: string;
    timezone?: string;
    acquireTimeout?: number;
}

export interface SQLiteConfig extends DatabaseConnectionConfig {
    type: 'sqlite';
    database: string; // file path or ':memory:'
    pragma?: {
        [key: string]: string | number;
    };
}

export interface MSSQLConfig extends DatabaseConnectionConfig {
    type: 'mssql';
    encrypt?: boolean;
    trustServerCertificate?: boolean;
    instanceName?: string;
}

// Export convenience type
export type SpecificDatabaseConfig = PostgreSQLConfig | MySQLConfig | SQLiteConfig | MSSQLConfig;