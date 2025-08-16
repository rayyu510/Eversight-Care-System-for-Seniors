export class EncryptionUtils {
  private static readonly algorithm = 'aes-256-gcm';

  static async encrypt(data: string, key?: string): Promise<string> {
    try {
      // Placeholder implementation - replace with actual crypto in production
      const encoded = Buffer.from(data).toString('base64');
      return `encrypted:${encoded}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  static async decrypt(encryptedData: string, key?: string): Promise<string> {
    try {
      if (!encryptedData.startsWith('encrypted:')) {
        throw new Error('Invalid encrypted data format');
      }
      
      const encoded = encryptedData.replace('encrypted:', '');
      return Buffer.from(encoded, 'base64').toString('utf-8');
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  // ADD THE MISSING METHODS HERE
  static async encryptField(data: string, key?: string): Promise<string> {
    return this.encrypt(data, key);
  }

  static async decryptField(encryptedData: string, key?: string): Promise<string> {
    return this.decrypt(encryptedData, key);
  }

  static generateKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  static async hash(data: string): Promise<string> {
    // Placeholder - use actual crypto hash in production
    return Buffer.from(data).toString('base64');
  }
}