// src/main/database-setup.ts - Temporary mock version
export async function setupGuardianDatabase() {
    console.log('📊 Using mock database for development');

    // Return mock objects that match what your main.ts expects
    return {
        dbManager: {
            // Mock database manager
            isConnected: true,
            query: async (sql: string) => ({ rows: [] })
        },
        guardianService: {
            // Mock guardian service
            getUsers: async () => [],
            getAlerts: async () => [],
            getDevices: async () => []
        }
    };
}