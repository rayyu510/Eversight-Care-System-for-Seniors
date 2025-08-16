// config/templates/system/performance.config.ts
export interface PerformanceConfig {
    caching: {
        enabled: boolean;
        provider: 'memory' | 'redis' | 'memcached';
        ttl: number; // seconds
        maxSize: string; // e.g., '100MB'
    };
    rateLimit: {
        enabled: boolean;
        windowMs: number;
        max: number;
        skipSuccessfulRequests: boolean;
    };
    compression: {
        enabled: boolean;
        level: number; // 1-9
        threshold: string; // e.g., '1kb'
    };
    monitoring: {
        enabled: boolean;
        metrics: Array<'cpu' | 'memory' | 'disk' | 'network' | 'database'>;
        alertThresholds: {
            cpu: number; // percentage
            memory: number; // percentage
            disk: number; // percentage
        };
    };
}

export const performanceTemplates = {
    // Development environment
    development: {
        caching: {
            enabled: false,
            provider: 'memory',
            ttl: 300,
            maxSize: '50MB'
        },
        rateLimit: {
            enabled: false,
            windowMs: 60000,
            max: 1000,
            skipSuccessfulRequests: true
        },
        compression: {
            enabled: false,
            level: 1,
            threshold: '1kb'
        },
        monitoring: {
            enabled: true,
            metrics: ['cpu', 'memory'],
            alertThresholds: {
                cpu: 90,
                memory: 90,
                disk: 95
            }
        }
    },

    // Production environment
    production: {
        caching: {
            enabled: true,
            provider: 'redis',
            ttl: 3600,
            maxSize: '500MB'
        },
        rateLimit: {
            enabled: true,
            windowMs: 60000,
            max: 100,
            skipSuccessfulRequests: false
        },
        compression: {
            enabled: true,
            level: 6,
            threshold: '1kb'
        },
        monitoring: {
            enabled: true,
            metrics: ['cpu', 'memory', 'disk', 'network', 'database'],
            alertThresholds: {
                cpu: 80,
                memory: 85,
                disk: 90
            }
        }
    },

    // High-performance setup
    highPerformance: {
        caching: {
            enabled: true,
            provider: 'redis',
            ttl: 7200,
            maxSize: '2GB'
        },
        rateLimit: {
            enabled: true,
            windowMs: 60000,
            max: 500,
            skipSuccessfulRequests: false
        },
        compression: {
            enabled: true,
            level: 9,
            threshold: '512b'
        },
        monitoring: {
            enabled: true,
            metrics: ['cpu', 'memory', 'disk', 'network', 'database'],
            alertThresholds: {
                cpu: 70,
                memory: 75,
                disk: 85
            }
        }
    }
};