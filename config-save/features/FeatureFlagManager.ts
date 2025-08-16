// config/features/FeatureFlagManager.ts
export interface FeatureFlag {
    name: string;
    enabled: boolean;
    rolloutPercentage?: number;
    conditions?: {
        userRoles?: string[];
        facilityTypes?: string[];
        environments?: string[];
    };
    metadata?: {
        description: string;
        owner: string;
        createdAt: Date;
        expiresAt?: Date;
    };
}

export class FeatureFlagManager {
    private flags = new Map<string, FeatureFlag>();

    registerFlag(flag: FeatureFlag): void {
        this.flags.set(flag.name, flag);
    }

    isFeatureEnabled(
        flagName: string,
        context: {
            userId?: string;
            userRole?: string;
            facilityType?: string;
            environment?: string;
        }
    ): boolean {
        const flag = this.flags.get(flagName);
        if (!flag) return false;

        // Check if flag is globally disabled
        if (!flag.enabled) return false;

        // Check conditions
        if (flag.conditions) {
            if (flag.conditions.userRoles && context.userRole) {
                if (!flag.conditions.userRoles.includes(context.userRole)) {
                    return false;
                }
            }

            if (flag.conditions.facilityTypes && context.facilityType) {
                if (!flag.conditions.facilityTypes.includes(context.facilityType)) {
                    return false;
                }
            }

            if (flag.conditions.environments && context.environment) {
                if (!flag.conditions.environments.includes(context.environment)) {
                    return false;
                }
            }
        }

        // Check rollout percentage
        if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
            const hash = this.generateUserHash(context.userId || 'anonymous', flagName);
            return hash % 100 < flag.rolloutPercentage;
        }

        return true;
    }

    private generateUserHash(userId: string, flagName: string): number {
        // Simple hash function for rollout
        let hash = 0;
        const str = `${userId}_${flagName}`;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
}

// Feature flag definitions
export const defaultFeatureFlags: FeatureFlag[] = [
    {
        name: 'guardian_insight_advanced_analytics',
        enabled: false,
        rolloutPercentage: 25,
        conditions: {
            facilityTypes: ['hospital', 'nursing_home'],
            environments: ['staging', 'production']
        },
        metadata: {
            description: 'Advanced analytics features for Guardian Insight',
            owner: 'analytics-team',
            createdAt: new Date('2025-08-01'),
            expiresAt: new Date('2025-12-31')
        }
    },
    {
        name: 'guardian_carepro_ai_scheduling',
        enabled: false,
        rolloutPercentage: 10,
        conditions: {
            userRoles: ['administrator', 'nurse_supervisor'],
            facilityTypes: ['assisted_living', 'nursing_home']
        },
        metadata: {
            description: 'AI-powered staff scheduling optimization',
            owner: 'ai-team',
            createdAt: new Date('2025-08-10')
        }
    },
    {
        name: 'guardian_protect_predictive_maintenance',
        enabled: true,
        conditions: {
            environments: ['production']
        },
        metadata: {
            description: 'Predictive maintenance for Guardian Protect devices',
            owner: 'device-team',
            createdAt: new Date('2025-07-15')
        }
    }
];