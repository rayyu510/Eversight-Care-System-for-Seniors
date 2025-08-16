// ==========================================
// GUARDIAN ECOSYSTEM - DATABASE SERVICES
// ==========================================
// File: src/database/services/index.ts

import Database from 'better-sqlite3';

// Import types from the models
import type {
    User,
    CareRecipient,
    Alert,
    Device,
    SafetyEvent,
    SensorReading,
    EmergencyResponse,
    ActivityLog,
    HealthMetric,
    CareTask,
    Appointment
} from '../models';

// ==========================================
// BASE DATABASE SERVICE
// ==========================================

export abstract class BaseService {
    protected db: Database.Database;

    constructor(database: Database.Database) {
        this.db = database;
    }

    protected generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    protected transaction<T>(fn: () => T): T {
        const transaction = this.db.transaction(fn);
        return transaction();
    }
}

// ==========================================
// CORE SERVICES
// ==========================================

export class UserService extends BaseService {
    findById(id: number): User | null {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE id = ? AND is_active = true`);
        const result = stmt.get(id);
        return result as User || null;
    }

    findByEmail(email: string): User | null {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE email = ? AND is_active = true`);
        const result = stmt.get(email);
        return result as User || null;
    }

    create(userData: Omit<User, 'id' | 'uuid' | 'created_at' | 'updated_at'>): User {
        const uuid = this.generateUUID();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO users (uuid, username, email, password_hash, role, first_name, last_name, phone, timezone, language, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            uuid, userData.username, userData.email, 'temp_hash',
            userData.role, userData.first_name, userData.last_name,
            userData.phone, userData.timezone || 'UTC', userData.language || 'en', userData.is_active, now, now
        );

        const createdUser = this.findById(result.lastInsertRowid as number);
        if (!createdUser) {
            throw new Error('Failed to create user');
        }
        return createdUser;
    }

    findAll(): User[] {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE is_active = true ORDER BY first_name, last_name`);
        return stmt.all() as User[];
    }
}

export class CareRecipientService extends BaseService {
    findById(id: number): CareRecipient | null {
        const stmt = this.db.prepare(`SELECT * FROM care_recipients WHERE id = ? AND is_active = true`);
        const result = stmt.get(id);
        return result as CareRecipient || null;
    }

    create(data: Omit<CareRecipient, 'id' | 'uuid' | 'created_at' | 'updated_at'>): CareRecipient {
        const uuid = this.generateUUID();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO care_recipients (
                uuid, first_name, last_name, date_of_birth, gender, address, city, state,
                zip_code, phone, emergency_contact_name, emergency_contact_phone, 
                medical_record_number, primary_caregiver_id, care_level, mobility_status,
                cognitive_status, medical_conditions, medications, allergies, 
                dietary_restrictions, is_active, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            uuid, data.first_name, data.last_name, data.date_of_birth, data.gender,
            data.address, data.city, data.state, data.zip_code, data.phone,
            data.emergency_contact_name, data.emergency_contact_phone,
            data.medical_record_number, data.primary_caregiver_id, data.care_level,
            data.mobility_status, data.cognitive_status,
            JSON.stringify(data.medical_conditions || []),
            JSON.stringify(data.medications || []),
            JSON.stringify(data.allergies || []),
            JSON.stringify(data.dietary_restrictions || []),
            data.is_active, now, now
        );

        const created = this.findById(result.lastInsertRowid as number);
        if (!created) {
            throw new Error('Failed to create care recipient');
        }
        return created;
    }

    findByCaregiver(caregiverId: number): CareRecipient[] {
        const stmt = this.db.prepare(`
            SELECT * FROM care_recipients 
            WHERE primary_caregiver_id = ? AND is_active = true
            ORDER BY first_name, last_name
        `);
        return stmt.all(caregiverId) as CareRecipient[];
    }

    findAll(): CareRecipient[] {
        const stmt = this.db.prepare(`SELECT * FROM care_recipients WHERE is_active = true ORDER BY first_name, last_name`);
        return stmt.all() as CareRecipient[];
    }

    getActiveCount(): number {
        const stmt = this.db.prepare(`SELECT COUNT(*) as count FROM care_recipients WHERE is_active = true`);
        const result = stmt.get() as { count: number };
        return result.count;
    }
}

export class AlertService extends BaseService {
    create(alertData: Omit<Alert, 'id' | 'uuid' | 'created_at'>): Alert {
        const uuid = this.generateUUID();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO alerts (uuid, care_recipient_id, module, alert_type, severity, title, description, data, location, triggered_at, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            uuid, alertData.care_recipient_id, alertData.module, alertData.alert_type,
            alertData.severity, alertData.title, alertData.description,
            JSON.stringify(alertData.data || {}), alertData.location,
            alertData.triggered_at, alertData.status, now
        );

        const created = this.findById(result.lastInsertRowid as number);
        if (!created) {
            throw new Error('Failed to create alert');
        }
        return created;
    }

    findById(id: number): Alert | null {
        const stmt = this.db.prepare(`
            SELECT a.*, cr.first_name || ' ' || cr.last_name as recipient_name
            FROM alerts a
            JOIN care_recipients cr ON a.care_recipient_id = cr.id
            WHERE a.id = ?
        `);
        const result = stmt.get(id);
        return result as Alert || null;
    }

    findActive(careRecipientId?: number, module?: string): Alert[] {
        let query = `
            SELECT a.*, cr.first_name || ' ' || cr.last_name as recipient_name
            FROM alerts a
            JOIN care_recipients cr ON a.care_recipient_id = cr.id
            WHERE a.status = 'active'
        `;

        const params: any[] = [];
        if (careRecipientId) {
            query += ` AND a.care_recipient_id = ?`;
            params.push(careRecipientId);
        }
        if (module) {
            query += ` AND a.module = ?`;
            params.push(module);
        }

        query += ` ORDER BY a.severity DESC, a.triggered_at DESC`;

        const stmt = this.db.prepare(query);
        return stmt.all(params) as Alert[];
    }

    acknowledge(id: number, userId: number): Alert | null {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            UPDATE alerts SET status = 'acknowledged', acknowledged_at = ?, acknowledged_by = ? WHERE id = ?
        `);
        stmt.run(now, userId, id);
        return this.findById(id);
    }

    resolve(id: number, userId: number): Alert | null {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            UPDATE alerts SET status = 'resolved', resolved_at = ?, resolved_by = ? WHERE id = ?
        `);
        stmt.run(now, userId, id);
        return this.findById(id);
    }

    getStatsByModule(): Record<string, number> {
        const stmt = this.db.prepare(`
            SELECT module, COUNT(*) as count FROM alerts WHERE status = 'active' GROUP BY module
        `);
        const results = stmt.all() as Array<{ module: string; count: number }>;
        return results.reduce((acc, { module, count }) => {
            acc[module] = count;
            return acc;
        }, {} as Record<string, number>);
    }
}

export class DeviceService extends BaseService {
    create(deviceData: Omit<Device, 'id' | 'uuid' | 'created_at' | 'updated_at'>): Device {
        const uuid = this.generateUUID();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO devices (uuid, care_recipient_id, device_type, device_model, device_name, location, room, battery_level, signal_strength, firmware_version, last_heartbeat, configuration, is_active, installed_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            uuid, deviceData.care_recipient_id, deviceData.device_type, deviceData.device_model, deviceData.device_name,
            deviceData.location, deviceData.room, deviceData.battery_level, deviceData.signal_strength,
            deviceData.firmware_version, deviceData.last_heartbeat, JSON.stringify(deviceData.configuration || {}),
            deviceData.is_active, deviceData.installed_at || now, now, now
        );

        const created = this.findById(result.lastInsertRowid as number);
        if (!created) {
            throw new Error('Failed to create device');
        }
        return created;
    }

    findById(id: number): Device | null {
        const stmt = this.db.prepare(`SELECT * FROM devices WHERE id = ?`);
        const result = stmt.get(id);
        return result as Device || null;
    }

    findByRecipient(careRecipientId: number): Device[] {
        const stmt = this.db.prepare(`
            SELECT * FROM devices WHERE care_recipient_id = ? AND is_active = true ORDER BY device_name
        `);
        return stmt.all(careRecipientId) as Device[];
    }

    updateHeartbeat(deviceId: number): void {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`UPDATE devices SET last_heartbeat = ?, updated_at = ? WHERE id = ?`);
        stmt.run(now, now, deviceId);
    }

    updateBattery(deviceId: number, batteryLevel: number): void {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`UPDATE devices SET battery_level = ?, updated_at = ? WHERE id = ?`);
        stmt.run(batteryLevel, now, deviceId);
    }
}

// ==========================================
// GUARDIAN PROTECT SERVICES
// ==========================================

export class SafetyEventService extends BaseService {
    create(eventData: Omit<SafetyEvent, 'id' | 'uuid' | 'created_at'>): SafetyEvent {
        const uuid = this.generateUUID();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO safety_events (
                uuid, care_recipient_id, device_id, event_type, severity, location, room, 
                description, sensor_data, image_url, video_url, response_time, responded_by, 
                resolution_notes, occurred_at, resolved_at, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            uuid, eventData.care_recipient_id, eventData.device_id, eventData.event_type,
            eventData.severity, eventData.location, eventData.room, eventData.description,
            JSON.stringify(eventData.sensor_data || {}), eventData.image_url, eventData.video_url,
            eventData.response_time, eventData.responded_by, eventData.resolution_notes,
            eventData.occurred_at, eventData.resolved_at, eventData.status, now
        );

        const created = this.findById(result.lastInsertRowid as number);
        if (!created) {
            throw new Error('Failed to create safety event');
        }
        return created;
    }

    findById(id: number): SafetyEvent | null {
        const stmt = this.db.prepare(`
            SELECT se.*, cr.first_name || ' ' || cr.last_name as recipient_name, d.device_name
            FROM safety_events se
            JOIN care_recipients cr ON se.care_recipient_id = cr.id
            LEFT JOIN devices d ON se.device_id = d.id
            WHERE se.id = ?
        `);
        const result = stmt.get(id);
        return result as SafetyEvent || null;
    }

    findByRecipient(careRecipientId: number, limit: number = 50): SafetyEvent[] {
        const stmt = this.db.prepare(`
            SELECT se.*, d.device_name FROM safety_events se
            LEFT JOIN devices d ON se.device_id = d.id
            WHERE se.care_recipient_id = ? ORDER BY se.occurred_at DESC LIMIT ?
        `);
        return stmt.all(careRecipientId, limit) as SafetyEvent[];
    }

    findRecent(limit: number = 20): SafetyEvent[] {
        const stmt = this.db.prepare(`
            SELECT se.*, cr.first_name || ' ' || cr.last_name as recipient_name, d.device_name
            FROM safety_events se
            JOIN care_recipients cr ON se.care_recipient_id = cr.id
            LEFT JOIN devices d ON se.device_id = d.id
            ORDER BY se.occurred_at DESC LIMIT ?
        `);
        return stmt.all(limit) as SafetyEvent[];
    }

    markResolved(id: number, userId: number, notes?: string): SafetyEvent | null {
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            UPDATE safety_events SET status = 'resolved', resolved_at = ?, responded_by = ?, resolution_notes = ? WHERE id = ?
        `);
        stmt.run(now, userId, notes, id);
        return this.findById(id);
    }
}

