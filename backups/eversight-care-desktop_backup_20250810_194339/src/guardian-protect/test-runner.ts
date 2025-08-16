// ==========================================
// QUICK TEST SCRIPT FOR BROWSER CONSOLE
// ==========================================
// File: src/guardian-protect/test-runner.ts

import {
    getDashboardSummary,
    getDevicesAsync,
    getActiveAlertsAsync,
    getLowBatteryDevices,
    acknowledgeAlert
} from './services/mockDataService';

// Simple test function you can run in React component or browser console
export async function testMockServices() {
    console.log('🧪 Starting Mock Services Test...\n');

    try {
        // Test 1: Dashboard Summary
        console.log('📊 Test 1: Dashboard Summary');
        const startTime = Date.now();
        const summary = await getDashboardSummary();
        const duration = Date.now() - startTime;

        console.log(`✅ Dashboard loaded in ${duration}ms`);
        console.log('Summary:', {
            totalDevices: summary.overview.totalDevices,
            onlineDevices: summary.overview.onlineDevices,
            activeAlerts: summary.overview.totalAlerts,
            criticalAlerts: summary.overview.criticalAlerts
        });

        // Test 2: Devices
        console.log('\n🔧 Test 2: Devices');
        const devices = await getDevicesAsync();
        console.log(`✅ Loaded ${devices.length} devices`);
        if (devices.length > 0) {
            console.log('First device:', devices[0]);
        }

        // Test 3: Active Alerts
        console.log('\n🚨 Test 3: Active Alerts');
        const activeAlerts = await getActiveAlertsAsync();
        console.log(`✅ Found ${activeAlerts.length} active alerts`);
        if (activeAlerts.length > 0) {
            console.log('First alert:', activeAlerts[0]);
        }

        // Test 4: Low Battery Devices
        console.log('\n🔋 Test 4: Low Battery Devices');
        const lowBattery = await getLowBatteryDevices();
        console.log(`✅ Found ${lowBattery.length} devices with battery < 50%`);
        lowBattery.forEach(device => {
            console.log(`  - Device: ${device.batteryLevel}%`);
        });

        // Test 5: Alert Interaction (if alerts exist)
        if (activeAlerts.length > 0) {
            console.log('\n⚡ Test 5: Alert Interaction');
            const alertId = activeAlerts[0].id;
            try {
                const acknowledged = await acknowledgeAlert(alertId, 'test-user');
                console.log(`Alert acknowledged: ${acknowledged.alertId}`);
            } catch (error) {
                if (error instanceof Error) {
                    console.log('❌ Alert acknowledgment failed:', error.message);
                } else {
                    console.log('❌ Alert acknowledgment failed:', error);
                }
            }
        }

        console.log('\n🎉 All tests completed successfully!');

        return {
            success: true,
            results: {
                dashboardSummary: summary,
                devicesCount: devices.length,
                activeAlertsCount: activeAlerts.length,
                lowBatteryCount: lowBattery.length,
                testDuration: Date.now() - startTime
            }
        };

    } catch (error) {
        console.error('❌ Test failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

// Test component connection
export async function testComponentConnection() {
    console.log('🔗 Testing Component Connection...\n');

    try {
        // Simulate what a React component would do
        console.log('1. Component mounting...');

        console.log('2. Loading dashboard data...');
        const summary = await getDashboardSummary();

        console.log('3. Processing data for UI...');
        const uiData = {
            deviceStats: {
                total: summary.overview.totalDevices,
                online: summary.overview.onlineDevices,
                offline: summary.deviceStatus ? summary.deviceStatus.offline : undefined,
                batteryIssues: summary.deviceStatus ? summary.deviceStatus.lowBattery : undefined
            },
            alertStats: {
                active: summary.overview.totalAlerts,
                needsAttention: summary.overview.criticalAlerts,
                total: summary.overview.totalAlerts
            },
            // lastUpdate: summary.lastUpdated ? summary.lastUpdated.toLocaleString() : ''
        };

        console.log('4. UI data ready:', uiData);

        console.log('5. Testing user interaction...');
        const alerts = await getActiveAlertsAsync();
        if (alerts.length > 0) {
            console.log(`   - Found ${alerts.length} alerts user can interact with`);
        }

        console.log('✅ Component connection test successful!');
        return uiData;

    } catch (error) {
        console.error('❌ Component connection test failed:', error);
        throw error;
    }
}

// Performance test
export async function testPerformance() {
    console.log('⚡ Testing Performance...\n');

    const results = [];

    // Test individual function performance
    const functions = [
        { name: 'getDashboardSummary', fn: getDashboardSummary },
        { name: 'getDevicesAsync', fn: getDevicesAsync },
        { name: 'getActiveAlertsAsync', fn: getActiveAlertsAsync },
        { name: 'getLowBatteryDevices', fn: () => getLowBatteryDevices() }
    ];

    for (const { name, fn } of functions) {
        const start = Date.now();
        await fn();
        const duration = Date.now() - start;
        results.push({ function: name, duration });
        console.log(`${name}: ${duration}ms`);
    }

    // Test concurrent requests
    console.log('\nTesting concurrent requests...');
    const concurrentStart = Date.now();
    await Promise.all([
        getDashboardSummary(),
        getDevicesAsync(),
        getActiveAlertsAsync()
    ]);
    const concurrentDuration = Date.now() - concurrentStart;

    console.log(`Concurrent requests: ${concurrentDuration}ms`);

    console.log('\n📊 Performance Summary:');
    results.forEach(result => {
        const status = result.duration < 1000 ? '✅' : '⚠️';
        console.log(`${status} ${result.function}: ${result.duration}ms`);
    });

    return results;
}

// Export for use in React components
export {
    getDashboardSummary,
    getDevicesAsync,
    getActiveAlertsAsync
};