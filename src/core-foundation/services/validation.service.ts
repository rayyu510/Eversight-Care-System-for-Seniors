export class ValidationService {
  private static instance: ValidationService;

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  validateEmail(email: string): string | null {
    if (!email) return 'Email is required';
    return null;
  }
}

export const validationService = ValidationService.getInstance();
