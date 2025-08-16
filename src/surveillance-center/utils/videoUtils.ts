// src/surveillance-center/utils/videoUtils.ts
// Fixed Video Utils with proper type imports

import { StorageQuality } from '../types';

export interface VideoMetadata {
    duration: number;
    size: number;
    resolution: string;
    bitrate: number;
    fps: number;
    codec: string;
    timestamp: string;
    cameraId: string;
}

export interface VideoSegment {
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    size: number;
    quality: StorageQuality;
    path: string;
    archived: boolean;
}

export const formatVideoDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
};

export const calculateVideoQuality = (resolution: string, bitrate: number): 'low' | 'medium' | 'high' | 'ultra' => {
    if (resolution.includes('4K') || bitrate > 8000) return 'ultra';
    if (resolution.includes('1080p') || bitrate > 4000) return 'high';
    if (resolution.includes('720p') || bitrate > 2000) return 'medium';
    return 'low';
};

export const getVideoCodecInfo = (codec: string): { name: string; efficiency: number; quality: string } => {
    const codecMap: Record<string, { name: string; efficiency: number; quality: string }> = {
        'h264': { name: 'H.264/AVC', efficiency: 70, quality: 'Good' },
        'h265': { name: 'H.265/HEVC', efficiency: 90, quality: 'Excellent' },
        'vp9': { name: 'VP9', efficiency: 85, quality: 'Very Good' },
        'av1': { name: 'AV1', efficiency: 95, quality: 'Excellent' }
    };

    return codecMap[codec.toLowerCase()] || { name: codec, efficiency: 50, quality: 'Unknown' };
};

export const estimateStorageRequirement = (
    duration: number, // in hours
    quality: StorageQuality,
    cameraCount: number = 1
): number => {
    const bytesPerSecond = (quality.bitrate * 1000) / 8; // Convert kbps to bytes/sec
    const bytesPerHour = bytesPerSecond * 3600;
    const totalBytes = bytesPerHour * duration * cameraCount;

    return totalBytes; // Return bytes
};

export const generateVideoThumbnail = (videoUrl: string, timeOffset: number = 5): string => {
    // In a real implementation, this would generate an actual thumbnail
    // For now, return a placeholder
    return `/api/video/thumbnail?url=${encodeURIComponent(videoUrl)}&time=${timeOffset}`;
};

export const validateVideoFormat = (filename: string): boolean => {
    const supportedFormats = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return supportedFormats.includes(extension);
};

export const calculateCompressionRatio = (originalSize: number, compressedSize: number): number => {
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
};

export const getVideoStreamUrl = (cameraId: string, quality: 'low' | 'medium' | 'high' = 'medium'): string => {
    const baseUrl = process.env.REACT_APP_STREAM_URL || 'http://localhost:8080';
    return `${baseUrl}/stream/${cameraId}?quality=${quality}`;
};

export const splitVideoIntoSegments = (
    duration: number,
    segmentLength: number = 300 // 5 minutes default
): { start: number; end: number; duration: number }[] => {
    const segments: { start: number; end: number; duration: number }[] = [];
    let currentTime = 0;

    while (currentTime < duration) {
        const end = Math.min(currentTime + segmentLength, duration);
        segments.push({
            start: currentTime,
            end: end,
            duration: end - currentTime
        });
        currentTime = end;
    }

    return segments;
};

export const mergeVideoSegments = (segments: VideoSegment[]): VideoMetadata => {
    const totalDuration = segments.reduce((sum, segment) => sum + segment.duration, 0);
    const totalSize = segments.reduce((sum, segment) => sum + segment.size, 0);

    // Use the quality settings from the first segment
    const firstSegment = segments[0];

    return {
        duration: totalDuration,
        size: totalSize,
        resolution: firstSegment.quality.resolution,
        bitrate: firstSegment.quality.bitrate,
        fps: firstSegment.quality.fps,
        codec: firstSegment.quality.compression,
        timestamp: firstSegment.startTime,
        cameraId: segments[0].id.split('_')[1] || 'unknown'
    };
};