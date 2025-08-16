// config/environments/EnvironmentConfigManager.ts
import { CompleteConfig } from '../types/CompleteConfig';

export class EnvironmentConfigManager {
    private environments = ['development', 'testing', 'staging', 'production'];

    mergeEnvironmentConfig(
        baseConfig: CompleteConfig,
        environment: string
    ): CompleteConfig {
        const envOverrides = this.getEnvironmentOverrides(environment);
        return this.deepMerge(baseConfig, envOverrides);
    }

    // Deep merge two objects (shallow merge for arrays)
    private deepMerge<T>(target: T, source: Partial<T>): T {
        if (typeof target !== 'object' || target === null) return target;
        if (typeof source !== 'object' || source === null) return target;

        const output = Array.isArray(target) ? [...(target as any)] : { ...target };

        Object.keys(source).forEach(key => {
            const sourceValue = (source as any)[key];
            const targetValue = (target as any)[key];

            if (
                sourceValue &&
                typeof sourceValue === 'object' &&
                !Array.isArray(sourceValue) &&
                targetValue &&
                typeof targetValue === 'object' &&
                !Array.isArray(targetValue)
            ) {
                (output as any)[key] = this.deepMerge(targetValue, sourceValue);
            } else {
                (output as any)[key] = sourceValue;
            }
        });

        return output as T;
    }

