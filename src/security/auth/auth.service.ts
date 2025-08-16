import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, AuthSession } from '@core/types';
import { logger } from '@core/services';
import { dbConnection } from '@data/database';
import { SessionService } from './session.service';
import { MFAService } from './mfa.service';
import { AuditService } from '../audit/audit.service';

export interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
  deviceId?: string;
  rememberDevice?: boolean;
}

export interface LoginResponse {
  success: boolean;
  session?: AuthSession;
  requiresMFA?: boolean;
  mfaMethod?: 'totp' | 'sms' | 'email';
  error?: string;
}

export class AuthService {
  private static instance: AuthService;
  private sessionService: SessionService;
  private mfaService: MFAService;
  private auditService: AuditService;
  private jwtSecret: string;
  private refreshTokenSecret: string;
  private tokenExpiry = '15m';
  private refreshTokenExpiry = '7d';

  constructor() {
    this.sessionService = SessionService.getInstance();
    this.mfaService = MFAService.getInstance();
    this.auditService = AuditService.getInstance();
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      // Find user by email
      const user = await this.findUserByEmail(request.email);
      if (!user) {
        await this.auditService.logFailedLogin(request.email, 'User not found');
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(request.password, user.passwordHash);
      if (!isPasswordValid) {
        await this.auditService.logFailedLogin(request.email, 'Invalid password');
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Check if user is active
      if (!user.isActive) {
        await this.auditService.logFailedLogin(request.email, 'Account disabled');
        return {
          success: false,
          error: 'Account is disabled'
        };
      }

      // Check if MFA is required
      const requiresMFA = await this.mfaService.isEnabledForUser(user.id);
      if (requiresMFA && !request.mfaCode) {
        const mfaMethod = await this.mfaService.getPrimaryMethod(user.id);
        await this.mfaService.sendMFACode(user.id, mfaMethod);

        return {
          success: false,
          requiresMFA: true,
          mfaMethod
        };
      }

      // Verify MFA code if provided
      if (requiresMFA && request.mfaCode) {
        const isMFAValid = await this.mfaService.verifyCode(user.id, request.mfaCode);
        if (!isMFAValid) {
          await this.auditService.logFailedLogin(request.email, 'Invalid MFA code');
          return {
            success: false,
            error: 'Invalid MFA code'
          };
        }
      }

      // Create session
      const session = await this.createSession(user, request.deviceId);

      // Update last login
      await this.updateLastLogin(user.id);

      // Log successful login
      await this.auditService.logSuccessfulLogin(user.id, request.deviceId);

      logger.info(`User ${user.email} logged in successfully`);

      return {
        success: true,
        session
      };

    } catch (error) {
      logger.error('Login error:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  async logout(token: string): Promise<void> {
    try {
      const session = await this.sessionService.getSession(token);
      if (session) {
        await this.sessionService.invalidateSession(token);
        await this.auditService.logLogout(session.user.id);
        logger.info(`User ${session.user.email} logged out`);
      }
    } catch (error) {
      logger.error('Logout error:', error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthSession | null> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as any;

      // Get current session
      const session = await this.sessionService.getSessionByRefreshToken(refreshToken);
      if (!session) {
        return null;
      }

      // Create new tokens
      const newToken = this.generateToken(session.user);
      const newRefreshToken = this.generateRefreshToken(session.user);

      // Update session
      const updatedSession: AuthSession = {
        ...session,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + this.parseExpiry(this.tokenExpiry))
      };

      await this.sessionService.updateSession(updatedSession);

      return updatedSession;

    } catch (error) {
      logger.error('Token refresh error:', error);
      return null;
    }
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      const session = await this.sessionService.getSession(token);

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      return session.user;

    } catch (error) {
      return null;
    }
  }

  private async createSession(user: User, deviceId?: string): Promise<AuthSession> {
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    const expiresAt = new Date(Date.now() + this.parseExpiry(this.tokenExpiry));

    const session: AuthSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      token: token,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
      createdAt: new Date(),
      lastActivity: new Date(),
      user: user
    };

    await this.sessionService.createSession(session, deviceId);

    return session;
  }

  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const options: SignOptions = {
      expiresIn: this.tokenExpiry as any  // Type assertion to bypass StringValue issue
    };

    return jwt.sign(payload, this.jwtSecret, options);
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      type: 'refresh'
    };

    const options: SignOptions = {
      expiresIn: this.refreshTokenExpiry as any  // Type assertion to bypass StringValue issue
    };

    return jwt.sign(payload, this.refreshTokenSecret, options);
  }

  private async findUserByEmail(email: string): Promise<any> {
    const result = await dbConnection.executeQuery(
      'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL',
      [email]
    );
    return result[0] || null;
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await dbConnection.executeUpdate(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }

  private parseExpiry(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));

    switch (unit) {
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 15 * 60 * 1000; // 15 minutes default
    }
  }
}

export const authService = AuthService.getInstance();
