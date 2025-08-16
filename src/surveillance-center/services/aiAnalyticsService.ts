// src/surveillance-center/services/aiAnalyticsService.ts
// Fixed AI Analytics Service

import {
    MotionEvent,
    FacialRecognition,
    BehaviorAnalysis,
    AIDetection,
    FaceRecognitionResult,
    BehaviorAnalysisResult
} from '../types';

export class AIAnalyticsService {
    private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    async getMotionDetections(cameraId?: string): Promise<MotionEvent[]> {
        try {
            const url = cameraId
                ? `${this.baseUrl}/api/surveillance/ai/motion?cameraId=${cameraId}`
                : `${this.baseUrl}/api/surveillance/ai/motion`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch motion detections');

            return await response.json();
        } catch (error) {
            console.error('Error fetching motion detections:', error);
            return this.getMockMotionDetections();
        }
    }

    async getFacialRecognitions(cameraId?: string): Promise<FacialRecognition[]> {
        try {
            const url = cameraId
                ? `${this.baseUrl}/api/surveillance/ai/facial?cameraId=${cameraId}`
                : `${this.baseUrl}/api/surveillance/ai/facial`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch facial recognitions');

            return await response.json();
        } catch (error) {
            console.error('Error fetching facial recognitions:', error);
            return this.getMockFacialRecognitions();
        }
    }

    async getBehaviorAnalyses(cameraId?: string): Promise<BehaviorAnalysis[]> {
        try {
            const url = cameraId
                ? `${this.baseUrl}/api/surveillance/ai/behavior?cameraId=${cameraId}`
                : `${this.baseUrl}/api/surveillance/ai/behavior`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch behavior analyses');

            return await response.json();
        } catch (error) {
            console.error('Error fetching behavior analyses:', error);
            return this.getMockBehaviorAnalyses();
        }
    }

    async getDetectionHistory(timeRange: string = '24h'): Promise<AIDetection[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/ai/history?range=${timeRange}`);
            if (!response.ok) throw new Error('Failed to fetch detection history');

            return await response.json();
        } catch (error) {
            console.error('Error fetching detection history:', error);
            return this.getMockDetectionHistory();
        }
    }

    async processDetection(detectionId: string, action: 'archive' | 'delete' | 'alert'): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/ai/detection/${detectionId}/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            return response.ok;
        } catch (error) {
            console.error('Error processing detection:', error);
            return false;
        }
    }

    // Mock data methods
    private getMockMotionDetections(): MotionEvent[] {
        return Array.from({ length: 15 }, (_, i) => ({
            id: `motion_${i + 1}`,
            cameraId: `camera_${(i % 6) + 1}`,
            timestamp: new Date(Date.now() - i * 300000).toISOString(),
            confidence: 0.85 + Math.random() * 0.1,
            bbox: {
                x: Math.random() * 800,
                y: Math.random() * 600,
                width: 50 + Math.random() * 100,
                height: 80 + Math.random() * 120
            },
            motion: {
                direction: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)],
                speed: 1 + Math.random() * 3,
                duration: 5 + Math.random() * 15
            },
            classification: ['person', 'vehicle', 'object'][Math.floor(Math.random() * 3)] as any,
            processed: Math.random() > 0.3
        }));
    }

    private getMockFacialRecognitions(): FacialRecognition[] {
        return Array.from({ length: 8 }, (_, i) => ({
            id: `face_${i + 1}`,
            cameraId: `camera_${(i % 4) + 1}`,
            timestamp: new Date(Date.now() - i * 600000).toISOString(),
            confidence: 0.75 + Math.random() * 0.2,
            bbox: {
                x: Math.random() * 800,
                y: Math.random() * 400,
                width: 80 + Math.random() * 40,
                height: 100 + Math.random() * 50
            },
            identity: {
                personId: Math.random() > 0.6 ? `person_${i}` : undefined,
                name: Math.random() > 0.6 ? `Staff Member ${i}` : undefined,
                authorized: Math.random() > 0.2,
                confidence: 0.8 + Math.random() * 0.15
            },
            biometrics: {
                age: 25 + Math.random() * 40,
                gender: Math.random() > 0.5 ? 'male' : 'female',
                emotion: ['happy', 'neutral', 'concerned'][Math.floor(Math.random() * 3)],
                glasses: Math.random() > 0.7,
                mask: Math.random() > 0.8
            },
            processed: Math.random() > 0.4
        }));
    }

    private getMockBehaviorAnalyses(): BehaviorAnalysis[] {
        return Array.from({ length: 12 }, (_, i) => ({
            id: `behavior_${i + 1}`,
            cameraId: `camera_${(i % 8) + 1}`,
            timestamp: new Date(Date.now() - i * 900000).toISOString(),
            confidence: 0.7 + Math.random() * 0.25,
            behavior: {
                type: ['normal', 'suspicious', 'fall', 'loitering'][Math.floor(Math.random() * 4)] as any,
                duration: 10 + Math.random() * 120,
                intensity: Math.random(),
                location: {
                    x: Math.random() * 800,
                    y: Math.random() * 600
                }
            },
            subject: {
                trackId: `track_${i}`,
                classification: Math.random() > 0.8 ? 'group' : 'person',
                count: Math.random() > 0.8 ? 2 + Math.floor(Math.random() * 3) : 1
            },
            risk: {
                level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
                factors: ['movement_pattern', 'time_of_day', 'location'].slice(0, 1 + Math.floor(Math.random() * 3)),
                score: Math.random()
            },
            processed: Math.random() > 0.3
        }));
    }

    private getMockDetectionHistory(): AIDetection[] {
        const motions = this.getMockMotionDetections().map(m => ({
            id: m.id,
            cameraId: m.cameraId,
            timestamp: m.timestamp,
            type: 'motion' as const,
            confidence: m.confidence,
            data: m,
            processed: m.processed,
            archived: Math.random() > 0.7
        }));

        const faces = this.getMockFacialRecognitions().map(f => ({
            id: f.id,
            cameraId: f.cameraId,
            timestamp: f.timestamp,
            type: 'face' as const,
            confidence: f.confidence,
            data: f,
            processed: f.processed,
            archived: Math.random() > 0.7
        }));

        return [...motions, ...faces].sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }
}

export const aiAnalyticsService = new AIAnalyticsService();