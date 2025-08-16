export class MFAService {
  private static instance: MFAService;

  static getInstance(): MFAService {
    if (!MFAService.instance) {
      MFAService.instance = new MFAService();
    }
    return MFAService.instance;
  }

  async isEnabledForUser(userId: string): Promise<boolean> {
    return false;
  }

  async getPrimaryMethod(userId: string): Promise<'totp' | 'sms' | 'email'> {
    return 'totp';
  }

  async sendMFACode(userId: string, method: string): Promise<void> {
    // Implementation placeholder
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    return true;
  }
}
