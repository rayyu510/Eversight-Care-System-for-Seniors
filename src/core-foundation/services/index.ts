// Core foundation services - centralized exports
export interface CoreService {
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
}

export interface Logger {
    info(message: string, meta?: any): void;
    error(message: string, error?: Error): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}

export class MockLogger implements Logger {
    info(message: string, meta?: any): void {
        console.log(`[INFO] ${message}`, meta);
    }

    error(message: string, error?: Error): void {
        console.error(`[ERROR] ${message}`, error);
    }

    warn(message: string, meta?: any): void {
        console.warn(`[WARN] ${message}`, meta);
    }

    debug(message: string, meta?: any): void {
        console.debug(`[DEBUG] ${message}`, meta);
    }
}

export const logger = new MockLogger();

// Service registry for dependency injection
export class ServiceRegistry {
    private services = new Map<string, any>();

    register<T>(key: string, service: T): void {
        this.services.set(key, service);
    }

    get<T>(key: string): T | undefined {
        return this.services.get(key);
    }

    has(key: string): boolean {
        return this.services.has(key);
    }
}

export const serviceRegistry = new ServiceRegistry();