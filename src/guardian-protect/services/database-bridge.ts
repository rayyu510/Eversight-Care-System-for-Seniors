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
