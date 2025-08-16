// src/guardian-protect/index.ts
export * from './components';
export * from './services';
export * from './hooks';
export * from './types';

// Default export for the entire module
export { VideoFeedGrid, HeatMapOverlay, AlertPanel, ResponseDashboard } from './components';
export { FallDetectionService, VideoStreamService, EmergencyResponseService } from './services';
export { useFloorPlan, useVideoFeeds, useFallDetection, useEmergencyResponse } from './hooks';
export type * from './types';