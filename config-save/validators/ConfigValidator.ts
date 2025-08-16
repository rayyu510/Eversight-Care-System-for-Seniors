// config/validators/ConfigValidator.ts
import { CompleteConfig, ValidationResult } from '../types';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export class ConfigValidator {
    private ajv: Ajv;
    private schema: any;

    constructor() {
        this.ajv = new Ajv({ allErrors: true });
        addFormats(this.ajv);
        this.loadSchema();
    }

    async validate(config: CompleteConfig): Promise<ValidationResult> {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Schema validation
        const schemaValid = this.ajv.validate(this.schema, config);
        if (!schemaValid && this.ajv.errors) {
            result.isValid = false;
            result.errors.push(...this.ajv.errors.map(error => ({
                path: error.instancePath || error.schemaPath,
                message: error.message || 'Validation error',
                severity: 'error' as const
            })));
        }

        // Business rule validation
        await this.validateBusinessRules(config, result);

        // Security validation
        await this.validateSecurity(config, result);

        return result;
    }

    private async validateBusinessRules(config: CompleteConfig, result: ValidationResult): Promise<void> {
        // Validate facility configuration
        if (config.facility.type === 'hospital' && config.facility.size === 'small') {
            if (!config.functional.guardianProtect) {
                result.warnings.push({
                    path: 'functional.guardianProtect',
                    message: 'Small hospitals typically require Guardian Protect module'
                });
            }
        }

        // Validate module dependencies
        if (config.functional.guardianInsight && !config.functional.guardianProtect) {
            result.errors.push({
                path: 'functional.guardianInsight',
                message: 'Guardian Insight requires Guardian Protect to be enabled',
                severity: 'error'
            });
            result.isValid = false;
        }

        // Validate database configuration
        if (config.system.database.primary.type === 'sqlite' && config.facility.size === 'large') {
            result.warnings.push({
                path: 'system.database.primary.type',
                message: 'SQLite is not recommended for large facilities'
            });
        }

        // Validate compliance requirements
        if (config.facility.compliance.includes('hipaa')) {
            if (!config.system.auth.audit.enabled) {
                result.errors.push({
                    path: 'system.auth.audit.enabled',
                    message: 'HIPAA compliance requires audit logging to be enabled',
                    severity: 'error'
                });
                result.isValid = false;
            }

            if (config.system.auth.audit.retention < 2555) { // 7 years
                result.warnings.push({
                    path: 'system.auth.audit.retention',
                    message: 'HIPAA recommends audit log retention of at least 7 years (2555 days)'
                });
            }
        }
    }

    private async validateSecurity(config: CompleteConfig, result: ValidationResult): Promise<void> {
        // Password policy validation
        const passwordPolicy = config.system.auth.passwordPolicy;
        if (passwordPolicy.minLength < 8) {
            result.warnings.push({
                path: 'system.auth.passwordPolicy.minLength',
                message: 'Password minimum length should be at least 8 characters'
            });
        }

        // MFA validation for healthcare
        if (config.facility.compliance.includes('hipaa') && !config.system.auth.mfa.required) {
            result.warnings.push({
                path: 'system.auth.mfa.required',
                message: 'HIPAA compliance strongly recommends mandatory MFA'
            });
        }

        // Encryption validation
        if (config.security && !config.security.encryption.atRest) {
            result.warnings.push({
                path: 'security.encryption.atRest',
                message: 'Encryption at rest is recommended for healthcare data'
            });
        }
    }

    private loadSchema(): void {
        this.schema = {
            type: 'object',
            required: ['facility', 'system', 'functional', 'deployment', 'metadata'],
            properties: {
                facility: {
                    type: 'object',
                    required: ['type', 'size', 'modules'],
                    properties: {
                        type: {
                            enum: ['hospital', 'clinic', 'assisted_living', 'nursing_home', 'rehabilitation']
                        },
                        size: {
                            enum: ['small', 'medium', 'large', 'enterprise']
                        },
                        modules: {
                            type: 'object',
                            properties: {
                                guardianProtect: { type: 'boolean' },
                                guardianInsight: { type: 'boolean' },
                                guardianCarePro: { type: 'boolean' },
                                guardianCareTrack: { type: 'boolean' }
                            }
                        }
                    }
                },
                system: {
                    type: 'object',
                    required: ['database', 'auth', 'performance'],
                    properties: {
                        database: {
                            type: 'object',
                            required: ['primary'],
                            properties: {
                                primary: {
                                    type: 'object',
                                    required: ['type', 'database'],
                                    properties: {
                                        type: {
                                            enum: ['postgresql', 'mysql', 'sqlite', 'mssql']
                                        },
                                        database: { type: 'string', minLength: 1 }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
}