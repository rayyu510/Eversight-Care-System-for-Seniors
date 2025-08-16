export class LoggerService {
  private static instance: LoggerService;

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  info(message: string, data?: any): void {
    console.info(`[INFO] ${message}`, data);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data);
  }
}

export const logger = LoggerService.getInstance();
