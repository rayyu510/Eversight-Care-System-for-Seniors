// src/operations-center/components/Controls/QuickActions.tsx
import React from 'react';
import { Zap, Download, Upload, Database, RefreshCw, Settings, BarChart3 } from 'lucide-react';

interface QuickActionsProps {
    onQuickAction: (action: string) => Promise<boolean>;
    loading?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onQuickAction,
    loading = false
}) => {
    const quickActions = [
        {
            id: 'system_health_check',
            title: 'Health Check',
            description: 'Run complete system health diagnostics',
            icon: BarChart3,
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            id: 'refresh_all_data',
            title: 'Refresh Data',
            description: 'Refresh all dashboard data and metrics',
            icon: RefreshCw,
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            id: 'generate_report',
            title: 'Generate Report',
            description: 'Create system performance report',
            icon: Download,
            color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            id: 'backup_config',
            title: 'Backup Config',
            description: 'Backup current system configuration',
            icon: Database,
            color: 'bg-orange-600 hover:bg-orange-700'
        },
        {
            id: 'update_settings',
            title: 'Update Settings',
            description: 'Apply pending configuration updates',
            icon: Settings,
            color: 'bg-indigo-600 hover:bg-indigo-700'
        },
        {
            id: 'sync_modules',
            title: 'Sync Modules',
            description: 'Synchronize all module configurations',
            icon: Upload,
            color: 'bg-teal-600 hover:bg-teal-700'
        }
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map(action => (
                    <button
                        key={action.id}
                        onClick={() => onQuickAction(action.id)}
                        disabled={loading}
                        className={`p-4 rounded-lg text-white transition-all duration-200 ${action.color} ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <div className="flex flex-col items-center space-y-2">
                            <action.icon className="h-6 w-6" />
                            <div className="text-center">
                                <h4 className="font-medium text-sm">{action.title}</h4>
                                <p className="text-xs opacity-90 mt-1">{action.description}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Automated Actions</h4>
                <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center justify-between">
                        <span>Auto Health Check</span>
                        <span className="text-green-600 font-medium">Every 30 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Data Refresh</span>
                        <span className="text-green-600 font-medium">Every 5 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Config Backup</span>
                        <span className="text-green-600 font-medium">Daily at 2:00 AM</span>
                    </div>
                </div>
            </div>
        </div>
    );
};