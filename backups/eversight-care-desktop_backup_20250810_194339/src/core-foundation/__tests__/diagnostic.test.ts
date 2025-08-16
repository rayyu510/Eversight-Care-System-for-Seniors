describe('Diagnostic Tests', () => {
    it('should be able to import ValidationUtils', () => {
        try {
            const { ValidationUtils } = require('../utils/validation.utils');
            expect(ValidationUtils).toBeDefined();
            expect(typeof ValidationUtils.validateEmail).toBe('function');
            console.log('✅ ValidationUtils imported successfully');
        } catch (error) {
            console.error('❌ Failed to import ValidationUtils:', error);
            throw error;
        }
    });

    it('should be able to import VALIDATION_RULES', () => {
        try {
            const { VALIDATION_RULES } = require('../constants/config.constants');
            expect(VALIDATION_RULES).toBeDefined();
            expect(VALIDATION_RULES.EMAIL_PATTERN).toBeDefined();
            console.log('✅ VALIDATION_RULES imported successfully');
        } catch (error) {
            console.error('❌ Failed to import VALIDATION_RULES:', error);
            throw error;
        }
    });
});