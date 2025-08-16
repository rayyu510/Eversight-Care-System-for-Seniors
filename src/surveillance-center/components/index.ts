// src/surveillance-center/components/index.ts
// Dashboard Components
export { default as SurveillanceCenterDashboard } from './Dashboard/SurveillanceCenterDashboard';
export { CameraGrid } from './Dashboard/CameraGrid';
export { AIDetectionPanel } from './Dashboard/AIDetectionPanel';
export { SecurityMetrics } from './Dashboard/SecurityMetrics';

// Camera Components
export { CameraView } from './Camera/CameraView';
export { CameraControls } from './Camera/CameraControls';
export { default as CameraSettings } from './Camera/CameraSettings';
export { CameraStatus } from './Camera/CameraStatus';

// Analytics Components
export { MotionDetection } from './Analytics/MotionDetection';
export { FacialRecognition } from './Analytics/FacialRecognition';
export { BehaviorAnalysis } from './Analytics/BehaviorAnalysis';
export { AlertGeneration } from './Analytics/AlertGeneration';

// Storage Components
export { VideoStorage } from './Storage/VideoStorage';
export { RetentionPolicies } from './Storage/RetentionPolicies';
export { ArchiveManagement } from './Storage/ArchiveManagement';
