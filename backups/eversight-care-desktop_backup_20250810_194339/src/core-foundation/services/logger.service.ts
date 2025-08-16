import { LogLevel } from '../types';

export class LoggerService {
  private static instance: LoggerService;

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  error(message: string, error?: unknown, metadata?: Record<string, any>): void {
    const errorData = this.formatError(error);
    console.error(message, errorData, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    console.info(message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    console.warn(message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>): void {
    console.debug(message, metadata);
  }

  private formatError(error: unknown): Record<string, any> {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }
    return { error: String(error) };
  }
}

export const logger = LoggerService.getInstance();