// config/templates/system/auth.config.ts
export interface AuthConfig {
    provider: 'local' | 'ldap' | 'saml' | 'oauth2';
    session: {
        duration: number; // minutes
        refreshToken: boolean;
        multiSession: boolean;
    };
    passwordPolicy: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSymbols: boolean;
        preventReuse: number;
        expiration: number; // days
    };
    mfa: {
        enabled: boolean;
        methods: Array<'totp' | 'sms' | 'email'>;
        required: boolean;
    };
    audit: {
        enabled: boolean;
        logLevel: 'basic' | 'detailed' | 'comprehensive';
        retention: number; // days
    };
}

export const authTemplates = {
    // Basic authentication for small clinics
    basic: {
        provider: 'local',
        session: {
            duration: 480, // 8 hours
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

    // Healthcare standard (HIPAA compliant)
    healthcare: {
        provider: 'local',
        session: {
            duration: 240, // 4 hours
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
            retention: 2555 // 7 years
        }
    },

    // Enterprise with LDAP integration
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