describe('Simple Test', () => {
    it('should work', () => {
        expect(1 + 1).toBe(2);
    });

    it('should import date-fns (external dependency)', () => {
        const { format } = require('date-fns');
        expect(typeof format).toBe('function');
    });
});