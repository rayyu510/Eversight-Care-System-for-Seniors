// config/schemas/config.schema.ts
export const configSchema = {
    type: 'object',
    required: ['facility', 'system', 'functional'],
    properties: {
        facility: {
            type: 'object',
            required: ['type', 'size', 'modules'],
            properties: {
                type: { enum: ['hospital', 'clinic', 'assisted_living', 'nursing_home'] },
                size: { enum: ['small', 'medium', 'large', 'enterprise'] },
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
            properties: {
                database: { $ref: '#/definitions/database' },
                auth: { $ref: '#/definitions/auth' },
                performance: { $ref: '#/definitions/performance' }
            }
        },
        functional: {
            type: 'object',
            properties: {
                guardianProtect: { $ref: '#/definitions/guardianProtect' },
                guardianInsight: { $ref: '#/definitions/guardianInsight' }
            }
        }
    }
};