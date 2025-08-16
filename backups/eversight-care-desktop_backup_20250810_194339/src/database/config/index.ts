// ==========================================
// DATABASE CONFIG INDEX FILE
// ==========================================
// File: src/database/config/index.ts

// Re-export everything from connection.ts for cleaner imports
export {
    DatabaseManager,
    initializeDatabase,
    getDatabaseManager,
    getGuardianService,
    shutdownDatabase,
    MigrationManager
} from './connection';

export type { Migration, DatabaseConfig } from './connection';

// This allows imports like:
// import { initializeDatabase, getGuardianService } from '../database/config';
// instead of:
// import { initializeDatabase, getGuardianService } from '../database/config/connection';