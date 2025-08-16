export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: Date;
    module?: string;
    metadata?: Record<string, any>;
}

export class Logger {
    constructor(private module?: string) { }

    debug(message: string, metadata?: Record<string, any>): void {
        this.log(LogLevel.DEBUG, message, metadata);
    }

    info(message: string, metadata?: Record<string, any>): void {
        this.log(LogLevel.INFO, message, metadata);
    }

    warn(message: string, metadata?: Record<string, any>): void {
        this.log(LogLevel.WARN, message, metadata);
    }

    error(message: string, metadata?: Record<string, any>): void {
        this.log(LogLevel.ERROR, message, metadata);
    }

    private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
        const logOutput = `[${level.toUpperCase()}] ${this.module ? `[${this.module}] ` : ''}${message}`;

        // FIX: Use explicit console methods to avoid the calling error
        if (level === LogLevel.ERROR) {
            console.error(logOutput);
        } else if (level === LogLevel.WARN) {
            console.warn(logOutput);
        } else if (level === LogLevel.INFO) {
            console.info(logOutput);
        } else {
            console.log(logOutput);
        }

        if (metadata) {
            console.log('Metadata:', metadata);
        }
    }

    // ADD THE MISSING getInstance METHOD
    static getInstance(): Logger {
        return new Logger();
    }

    createModuleLogger(module: string): ModuleLogger {
        return new ModuleLogger(module);
    }
}

export class ModuleLogger extends Logger {
    constructor(module: string) {
        super(module);
    }
}

export const createLogger = (module?: string): Logger => new Logger(module);
export const createModuleLogger = (module: string): ModuleLogger => new ModuleLogger(module);
