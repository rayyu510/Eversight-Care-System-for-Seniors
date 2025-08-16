import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GuardianService } from '../../src/database/services';
import type { User, CareRecipient } from '../../src/database/models';

export class TestDatabaseHelper {
    private db: Database.Database;
    private guardianService: GuardianService;

    constructor() {
        this.db = new Database(':memory:');
        this.loadSchema();
        this.guardianService = new GuardianService(this.db);
    }

    private loadSchema(): void {
        try {
            const schemaPath = join(__dirname, '../../src/database/schema/001_guardian_ecosystem.sql');
            const schema = readFileSync(schemaPath, 'utf8');
            this.db.exec(schema);
        } catch (error) {
            console.error('Failed to load test schema:', error);
            throw error;
        }
    }

    getService(): GuardianService {
        return this.guardianService;
    }

    cleanDatabase(): void {
        // Clean in reverse dependency order
        this.db.exec('DELETE FROM emergency_responses');
        this.db.exec('DELETE FROM sensor_readings');
        this.db.exec('DELETE FROM safety_events');
        this.db.exec('DELETE FROM alerts');
        this.db.exec('DELETE FROM devices');
        this.db.exec('DELETE FROM care_team_members');
        this.db.exec('DELETE FROM care_recipients');
        this.db.exec('DELETE FROM users');
    }

    createTestUser(overrides: Partial<any> = {}): User {
        const userData = {
            username: 'test_user',
            email: 'test@example.com',
            role: 'caregiver' as const,
            first_name: 'Test',
            last_name: 'User',
            timezone: 'UTC',
            language: 'en',
            is_active: true,
            ...overrides
        };

        return this.guardianService.users.create(userData);
    }

    createTestCareRecipient(caregiverId: number, overrides: Partial<any> = {}): CareRecipient {
        const recipientData = {
            first_name: 'Test',
            last_name: 'Recipient',
            date_of_birth: new Date('1950-01-01'),
            primary_caregiver_id: caregiverId,
            is_active: true,
            ...overrides
        };

        return this.guardianService.careRecipients.create(recipientData);
    }

    close(): void {
        this.db.close();
    }
}

// Type augmentation for custom matchers
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValidUUID(): R;
        }
    }
}