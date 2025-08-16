// src/surveillance-center/hooks/useVideoStorage.ts
// Fixed Video Storage Hook with correct property names

import { useState, useEffect } from 'react';
import { VideoStorage, StorageStatistics, ArchiveJob, RetentionPolicy } from '../types';
import { videoStorageService } from '../services/videoStorageService';

interface UseVideoStorageReturn {
    storageDevices: VideoStorage[];
    storageStats: StorageStatistics;
    archiveJobs: ArchiveJob[];
    retentionPolicies: RetentionPolicy[];
    loading: boolean;
    error: any;
    refreshStorage: () => Promise<void>;
    createArchiveJob: (jobData: Partial<ArchiveJob>) => Promise<ArchiveJob | null>;
    updateRetentionPolicy: (policyId: string, updates: Partial<RetentionPolicy>) => Promise<boolean>;
    deleteOldRecordings: (policyId: string) => Promise<{ deleted: number; spaceFreed: number }>;
}

export const useVideoStorage = (): UseVideoStorageReturn => {
    const [storageDevices, setStorageDevices] = useState<VideoStorage[]>([]);
    const [storageStats, setStorageStats] = useState<StorageStatistics>({
        totalSpace: 0,
        usedSpace: 0,
        availableSpace: 0,
        usagePercentage: 0,
        dailyUsage: 0,
        weeklyTrend: [],
        retentionCompliance: 0
    });
    const [archiveJobs, setArchiveJobs] = useState<ArchiveJob[]>([]);
    const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchStorageData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [devices, stats, jobs, policies] = await Promise.all([
                videoStorageService.getStorageDevices(),
                videoStorageService.getStorageStatistics(),
                videoStorageService.getArchiveJobs(),
                videoStorageService.getRetentionPolicies()
            ]);

            setStorageDevices(devices);
            setStorageStats(stats);
            setArchiveJobs(jobs);
            setRetentionPolicies(policies);
        } catch (err) {
            setError(err);
            console.error('Error fetching storage data:', err);

            // Set default values on error
            setStorageStats({
                totalSpace: 0,
                usedSpace: 0,
                availableSpace: 0,
                usagePercentage: 0,
                dailyUsage: 0,
                weeklyTrend: [0, 0, 0, 0, 0, 0, 0],
                retentionCompliance: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const refreshStorage = async () => {
        await fetchStorageData();
    };

    const createArchiveJob = async (jobData: Partial<ArchiveJob>): Promise<ArchiveJob | null> => {
        try {
            const newJob = await videoStorageService.createArchiveJob(jobData);
            setArchiveJobs(prev => [...prev, newJob]);
            return newJob;
        } catch (err) {
            console.error('Error creating archive job:', err);
            return null;
        }
    };

    const updateRetentionPolicy = async (policyId: string, updates: Partial<RetentionPolicy>): Promise<boolean> => {
        try {
            const success = await videoStorageService.updateRetentionPolicy(policyId, updates);
            if (success) {
                setRetentionPolicies(prev =>
                    prev.map(policy =>
                        policy.id === policyId
                            ? { ...policy, ...updates, lastModified: new Date().toISOString() }
                            : policy
                    )
                );
            }
            return success;
        } catch (err) {
            console.error('Error updating retention policy:', err);
            return false;
        }
    };

    const deleteOldRecordings = async (policyId: string): Promise<{ deleted: number; spaceFreed: number }> => {
        try {
            const result = await videoStorageService.deleteOldRecordings(policyId);

            // Refresh storage stats after deletion
            await fetchStorageData();

            return result;
        } catch (err) {
            console.error('Error deleting old recordings:', err);
            return { deleted: 0, spaceFreed: 0 };
        }
    };

    useEffect(() => {
        fetchStorageData();

        // Set up periodic refresh for storage statistics
        const interval = setInterval(fetchStorageData, 60000); // Every minute

        return () => clearInterval(interval);
    }, []);

    return {
        storageDevices,
        storageStats,
        archiveJobs,
        retentionPolicies,
        loading,
        error,
        refreshStorage,
        createArchiveJob,
        updateRetentionPolicy,
        deleteOldRecordings
    };
};