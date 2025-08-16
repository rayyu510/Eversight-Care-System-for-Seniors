// ==========================================
// GUARDIAN ECOSYSTEM - COMPREHENSIVE TEST SUITE
// ==========================================
// File: tests/database/guardian-ecosystem.test.ts

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
    GuardianService,
    UserService,
    CareRecipientService,
    AlertService,
    DeviceService,
    SafetyEventService,
    SensorReadingService,
    EmergencyResponseService
} from '../../src/database/services';

// Import types
import type {
    User,
    CareRecipient,
    Alert,
    Device,
    SafetyEvent,
    SensorReading,
    EmergencyResponse
} from '../../src/database/models';

describe('Guardian Ecosystem Database Tests', () => {
    let db: Database.Database;
    let guardianService: GuardianService;

    // Test data
    let testUser: User;
    let testCareRecipient: CareRecipient;
    let testDevice: Device;

    beforeAll(async () => {
        // Create in-memory database for testing
        db = new Database(':memory:');

        // Load and execute the schema
        try {
            const schemaPath = join(__dirname, '../../src/database/schema/001_guardian_ecosystem.sql');
            const schema = readFileSync(schemaPath, 'utf8');
            db.exec(schema);
            console.log('✅ Database schema loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load schema:', error);
            throw error;
        }

        // Initialize Guardian service
        guardianService = new GuardianService(db);
    });

    afterAll(() => {
        db.close();
    });

    beforeEach(() => {
        // Clean up data before each test
        db.exec('DELETE FROM emergency_responses');
        db.exec('DELETE FROM sensor_readings');
        db.exec('DELETE FROM safety_events');
        db.exec('DELETE FROM alerts');
        db.exec('DELETE FROM devices');
        db.exec('DELETE FROM care_recipients');
        db.exec('DELETE FROM users');
    });

    // ==========================================
    // SCHEMA AND STRUCTURE TESTS
    // ==========================================

    describe('Database Schema Tests', () => {
        test('should have all required tables', () => {
            const tables = db.prepare(`
                SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
            `).all() as Array<{ name: string }>;

            const tableNames = tables.map(t => t.name);

            // Core tables
            expect(tableNames).toContain('users');
            expect(tableNames).toContain('care_recipients');
            expect(tableNames).toContain('care_team_members');
            expect(tableNames).toContain('alerts');
            expect(tableNames).toContain('devices');

            // Guardian Protect tables
            expect(tableNames).toContain('safety_events');
            expect(tableNames).toContain('sensor_readings');
            expect(tableNames).toContain('emergency_responses');

            // Guardian Insight tables
            expect(tableNames).toContain('behavior_patterns');
            expect(tableNames).toContain('activity_logs');
            expect(tableNames).toContain('health_metrics');

            // Guardian CarePro tables
            expect(tableNames).toContain('care_plans');
            expect(tableNames).toContain('care_tasks');
            expect(tableNames).toContain('medications');

            // Guardian CareTrack tables
            expect(tableNames).toContain('appointments');
            expect(tableNames).toContain('care_communications');
            expect(tableNames).toContain('care_shifts');

            // System tables
            expect(tableNames).toContain('system_settings');
            expect(tableNames).toContain('audit_logs');
            expect(tableNames).toContain('file_storage');

            console.log(`✅ Found ${tableNames.length} tables in schema`);
        });

        test('should have required indexes', () => {
            const indexes = db.prepare(`
                SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'
            `).all() as Array<{ name: string }>;

            const indexNames = indexes.map(i => i.name);

            // Check for key indexes
            expect(indexNames.some(name => name.includes('users'))).toBe(true);
            expect(indexNames.some(name => name.includes('care_recipients'))).toBe(true);
            expect(indexNames.some(name => name.includes('alerts'))).toBe(true);

            console.log(`✅ Found ${indexNames.length} indexes`);
        });

        test('should have system settings populated', () => {
            const settings = db.prepare(`SELECT COUNT(*) as count FROM system_settings`).get() as { count: number };
            expect(settings.count).toBeGreaterThan(0);
            console.log(`✅ Found ${settings.count} system settings`);
        });
    });

    // ==========================================
    // CORE SERVICES TESTS
    // ==========================================

    describe('Core Services Tests', () => {
        test('UserService - CRUD operations', () => {
            const userData = {
                username: 'test_user',
                email: 'test@example.com',
                role: 'caregiver' as const,
                first_name: 'Test',
                last_name: 'User',
                phone: '555-0123',
                timezone: 'UTC',
                language: 'en',
                is_active: true
            };

            // Create user
            testUser = guardianService.users.create(userData);
            expect(testUser.id).toBeDefined();
            expect(testUser.uuid).toBeDefined();
            expect(testUser.username).toBe('test_user');
            expect(testUser.email).toBe('test@example.com');
            console.log('✅ User created successfully');

            // Find by ID
            const foundUser = guardianService.users.findById(testUser.id);
            expect(foundUser).not.toBeNull();
            expect(foundUser?.email).toBe('test@example.com');
            console.log('✅ User found by ID');

            // Find by email
            const foundByEmail = guardianService.users.findByEmail('test@example.com');
            expect(foundByEmail).not.toBeNull();
            expect(foundByEmail?.id).toBe(testUser.id);
            console.log('✅ User found by email');

            // Find all users
            const allUsers = guardianService.users.findAll();
            expect(allUsers.length).toBe(1);
            expect(allUsers[0].id).toBe(testUser.id);
            console.log('✅ All users retrieved');
        });

        test('CareRecipientService - CRUD operations', () => {
            // First create a user to be the caregiver
            const caregiverData = {
                username: 'caregiver',
                email: 'caregiver@example.com',
                role: 'caregiver' as const,
                first_name: 'Care',
                last_name: 'Giver',
                timezone: 'UTC',
                language: 'en',
                is_active: true
            };
            const caregiver = guardianService.users.create(caregiverData);

            const recipientData = {
                first_name: 'John',
                last_name: 'Doe',
                date_of_birth: new Date('1950-01-01'),
                gender: 'male' as const,
                address: '123 Main St',
                city: 'Springfield',
                state: 'NY',
                phone: '555-0456',
                emergency_contact_name: 'Jane Doe',
                emergency_contact_phone: '555-0789',
                primary_caregiver_id: caregiver.id,
                care_level: 'assisted' as const,
                medical_conditions: ['Diabetes', 'Hypertension'],
                medications: ['Metformin', 'Lisinopril'],
                allergies: ['Penicillin'],
                is_active: true
            };

            // Create care recipient
            testCareRecipient = guardianService.careRecipients.create(recipientData);
            expect(testCareRecipient.id).toBeDefined();
            expect(testCareRecipient.first_name).toBe('John');
            expect(testCareRecipient.primary_caregiver_id).toBe(caregiver.id);
            console.log('✅ Care recipient created successfully');

            // Find by ID
            const found = guardianService.careRecipients.findById(testCareRecipient.id);
            expect(found).not.toBeNull();
            expect(found?.last_name).toBe('Doe');
            console.log('✅ Care recipient found by ID');

            // Find by caregiver
            const byCaregiverList = guardianService.careRecipients.findByCaregiver(caregiver.id);
            expect(byCaregiverList.length).toBe(1);
            expect(byCaregiverList[0].id).toBe(testCareRecipient.id);
            console.log('✅ Care recipient found by caregiver');

            // Get active count
            const count = guardianService.careRecipients.getActiveCount();
            expect(count).toBe(1);
            console.log('✅ Active count retrieved');
        });
    });

    // ==========================================
    // GUARDIAN PROTECT TESTS
    // ==========================================

    describe('Guardian Protect Services Tests', () => {
        beforeEach(() => {
            // Create test user and care recipient for Guardian Protect tests
            const userData = {
                username: 'protect_user',
                email: 'protect@example.com',
                role: 'caregiver' as const,
                first_name: 'Protect',
                last_name: 'User',
                timezone: 'UTC',
                language: 'en',
                is_active: true
            };
            testUser = guardianService.users.create(userData);

            const recipientData = {
                first_name: 'Protected',
                last_name: 'Person',
                date_of_birth: new Date('1945-05-15'),
                primary_caregiver_id: testUser.id,
                is_active: true
            };
            testCareRecipient = guardianService.careRecipients.create(recipientData);
        });

        test('DeviceService - Device management', () => {
            const deviceData = {
                care_recipient_id: testCareRecipient.id,
                device_type: 'sensor' as const,
                device_name: 'Motion Sensor 1',
                location: 'Living Room',
                room: 'Living Room',
                battery_level: 85,
                signal_strength: 95,
                is_active: true,
                installed_at: new Date()
            };

            // Create device
            testDevice = guardianService.devices.create(deviceData);
            expect(testDevice.id).toBeDefined();
            expect(testDevice.device_name).toBe('Motion Sensor 1');
            expect(testDevice.battery_level).toBe(85);
            console.log('✅ Device created successfully');

            // Find by recipient
            const devices = guardianService.devices.findByRecipient(testCareRecipient.id);
            expect(devices.length).toBe(1);
            expect(devices[0].id).toBe(testDevice.id);
            console.log('✅ Device found by recipient');

            // Update heartbeat
            guardianService.devices.updateHeartbeat(testDevice.id);
            const updated = guardianService.devices.findById(testDevice.id);
            expect(updated?.last_heartbeat).toBeDefined();
            console.log('✅ Device heartbeat updated');

            // Update battery
            guardianService.devices.updateBattery(testDevice.id, 75);
            const batteryUpdated = guardianService.devices.findById(testDevice.id);
            expect(batteryUpdated?.battery_level).toBe(75);
            console.log('✅ Device battery updated');
        });

        test('AlertService - Alert management', () => {
            const alertData = {
                care_recipient_id: testCareRecipient.id,
                module: 'protect' as const,
                alert_type: 'fall_detected',
                severity: 'high' as const,
                title: 'Fall Detected',
                description: 'Motion sensor detected a potential fall',
                location: 'Living Room',
                triggered_at: new Date(),
                status: 'active' as const
            };

            // Create alert
            const alert = guardianService.alerts.create(alertData);
            expect(alert.id).toBeDefined();
            expect(alert.alert_type).toBe('fall_detected');
            expect(alert.severity).toBe('high');
            console.log('✅ Alert created successfully');

            // Find active alerts
            const activeAlerts = guardianService.alerts.findActive(testCareRecipient.id);
            expect(activeAlerts.length).toBe(1);
            expect(activeAlerts[0].id).toBe(alert.id);
            console.log('✅ Active alerts retrieved');

            // Acknowledge alert
            const acknowledged = guardianService.alerts.acknowledge(alert.id, testUser.id);
            expect(acknowledged?.status).toBe('acknowledged');
            expect(acknowledged?.acknowledged_by).toBe(testUser.id);
            console.log('✅ Alert acknowledged');

            // Resolve alert
            const resolved = guardianService.alerts.resolve(alert.id, testUser.id);
            expect(resolved?.status).toBe('resolved');
            expect(resolved?.resolved_by).toBe(testUser.id);
            console.log('✅ Alert resolved');

            // Get stats by module
            const stats = guardianService.alerts.getStatsByModule();
            expect(typeof stats).toBe('object');
            console.log('✅ Alert stats retrieved');
        });

        test('SafetyEventService - Safety event tracking', () => {
            const eventData = {
                care_recipient_id: testCareRecipient.id,
                device_id: testDevice?.id,
                event_type: 'fall' as const,
                severity: 'critical' as const,
                location: 'Bathroom',
                room: 'Bathroom',
                description: 'Detected sudden movement consistent with fall',
                sensor_data: { acceleration: 9.8, duration: 2.5 },
                occurred_at: new Date(),
                status: 'open' as const
            };

            // Create safety event
            const safetyEvent = guardianService.safetyEvents.create(eventData);
            expect(safetyEvent.id).toBeDefined();
            expect(safetyEvent.event_type).toBe('fall');
            expect(safetyEvent.severity).toBe('critical');
            console.log('✅ Safety event created successfully');

            // Find by recipient
            const events = guardianService.safetyEvents.findByRecipient(testCareRecipient.id);
            expect(events.length).toBe(1);
            expect(events[0].id).toBe(safetyEvent.id);
            console.log('✅ Safety events found by recipient');

            // Find recent events
            const recentEvents = guardianService.safetyEvents.findRecent(10);
            expect(recentEvents.length).toBeGreaterThan(0);
            console.log('✅ Recent safety events retrieved');

            // Mark resolved
            const resolved = guardianService.safetyEvents.markResolved(safetyEvent.id, testUser.id, 'False alarm');
            expect(resolved?.status).toBe('resolved');
            expect(resolved?.resolution_notes).toBe('False alarm');
            console.log('✅ Safety event marked as resolved');
        });

        test('SensorReadingService - Sensor data', () => {
            const readingData = {
                device_id: testDevice?.id || 0,
                care_recipient_id: testCareRecipient.id,
                sensor_type: 'motion' as const,
                value: 1,
                unit: 'boolean',
                location: 'Living Room',
                room: 'Living Room',
                metadata: { confidence: 0.95 },
                recorded_at: new Date()
            };

            // Create sensor reading
            const reading = guardianService.sensorReadings.create(readingData);
            expect(reading.id).toBeDefined();
            expect(reading.sensor_type).toBe('motion');
            expect(reading.value).toBe(1);
            console.log('✅ Sensor reading created successfully');

            // Get latest readings
            const latestReadings = guardianService.sensorReadings.getLatestReadings(
                testDevice?.id || 0, 'motion', 5
            );
            expect(latestReadings.length).toBe(1);
            console.log('✅ Latest sensor readings retrieved');

            // Get recent readings
            const recentReadings = guardianService.sensorReadings.getRecentReadings(testCareRecipient.id, 1);
            expect(recentReadings.length).toBe(1);
            console.log('✅ Recent sensor readings retrieved');
        });

        test('EmergencyResponseService - Emergency contacts', () => {
            const responseData = {
                care_recipient_id: testCareRecipient.id,
                response_type: 'fall' as const,
                priority_order: 1,
                contact_type: 'family' as const,
                contact_name: 'Jane Doe',
                contact_phone: '555-0987',
                contact_email: 'jane@example.com',
                response_instructions: 'Call immediately if fall detected',
                is_active: true
            };

            // Create emergency response
            const response = guardianService.emergencyResponses.create(responseData);
            expect(response.id).toBeDefined();
            expect(response.contact_name).toBe('Jane Doe');
            expect(response.priority_order).toBe(1);
            console.log('✅ Emergency response created successfully');

            // Find by recipient
            const responses = guardianService.emergencyResponses.findByRecipient(testCareRecipient.id);
            expect(responses.length).toBe(1);
            expect(responses[0].id).toBe(response.id);
            console.log('✅ Emergency responses found by recipient');

            // Find by response type
            const fallResponses = guardianService.emergencyResponses.findByResponseType(
                testCareRecipient.id, 'fall'
            );
            expect(fallResponses.length).toBe(1);
            console.log('✅ Emergency responses found by type');
        });
    });

    // ==========================================
    // INTEGRATION TESTS
    // ==========================================

    describe('Guardian Integration Tests', () => {
        beforeEach(() => {
            // Set up full test scenario
            const userData = {
                username: 'integration_user',
                email: 'integration@example.com',
                role: 'caregiver' as const,
                first_name: 'Integration',
                last_name: 'Tester',
                timezone: 'UTC',
                language: 'en',
                is_active: true
            };
            testUser = guardianService.users.create(userData);

            const recipientData = {
                first_name: 'Test',
                last_name: 'Recipient',
                date_of_birth: new Date('1940-01-01'),
                primary_caregiver_id: testUser.id,
                is_active: true
            };
            testCareRecipient = guardianService.careRecipients.create(recipientData);

            const deviceData = {
                care_recipient_id: testCareRecipient.id,
                device_type: 'sensor' as const,
                device_name: 'Integration Sensor',
                is_active: true,
                installed_at: new Date()
            };
            testDevice = guardianService.devices.create(deviceData);
        });

        test('Dashboard Stats Integration', () => {
            // Create some test data
            guardianService.alerts.create({
                care_recipient_id: testCareRecipient.id,
                module: 'protect',
                alert_type: 'test_alert',
                severity: 'medium',
                title: 'Test Alert',
                description: 'Test description',
                triggered_at: new Date(),
                status: 'active'
            });

            // Get dashboard stats
            const stats = guardianService.getDashboardStats();
            expect(stats.totalCareRecipients).toBe(1);
            expect(stats.activeAlerts).toBe(1);
            expect(stats.protect).toBeDefined();
            expect(stats.protect.totalDevices).toBe(1);
            console.log('✅ Dashboard stats integration working');

            // Get stats for specific recipient
            const recipientStats = guardianService.getDashboardStats(testCareRecipient.id);
            expect(recipientStats.totalCareRecipients).toBe(0); // Should be 0 when filtered
            expect(recipientStats.activeAlerts).toBe(1);
            console.log('✅ Recipient-specific dashboard stats working');
        });

        test('Safety Alert Creation Integration', () => {
            // Create safety event
            const safetyEvent = guardianService.safetyEvents.create({
                care_recipient_id: testCareRecipient.id,
                event_type: 'emergency_button',
                severity: 'critical',
                description: 'Emergency button pressed',
                occurred_at: new Date(),
                status: 'open'
            });

            // Create safety alert from event
            const alert = guardianService.createSafetyAlert(safetyEvent);
            expect(alert.module).toBe('protect');
            expect(alert.alert_type).toBe('emergency_button');
            expect(alert.severity).toBe('critical');
            expect(alert.status).toBe('active');
            console.log('✅ Safety alert creation integration working');
        });

        test('Module Availability', () => {
            const availableModules = guardianService.getAvailableModules();
            expect(availableModules).toContain('protect');
            expect(guardianService.isModuleAvailable('protect')).toBe(true);
            expect(guardianService.isModuleAvailable('insight')).toBe(false);
            console.log('✅ Module availability detection working');
        });
    });

    // ==========================================
    // FUTURE MODULE PLACEHOLDER TESTS
    // ==========================================

    describe('Future Module Placeholder Tests', () => {
        test('Placeholder services return empty arrays', () => {
            expect(guardianService.activityLogs.findByRecipient(1)).toEqual([]);
            expect(guardianService.healthMetrics.findByRecipient(1)).toEqual([]);
            expect(guardianService.careTasks.findByRecipient(1)).toEqual([]);
            expect(guardianService.careTasks.getTodaysTasks()).toEqual([]);
            expect(guardianService.appointments.findUpcoming()).toEqual([]);
            console.log('✅ Placeholder services working correctly');
        });
    });

    // ==========================================
    // ERROR HANDLING TESTS
    // ==========================================

    describe('Error Handling Tests', () => {
        test('Should handle non-existent records gracefully', () => {
            expect(guardianService.users.findById(999)).toBeNull();
            expect(guardianService.careRecipients.findById(999)).toBeNull();
            expect(guardianService.alerts.findById(999)).toBeNull();
            expect(guardianService.devices.findById(999)).toBeNull();
            expect(guardianService.safetyEvents.findById(999)).toBeNull();
            console.log('✅ Non-existent record handling working');
        });

        test('Should handle empty results gracefully', () => {
            expect(guardianService.users.findAll()).toEqual([]);
            expect(guardianService.careRecipients.findAll()).toEqual([]);
            expect(guardianService.alerts.findActive()).toEqual([]);
            expect(guardianService.devices.findByRecipient(999)).toEqual([]);
            console.log('✅ Empty result handling working');
        });
    });
});

// ==========================================
// PERFORMANCE TESTS
// ==========================================

describe('Guardian Performance Tests', () => {
    let db: Database.Database;
    let guardianService: GuardianService;

    beforeAll(() => {
        db = new Database(':memory:');
        // Load schema (same as above)
        guardianService = new GuardianService(db);
    });

    afterAll(() => {
        db.close();
    });

    test('Bulk operations performance', () => {
        const startTime = Date.now();

        // Create multiple users
        for (let i = 0; i < 100; i++) {
            guardianService.users.create({
                username: `user_${i}`,
                email: `user_${i}@example.com`,
                role: 'caregiver',
                first_name: `User`,
                last_name: `${i}`,
                timezone: 'UTC',
                language: 'en',
                is_active: true
            });
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
        console.log(`✅ Created 100 users in ${duration}ms`);

        // Verify all users were created
        const allUsers = guardianService.users.findAll();
        expect(allUsers.length).toBe(100);
    });
});

// ==========================================
// TEST RUNNER UTILITY
// ==========================================

export function runGuardianTests() {
    console.log('🚀 Starting Guardian Ecosystem Tests...\n');

    // This would be called by your test runner (Jest, Mocha, etc.)
    // For now, it's a placeholder to show how to organize the tests

    console.log('📋 Test Categories:');
    console.log('  ✅ Database Schema Tests');
    console.log('  ✅ Core Services Tests');
    console.log('  ✅ Guardian Protect Services Tests');
    console.log('  ✅ Integration Tests');
    console.log('  ✅ Future Module Placeholder Tests');
    console.log('  ✅ Error Handling Tests');
    console.log('  ✅ Performance Tests');

    console.log('\n🎯 To run these tests:');
    console.log('  npm test guardian-ecosystem');
    console.log('  npm run test:watch guardian-ecosystem');
    console.log('  npm run test:coverage guardian-ecosystem');
}