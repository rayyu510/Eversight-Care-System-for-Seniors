// config/templates/customer/facility-types.config.ts
export interface FacilityConfig {
    type: 'hospital' | 'clinic' | 'assisted_living' | 'nursing_home' | 'rehabilitation';
    size: 'small' | 'medium' | 'large' | 'enterprise';
    specialties: string[];
    compliance: Array<'hipaa' | 'hitech' | 'gdpr' | 'pipeda'>;
    modules: {
        guardianProtect: boolean;
        guardianInsight: boolean;
        guardianCarePro: boolean;
        guardianCareTrack: boolean;
    };
}

export const facilityTemplates = {
    smallClinic: {
        type: 'clinic',
        size: 'small',
        specialties: ['general'],
        compliance: ['hipaa'],
        modules: {
            guardianProtect: true,
            guardianInsight: false,
            guardianCarePro: false,
            guardianCareTrack: true
        }
    },

    assistedLivingMedium: {
        type: 'assisted_living',
        size: 'medium',
        specialties: ['elderly_care', 'memory_care'],
        compliance: ['hipaa', 'hitech'],
        modules: {
            guardianProtect: true,
            guardianInsight: true,
            guardianCarePro: true,
            guardianCareTrack: true
        }
    },

    largeHospital: {
        type: 'hospital',
        size: 'large',
        specialties: ['emergency', 'surgery', 'icu', 'pediatric'],
        compliance: ['hipaa', 'hitech'],
        modules: {
            guardianProtect: true,
            guardianInsight: true,
            guardianCarePro: true,
            guardianCareTrack: true
        }
    }
};