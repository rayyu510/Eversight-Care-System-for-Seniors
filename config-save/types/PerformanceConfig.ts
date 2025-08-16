// config/types/PerformanceConfig.ts

export interface CachingConfig {
    enabled: boolean;
    provider?: 'memory' | 'redis' | 'memcached';
    ttl?: number; // seconds
    maxSize?: string; // e.g., '100MB'
    namespace?: string;
    compression?: boolean;
    serialization?: 'json' | 'msgpack' | 'binary';

    // Redis-specific settings
    redis?: {
        host: string;
        port: number;
        password?: string;
        db?: number;
        keyPrefix?: string;
        cluster?: boolean;
        sentinel?: {
            hosts: Array<{ host: string; port: number }>;
            masterName: string;
        };
    };

    // Memory-specific settings
    memory?: {
        maxKeys: number;
        algorithm: 'lru' | 'lfu' | 'fifo';
    };
}

export interface RateLimitConfig {
    enabled: boolean;
    windowMs: number; // time window in milliseconds
    max: number; // maximum requests per window
    skipSuccessfulRequests: boolean;
    skipFailedRequests?: boolean;
    keyGenerator?: 'ip' | 'user' | 'custom';
    handler?: 'block' | 'delay' | 'queue';

    // Different limits for different endpoints
    endpoints?: {
        [endpoint: string]: {
            windowMs: number;
            max: number;
        };
    };

    // User-based rate limiting
    userLimits?: {
        [userRole: string]: {
            windowMs: number;
            max: number;
        };
    };
}

export interface CompressionConfig {
    enabled: boolean;
    level?: number; // 1-9, higher = better compression but slower
    threshold?: string; // minimum size to compress, e.g., '1kb'
    algorithms?: Array<'gzip' | 'deflate' | 'br'>;
    filter?: {
        mimeTypes: string[];
        excludePaths: string[];
    };
}

export interface MonitoringConfig {
    enabled: boolean;
    metrics?: Array<'cpu' | 'memory' | 'disk' | 'network' | 'database' | 'cache' | 'requests'>;

    alertThresholds?: {
        cpu: number; // percentage
        memory: number; // percentage
        disk: number; // percentage
        responseTime: number; // milliseconds
        errorRate: number; // percentage
    };

    collection?: {
        interval: number; // seconds
        retention: number; // days
        aggregation: Array<'minute' | 'hour' | 'day'>;
    };

    exporters?: Array<{
        type: 'prometheus' | 'datadog' | 'newrelic' | 'custom';
        endpoint?: string;
        apiKey?: string;
    }>;

    healthChecks?: {
        enabled: boolean;
        endpoint: string;
        interval: number; // seconds
        timeout: number; // seconds
        checks: Array<'database' | 'cache' | 'external_services'>;
    };
}

export interface LoadBalancingConfig {
    enabled: boolean;
    algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'ip_hash';
    healthCheck: {
        enabled: boolean;
        path: string;
        interval: number; // seconds
        timeout: number; // seconds
        retries: number;
    };
    upstream: Array<{
        server: string;
        weight?: number;
        maxFails?: number;
        failTimeout?: number; // seconds
    }>;
}

export interface ConnectionPoolConfig {
    database?: {
        min: number;
        max: number;
        acquireTimeoutMillis: number;
        idleTimeoutMillis: number;
        reapIntervalMillis: number;
        createRetryIntervalMillis: number;
        createTimeoutMillis: number;
    };

    http?: {
        maxSockets: number;
        maxFreeSockets: number;
        timeout: number;
        freeSocketTimeout: number;
        keepAlive: boolean;
    };
}

export interface PerformanceConfig {
    caching: CachingConfig;
    rateLimit?: RateLimitConfig;
    compression?: CompressionConfig;
    monitoring: MonitoringConfig;
    loadBalancing?: LoadBalancingConfig;
    connectionPool?: ConnectionPoolConfig;

    // Application-specific performance settings
    application?: {
        maxRequestSize: string; // e.g., '10mb'
        requestTimeout: number; // seconds
        keepAliveTimeout: number; // seconds
        maxConcurrentRequests: number;

        // Static file serving
        staticFiles?: {
            enabled: boolean;
            maxAge: number; // seconds
            etag: boolean;
            lastModified: boolean;
        };

        // API response optimization
        api?: {
            pagination: {
                defaultLimit: number;
                maxLimit: number;
            };
            fieldSelection: boolean;
            responseCompression: boolean;
        };
    };
}