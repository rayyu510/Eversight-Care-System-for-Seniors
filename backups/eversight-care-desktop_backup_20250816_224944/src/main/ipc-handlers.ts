import { ipcMain } from 'electron';
import { getGuardianService } from '../database/config';

export function setupGuardianIPC() {
  const service = getGuardianService();

  // Users
   ipcMain.handle('guardian:alerts:findActive', async (event, careRecipientId) => {
    return service.alerts.findActive(careRecipientId);
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