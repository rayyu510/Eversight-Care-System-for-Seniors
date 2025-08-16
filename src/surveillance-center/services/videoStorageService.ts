// src/surveillance-center/services/videoStorageService.ts
// Fixed Video Storage Service with correct property names

import { VideoStorage, StorageStatistics, ArchiveJob, RetentionPolicy, StorageQuality } from '../types';

export class VideoStorageService {
    private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    async getStorageDevices(): Promise<VideoStorage[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/storage/devices`);
            if (!response.ok) throw new Error('Failed to fetch storage devices');

            return await response.json();
        } catch (error) {
            console.error('Error fetching storage devices:', error);
            return this.getMockStorageDevices();
        }
    }

    async getStorageStatistics(): Promise<StorageStatistics> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/storage/statistics`);
            if (!response.ok) throw new Error('Failed to fetch storage statistics');

            return await response.json();
        } catch (error) {
            console.error('Error fetching storage statistics:', error);
            return this.getMockStorageStatistics();
        }
    }

    async getArchiveJobs(): Promise<ArchiveJob[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/storage/archive/jobs`);
            if (!response.ok) throw new Error('Failed to fetch archive jobs');

            return await response.json();
        } catch (error) {
            console.error('Error fetching archive jobs:', error);
            return this.getMockArchiveJobs();
        }
    }

    async createArchiveJob(jobData: Partial<ArchiveJob>): Promise<ArchiveJob> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/storage/archive/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobData)
            });

            if (!response.ok) throw new Error('Failed to create archive job');
            return await response.json();
        } catch (error) {
            console.error('Error creating archive job:', error);

            // Return mock job for development
            const mockJob: ArchiveJob = {
                id: `job_${Date.now()}`,
                name: jobData.name || 'Archive Job',
                type: jobData.type || 'manual',
                status: 'pending',
                priority: jobData.priority || 'medium',
                source: {
                    cameras: jobData.source?.cameras || ['camera_1'],
                    dateRange: jobData.source?.dateRange || {
                        start: new Date(Date.now() - 86400000).toISOString(),
                        end: new Date().toISOString()
                    },
                    quality: jobData.source?.quality || {
                        resolution: '1080p',
                        bitrate: 4000,
                        fps: 30,
                        compression: 'h264',
                        size: 500
                    }
                },
                destination: jobData.destination || {
                    type: 'local',
                    location: '/archive/videos',
                    encryption: true,
                    compression: true
                },
                progress: {
                    filesProcessed: 0,
                    totalFiles: 100,
                    bytesProcessed: 0,
                    totalBytes: 50000000,
                    percentage: 0
                },
                schedule: {}
            };

            return mockJob;
        }
    }

    async getRetentionPolicies(): Promise<RetentionPolicy[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/storage/retention/policies`);
            if (!response.ok) throw new Error('Failed to fetch retention policies');

            return await response.json();
        } catch (error) {
            console.error('Error fetching retention policies:', error);
            return this.getMockRetentionPolicies();
        }
    }

    async updateRetentionPolicy(policyId: string, updates: Partial<RetentionPolicy>): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/storage/retention/policies/${policyId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            return response.ok;
        } catch (error) {
            console.error('Error updating retention policy:', error);
            return false;
        }
    }

    async deleteOldRecordings(policyId: string): Promise<{ deleted: number; spaceFreed: number }> {
        try {
            const response = await fetch(`${this.baseUrl}/api/surveillance/storage/cleanup/${policyId}`, {
                method: 'POST'
            });

            if (!response.ok) throw new Error('Failed to delete old recordings');
            return await response.json();
        } catch (error) {
            console.error('Error deleting old recordings:', error);
            return { deleted: 0, spaceFreed: 0 };
        }
    }

    private getMockStorageDevices(): VideoStorage[] {
        return [
            {
                id: 'storage_001',
                name: 'Primary NAS',
                type: 'network',
                location: 'Server Room Rack A',
                capacity: {
                    total: 50000000000000, // 50TB
                    used: 32500000000000,  // 32.5TB
                    available: 17500000000000, // 17.5TB
                    percentage: 65
                },
                status: 'healthy',
                performance: {
                    readSpeed: 1200,
                    writeSpeed: 950,
                    iops: 8500,
                    latency: 12
                },
                retention: {
                    policy: 'healthcare_standard',
                    days: 365,
                    autoDelete: true
                },
                redundancy: {
                    level: 'raid6',
                    healthy: true
                },
                metadata: {
                    filesystem: 'ext4',
                    mounted: true,
                    lastCheck: new Date(Date.now() - 86400000).toISOString()
                }
            },
            {
                id: 'storage_002',
                name: 'Backup Storage',
                type: 'local',
                location: 'Server Room Rack B',
                capacity: {
                    total: 25000000000000, // 25TB
                    used: 18750000000000,  // 18.75TB
                    available: 6250000000000, // 6.25TB
                    percentage: 75
                },
                status: 'warning',
                performance: {
                    readSpeed: 800,
                    writeSpeed: 600,
                    iops: 5200,
                    latency: 18
                },
                retention: {
                    policy: 'long_term_archive',
                    days: 2555, // 7 years
                    autoDelete: false
                },
                redundancy: {
                    level: 'mirror',
                    healthy: true
                },
                metadata: {
                    filesystem: 'xfs',
                    mounted: true,
                    lastCheck: new Date(Date.now() - 43200000).toISOString()
                }
            }
        ];
    }

    private getMockStorageStatistics(): StorageStatistics {
        return {
            totalSpace: 75000000000000, // 75TB
            usedSpace: 51250000000000,  // 51.25TB
            availableSpace: 23750000000000, // 23.75TB
            usagePercentage: 68.3,
            dailyUsage: 2100000000, // 2.1GB per day
            weeklyTrend: [1.8, 2.1, 2.3, 1.9, 2.2, 2.5, 2.1],
            retentionCompliance: 98.5
        };
    }

    private getMockArchiveJobs(): ArchiveJob[] {
        return [
            {
                id: 'job_001',
                name: 'Weekly Archive - Floor 1',
                type: 'scheduled',
                status: 'completed',
                priority: 'medium',
                source: {
                    cameras: ['camera_1', 'camera_2', 'camera_3', 'camera_4'],
                    dateRange: {
                        start: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
                        end: new Date().toISOString()
                    },
                    quality: {
                        resolution: '1080p',
                        bitrate: 4000,
                        fps: 30,
                        compression: 'h264',
                        size: 500
                    }
                },
                destination: {
                    type: 'network',
                    location: '/archive/weekly/floor1',
                    encryption: true,
                    compression: true
                },
                progress: {
                    filesProcessed: 168,
                    totalFiles: 168,
                    bytesProcessed: 84000000000,
                    totalBytes: 84000000000,
                    percentage: 100
                },
                schedule: {
                    startedAt: new Date(Date.now() - 3600000).toISOString(),
                    completedAt: new Date(Date.now() - 1800000).toISOString(),
                    duration: 1800
                }
            },
            {
                id: 'job_002',
                name: 'Emergency Archive - Incident 001',
                type: 'manual',
                status: 'in_progress',
                priority: 'high',
                source: {
                    cameras: ['camera_12', 'camera_13'],
                    dateRange: {
                        start: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                        end: new Date().toISOString()
                    },
                    quality: {
                        resolution: '4K',
                        bitrate: 8000,
                        fps: 60,
                        compression: 'h265',
                        size: 1200
                    }
                },
                destination: {
                    type: 'cloud',
                    location: 's3://security-archives/incidents',
                    encryption: true,
                    compression: false
                },
                progress: {
                    filesProcessed: 87,
                    totalFiles: 120,
                    bytesProcessed: 10440000000,
                    totalBytes: 14400000000,
                    percentage: 72.5
                },
                schedule: {
                    startedAt: new Date(Date.now() - 900000).toISOString(),
                    estimatedCompletion: new Date(Date.now() + 300000).toISOString()
                }
            }
        ];
    }

    private getMockRetentionPolicies(): RetentionPolicy[] {
        return [
            {
                id: 'policy_001',
                name: 'Healthcare Standard',
                description: 'Standard retention for healthcare facilities - 1 year',
                type: 'time_based',
                rules: {
                    duration: 365,
                    priority: 'medium'
                },
                cameras: ['camera_1', 'camera_2', 'camera_3', 'camera_4', 'camera_5'],
                active: true,
                compliance: {
                    hipaa: true,
                    gdpr: false,
                    sox: false
                },
                created: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
                lastModified: new Date(Date.now() - 2592000000).toISOString() // 30 days ago
            },
            {
                id: 'policy_002',
                name: 'High Security Areas',
                description: 'Extended retention for high security zones - 7 years',
                type: 'time_based',
                rules: {
                    duration: 2555, // 7 years
                    priority: 'high'
                },
                cameras: ['camera_12', 'camera_13', 'camera_14'],
                active: true,
                compliance: {
                    hipaa: true,
                    gdpr: true,
                    sox: true
                },
                created: new Date(Date.now() - 7776000000).toISOString(),
                lastModified: new Date(Date.now() - 1296000000).toISOString() // 15 days ago
            }
        ];
    }
}

export const videoStorageService = new VideoStorageService();