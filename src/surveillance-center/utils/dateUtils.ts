// src/surveillance-center/utils/dateUtils.ts
// Create utility for consistent date handling
export const parseDate = (input: string | Date): Date => {
    return input instanceof Date ? input : new Date(input);
};

export const toISOString = (date: Date | string): string => {
    return date instanceof Date ? date.toISOString() : date;
};