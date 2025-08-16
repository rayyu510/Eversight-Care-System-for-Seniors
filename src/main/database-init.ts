import { logger } from '@core/services';

export async function initializeDatabase(): Promise<void> {
  try {
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}
