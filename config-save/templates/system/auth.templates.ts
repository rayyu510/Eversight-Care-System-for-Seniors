// config/templates/system/auth.templates.ts
import { AuthConfig } from '../../types';

export const authTemplates: Record<string, AuthConfig> = {
    basic: {
        provider: 'local',
        session: {
            duration: 480,
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
            enabled: false,
            methods: ['email'],
            required: false
        },
        audit: {
            enabled: true,
            logLevel: 'basic',
            retention: 90
        }
    },

    healthcare: {
        provider: 'local',
        session: {
            duration: 240,
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
            retention: 2555
        }
    },

    enterprise: {
        provider: 'ldap',
        session: {
            duration: 480,
            refreshToken: true,
            multiSession: true
        },
        passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: true,
            preventReuse: 5,
            expiration: 90
        },
        mfa: {
            enabled: true,
            methods: ['totp'],
            required: false
        },
        audit: {
            enabled: true,
            logLevel: 'detailed',
            retention: 365
        }
    }
};