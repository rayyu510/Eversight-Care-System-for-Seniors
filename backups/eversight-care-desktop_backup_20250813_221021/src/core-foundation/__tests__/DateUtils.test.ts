import { DateUtils } from '../utils/date.utils';

describe('DateUtils', () => {
    describe('formatDisplay', () => {
        it('should format date correctly', () => {
            const date = new Date('2024-01-15T10:30:00Z');
            const formatted = DateUtils.formatDisplay(date);

            expect(typeof formatted).toBe('string');
            expect(formatted).not.toBe('Invalid Date');
        });

        it('should handle invalid date', () => {
            const result = DateUtils.formatDisplay('invalid-date');
            expect(result).toBe('Invalid Date');
        });
    });

    describe('getAge', () => {
        it('should calculate age correctly', () => {
            const birthDate = new Date('1990-01-01');
            const age = DateUtils.getAge(birthDate);

            expect(age).toBeGreaterThan(30);
            expect(age).toBeLessThan(100);
        });
    });

    describe('isToday', () => {
        it('should return true for today', () => {
            const today = new Date();
            expect(DateUtils.isToday(today)).toBe(true);
        });

        it('should return false for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(DateUtils.isToday(yesterday)).toBe(false);
        });
    });

    describe('getRelativeTime', () => {
        it('should return "Just now" for current time', () => {
            const now = new Date();
            const result = DateUtils.getRelativeTime(now);
            expect(result).toBe('Just now');
        });

        it('should return minutes ago for recent time', () => {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const result = DateUtils.getRelativeTime(fiveMinutesAgo);
            expect(result).toMatch(/\d+ minutes? ago/);
        });
    });

    describe('startOfDay', () => {
        it('should return start of day', () => {
            const date = new Date('2024-01-15T15:30:45Z');
            const startOfDay = DateUtils.startOfDay(date);

            expect(startOfDay.getHours()).toBe(0);
            expect(startOfDay.getMinutes()).toBe(0);
            expect(startOfDay.getSeconds()).toBe(0);
            expect(startOfDay.getMilliseconds()).toBe(0);
        });
    });
});