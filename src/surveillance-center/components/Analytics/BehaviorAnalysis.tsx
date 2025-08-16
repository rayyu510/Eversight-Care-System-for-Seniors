// src/surveillance-center/components/Analytics/BehaviorAnalysis.tsx
import React, { useState } from 'react';
import { Activity, AlertTriangle, Clock, Users } from 'lucide-react';
import { BehaviorAnalysis as BehaviorAnalysisType, Camera } from '../../types';

interface BehaviorAnalysisProps {
    analyses: BehaviorAnalysisType[];
    cameras: Camera[];
    onBehaviorAction?: (analysisId: string, action: string) => void;
    loading?: boolean;
}

export const BehaviorAnalysis: React.FC<BehaviorAnalysisProps> = ({
    analyses,
    cameras,
    onBehaviorAction,
    loading = false
}) => {
    const [severityFilter, setSeverityFilter] = useState<string>('all');

    const filteredAnalyses = analyses.filter(analysis =>
        severityFilter === 'all' || analysis.risk.level === severityFilter
    );

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'border-l-red-500 bg-red-50';
            case 'high': return 'border-l-orange-500 bg-orange-50';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50';
            default: return 'border-l-blue-500 bg-blue-50';
        }
    };

    const getBehaviorIcon = (behaviorType: string) => {
        switch (behaviorType) {
            case 'loitering': return <Clock className="h-5 w-5 text-yellow-600" />;
            case 'running': return <Activity className="h-5 w-5 text-blue-600" />;
            case 'falling': return <AlertTriangle className="h-5 w-5 text-red-600" />;
            case 'crowding': return <Users className="h-5 w-5 text-orange-600" />;
            case 'fighting': return <AlertTriangle className="h-5 w-5 text-red-600" />;
            default: return <Activity className="h-5 w-5 text-gray-600" />;
        }
    };

    if (loading) {
        return <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Behavior Analysis</h3>
                <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            <div className="space-y-3">
                {filteredAnalyses.map(analysis => (
                    <div key={analysis.id} className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(analysis.risk.level)}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white rounded-lg p-2">
                                    {getBehaviorIcon(analysis.behavior.type)}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 capitalize">
                                        {analysis.behavior.type.replace('_', ' ')} Detected
                                    </h4>
                                    <p className="text-sm text-gray-600">{analysis.behavior.type}</p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                        <span>Camera: {cameras.find(c => c.id === analysis.cameraId)?.name}</span>
                                        <span>•</span>
                                        <span>Duration: {analysis.behavior.duration}s</span>
                                        <span>•</span>
                                        <span>Confidence: {Math.round(analysis.confidence * 100)}%</span>
                                        <span>•</span>
                                        <span>{new Date(analysis.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onBehaviorAction?.(analysis.id, 'investigate')}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                    Investigate
                                </button>
                                <button
                                    onClick={() => onBehaviorAction?.(analysis.id, 'dismiss')}
                                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};