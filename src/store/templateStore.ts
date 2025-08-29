import { create } from 'zustand';

interface Template {
    facility: {
        name: string;
        units: string[];
        cameraCount: number;
    };
    widgets: Array<{
        id: string;
        type: string;
        enabled: boolean;
        position: { x: number; y: number; w: number; h: number };
        settings: any;
    }>;
    alertRules: Array<{
        type: string;
        threshold: string;
        priority: string;
        notify: string[];
    }>;
}

interface TemplateStore {
    selectedTemplate: Template;
    updateTemplate: (template: Template) => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
    selectedTemplate: {
        facility: {
            name: 'Sunrise Senior Living',
            units: ['Assisted Living', 'Memory Care', 'Rehab'],
            cameraCount: 100,
        },
        widgets: [
            {
                id: 'criticalAlerts',
                type: 'CriticalAlerts',
                enabled: true,
                position: { x: 0, y: 0, w: 3, h: 2 },
                settings: { alertTypes: ['falls', 'wandering', 'medicationErrors'], videoIntegration: true },
            },
            {
                id: 'videoMonitoring',
                type: 'VideoMonitoring',
                enabled: true,
                position: { x: 3, y: 0, w: 3, h: 2 },
                settings: {
                    defaultFeeds: ['commonArea1', 'memoryCareHall1'],
                    privacy: { residentRooms: 'restricted', roles: ['nurse', 'manager'] },
                },
            },
            {
                id: 'residentHealth',
                type: 'ResidentHealth',
                enabled: true,
                position: { x: 0, y: 2, w: 2, h: 2 },
                settings: { metrics: ['incidents', 'therapyAttendance', 'infectionCases'] },
            },
            {
                id: 'staffingStatus',
                type: 'StaffingStatus',
                enabled: true,
                position: { x: 2, y: 2, w: 2, h: 2 },
                settings: { targetRatio: '1:6', showCertifications: true, showShortages: true },
            },
            {
                id: 'operations',
                type: 'Operations',
                enabled: true,
                position: { x: 4, y: 2, w: 2, h: 2 },
                settings: { showMaintenance: true, showHousekeeping: true, showCameraIssues: true },
            },
            {
                id: 'compliance',
                type: 'Compliance',
                enabled: true,
                position: { x: 0, y: 4, w: 2, h: 2 },
                settings: { showDocumentation: true, showPendingReports: true, showVideoAccessLogs: true },
            },
            {
                id: 'financialSnapshot',
                type: 'FinancialSnapshot',
                enabled: true,
                position: { x: 2, y: 4, w: 2, h: 2 },
                settings: { showRevenue: true, showBillingIssues: true },
            },
        ],
        alertRules: [
            { type: 'fall', threshold: 'residentOnFloor > 30s', priority: 'high', notify: ['nurse', 'manager'] },
            { type: 'wandering', threshold: 'motion > 5min', priority: 'medium', notify: ['nurse'] },
        ],
    },
    updateTemplate: (template) => set({ selectedTemplate: template }),
}));