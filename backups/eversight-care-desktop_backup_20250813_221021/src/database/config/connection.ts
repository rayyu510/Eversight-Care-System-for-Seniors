import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { logger } from '@core/services';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database.Database | null = null;

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async initialize(): Promise<void> {
    try {
      const dbPath = this.getDatabasePath();

      this.db = new Database(dbPath);

      // Enable foreign keys and performance settings
      this.db.pragma('foreign_keys = ON');
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('cache_size = 10000');

      logger.info('Database connection initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize database connection:', error);
      throw error;
    }
  }

  async executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.all(...params);
      return result as T[];
    } catch (error) {
      logger.error('Query execution failed:', error);
      throw error;
    }
  }

  async executeUpdate(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.run(...params);
      return {
        lastID: result.lastInsertRowid as number,
        changes: result.changes
      };
    } catch (error) {
      logger.error('Update execution failed:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      logger.info('Database connection closed');
    }
  }

  private getDatabasePath(): string {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, 'eversight-care.db');
  }
}

export const dbConnection = {
  isConnected: false,
  query: async (sql: string, params?: any[]) => ({ rows: [] }),
  execute: async (sql: string, params?: any[]) => ({ success: true })
};

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
  getAlerts: async () => [],

  // Add all the missing service properties
  alerts: {
    findActive: async (careRecipientId: string) => [],
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
    findByRecipient: async (careRecipientId: string) => []
  },

  getDashboardStats: async (careRecipientId: string) => ({
    totalDevices: 0,
    activeAlerts: 0,
    recentEvents: 0
  })
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
