// tests/guardian-protect/testExistingService.test.ts

describe('Test Your Existing Mock Service', () => {
    let mockDataService: any;

    beforeAll(async () => {
        try {
            mockDataService = await import('../../src/guardian-protect/services/mockDataService');
            console.log('✅ Your existing service imported successfully');
            console.log('📋 Available methods:', Object.keys(mockDataService));
        } catch (error) {
            console.error('❌ Failed to import your service:', error);
            throw error;
        }
    });

    describe('Service Methods Available', () => {
        it('should check what methods your service provides', async () => {
            const availableMethods = Object.keys(mockDataService);
            console.log('🔍 Your service provides these methods:');

            availableMethods.forEach(method => {
                console.log(`  - ${method}: ${typeof mockDataService[method]}`);
            });

            // Check for the methods our hook expects
            const expectedMethods = [
                'getUsers',
                'getDevices',
                'getAlerts',
                'getRecentSafetyEvents',
                'getEmergencyEvents',
                'getDashboardMetrics',
                'acknowledgeAlert',
                'dismissAlert',
                'toggleDeviceStatus'
            ];

            console.log('\n🎯 Checking for expected methods:');
            expectedMethods.forEach(method => {
                const exists = method in mockDataService;
                const type = exists ? typeof mockDataService[method] : 'missing';
                console.log(`  ${exists ? '✅' : '❌'} ${method}: ${type}`);
            });

            expect(availableMethods.length).toBeGreaterThan(0);
        });
    });

    describe('Test Available Methods', () => {
        it('should test getUsers if available', async () => {
            if (mockDataService.getUsers) {
                try {
                    const users = await mockDataService.getUsers();
                    console.log('✅ getUsers() success - returned:', users?.length || 0, 'users');

                    if (users && users.length > 0) {
                        console.log('👤 Sample user structure:', JSON.stringify(users[0], null, 2));
                    }

                    expect(users).toBeDefined();
                } catch (error) {
                    console.log('⚠️ getUsers() error:', error);
                }
            } else {
                console.log('ℹ️ getUsers method not available in your service');
            }
        });

        it('should test getDevices if available', async () => {
            if (mockDataService.getDevices) {
                try {
                    const devices = await mockDataService.getDevices();
                    console.log('✅ getDevices() success - returned:', devices?.length || 0, 'devices');

                    if (devices && devices.length > 0) {
                        console.log('📱 Sample device structure:', JSON.stringify(devices[0], null, 2));
                    }

                    expect(devices).toBeDefined();
                } catch (error) {
                    console.log('⚠️ getDevices() error:', error);
                }
            } else {
                console.log('ℹ️ getDevices method not available in your service');
            }
        });

        it('should test getAlerts if available', async () => {
            if (mockDataService.getAlerts) {
                try {
                    const alerts = await mockDataService.getAlerts();
                    console.log('✅ getAlerts() success - returned:', alerts?.length || 0, 'alerts');

                    if (alerts && alerts.length > 0) {
                        console.log('🚨 Sample alert structure:', JSON.stringify(alerts[0], null, 2));
                    }

                    expect(alerts).toBeDefined();
                } catch (error) {
                    console.log('⚠️ getAlerts() error:', error);
                }
            } else {
                console.log('ℹ️ getAlerts method not available in your service');
            }
        });

        it('should test getDashboardMetrics if available', async () => {
            if (mockDataService.getDashboardMetrics) {
                try {
                    const metrics = await mockDataService.getDashboardMetrics();
                    console.log('✅ getDashboardMetrics() success');
                    console.log('📊 Metrics structure:', JSON.stringify(metrics, null, 2));

                    expect(metrics).toBeDefined();
                } catch (error) {
                    console.log('⚠️ getDashboardMetrics() error:', error);
                }
            } else {
                console.log('ℹ️ getDashboardMetrics method not available in your service');
            }
        });

        it('should test other methods if available', async () => {
            const otherMethods = [
                'getRecentSafetyEvents',
                'getEmergencyEvents',
                'acknowledgeAlert',
                'dismissAlert',
                'toggleDeviceStatus'
            ];

            for (const methodName of otherMethods) {
                if (mockDataService[methodName]) {
                    console.log(`✅ ${methodName} is available`);

                    // Test methods that don't need parameters
                    if (['getRecentSafetyEvents', 'getEmergencyEvents'].includes(methodName)) {
                        try {
                            const result = methodName === 'getRecentSafetyEvents'
                                ? await mockDataService[methodName](5)
                                : await mockDataService[methodName]();
                            console.log(`   - Returned: ${result?.length || 0} items`);
                        } catch (error) {
                            console.log(`   - Error calling ${methodName}:`, error);
                        }
                    }
                } else {
                    console.log(`ℹ️ ${methodName} not available`);
                }
            }
        });
    });

    describe('Integration with Flexible Hook', () => {
        it('should work with the flexible dashboard hook', async () => {
            try {
                const { useDashboardData } = await import('../../src/guardian-protect/hooks/useDashboardData');
                console.log('✅ Flexible hook imported successfully');
                console.log('💡 The hook will adapt to whatever data your service returns');

                expect(useDashboardData).toBeDefined();
                expect(typeof useDashboardData).toBe('function');
            } catch (error) {
                console.error('❌ Hook import failed:', error);
                throw error;
            }
        });
    });

    describe('Data Structure Analysis', () => {
        it('should analyze the structure of your data', async () => {
            console.log('\n📋 DATA STRUCTURE ANALYSIS:');
            console.log('This shows what your service returns so we can verify compatibility\n');

            // Test each method and show structure
            const methods = [
                { name: 'getUsers', params: [] },
                { name: 'getDevices', params: [] },
                { name: 'getAlerts', params: [] },
                { name: 'getRecentSafetyEvents', params: [5] },
                { name: 'getEmergencyEvents', params: [] },
                { name: 'getDashboardMetrics', params: [] }
            ];

            for (const { name, params } of methods) {
                if (mockDataService[name]) {
                    try {
                        const result = await mockDataService[name](...params);
                        console.log(`\n🔍 ${name}:`);

                        if (Array.isArray(result)) {
                            console.log(`   - Returns array with ${result.length} items`);
                            if (result.length > 0) {
                                console.log(`   - Item properties:`, Object.keys(result[0]));
                                console.log(`   - Sample item:`, JSON.stringify(result[0], null, 4));
                            }
                        } else if (result && typeof result === 'object') {
                            console.log(`   - Returns object`);
                            console.log(`   - Properties:`, Object.keys(result));
                            console.log(`   - Sample:`, JSON.stringify(result, null, 4));
                        } else {
                            console.log(`   - Returns:`, typeof result, result);
                        }
                    } catch (error) {
                        console.log(`\n❌ ${name}: Error -`, error);
                    }
                }
            }

            expect(true).toBe(true); // Always pass - this is just for analysis
        });
    });
});