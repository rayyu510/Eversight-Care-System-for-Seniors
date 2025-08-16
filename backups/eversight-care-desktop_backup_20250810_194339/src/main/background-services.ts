import { logger } from '@core/services';

export async function startBackgroundServices(): Promise<void> {
  try {
    logger.info('Background services started');
  } catch (error) {
    logger.error('Failed to start background services:', error);
    throw error;
  }
}
