// src/surveillance-center/components/Storage/RetentionPolicies.tsx
import React, { useState } from 'react';
import { Calendar, Save, Plus, Trash2 } from 'lucide-react';
import { RetentionPolicy, Camera } from '../../types';

interface RetentionPoliciesProps {
    policies: RetentionPolicy[];
    cameras: Camera[];
    onPolicyAction?: (policyId: string, action: string, data?: any) => Promise<boolean>;
    loading?: boolean;
}

export const RetentionPolicies: React.FC<RetentionPoliciesProps> = ({
    policies,
    cameras,
    onPolicyAction,
    loading = false
}) => {
    const [editingPolicy, setEditingPolicy] = useState<string | null>(null);
    const [newPolicy, setNewPolicy] = useState<Partial<RetentionPolicy>>({
        name: '',
        description: '',
        type: 'time_based',
        rules: {
            duration: 30,
            priority: 'medium'  // Add this required field
        },
        cameras: [],
        active: true,
        compliance: {
            hipaa: false,
            gdpr: false,
            sox: false
        },
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
    });
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Retention Policies</h3>
                <button
                    onClick={() => setEditingPolicy('new')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                    <Plus className="h-4 w-4 inline mr-2" />
                    Add Policy
                </button>
            </div>

            <div className="space-y-4">
                {policies.map(policy => (
                    <div key={policy.id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-900">{policy.name}</h4>
                                <p className="text-sm text-gray-600">{policy.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                                    <span>Retention: {policy.rules.duration} days</span>
                                    <span>•</span>
                                    <span>Priority: {policy.rules.priority}</span>
                                    <span>•</span>
                                    <span>Cameras: {policy.cameras.length || 'All'}</span>
                                    <span>•</span>
                                    <span className={policy.active ? 'text-green-600' : 'text-red-600'}>
                                        {policy.active ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setEditingPolicy(policy.id)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onPolicyAction?.(policy.id, 'delete')}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

