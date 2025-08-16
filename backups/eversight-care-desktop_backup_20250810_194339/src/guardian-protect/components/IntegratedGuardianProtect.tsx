import React, { useState, useEffect } from 'react';
import FloorPlanView from './FloorPlanView';
import AlertPanel from './AlertPanel';
import VideoFeedGrid from './VideoFeedGrid';
import ResponseDashboard from './ResponseDashboard';
import HeatMapOverlay from './HeatMapOverlay';

interface SystemStatus {
    timestamp: string;
    totalResidents: number;
    residentsPresent: number;
    activeAlerts: number;
    criticalAlerts: number;
    staffOnDuty: number;
    camerasOnline: number;
    camerasOffline: number;
    systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
    facilityStatus: 'normal_operation' | 'elevated_alert' | 'emergency';
}

type ViewMode = 'overview' | 'floor_plan' | 'video_grid' | 'alerts' | 'response';
type HeatMapMode = 'fall_risk' | 'activity' | 'movement' | 'all' | 'off';

export const IntegratedGuardianProtect: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewMode>('overview');
    const [selectedFloor, setSelectedFloor] = useState<number>(1);
    const [heatMapMode, setHeatMapMode] = useState<HeatMapMode>('off');
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);

    // Mock system status data
    const mockSystemStatus: SystemStatus = {
        timestamp: new Date().toISOString(),
        totalResidents: 12,
        residentsPresent: 12,
        activeAlerts: 4,
        criticalAlerts: 1,
        staffOnDuty: 6,
        camerasOnline: 15,
        camerasOffline: 0,
        systemHealth: 'good',
        facilityStatus: 'elevated_alert'
    };

    useEffect(() => {
        // Simulate loading and set mock data
        setLoading(true);
        setTimeout(() => {
            setSystemStatus(mockSystemStatus);
            setLoading(false);
        }, 1000);

        // Update timestamp every 30 seconds
        const interval = setInterval(() => {
            setSystemStatus(prev => prev ? {
                ...prev,
                timestamp: new Date().toISOString()
            } : null);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const getHealthColor = (health: string): string => {
        switch (health) {
            case 'excellent': return 'text-green-600 bg-green-100';
            case 'good': return 'text-blue-600 bg-blue-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            case 'critical': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getFacilityStatusColor = (status: string): string => {
        switch (status) {
            case 'normal_operation': return 'text-green-600 bg-green-100';
            case 'elevated_alert': return 'text-yellow-600 bg-yellow-100';
            case 'emergency': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const renderSystemStatusBar = () => {
        if (!systemStatus) return null;

        return (
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-bold text-gray-900">Guardian Protect System</h1>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(systemStatus.systemHealth)}`}>
                            {systemStatus.systemHealth.charAt(0).toUpperCase() + systemStatus.systemHealth.slice(1)} Health
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getFacilityStatusColor(systemStatus.facilityStatus)}`}>
                            {systemStatus.facilityStatus.replace('_', ' ').toUpperCase()}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                            <div className="font-bold text-lg text-blue-600">{systemStatus.totalResidents}</div>
                            <div className="text-gray-600">Residents</div>
                        </div>
                        <div className="text-center">
                            <div className={`font-bold text-lg ${systemStatus.activeAlerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {systemStatus.activeAlerts}
                            </div>
                            <div className="text-gray-600">Active Alerts</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-lg text-purple-600">{systemStatus.staffOnDuty}</div>
                            <div className="text-gray-600">Staff On Duty</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-lg text-green-600">{systemStatus.camerasOnline}</div>
                            <div className="text-gray-600">Cameras Online</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderNavigationTabs = () => {
        const tabs = [
            { id: 'overview', label: 'Overview', icon: '🏠' },
            { id: 'floor_plan', label: 'Floor Plan', icon: '🏢' },
            { id: 'video_grid', label: 'Video Surveillance', icon: '📹' },
            { id: 'alerts', label: 'Alert Management', icon: '🚨' },
            { id: 'response', label: 'Emergency Response', icon: '🚑' }
        ];

        return (
            <div className="bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setCurrentView(tab.id as ViewMode)}
                                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${currentView === tab.id
                                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Floor Selector */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Floor:</label>
                            <select
                                value={selectedFloor}
                                onChange={(e) => setSelectedFloor(parseInt(e.target.value))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                                <option value={1}>Floor 1</option>
                                <option value={2}>Floor 2</option>
                            </select>
                        </div>

                        {/* Heat Map Toggle */}
                        {(currentView === 'overview' || currentView === 'floor_plan') && (
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Heat Map:</label>
                                <select
                                    value={heatMapMode}
                                    onChange={(e) => setHeatMapMode(e.target.value as HeatMapMode)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                >
                                    <option value="off">Off</option>
                                    <option value="fall_risk">Fall Risk</option>
                                    <option value="activity">Activity</option>
                                    <option value="movement">Movement</option>
                                    <option value="all">All Overlays</option>
                                </select>
                            </div>
                        )}

                        {/* Live Status Indicator */}
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Live</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderOverviewDashboard = () => {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Floor Plan with Heat Map */}
                <div className="relative">
                    <div className="h-96">
                        <FloorPlanView selectedFloor={selectedFloor} />
                        {heatMapMode !== 'off' && (
                            <HeatMapOverlay
                                selectedMetric="occupancy"
                                className="absolute inset-0"
                            />
                        )}
                    </div>
                </div>

                {/* Alert Panel */}
                <div className="h-96">
                    <AlertPanel
                        maxHeight="24rem"
                        autoRefresh={true}
                        refreshInterval={10000}
                    />
                </div>

                {/* Video Grid */}
                <div className="h-96">
                    <VideoFeedGrid
                        selectedFloor={selectedFloor}
                        gridSize="2x3"
                        maxHeight="24rem"
                        autoRefresh={true}
                    />
                </div>

                {/* Response Dashboard */}
                <div className="h-96">
                    <ResponseDashboard
                        maxHeight="24rem"
                        autoRefresh={true}
                        refreshInterval={15000}
                    />
                </div>
            </div>
        );
    };

    const renderSingleView = () => {
        const commonProps = {
            autoRefresh: true,
            maxHeight: '70vh'
        };

        switch (currentView) {
            case 'floor_plan':
                return (
                    <div className="p-6 relative">
                        <FloorPlanView selectedFloor={selectedFloor} />
                        {heatMapMode !== 'off' && (
                            <HeatMapOverlay
                                selectedMetric="occupancy"
                                className="absolute inset-0"
                            />
                        )}
                    </div>
                );
            case 'video_grid':
                return (
                    <div className="p-6">
                        <VideoFeedGrid
                            selectedFloor={selectedFloor}
                            gridSize="4x4"
                            {...commonProps}
                        />
                    </div>
                );
            case 'alerts':
                return (
                    <div className="p-6">
                        <AlertPanel
                            showFilters={true}
                            refreshInterval={5000}
                            {...commonProps}
                        />
                    </div>
                );
            case 'response':
                return (
                    <div className="p-6">
                        <ResponseDashboard
                            refreshInterval={10000}
                            {...commonProps}
                        />
                    </div>
                );
            default:
                return renderOverviewDashboard();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏥</div>
                    <div className="text-xl font-semibold text-gray-700 mb-2">
                        Guardian Protect System
                    </div>
                    <div className="text-gray-600">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* System Status Bar */}
            {renderSystemStatusBar()}

            {/* Navigation Tabs */}
            {renderNavigationTabs()}

            {/* Main Content */}
            <div className="bg-gray-100 min-h-screen">
                {renderSingleView()}
            </div>

            {/* Emergency Alert Banner */}
            {systemStatus?.criticalAlerts && systemStatus.criticalAlerts > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 z-50">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                            <span className="font-bold text-lg">
                                CRITICAL ALERT: {systemStatus.criticalAlerts} emergency situation(s) require immediate attention
                            </span>
                        </div>
                        <button
                            onClick={() => setCurrentView('response')}
                            className="px-4 py-2 bg-white text-red-600 rounded font-medium hover:bg-gray-100"
                        >
                            View Emergency Response
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntegratedGuardianProtect;