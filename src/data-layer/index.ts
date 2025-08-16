// Add these to your existing database files:

// In src/data-layer/index.ts - Create if missing:
export * from '../database';
export * from '../database/models';

// In src/data-layer/database.ts - Create if missing:
export const mockDatabase = {
    isConnected: false,
    connect: async () => console.log('Mock database connected'),
    disconnect: async () => console.log('Mock database disconnected')
};

// In src/data-layer/models.ts - Create if missing:
export interface BaseModel {
    id: string;
    createdAt: string;
    updatedAt: string;
}

// In src/database/index.ts - Add:
export const dbConnection = {
    isConnected: false,
    query: async (sql: string, params?: any[]) => ({ rows: [] }),
    execute: async (sql: string, params?: any[]) => ({ success: true })
};

// In src/database/config/connection.ts - Add these exports:
export class DatabaseManager {
    async initialize() { console.log('Mock DB Manager initialized'); }
}

export interface DatabaseConfig {
    type: 'sqlite' | 'postgres';
    database: string;
}

export const initializeDatabase = async () => {
    console.log('Mock database initialized');
};

export const getDatabaseManager = () => new DatabaseManager();

export const getGuardianService = () => ({
    getDevices: async () => [],
    getAlerts: async () => []
});

export const shutdownDatabase = async () => {
    console.log('Mock database shutdown');
};

export class MigrationManager {
    async runMigrations() { console.log('Mock migrations run'); }
}

export interface Migration {
    id: string;
    name: string;
}