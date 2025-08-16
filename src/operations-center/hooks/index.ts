export const usePerformanceMetrics = () => {
    // Implementation
    return {
        metrics: [],
        loading: false,
        error: null
    };
};

export { useSystemStatus } from './useSystemStatus';
export { useAlertAggregation } from './useAlertAggregation';
export { useModuleIntegration } from './useModuleIntegration';
export { useEmergencyProtocols } from './useEmergencyProtocols';
