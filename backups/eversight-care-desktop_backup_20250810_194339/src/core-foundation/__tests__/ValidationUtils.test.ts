import { ValidationUtils, ValidationResult } from '../utils/validation.utils';

describe('ValidationUtils', () => {
    describe('validateEmail', () => {
        it('should validate correct email', () => {
            const result: ValidationResult = ValidationUtils.validateEmail('test@example.com');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject invalid email', () => {
            const result: ValidationResult = ValidationUtils.validateEmail('invalid-email');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid email format');
        });

        it('should reject empty email', () => {
            const result: ValidationResult = ValidationUtils.validateEmail('');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Email is required');
        });
    });

    describe('validatePassword', () => {
        it('should validate strong password', () => {
            const result: ValidationResult = ValidationUtils.validatePassword('StrongPass123!');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should reject weak password', () => {
            const result: ValidationResult = ValidationUtils.validatePassword('weak');
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should reject empty password', () => {
            const result: ValidationResult = ValidationUtils.validatePassword('');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password is required');
        });
    });

    describe('validateRequired', () => {
        it('should pass for non-empty value', () => {
            const result: ValidationResult = ValidationUtils.validateRequired('value', 'Field');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should fail for empty value', () => {
            const result: ValidationResult = ValidationUtils.validateRequired('', 'Field');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Field is required');
        });

        it('should fail for null value', () => {
            const result: ValidationResult = ValidationUtils.validateRequired(null, 'Field');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Field is required');
        });

        it('should fail for undefined value', () => {
            const result: ValidationResult = ValidationUtils.validateRequired(undefined, 'Field');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Field is required');
        });
    });
});