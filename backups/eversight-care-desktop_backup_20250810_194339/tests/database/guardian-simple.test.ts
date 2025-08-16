// ==========================================
// ENHANCED GUARDIAN TEST - STEP BY STEP
// ==========================================
// Replace your tests/database/guardian-simple.test.ts with this enhanced version

/// <reference types="jest" />

import Database from 'better-sqlite3';

// Simple type interfaces (add these back gradually)
interface TestUser {
    id?: number;
    uuid: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active?: boolean;
    created_at?: string;
}

interface TestCareRecipient {
    id?: number;
    uuid: string;
    first_name: string;
    last_name: string;
    date_of_birth?: string;
    primary_caregiver_id?: number;
    is_active?: boolean;
    created_at?: string;
}

interface TestDevice {
    id?: number;
    uuid: string;
    care_recipient_id: number;
    device_name: string;
    device_type: string;
    battery_level?: number;
    is_active?: boolean;
}

describe('Guardian Database Enhanced Tests', () => {
    let db: Database.Database;

    beforeAll(() => {
        db = new Database(':memory:');
        db.pragma('foreign_keys = ON');
    });

    afterAll(() => {
        if (db) {
            db.close();
        }
    });

    describe('Database Connection Tests', () => {
        test('should create database connection', () => {
            expect(db).toBeDefined();
            console.log('✅ Database connection created');
        });

        test('should execute simple SQL', () => {
            db.exec('CREATE TABLE test_table (id INTEGER PRIMARY KEY, name TEXT)');
            db.exec("INSERT INTO test_table (name) VALUES ('test')");

            const result = db.prepare('SELECT * FROM test_table').all();
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('name', 'test');
            console.log('✅ Basic SQL execution working');

            db.exec('DROP TABLE test_table');
        });
    });

    describe('Schema Creation Tests', () => {
        test('should create users table', () => {
            const createUsersSQL = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL DEFAULT 'temp',
                    role TEXT NOT NULL,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    phone TEXT,
                    timezone TEXT DEFAULT 'UTC',
                    language TEXT DEFAULT 'en',
                    is_active BOOLEAN DEFAULT true,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            expect(() => db.exec(createUsersSQL)).not.toThrow();

            const tables = db.prepare(`
                SELECT name FROM sqlite_master WHERE type='table' AND name='users'
            `).all();

            expect(tables).toHaveLength(1);
            console.log('✅ Users table created successfully');
        });

        test('should create care_recipients table', () => {
            const createCareRecipientsSQL = `
                CREATE TABLE IF NOT EXISTS care_recipients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    date_of_birth DATE NOT NULL,
                    gender TEXT,
                    address TEXT,
                    city TEXT,
                    state TEXT,
                    zip_code TEXT,
                    phone TEXT,
                    emergency_contact_name TEXT,
                    emergency_contact_phone TEXT,
                    primary_caregiver_id INTEGER,
                    care_level TEXT,
                    is_active BOOLEAN DEFAULT true,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (primary_caregiver_id) REFERENCES users(id)
                )
            `;

            expect(() => db.exec(createCareRecipientsSQL)).not.toThrow();

            const tables = db.prepare(`
                SELECT name FROM sqlite_master WHERE type='table' AND name='care_recipients'
            `).all();

            expect(tables).toHaveLength(1);
            console.log('✅ Care recipients table created successfully');
        });

        test('should create devices table', () => {
            const createDevicesSQL = `
                CREATE TABLE IF NOT EXISTS devices (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    care_recipient_id INTEGER NOT NULL,
                    device_type TEXT NOT NULL,
                    device_name TEXT NOT NULL,
                    location TEXT,
                    room TEXT,
                    battery_level INTEGER,
                    signal_strength INTEGER,
                    last_heartbeat DATETIME,
                    is_active BOOLEAN DEFAULT true,
                    installed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (care_recipient_id) REFERENCES care_recipients(id)
                )
            `;

            expect(() => db.exec(createDevicesSQL)).not.toThrow();
            console.log('✅ Devices table created successfully');
        });

        test('should create alerts table', () => {
            const createAlertsSQL = `
                CREATE TABLE IF NOT EXISTS alerts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    care_recipient_id INTEGER NOT NULL,
                    module TEXT NOT NULL,
                    alert_type TEXT NOT NULL,
                    severity TEXT NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    data TEXT,
                    location TEXT,
                    triggered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    acknowledged_at DATETIME,
                    acknowledged_by INTEGER,
                    resolved_at DATETIME,
                    resolved_by INTEGER,
                    status TEXT DEFAULT 'active',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (care_recipient_id) REFERENCES care_recipients(id),
                    FOREIGN KEY (acknowledged_by) REFERENCES users(id),
                    FOREIGN KEY (resolved_by) REFERENCES users(id)
                )
            `;

            expect(() => db.exec(createAlertsSQL)).not.toThrow();
            console.log('✅ Alerts table created successfully');
        });
    });

    describe('CRUD Operations Tests', () => {
        beforeEach(() => {
            // Clean slate for each test
            try {
                db.exec('DROP TABLE IF EXISTS test_alerts');
                db.exec('DROP TABLE IF EXISTS test_devices');
                db.exec('DROP TABLE IF EXISTS test_care_recipients');
                db.exec('DROP TABLE IF EXISTS test_users');
            } catch (error) {
                // Ignore cleanup errors
            }

            // Create fresh tables
            db.exec(`
                CREATE TABLE test_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    role TEXT NOT NULL,
                    is_active BOOLEAN DEFAULT true,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            db.exec(`
                CREATE TABLE test_care_recipients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    date_of_birth DATE NOT NULL,
                    primary_caregiver_id INTEGER,
                    is_active BOOLEAN DEFAULT true,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (primary_caregiver_id) REFERENCES test_users(id)
                )
            `);
        });

        afterEach(() => {
            try {
                db.exec('DROP TABLE IF EXISTS test_alerts');
                db.exec('DROP TABLE IF EXISTS test_devices');
                db.exec('DROP TABLE IF EXISTS test_care_recipients');
                db.exec('DROP TABLE IF EXISTS test_users');
            } catch (error) {
                // Ignore cleanup errors
            }
        });

        test('should insert and retrieve user with types', () => {
            const uuid = 'test-uuid-123';
            const insertStmt = db.prepare(`
                INSERT INTO test_users (uuid, username, email, first_name, last_name, role)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            const result = insertStmt.run(uuid, 'testuser', 'test@example.com', 'Test', 'User', 'caregiver');
            expect(result.lastInsertRowid).toBeDefined();

            const selectStmt = db.prepare('SELECT * FROM test_users WHERE uuid = ?');
            const user = selectStmt.get(uuid) as TestUser;

            expect(user).toBeDefined();
            expect(user.username).toBe('testuser');
            expect(user.email).toBe('test@example.com');
            expect(user.first_name).toBe('Test');
            expect(user.last_name).toBe('User');
            console.log('✅ User CRUD with types working');
        });

        test('should handle foreign key relationships', () => {
            // Create user first
            const userStmt = db.prepare(`
                INSERT INTO test_users (uuid, username, email, first_name, last_name, role)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            const userResult = userStmt.run('user-123', 'testuser', 'test@example.com', 'Test', 'User', 'caregiver');

            // Create care recipient with foreign key
            const recipientStmt = db.prepare(`
                INSERT INTO test_care_recipients (uuid, first_name, last_name, date_of_birth, primary_caregiver_id)
                VALUES (?, ?, ?, ?, ?)
            `);
            const recipientResult = recipientStmt.run(
                'recipient-123', 'Jane', 'Smith', '1955-05-15', userResult.lastInsertRowid
            );

            // Verify relationship
            const joinQuery = db.prepare(`
                SELECT 
                    cr.first_name as recipient_name,
                    u.first_name as caregiver_name
                FROM test_care_recipients cr
                JOIN test_users u ON cr.primary_caregiver_id = u.id
                WHERE cr.uuid = ?
            `);

            const result = joinQuery.get('recipient-123') as any;
            expect(result).toHaveProperty('recipient_name', 'Jane');
            expect(result).toHaveProperty('caregiver_name', 'Test');
            console.log('✅ Foreign key relationships working');
        });
    });

    describe('Guardian Protect Workflow', () => {
        test('should create complete workflow with proper cleanup', () => {
            // Setup tables
            db.exec(`
                CREATE TABLE IF NOT EXISTS workflow_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    role TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS workflow_recipients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    primary_caregiver_id INTEGER,
                    FOREIGN KEY (primary_caregiver_id) REFERENCES workflow_users(id)
                );

                CREATE TABLE IF NOT EXISTS workflow_devices (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    care_recipient_id INTEGER NOT NULL,
                    device_name TEXT NOT NULL,
                    device_type TEXT NOT NULL,
                    battery_level INTEGER,
                    FOREIGN KEY (care_recipient_id) REFERENCES workflow_recipients(id)
                );

                CREATE TABLE IF NOT EXISTS workflow_alerts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    uuid TEXT UNIQUE NOT NULL,
                    care_recipient_id INTEGER NOT NULL,
                    module TEXT NOT NULL,
                    alert_type TEXT NOT NULL,
                    severity TEXT NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    status TEXT DEFAULT 'active',
                    FOREIGN KEY (care_recipient_id) REFERENCES workflow_recipients(id)
                );
            `);

            // Create complete workflow
            const userStmt = db.prepare(`
                INSERT INTO workflow_users (uuid, first_name, last_name, role)
                VALUES (?, ?, ?, ?)
            `);
            const userResult = userStmt.run('user-1', 'John', 'Caregiver', 'caregiver');

            const recipientStmt = db.prepare(`
                INSERT INTO workflow_recipients (uuid, first_name, last_name, primary_caregiver_id)
                VALUES (?, ?, ?, ?)
            `);
            const recipientResult = recipientStmt.run('recipient-1', 'Mary', 'Patient', userResult.lastInsertRowid);

            const deviceStmt = db.prepare(`
                INSERT INTO workflow_devices (uuid, care_recipient_id, device_name, device_type, battery_level)
                VALUES (?, ?, ?, ?, ?)
            `);
            const deviceResult = deviceStmt.run('device-1', recipientResult.lastInsertRowid, 'Motion Sensor', 'sensor', 85);

            const alertStmt = db.prepare(`
                INSERT INTO workflow_alerts (uuid, care_recipient_id, module, alert_type, severity, title, description)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            const alertResult = alertStmt.run(
                'alert-1', recipientResult.lastInsertRowid, 'protect', 'fall_detected',
                'high', 'Fall Detected', 'Motion sensor detected potential fall'
            );

            // Verify all data was created
            expect(userResult.lastInsertRowid).toBeDefined();
            expect(recipientResult.lastInsertRowid).toBeDefined();
            expect(deviceResult.lastInsertRowid).toBeDefined();
            expect(alertResult.lastInsertRowid).toBeDefined();

            // Test dashboard query
            const dashboardQuery = db.prepare(`
                SELECT 
                    cr.first_name as recipient_name,
                    COUNT(DISTINCT d.id) as device_count,
                    COUNT(DISTINCT a.id) as alert_count
                FROM workflow_recipients cr
                LEFT JOIN workflow_devices d ON cr.id = d.care_recipient_id
                LEFT JOIN workflow_alerts a ON cr.id = a.care_recipient_id AND a.status = 'active'
                WHERE cr.id = ?
                GROUP BY cr.id
            `);

            const dashboardResult = dashboardQuery.get(recipientResult.lastInsertRowid) as any;
            expect(dashboardResult).toHaveProperty('recipient_name', 'Mary');
            expect(dashboardResult.device_count).toBeGreaterThan(0);
            expect(dashboardResult.alert_count).toBeGreaterThan(0);

            console.log('✅ Complete Guardian Protect workflow working');

            // Cleanup
            db.exec('DROP TABLE IF EXISTS workflow_alerts');
            db.exec('DROP TABLE IF EXISTS workflow_devices');
            db.exec('DROP TABLE IF EXISTS workflow_recipients');
            db.exec('DROP TABLE IF EXISTS workflow_users');
        });
    });

    describe('Performance Tests', () => {
        test('should handle bulk operations efficiently', () => {
            const startTime = Date.now();

            db.exec(`
                CREATE TABLE bulk_test (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    value INTEGER
                )
            `);

            const insertStmt = db.prepare('INSERT INTO bulk_test (name, value) VALUES (?, ?)');
            const insertMany = db.transaction((records: Array<{ name: string, value: number }>) => {
                for (const record of records) {
                    insertStmt.run(record.name, record.value);
                }
            });

            const testData = Array.from({ length: 1000 }, (_, i) => ({
                name: `test_${i}`,
                value: i
            }));

            insertMany(testData);

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(2000);

            const countStmt = db.prepare('SELECT COUNT(*) as count FROM bulk_test');
            const result = countStmt.get() as { count: number };
            expect(result.count).toBe(1000);

            console.log(`✅ Bulk operations completed in ${duration}ms`);

            db.exec('DROP TABLE bulk_test');
        });
    });
});

// Export for manual testing
export function runEnhancedGuardianTests(): void {
    console.log('🧪 Running Enhanced Guardian Tests...');
    console.log('📋 Test Categories:');
    console.log('  ✅ Database Connection Tests');
    console.log('  ✅ Schema Creation Tests');
    console.log('  ✅ CRUD Operations Tests');
    console.log('  ✅ Guardian Protect Workflow');
    console.log('  ✅ Performance Tests');
    console.log('\n🚀 Run with: npm run test:guardian');
}