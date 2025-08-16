// src/guardian-protect/workers/index.ts
// Web Workers cannot be imported like regular modules
// They need to be loaded using the Worker constructor

// Export worker types
export type {
    WorkerMessage,
    WorkerResponse,
    DetectionResult
} from '../types';

// Helper functions for creating workers
export const createVideoProcessorWorker = () => {
    return new Worker(
        new URL('./video-processor.worker.ts', import.meta.url),
        { type: 'module' }
    );
};

export const createAlertProcessorWorker = () => {
    return new Worker(
        new URL('./alert-processor.worker.ts', import.meta.url),
        { type: 'module' }
    );
};