export class SensorReadingService extends BaseService {
    create(readingData: Omit<SensorReading, 'id' | 'created_at'>): SensorReading {
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO sensor_readings (device_id, care_recipient_id, sensor_type, value, unit, location, room, metadata, recorded_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            readingData.device_id, readingData.care_recipient_id, readingData.sensor_type,
            readingData.value, readingData.unit, readingData.location, readingData.room,
            JSON.stringify(readingData.metadata || {}), readingData.recorded_at, now
        );

        const created = this.findById(result.lastInsertRowid as number);
        if (!created) {
            throw new Error('Failed to create sensor reading');
        }
        return created;
    }

    findById(id: number): SensorReading | null {
        const stmt = this.db.prepare(`SELECT * FROM sensor_readings WHERE id = ?`);
        const result = stmt.get(id);
        return result as SensorReading || null;
    }

    getLatestReadings(deviceId: number, sensorType: string, limit: number = 100): SensorReading[] {
        const stmt = this.db.prepare(`
            SELECT * FROM sensor_readings WHERE device_id = ? AND sensor_type = ? ORDER BY recorded_at DESC LIMIT ?
        `);
        return stmt.all(deviceId, sensorType, limit) as SensorReading[];
    }

    getRecentReadings(careRecipientId: number, hours: number = 24): SensorReading[] {
        const stmt = this.db.prepare(`
            SELECT sr.*, d.device_name FROM sensor_readings sr
            JOIN devices d ON sr.device_id = d.id
            WHERE sr.care_recipient_id = ? AND sr.recorded_at >= datetime('now', '-${hours} hours')
            ORDER BY sr.recorded_at DESC
        `);
        return stmt.all(careRecipientId) as SensorReading[];
    }
}