    private getEnvironmentOverrides(environment: string): Partial<CompleteConfig> {
        switch (environment) {
            case 'development':
                return {
                    system: {
                        database: {
                            primary: {
                                type: 'sqlite',
                                database: './dev/eversight.db',
                                pool: {
                                    min: 1,
                                    max: 5,
                                    idle: 10000
                                }
                            }
                        },
                        auth: {
                            provider: 'local',
                            session: {
                                duration: 480,
                                refreshToken: true,
                                multiSession: true
                            },
                            passwordPolicy: {
                                minLength: 6, // Relaxed for development
                                requireUppercase: false,
                                requireLowercase: true,
                                requireNumbers: false,
                                requireSymbols: false,
                                preventReuse: 1,
                                expiration: 365
                            },
                            mfa: {
                                enabled: false,
                                methods: ['email'],
                                required: false
                            },
                            audit: {
                                enabled: true,
                                logLevel: 'basic',
                                retention: 30
                            }
                        },
                        performance: {
                            caching: {
                                enabled: false,
                                provider: 'memory',
                                ttl: 300
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
                        }
                    },
                    functional: {
                        guardianProtect: {
                            monitoring: {
                                updateInterval: 30,
                                realTimeUpdates: true,
                                dataRetention: 30,
                                metricsCollection: true
                            },
                            devices: {
                                maxDevicesPerFacility: 10,
                                autoDiscovery: true,
                                heartbeatInterval: 60,
                                offlineThreshold: 300,
                                batteryAlertThreshold: 20
                            },
                            alerts: {
                                retentionPeriod: 30,
                                escalationRules: [],
                                acknowledgmentTimeout: 60
                            },
                            notifications: {
                                email: true,
                                sms: false,
                                push: true,
                                sound: true,
                                desktop: true
                            }
                        }
                    }
                };

            case 'testing':
                return {
                    system: {
                        database: {
                            primary: {
                                type: 'sqlite',
                                database: ':memory:',
                                pool: {
                                    min: 1,
                                    max: 3,
                                    idle: 5000
                                }
                            }
                        },
                        auth: {
                            provider: 'local',
                            session: {
                                duration: 60,
                                refreshToken: false,
                                multiSession: false
                            },
                            passwordPolicy: {
                                minLength: 4,
                                requireUppercase: false,
                                requireLowercase: false,
                                requireNumbers: false,
                                requireSymbols: false,
                                preventReuse: 0,
                                expiration: 365
                            },
                            mfa: {
                                enabled: false,
                                methods: ['email'],
                                required: false
                            },
                            audit: {
                                enabled: false,
                                logLevel: 'basic',
                                retention: 1
                            }
                        },
                        performance: {
                            caching: {
                                enabled: false,
                                provider: 'memory'
                            },
                            monitoring: {
                                enabled: false
                            }
                        }
                    }
                };

            case 'staging':
                return {
                    system: {
                        database: {
                            primary: {
                                type: 'postgresql',
                                host: 'staging-db.example.com',
                                port: 5432,
                                database: 'eversight_staging',
                                ssl: true,
                                pool: {
                                    min: 2,
                                    max: 10,
                                    idle: 30000
                                }
                            }
                        },
                        auth: {
                            provider: 'local',
                            session: {
                                duration: 240,
                                refreshToken: true,
                                multiSession: false
                            },
                            passwordPolicy: {
                                minLength: 8,
                                requireUppercase: true,
                                requireLowercase: true,
                                requireNumbers: true,
                                requireSymbols: false,
                                preventReuse: 3,
                                expiration: 90
                            },
                            mfa: {
                                enabled: true,
                                methods: ['totp', 'email'],
                                required: false
                            },
                            audit: {
                                enabled: true,
                                logLevel: 'detailed',
                                retention: 90
                            }
                        },
                        performance: {
                            caching: {
                                enabled: true,
                                provider: 'memory',
                                ttl: 1800,
                                maxSize: '100MB'
                            },
                            monitoring: {
                                enabled: true,
                                metrics: ['cpu', 'memory', 'disk', 'network'],
                                alertThresholds: {
                                    cpu: 85,
                                    memory: 85,
                                    disk: 90
                                }
                            },
                            rateLimit: {
                                enabled: true,
                                windowMs: 60000,
                                max: 200,
                                skipSuccessfulRequests: false
                            }
                        }
                    }
                };

            case 'production':
                return {
                    system: {
                        database: {
                            primary: {
                                type: 'postgresql',
                                host: process.env.DB_HOST || 'prod-db.example.com',
                                port: 5432,
                                database: 'eversight_production',
                                ssl: true,
                                pool: {
                                    min: 5,
                                    max: 50,
                                    idle: 60000
                                }
                            },
                            backup: {
                                enabled: true,
                                schedule: '0 2 * * *', // Daily at 2 AM
                                retention: 365,
                                location: '/var/backups/eversight/'
                            }
                        },
                        auth: {
                            provider: 'local',
                            session: {
                                duration: 240, // 4 hours for security
                                refreshToken: true,
                                multiSession: false
                            },
                            passwordPolicy: {
                                minLength: 12,
                                requireUppercase: true,
                                requireLowercase: true,
                                requireNumbers: true,
                                requireSymbols: true,
                                preventReuse: 12,
                                expiration: 60
                            },
                            mfa: {
                                enabled: true,
                                methods: ['totp', 'sms'],
                                required: true
                            },
                            audit: {
                                enabled: true,
                                logLevel: 'comprehensive',
                                retention: 2555 // 7 years for compliance
                            }
                        },
                        performance: {
                            caching: {
                                enabled: true,
                                provider: 'redis',
                                ttl: 3600,
                                maxSize: '1GB'
                            },
                            monitoring: {
                                enabled: true,
                                metrics: ['cpu', 'memory', 'disk', 'network', 'database'],
                                alertThresholds: {
                                    cpu: 80,
                                    memory: 85,
                                    disk: 90
                                }
                            },
                            compression: {
                                enabled: true,
                                level: 6,
                                threshold: '1kb'
                            },
                            rateLimit: {
                                enabled: true,
                                windowMs: 60000,
                                max: 100,
                                skipSuccessfulRequests: false
                            }
                        }
                    },
                    security: {
                        encryption: {
                            atRest: true,
                            inTransit: true,
                            algorithm: 'AES-256-GCM',
                            keyManagement: 'hsm'
                        },
                        network: {
                            firewall: true,
                            intrusion: {
                                detection: true,
                                prevention: true
                            },
                            vpn: {
                                required: true,
                                type: 'ssl'
                            }
                        },
                        compliance: {
                            hipaa: true,
                            gdpr: true,
                            auditLogging: true,
                            dataRetention: 2555
                        }
                    }
                };

            default:
                return {};
        }
    }

    /**
     * Validates if the given environment is supported
     */
    isValidEnvironment(environment: string): boolean {
        return this.environments.includes(environment);
    }

    /**
     * Gets all supported environments
     */
    getSupportedEnvironments(): string[] {
        return [...this.environments];
    }

    /**
     * Gets environment-specific configuration without merging
     */
    getEnvironmentSpecificConfig(environment: string): Partial<CompleteConfig> {
        if (!this.isValidEnvironment(environment)) {
            throw new Error(`Unsupported environment: ${environment}`);
        }
        return this.getEnvironmentOverrides(environment);
    }
}