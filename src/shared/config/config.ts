// src/shared/config/config.ts
export const config = {
    api: {
        baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
        timeout: 10000,
    },
    websocket: {
        url: process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws',
        reconnectDelay: 1000,
        maxReconnectAttempts: 5,
    },
    app: {
        useMockData: process.env.REACT_APP_USE_MOCK_DATA === 'true',
        logLevel: process.env.REACT_APP_LOG_LEVEL || 'info',
        version: process.env.REACT_APP_VERSION || '1.0.0',
    },
    features: {
        enableRealTimeUpdates: true,
        enableNotifications: true,
        enableAnalytics: false,
    }
};