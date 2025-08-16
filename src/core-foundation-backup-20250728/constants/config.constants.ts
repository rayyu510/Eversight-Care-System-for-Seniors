export const APP_CONFIG = {
  name: 'Eversight Care Desktop',
  version: '1.0.0',
  description: 'Comprehensive Healthcare Management Desktop Application'
} as const;

export const DATABASE_CONFIG = {
  maxConnections: 10,
  queryTimeout: 30000,
  backupInterval: 24 * 60 * 60 * 1000,
} as const;
