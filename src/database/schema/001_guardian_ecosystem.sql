// ==========================================
// GUARDIAN DATABASE SETUP GUIDE
// ==========================================

// STEP 1: File Organization
// Place files in your existing src/database/ structure:

/*
src/database/
├── schema/
│   └── 001_guardian_ecosystem.sql    ← First artifact (SQL schema)
├── models/
│   └── index.ts                      ← Second artifact (TypeScript models)
├── services/
│   └── index.ts                      ← Third artifact (Services)
├── config/
│   └── connection.ts                 ← Fourth artifact (Database config)
├── migrations/                       ← Keep your existing
├── seeds/                           ← Keep your existing
└── backups/                         ← Keep your existing
*/

// ==========================================
// STEP 2: Install Required Dependencies
// ==========================================

/*
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3

# If you don't have these already:
npm install uuid
npm install --save-dev @types/uuid
*/

// ==========================================
// STEP 3: Automatic Database Setup
// ==========================================

// File: src/main/database-setup.ts
import { app } from 'electron';
import { initializeDatabase, getDatabaseManager } from '../database/config/connection';

export async function setupGuardianDatabase() {
  try {
    console.log('🚀 Initializing Guardian Database...');
    
    // This automatically:
    // 1. Creates the database file if it doesn't exist
    // 2. Runs the SQL schema from schema/001_guardian_ecosystem.sql
    // 3. Sets up indexes and views
    // 4. Inserts default settings
    // 5. Configures backups
    const dbManager = await initializeDatabase({
      // Optional custom config
      backup: {
        enabled: true,
        interval: 60, // backup every hour
        maxBackups: 24 // keep 24 backups
      }
    });

    console.log('✅ Guardian Database initialized successfully!');
    
    // Get the service layer for your app
    const guardianService = dbManager.getService();
    
    // Optional: Create a demo user and care recipient
    await createDemoData(guardianService);
    
    return { dbManager, guardianService };
    
  } catch (error) {
    console.error('❌ Failed to setup Guardian Database:', error);
    throw error;
  }
}

// Optional: Create some demo data for testing
async function createDemoData(guardianService: any) {
  try {
    // Check if demo data already exists
    const existingUsers = await guardianService.users.findAll({ limit: 1 });
    if (existingUsers.data.length > 0) {
      console.log('✅ Database already has data, skipping demo setup');
      return;
    }

    console.log('📝 Creating demo data...');

    // Create demo caregiver
    const caregiver = await guardianService.users.create({
      username: 'demo_caregiver',
      email: 'caregiver@guardian.demo',
      password_hash: 'demo_hash_123', // In real app, use proper hashing
      role: 'caregiver',
      first_name: 'Sarah',
      last_name: 'Johnson',
      phone: '(555) 123-4567',
      timezone: 'America/New_York',
      language: 'en',
      is_active: true
    });

    // Create demo care recipient
    const careRecipient = await guardianService.careRecipients.create({
      first_name: 'Robert',
      last_name: 'Smith',
      date_of_birth: '1945-03-15',
      gender: 'male',
      address: '123 Maple Street',
      city: 'Springfield',
      state: 'NY',
      zip_code: '12345',
      phone: '(555) 987-6543',
      emergency_contact_name: 'Mary Smith',
      emergency_contact_phone: '(555) 987-6544',
      primary_caregiver_id: caregiver.id,
      care_level: 'assisted',
      medical_conditions: ['Diabetes', 'Hypertension'],
      medications: ['Metformin', 'Lisinopril'],
      allergies: ['Penicillin'],
      is_active: true
    });

    // Create demo alert
    await guardianService.alerts.create({
      care_recipient_id: careRecipient.id,
      module: 'protect',
      alert_type: 'medication_reminder',
      severity: 'medium',
      title: 'Medication Reminder',
      description: 'Time for evening medication',
      triggered_at: new Date().toISOString(),
      status: 'active'
    });

    console.log('✅ Demo data created successfully!');
    console.log(`   - Caregiver: ${caregiver.first_name} ${caregiver.last_name}`);
    console.log(`   - Care Recipient: ${careRecipient.first_name} ${careRecipient.last_name}`);

  } catch (error) {
    console.error('❌ Failed to create demo data:', error);
  }
}

// ==========================================
// STEP 4: Integration with Electron Main Process
// ==========================================

// File: src/main/main.ts (update your existing main.ts)
import { app, BrowserWindow } from 'electron';
import { setupGuardianDatabase } from './database-setup';

let mainWindow: BrowserWindow;
let guardianService: any;

async function createWindow() {
  // Setup database FIRST
  const { dbManager, guardianService: service } = await setupGuardianDatabase();
  guardianService = service;

  // Create your Electron window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load your app
  mainWindow.loadFile('dist/index.html'); // or your build output
}

app.whenReady().then(createWindow);

// Cleanup on app quit
app.on('before-quit', async () => {
  console.log('🔄 Shutting down Guardian Database...');
  const { shutdownDatabase } = await import('../database/config/connection');
  await shutdownDatabase();
  console.log('✅ Guardian Database shutdown complete');
});

