export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

export class ValidationUtils {
    static validateEmail(email: string): ValidationResult {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        return {
            isValid,
            errors: isValid ? [] : ['Invalid email format']
        };
    }

    static validateRequired(value: any, fieldName: string): ValidationResult {
        const isValid = value !== null && value !== undefined && String(value).trim() !== '';

        return {
            isValid,
            errors: isValid ? [] : [`${fieldName} is required`]
        };
    }

    static validateLength(value: string, min: number, max: number, fieldName: string): ValidationResult {
        const length = value ? value.length : 0;
        const isValid = length >= min && length <= max;

        return {
            isValid,
            errors: isValid ? [] : [`${fieldName} must be between ${min} and ${max} characters`]
        };
    }

    static validatePhone(phone: string): ValidationResult {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        const isValid = phoneRegex.test(phone);

        return {
            isValid,
            errors: isValid ? [] : ['Invalid phone number format']
        };
    }

    // ADD THE MISSING METHOD HERE
    static validatePassword(password: string): ValidationResult {
        const errors: string[] = [];

        if (!password) {
            errors.push('Password is required');
        } else {
            if (password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }
            if (!/[A-Z]/.test(password)) {
                errors.push('Password must contain at least one uppercase letter');
            }
            if (!/[a-z]/.test(password)) {
                errors.push('Password must contain at least one lowercase letter');
            }
            if (!/\d/.test(password)) {
                errors.push('Password must contain at least one number');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static combineResults(...results: ValidationResult[]): ValidationResult {
        const allErrors = results.flatMap(r => r.errors);
        const allWarnings = results.flatMap(r => r.warnings || []);

        return {
            isValid: results.every(r => r.isValid),
            errors: allErrors,
            warnings: allWarnings.length > 0 ? allWarnings : undefined
        };
    }
}
