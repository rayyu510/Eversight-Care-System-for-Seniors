// src/shared/services/__tests__/guardianProtectService.test.ts
import { guardianProtectService } from '../moduleServices';

describe('GuardianProtectService', () => {
    test('should fetch devices successfully', async () => {
        const devices = await guardianProtectService.getDevices();
        expect(devices).toBeDefined();
        expect(Array.isArray(devices)).toBe(true);
        expect(devices.length).toBeGreaterThan(0);
    });

    test('should fetch alerts successfully', async () => {
        const alerts = await guardianProtectService.getAlerts();
        expect(alerts).toBeDefined();
        expect(Array.isArray(alerts)).toBe(true);
    });
});