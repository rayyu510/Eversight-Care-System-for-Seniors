// config/templates/functional/guardian-carepro.config.ts
export interface GuardianCareProConfig {
    staffManagement: {
        maxStaffPerFacility: number;
        roleHierarchy: Array<{
            role: string;
            level: number;
            permissions: string[];
        }>;
        shiftPatterns: Array<{
            name: string;
            startTime: string;
            endTime: string;
            duration: number; // hours
        }>;
    };
    residents: {
        maxResidentsPerFacility: number;
        careLevel: Array<{
            level: string;
            staffRatio: string; // e.g., "1:4"
            requirements: string[];
        }>;
        assessmentSchedule: {
            initial: number; // days
            ongoing: number; // days
            comprehensive: number; // days
        };
    };
    scheduling: {
        advanceBooking: number; // days
        minStaffingLevels: {
            [shift: string]: number;
        };
        overtimeRules: {
            dailyThreshold: number; // hours
            weeklyThreshold: number; // hours
            approval: boolean;
        };
    };
}

export const guardianCareProTemplates = {
    // Assisted living facility
    assistedLiving: {
        staffManagement: {
            maxStaffPerFacility: 100,
            roleHierarchy: [
                {
                    role: 'administrator',
                    level: 1,
                    permissions: ['all']
                },
                {
                    role: 'nurse_supervisor',
                    level: 2,
                    permissions: ['staff_management', 'resident_care', 'scheduling']
                },
                {
                    role: 'registered_nurse',
                    level: 3,
                    permissions: ['resident_care', 'medication', 'assessments']
                },
                {
                    role: 'care_aide',
                    level: 4,
                    permissions: ['resident_care', 'activities']
                }
            ],
            shiftPatterns: [
                { name: 'day', startTime: '07:00', endTime: '19:00', duration: 12 },
                { name: 'night', startTime: '19:00', endTime: '07:00', duration: 12 }
            ]
        },
        residents: {
            maxResidentsPerFacility: 200,
            careLevel: [
                {
                    level: 'independent',
                    staffRatio: '1:20',
                    requirements: ['daily_check']
                },
                {
                    level: 'assisted',
                    staffRatio: '1:10',
                    requirements: ['daily_check', 'medication_assistance']
                },
                {
                    level: 'memory_care',
                    staffRatio: '1:6',
                    requirements: ['constant_supervision', 'specialized_care']
                }
            ],
            assessmentSchedule: {
                initial: 7,
                ongoing: 90,
                comprehensive: 365
            }
        },
        scheduling: {
            advanceBooking: 14,
            minStaffingLevels: {
                'day': 8,
                'night': 4
            },
            overtimeRules: {
                dailyThreshold: 8,
                weeklyThreshold: 40,
                approval: true
            }
        }
    }
};