// ==========================================
// STEP 5: Using Guardian Services in Renderer
// ==========================================

// File: src/guardian-protect/services/database-bridge.ts
// Bridge to access database from renderer process

import { ipcRenderer } from 'electron';

export class GuardianDatabaseBridge {
  
  // Users
  async getUsers() {
    return ipcRenderer.invoke('guardian:users:findAll');
  }

  async createUser(userData: any) {
    return ipcRenderer.invoke('guardian:users:create', userData);
  }

  // Care Recipients
  async getCareRecipients() {
    return ipcRenderer.invoke('guardian:careRecipients:findAll');
  }

  async getCareRecipient(id: number) {
    return ipcRenderer.invoke('guardian:careRecipients:findById', id);
  }

  // Alerts
  async getActiveAlerts(careRecipientId?: number) {
    return ipcRenderer.invoke('guardian:alerts:findActive', careRecipientId);
  }

  async acknowledgeAlert(alertId: number, userId: number) {
    return ipcRenderer.invoke('guardian:alerts:acknowledge', alertId, userId);
  }

  // Safety Events (Guardian Protect)
  async createSafetyEvent(eventData: any) {
    return ipcRenderer.invoke('guardian:safetyEvents:create', eventData);
  }

  async getSafetyEvents(careRecipientId: number) {
    return ipcRenderer.invoke('guardian:safetyEvents:findByRecipient', careRecipientId);
  }

  // Dashboard Stats
  async getDashboardStats(careRecipientId?: number) {
    return ipcRenderer.invoke('guardian:dashboard:getStats', careRecipientId);
  }
}

// ==========================================
// STEP 6: IPC Handlers in Main Process
// ==========================================

// File: src/main/ipc-handlers.ts
import { ipcMain } from 'electron';
import { getGuardianService } from '../database/config/connection';

export function setupGuardianIPC() {
  const service = getGuardianService();

  // Users
  ipcMain.handle('guardian:users:findAll', async (event, pagination) => {
    return service.users.findAll(pagination);
  });

  ipcMain.handle('guardian:users:create', async (event, userData) => {
    return service.users.create(userData);
  });

  // Care Recipients
  ipcMain.handle('guardian:careRecipients:findAll', async (event, pagination) => {
    return service.careRecipients.findAll(pagination);
  });

  ipcMain.handle('guardian:careRecipients:findById', async (event, id) => {
    return service.careRecipients.findById(id);
  });

  // Alerts
  ipcMain.handle('guardian:alerts:findActive', async (event, careRecipientId) => {
    return service.alerts.findActive(careRecipientId);
  });

  ipcMain.handle('guardian:alerts:acknowledge', async (event, alertId, userId) => {
    return service.alerts.acknowledge(alertId, userId);
  });

  // Safety Events
  ipcMain.handle('guardian:safetyEvents:create', async (event, eventData) => {
    return service.safetyEvents.create(eventData);
  });

  ipcMain.handle('guardian:safetyEvents:findByRecipient', async (event, careRecipientId) => {
    return service.safetyEvents.findByRecipient(careRecipientId);
  });

  // Dashboard
  ipcMain.handle('guardian:dashboard:getStats', async (event, careRecipientId) => {
    return service.getDashboardStats(careRecipientId);
  });

  console.log('✅ Guardian IPC handlers registered');
}

// Call this in your main.ts after database setup
// setupGuardianIPC();

// ==========================================
// STEP 7: Using in Your React Components
// ==========================================

// File: src/guardian-protect/components/AlertsList.tsx
import React, { useState, useEffect } from 'react';
import { GuardianDatabaseBridge } from '../services/database-bridge';

const db = new GuardianDatabaseBridge();

export function AlertsList() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const activeAlerts = await db.getActiveAlerts();
      setAlerts(activeAlerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId: number) => {
    try {
      await db.acknowledgeAlert(alertId, 1); // Current user ID
      loadAlerts(); // Refresh list
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  if (loading) return <div>Loading alerts...</div>;

  return (
    <div className="alerts-list">
      <h3>Active Alerts</h3>
      {alerts.map((alert: any) => (
        <div key={alert.id} className={`alert alert-${alert.severity}`}>
          <h4>{alert.title}</h4>
          <p>{alert.description}</p>
          <button onClick={() => handleAcknowledge(alert.id)}>
            Acknowledge
          </button>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// QUICK START CHECKLIST
// ==========================================

/*
✅ STEP 1: Copy the 4 artifacts to your src/database/ structure
✅ STEP 2: Install dependencies (better-sqlite3)
✅ STEP 3: Update your main.ts to call setupGuardianDatabase()
✅ STEP 4: Add IPC handlers for database communication
✅ STEP 5: Create database bridge service for renderer
✅ STEP 6: Update your Guardian Protect components to use the bridge
✅ STEP 7: Test with your existing pages!

NO MANUAL SQL NEEDED! 
The DatabaseManager handles everything automatically.
*/