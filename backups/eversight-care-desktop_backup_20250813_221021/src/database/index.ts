// Database layer exports
export * from './services';
export * from './config';

// Temporary placeholder until real database is implemented
export interface DatabaseConnection {
    isConnected: boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}

export class MockDatabaseConnection implements DatabaseConnection {
    isConnected = false;

    async connect(): Promise<void> {
        this.isConnected = true;
        console.log('📊 Mock database connected');
    }

    async disconnect(): Promise<void> {
        this.isConnected = false;
        console.log('📊 Mock database disconnected');
    }
}

export const dbConnection = {
    isConnected: false,
    query: async (sql: string, params?: any[]) => ({ rows: [] }),
    execute: async (sql: string, params?: any[]) => ({ success: true }),
    executeQuery: async (sql: string, params?: any[]) => ({ rows: [] }),
    executeUpdate: async (sql: string, params?: any[]) => ({ success: true })
};

// Fix 3: Update getGuardianService in database/config/connection.ts
export const getGuardianService = () => ({
    getDevices: async () => [],
    getAlerts: async () => [],
    alerts: {
        findActive: async (id: string) => [],
        acknowledge: async (alertId: string, userId: string) => ({ success: true })
    },
    users: {
        create: async (userData: any) => ({ success: true, id: 'new-user' })
    },
    careRecipients: {
        findAll: async (pagination: any) => [],
        findById: async (id: string) => null
    },
    safetyEvents: {
        create: async (eventData: any) => ({ success: true, id: 'new-event' }),
        findByRecipient: async (id: string) => []
    },
    getDashboardStats: async (id: string) => ({
        totalDevices: 0,
        activeAlerts: 0,
        recentEvents: 0
    })
});

export const database = new MockDatabaseConnection();