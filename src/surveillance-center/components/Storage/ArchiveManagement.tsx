// src/surveillance-center/components/Storage/ArchiveManagement.tsx
import React, { useState } from 'react';
import { ArchiveJob } from '../../types';
import { useVideoStorage } from '../../hooks';

interface ArchiveManagementProps {
    onCreateJob?: (jobData: any) => Promise<string>;
}

export const ArchiveManagement: React.FC<ArchiveManagementProps> = ({
    onCreateJob
}) => {
    const { archiveJobs, loading, error } = useVideoStorage();
    const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'green';
            case 'running': return 'blue';
            case 'pending': return 'yellow';
            case 'failed': return 'red';
            case 'cancelled': return 'gray';
            default: return 'gray';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return '✅';
            case 'running': return '⏳';
            case 'pending': return '⏸️';
            case 'failed': return '❌';
            case 'cancelled': return '⏹️';
            default: return '❓';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Archive Management</h3>
                        <p className="text-sm text-gray-600">Manage video archival and backup jobs</p>
                    </div>
                    <button
                        onClick={() => setShowCreateDialog(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + Create Archive Job
                    </button>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {archiveJobs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="text-4xl mb-4">📦</div>
                        <div className="text-lg font-medium">No archive jobs</div>
                        <div className="text-sm">Create your first archive job to get started</div>
                    </div>
                ) : (
                    archiveJobs.map((job) => {
                        const statusColor = getStatusColor(job.status);

                        return (
                            <div key={job.id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{getStatusIcon(job.status)}</span>
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900">{job.name}</h4>
                                                <p className="text-gray-600">Type: {job.type.toUpperCase()}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${statusColor}-100 text-${statusColor}-800`}>
                                                {job.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Progress:</span>
                                                <span className="ml-2 font-medium">{job.progress.percentage}%</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Files:</span>
                                                <span className="ml-2 font-medium">{job.progress.filesProcessed}/{job.progress.totalFiles}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Size:</span>
                                                <span className="ml-2 font-medium">
                                                    {(job.progress.bytesProcessed / (1024 * 1024 * 1024)).toFixed(1)}/
                                                    {(job.progress.totalBytes / (1024 * 1024 * 1024)).toFixed(1)} GB
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Cameras:</span>
                                                <span className="ml-2 font-medium">{job.source.cameras.length}</span>
                                            </div>
                                        </div>

                                        {job.status === 'in_progress' && (
                                            <div className="mt-3">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${job.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-3 text-xs text-gray-500">
                                            <div>Destination: {job.destination.location}</div>
                                            <div>Date Range: {job.source.dateRange.start} to {job.source.dateRange.end}</div>
                                            {job.schedule.startedAt && (
                                                <div>Started: {new Date(job.schedule.startedAt).toLocaleString()}</div>
                                            )}
                                            {job.schedule.completedAt && (
                                                <div>Completed: {new Date(job.schedule.completedAt).toLocaleString()}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 ml-4">
                                        {job.status === 'in_progress' && (
                                            <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
                                                Cancel
                                            </button>
                                        )}
                                        {job.status === 'completed' && (
                                            <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">
                                                Download
                                            </button>
                                        )}
                                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};