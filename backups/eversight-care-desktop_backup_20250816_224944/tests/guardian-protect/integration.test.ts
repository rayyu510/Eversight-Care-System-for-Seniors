/// <reference types="jest" />

import {
    getDashboardSummary,
    getDevicesAsync,
    getActiveAlertsAsync
} from '../../src/guardian-protect/services/mockDataService';

describe('Guardian Protect Integration', () => {
    test('should handle full dashboard workflow', async () => {
        // Test the complete flow a component would use
        const [summary, devices, alerts] = await Promise.all([
            getDashboardSummary(),
            getDevicesAsync(),
            getActiveAlertsAsync()
        ]);

        // Verify data consistency
        const totalDevices = summary.devices.online + summary.devices.offline + summary.devices.warning + summary.devices.lowBattery;
        expect(totalDevices).toBe(devices.length);
        expect(summary.alerts.active).toBe(alerts.length);

        console.log('✅ Integration test passed');
        console.log(`📊 ${devices.length} devices, ${alerts.length} active alerts`);
    });
});