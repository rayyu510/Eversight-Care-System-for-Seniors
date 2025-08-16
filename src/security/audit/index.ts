export class AuditService {
  private static instance: AuditService;

  static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService();
    }
    return AuditService.instance;
  }

  async logFailedLogin(email: string, reason: string): Promise<void> {
    console.log(`Failed login: ${email} - ${reason}`);
  }

  async logSuccessfulLogin(userId: string, deviceId?: string): Promise<void> {
    console.log(`Successful login: ${userId}`);
  }

  async logLogout(userId: string): Promise<void> {
    console.log(`Logout: ${userId}`);
  }

  async logPasswordChangeAttempt(userId: string, success: boolean, reason?: string): Promise<void> {
    console.log(`Password change: ${userId} - ${success ? 'success' : 'failed'}`);
  }

  async logPasswordResetRequest(userId: string): Promise<void> {
    console.log(`Password reset requested: ${userId}`);
  }
}
