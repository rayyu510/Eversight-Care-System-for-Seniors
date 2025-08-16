// src/guardian-protect/utils/index.ts
// Simple utility exports - no complex imports

export const formatDate = (date: Date) => date.toLocaleDateString();
export const generateId = () => Math.random().toString(36).substr(2, 9);