export class EmergencyResponseService extends BaseService {
    create(responseData: Omit<EmergencyResponse, 'id' | 'created_at'>): EmergencyResponse {
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO emergency_responses (
                care_recipient_id, response_type, priority_order, contact_type, contact_name, 
                contact_phone, contact_email, response_instructions, is_active, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            responseData.care_recipient_id, responseData.response_type, responseData.priority_order,
            responseData.contact_type, responseData.contact_name, responseData.contact_phone,
            responseData.contact_email, responseData.response_instructions, responseData.is_active, now
        );

        const created = this.findById(result.lastInsertRowid as number);
        if (!created) {
            throw new Error('Failed to create emergency response');
        }
        return created;
    }

    findById(id: number): EmergencyResponse | null {
        const stmt = this.db.prepare(`SELECT * FROM emergency_responses WHERE id = ?`);
        const result = stmt.get(id);
        return result as EmergencyResponse || null;
    }

    findByRecipient(careRecipientId: number): EmergencyResponse[] {
        const stmt = this.db.prepare(`
            SELECT * FROM emergency_responses WHERE care_recipient_id = ? AND is_active = true ORDER BY priority_order ASC
        `);
        return stmt.all(careRecipientId) as EmergencyResponse[];
    }

    findByResponseType(careRecipientId: number, responseType: string): EmergencyResponse[] {
        const stmt = this.db.prepare(`
            SELECT * FROM emergency_responses 
            WHERE care_recipient_id = ? AND response_type = ? AND is_active = true 
            ORDER BY priority_order ASC
        `);
        return stmt.all(careRecipientId, responseType) as EmergencyResponse[];
    }
}

// ==========================================
// PLACEHOLDER SERVICES (FUTURE MODULES)
// ==========================================

export class ActivityLogService extends BaseService {
    findByRecipient(careRecipientId: number): ActivityLog[] {
        return [];
    }
}

export class HealthMetricService extends BaseService {
    findByRecipient(careRecipientId: number): HealthMetric[] {
        return [];
    }
}

export class CareTaskService extends BaseService {
    findByRecipient(careRecipientId: number): CareTask[] {
        return [];
    }

    getTodaysTasks(careRecipientId?: number): CareTask[] {
        return [];
    }
}

export class AppointmentService extends BaseService {
    findUpcoming(careRecipientId?: number, days: number = 7): Appointment[] {
        return [];
    }
}

// ==========================================
// UNIFIED GUARDIAN SERVICE
// ==========================================

export class GuardianService {
    public users: UserService;
    public careRecipients: CareRecipientService;
    public alerts: AlertService;
    public devices: DeviceService;
    public safetyEvents: SafetyEventService;
    public sensorReadings: SensorReadingService;
    public emergencyResponses: EmergencyResponseService;
    public activityLogs: ActivityLogService;
    public healthMetrics: HealthMetricService;
    public careTasks: CareTaskService;
    public appointments: AppointmentService;

    constructor(database: Database.Database) {
        this.users = new UserService(database);
        this.careRecipients = new CareRecipientService(database);
        this.alerts = new AlertService(database);
        this.devices = new DeviceService(database);
        this.safetyEvents = new SafetyEventService(database);
        this.sensorReadings = new SensorReadingService(database);
        this.emergencyResponses = new EmergencyResponseService(database);
        this.activityLogs = new ActivityLogService(database);
        this.healthMetrics = new HealthMetricService(database);
        this.careTasks = new CareTaskService(database);
        this.appointments = new AppointmentService(database);
    }

    getProtectDashboard(careRecipientId?: number): any {
        const stats = {
            activeAlerts: 0,
            recentSafetyEvents: 0,
            devicesOnline: 0,
            totalDevices: 0,
            batteryWarnings: 0,
            responseTime: 0
        };

        const activeAlerts = this.alerts.findActive(careRecipientId, 'protect');
        stats.activeAlerts = activeAlerts.length;

        const recentEvents = careRecipientId
            ? this.safetyEvents.findByRecipient(careRecipientId, 100)
            : this.safetyEvents.findRecent(100);

        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        stats.recentSafetyEvents = recentEvents.filter(event =>
            new Date(event.occurred_at) >= last24Hours
        ).length;

        if (careRecipientId) {
            const devices = this.devices.findByRecipient(careRecipientId);
            stats.totalDevices = devices.length;
            stats.devicesOnline = devices.filter(d => {
                if (!d.last_heartbeat) return false;
                const lastHeartbeat = new Date(d.last_heartbeat);
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                return lastHeartbeat >= fiveMinutesAgo;
            }).length;

            stats.batteryWarnings = devices.filter(d =>
                d.battery_level !== undefined && d.battery_level < 20
            ).length;
        }

        const resolvedEvents = recentEvents.filter(event =>
            event.status === 'resolved' && event.response_time
        );

        if (resolvedEvents.length > 0) {
            const totalResponseTime = resolvedEvents.reduce((sum, event) =>
                sum + (event.response_time || 0), 0
            );
            stats.responseTime = Math.round(totalResponseTime / resolvedEvents.length / 60);
        }

        return stats;
    }

    getDashboardStats(careRecipientId?: number): any {
        const stats = {
            totalCareRecipients: 0,
            activeAlerts: 0,
            protect: this.getProtectDashboard(careRecipientId),
            insight: { recentActivities: 0, healthAlerts: 0 },
            carePro: { todaysTasks: 0, overdueTasks: 0 },
            careTrack: { upcomingAppointments: 0, unreadMessages: 0 }
        };

        if (!careRecipientId) {
            stats.totalCareRecipients = this.careRecipients.getActiveCount();
        }

        const activeAlerts = this.alerts.findActive(careRecipientId);
        stats.activeAlerts = activeAlerts.length;

        const todaysTasks = this.careTasks.getTodaysTasks(careRecipientId);
        stats.carePro.todaysTasks = todaysTasks.length;

        const upcomingAppointments = this.appointments.findUpcoming(careRecipientId, 7);
        stats.careTrack.upcomingAppointments = upcomingAppointments.length;

        return stats;
    }

    createSafetyAlert(safetyEvent: SafetyEvent): Alert {
        return this.alerts.create({
            care_recipient_id: safetyEvent.care_recipient_id,
            module: 'protect',
            alert_type: safetyEvent.event_type,
            severity: safetyEvent.severity,
            title: `${safetyEvent.event_type.replace('_', ' ').toUpperCase()} Alert`,
            description: safetyEvent.description || `${safetyEvent.event_type} detected`,
            data: {
                safety_event_id: safetyEvent.id,
                location: safetyEvent.location,
                room: safetyEvent.room
            },
            location: safetyEvent.location,
            triggered_at: safetyEvent.occurred_at,
            status: 'active'
        });
    }

    getAvailableModules(): string[] {
        return ['protect'];
    }

    isModuleAvailable(module: string): boolean {
        return this.getAvailableModules().includes(module);
    }
}