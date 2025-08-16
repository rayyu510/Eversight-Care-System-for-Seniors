// config/types/AuthConfig.ts

export interface SessionConfig {
    duration: number; // minutes
    refreshToken: boolean;
    multiSession: boolean;
    cookieSettings?: {
        secure: boolean;
        httpOnly: boolean;
        sameSite: 'strict' | 'lax' | 'none';
    };
    storage?: 'memory' | 'redis' | 'database';
}

export interface PasswordPolicyConfig {
    minLength: number;
    maxLength?: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    preventReuse: number; // number of previous passwords to check
    expiration: number; // days
    complexityRules?: {
        minCharacterTypes: number; // minimum different character types required
        noCommonPasswords: boolean;
        noUserInfoInPassword: boolean;
    };
}

export interface MFAConfig {
    enabled: boolean;
    methods: Array<'totp' | 'sms' | 'email' | 'hardware_token' | 'biometric'>;
    required: boolean;
    backupCodes?: {
        enabled: boolean;
        count: number;
    };
    trustedDevices?: {
        enabled: boolean;
        duration: number; // days
    };
}

export interface AuditConfig {
    enabled: boolean;
    logLevel: 'basic' | 'detailed' | 'comprehensive';
    retention: number; // days
    events: {
        login: boolean;
        logout: boolean;
        failedLogin: boolean;
        passwordChange: boolean;
        privilegeEscalation: boolean;
        dataAccess: boolean;
        systemChanges: boolean;
    };
    storage?: {
        type: 'database' | 'file' | 'external';
        location?: string;
        encryption: boolean;
    };
}

export interface LDAPConfig {
    server: string;
    port: number;
    baseDN: string;
    bindDN?: string;
    bindPassword?: string;
    userSearchBase: string;
    userSearchFilter: string;
    groupSearchBase?: string;
    groupSearchFilter?: string;
    ssl: boolean;
    startTLS?: boolean;
    caCert?: string;
}

export interface SAMLConfig {
    entityId: string;
    ssoUrl: string;
    sloUrl?: string;
    certificate: string;
    privateKey?: string;
    signRequests: boolean;
    wantAssertionsSigned: boolean;
    attributeMapping: {
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
        roles?: string;
    };
}

export interface OAuth2Config {
    clientId: string;
    clientSecret: string;
    authorizationUrl: string;
    tokenUrl: string;
    userInfoUrl: string;
    scope: string[];
    redirectUri: string;
    pkce?: boolean;
}

export interface AuthConfig {
    provider: 'local' | 'ldap' | 'saml' | 'oauth2';
    session: SessionConfig;
    passwordPolicy: PasswordPolicyConfig;
    mfa: MFAConfig;
    audit: AuditConfig;

    // Provider-specific configurations
    ldap?: LDAPConfig;
    saml?: SAMLConfig;
    oauth2?: OAuth2Config;

    // Security settings
    lockout?: {
        enabled: boolean;
        maxAttempts: number;
        lockoutDuration: number; // minutes
        incrementalDelay: boolean;
    };

    // Rate limiting
    rateLimit?: {
        enabled: boolean;
        maxAttempts: number;
        windowMs: number;
        skipSuccessfulRequests: boolean;
    };
}