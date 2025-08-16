// src/core-foundation/utils/date.utils.ts - DEBUGGED AND FIXED

import { format, parse, isValid, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

// Define DATE_FORMATS locally to avoid import issues
export const DATE_FORMATS = {
    DISPLAY: 'MM/dd/yyyy',
    DISPLAY_WITH_TIME: 'MM/dd/yyyy HH:mm',
    API: 'yyyy-MM-dd',
    API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
    TIME_ONLY: 'HH:mm',
    MONTH_YEAR: 'MM/yyyy'
};

export class DateUtils {
    /**
     * Format date for display
     */
    static formatDisplay(date: Date | string): string {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return 'Invalid Date';
            return format(dateObj, DATE_FORMATS.DISPLAY);
        } catch (error) {
            console.error('Error in formatDisplay:', error);
            return 'Invalid Date';
        }
    }

    /**
     * Format date with time for display
     */
    static formatDisplayWithTime(date: Date | string): string {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return 'Invalid Date';
            return format(dateObj, DATE_FORMATS.DISPLAY_WITH_TIME);
        } catch (error) {
            console.error('Error in formatDisplayWithTime:', error);
            return 'Invalid Date';
        }
    }

    /**
     * Format date for API
     */
    static formatForAPI(date: Date | string): string {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) throw new Error('Invalid date provided');
            return format(dateObj, DATE_FORMATS.API_WITH_TIME);
        } catch (error) {
            console.error('Error in formatForAPI:', error);
            throw new Error('Invalid date provided');
        }
    }

    /**
     * Parse date from string
     */
    static parseDate(dateString: string, dateFormat?: string): Date | null {
        try {
            if (!dateString) return null;

            const formatToUse = dateFormat || DATE_FORMATS.DISPLAY;
            const parsed = parse(dateString, formatToUse, new Date());
            return isValid(parsed) ? parsed : null;
        } catch (error) {
            console.error('Error in parseDate:', error);
            return null;
        }
    }

    /**
     * Get relative time description
     */
    static getRelativeTime(date: Date | string): string {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return 'Invalid Date';

            const now = new Date();
            const days = differenceInDays(now, dateObj);
            const hours = differenceInHours(now, dateObj);
            const minutes = differenceInMinutes(now, dateObj);

            if (days > 7) return DateUtils.formatDisplay(dateObj);
            if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
            if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
            if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
            return 'Just now';
        } catch (error) {
            console.error('Error in getRelativeTime:', error);
            return 'Unknown time';
        }
    }

    /**
     * Check if date is within business hours
     */
    static isWithinBusinessHours(date: Date | string, businessHours: { start: string; end: string }): boolean {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return false;

            const timeString = format(dateObj, 'HH:mm');
            return timeString >= businessHours.start && timeString <= businessHours.end;
        } catch (error) {
            console.error('Error in isWithinBusinessHours:', error);
            return false;
        }
    }

    /**
     * Get age from date of birth
     */
    static getAge(dateOfBirth: Date | string): number {
        try {
            const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
            if (!isValid(dob)) return 0;

            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            return Math.max(0, age); // Ensure non-negative age
        } catch (error) {
            console.error('Error in getAge:', error);
            return 0;
        }
    }

    /**
     * Check if date is today
     */
    static isToday(date: Date | string): boolean {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return false;

            const today = new Date();
            return dateObj.toDateString() === today.toDateString();
        } catch (error) {
            console.error('Error in isToday:', error);
            return false;
        }
    }

    /**
     * Get start of day
     */
    static startOfDay(date: Date | string): Date {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return new Date();

            return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        } catch (error) {
            console.error('Error in startOfDay:', error);
            return new Date();
        }
    }

    /**
     * Get end of day
     */
    static endOfDay(date: Date | string): Date {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return new Date();

            return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59, 999);
        } catch (error) {
            console.error('Error in endOfDay:', error);
            return new Date();
        }
    }

    /**
     * Check if date is within range
     */
    static isWithinRange(date: Date | string, startDate: Date | string, endDate: Date | string): boolean {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
            const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

            if (!isValid(dateObj) || !isValid(start) || !isValid(end)) return false;

            return dateObj >= start && dateObj <= end;
        } catch (error) {
            console.error('Error in isWithinRange:', error);
            return false;
        }
    }

    /**
     * Add days to date
     */
    static addDays(date: Date | string, days: number): Date {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return new Date();

            const result = new Date(dateObj);
            result.setDate(result.getDate() + days);
            return result;
        } catch (error) {
            console.error('Error in addDays:', error);
            return new Date();
        }
    }

    /**
     * Subtract days from date
     */
    static subtractDays(date: Date | string, days: number): Date {
        return DateUtils.addDays(date, -days);
    }

    /**
     * Get difference in days between two dates
     */
    static getDaysDifference(date1: Date | string, date2: Date | string): number {
        try {
            const dateObj1 = typeof date1 === 'string' ? new Date(date1) : date1;
            const dateObj2 = typeof date2 === 'string' ? new Date(date2) : date2;

            if (!isValid(dateObj1) || !isValid(dateObj2)) return 0;

            return differenceInDays(dateObj2, dateObj1);
        } catch (error) {
            console.error('Error in getDaysDifference:', error);
            return 0;
        }
    }

    /**
     * Format duration in human readable format
     */
    static formatDuration(milliseconds: number): string {
        try {
            if (milliseconds < 0) return '0 seconds';

            const seconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) return `${days} day${days === 1 ? '' : 's'}`;
            if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
            if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
            return `${seconds} second${seconds === 1 ? '' : 's'}`;
        } catch (error) {
            console.error('Error in formatDuration:', error);
            return '0 seconds';
        }
    }

    /**
     * Check if date is weekend
     */
    static isWeekend(date: Date | string): boolean {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return false;

            const day = dateObj.getDay();
            return day === 0 || day === 6; // Sunday = 0, Saturday = 6
        } catch (error) {
            console.error('Error in isWeekend:', error);
            return false;
        }
    }

    /**
     * Get first day of month
     */
    static getFirstDayOfMonth(date: Date | string): Date {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return new Date();

            return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        } catch (error) {
            console.error('Error in getFirstDayOfMonth:', error);
            return new Date();
        }
    }

    /**
     * Get last day of month
     */
    static getLastDayOfMonth(date: Date | string): Date {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!isValid(dateObj)) return new Date();

            return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
        } catch (error) {
            console.error('Error in getLastDayOfMonth:', error);
            return new Date();
        }
    }
}

// Alternative simple version without date-fns dependency (backup)
export class SimpleDateUtils {
    /**
     * Simple format without date-fns dependency
     */
    static formatSimple(date: Date | string): string {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return 'Invalid Date';

            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const year = dateObj.getFullYear();

            return `${month}/${day}/${year}`;
        } catch (error) {
            console.error('Error in formatSimple:', error);
            return 'Invalid Date';
        }
    }

    /**
     * Simple relative time without date-fns dependency
     */
    static getSimpleRelativeTime(date: Date | string): string {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return 'Invalid Date';

            const now = new Date();
            const diffMs = now.getTime() - dateObj.getTime();

            const minutes = Math.floor(diffMs / (1000 * 60));
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (days > 7) return SimpleDateUtils.formatSimple(dateObj);
            if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
            if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
            if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
            return 'Just now';
        } catch (error) {
            console.error('Error in getSimpleRelativeTime:', error);
            return 'Unknown time';
        }
    }
}

// Export both for flexibility
export default DateUtils;