// src/surveillance-center/hooks/useAIDetections.ts
// Fixed AI Detections Hook with correct type imports

import { useState, useEffect } from 'react';
import { MotionEvent, FacialRecognition, BehaviorAnalysisResult, FaceRecognitionResult, AIDetection } from '../types';
import { aiAnalyticsService } from '../services/aiAnalyticsService';

interface UseAIDetectionsReturn {
    motionEvents: MotionEvent[];
    facialRecognitions: FacialRecognition[];
    behaviorAnalyses: BehaviorAnalysisResult[];
    faceRecognitionResults: FaceRecognitionResult[];
    allDetections: AIDetection[];
    loading: boolean;
    error: any;
    refreshDetections: () => Promise<void>;
    processDetection: (detectionId: string, action: 'archive' | 'delete' | 'alert') => Promise<boolean>;
}

export const useAIDetections = (cameraId?: string): UseAIDetectionsReturn => {
    const [motionEvents, setMotionEvents] = useState<MotionEvent[]>([]);
    const [facialRecognitions, setFacialRecognitions] = useState<FacialRecognition[]>([]);
    const [behaviorAnalyses, setBehaviorAnalyses] = useState<BehaviorAnalysisResult[]>([]);
    const [faceRecognitionResults, setFaceRecognitionResults] = useState<FaceRecognitionResult[]>([]);
    const [allDetections, setAllDetections] = useState<AIDetection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchDetections = async () => {
        try {
            setLoading(true);
            setError(null);

            const [motions, faces, behaviors, history] = await Promise.all([
                aiAnalyticsService.getMotionDetections(cameraId),
                aiAnalyticsService.getFacialRecognitions(cameraId),
                aiAnalyticsService.getBehaviorAnalyses(cameraId),
                aiAnalyticsService.getDetectionHistory('24h')
            ]);

            setMotionEvents(motions);
            setFacialRecognitions(faces);

            // Convert behavior analyses to results format
            const behaviorResults: BehaviorAnalysisResult[] = behaviors.map(behavior => ({
                id: behavior.id,
                cameraId: behavior.cameraId,
                timestamp: behavior.timestamp,
                analyses: [behavior],
                totalBehaviors: 1,
                suspiciousBehaviors: behavior.behavior.type === 'suspicious' ? 1 : 0,
                riskLevel: behavior.risk.level,
                confidence: behavior.confidence
            }));
            setBehaviorAnalyses(behaviorResults);

            // Convert facial recognitions to results format
            const faceResults: FaceRecognitionResult[] = faces.map(face => ({
                id: face.id,
                cameraId: face.cameraId,
                timestamp: face.timestamp,
                detections: [face],
                totalFaces: 1,
                authorizedFaces: face.identity.authorized ? 1 : 0,
                unknownFaces: face.identity.authorized ? 0 : 1,
                confidence: face.confidence
            }));
            setFaceRecognitionResults(faceResults);

            setAllDetections(history);
        } catch (err) {
            setError(err);
            console.error('Error fetching AI detections:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshDetections = async () => {
        await fetchDetections();
    };

    const processDetection = async (detectionId: string, action: 'archive' | 'delete' | 'alert'): Promise<boolean> => {
        try {
            const success = await aiAnalyticsService.processDetection(detectionId, action);
            if (success) {
                await refreshDetections();
            }
            return success;
        } catch (err) {
            console.error('Error processing detection:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchDetections();

        // Set up polling for real-time updates
        const interval = setInterval(fetchDetections, 30000); // Every 30 seconds

        return () => clearInterval(interval);
    }, [cameraId]);

    return {
        motionEvents,
        facialRecognitions,
        behaviorAnalyses,
        faceRecognitionResults,
        allDetections,
        loading,
        error,
        refreshDetections,
        processDetection
    };
};