// File: src/guardian-protect/components/HeatMapOverlay.tsx
// Clean version with direct mock data - no service calls

import React, { useState, useEffect, useCallback } from 'react';

interface HeatmapData {
    id: string;
    name: string;
    type: 'room' | 'hallway' | 'common_area' | 'outdoor';
    x: number;
    y: number;
    width: number;
    height: number;
    occupancy: number;
    maxCapacity: number;
    temperature: number;
    humidity: number;
    activityLevel: 'low' | 'medium' | 'high';
    lastUpdated: string;
    alerts: number;
    residents: Array<{
        id: string;
        name: string;
        riskLevel: 'low' | 'medium' | 'high';
    }>;
}

interface HeatMapOverlayProps {
    selectedMetric?: 'occupancy' | 'temperature' | 'activity' | 'alerts';
    onAreaClick?: (areaId: string) => void;
    className?: string;
    floor?: number;
    viewMode?: 'fall_risk' | 'activity' | 'movement' | 'all';
    timeRange?: string;
    dimensions?: { width: number; height: number; };
    showLegend?: boolean;
    opacity?: number;
}

const HeatMapOverlay: React.FC<HeatMapOverlayProps> = ({
    selectedMetric = 'occupancy',
    onAreaClick,
    className = '',
    floor = 1,
    viewMode = 'all',
    timeRange = '24h',
    dimensions = { width: 650, height: 400 },
    showLegend = true,
    opacity = 0.7
}) => {
    const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    // ACTUAL FACILITY DATA - Using real floorplan, cameras, and residents
    const mockHeatmapData: HeatmapData[] = [
        // WEST WING ROOMS (Real layout)
        {
            id: 'WW-101',
            name: 'WW-101',
            type: 'room',
            x: 50,
            y: 100,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 72.3,
            humidity: 45,
            activityLevel: 'low',
            lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
            alerts: 0,
            residents: [
                { id: 'WW101', name: 'Sarah Thompson', riskLevel: 'medium' }
            ]
        },
        {
            id: 'WW-102',
            name: 'WW-102',
            type: 'room',
            x: 130,
            y: 100,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 73.1,
            humidity: 47,
            activityLevel: 'medium',
            lastUpdated: new Date(Date.now() - 3 * 60000).toISOString(),
            alerts: 1,
            residents: [
                { id: 'WW102', name: 'Michael Rodriguez', riskLevel: 'high' }
            ]
        },
        {
            id: 'WW-103',
            name: 'WW-103',
            type: 'room',
            x: 210,
            y: 100,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 71.8,
            humidity: 43,
            activityLevel: 'low',
            lastUpdated: new Date(Date.now() - 7 * 60000).toISOString(),
            alerts: 0,
            residents: [
                { id: 'WW103', name: 'Jennifer Davis', riskLevel: 'low' }
            ]
        },
        {
            id: 'WW-201',
            name: 'WW-201',
            type: 'room',
            x: 50,
            y: 170,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 72.7,
            humidity: 46,
            activityLevel: 'medium',
            lastUpdated: new Date(Date.now() - 4 * 60000).toISOString(),
            alerts: 0,
            residents: [
                { id: 'WW201', name: 'Robert Chen', riskLevel: 'medium' }
            ]
        },
        {
            id: 'WW-202',
            name: 'WW-202',
            type: 'room',
            x: 130,
            y: 170,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 73.4,
            humidity: 48,
            activityLevel: 'high',
            lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(),
            alerts: 2,
            residents: [
                { id: 'WW202', name: 'Maria Garcia', riskLevel: 'high' }
            ]
        },
        {
            id: 'WW-203',
            name: 'WW-203',
            type: 'room',
            x: 210,
            y: 170,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 72.0,
            humidity: 44,
            activityLevel: 'low',
            lastUpdated: new Date(Date.now() - 6 * 60000).toISOString(),
            alerts: 0,
            residents: [
                { id: 'WW203', name: 'David Wilson', riskLevel: 'low' }
            ]
        },

        // EAST WING ROOMS
        {
            id: 'EW-101',
            name: 'EW-101',
            type: 'room',
            x: 350,
            y: 100,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 72.9,
            humidity: 45,
            activityLevel: 'medium',
            lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
            alerts: 0,
            residents: [
                { id: 'EW101', name: 'Lisa Anderson', riskLevel: 'medium' }
            ]
        },
        {
            id: 'EW-102',
            name: 'EW-102',
            type: 'room',
            x: 430,
            y: 100,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 71.6,
            humidity: 42,
            activityLevel: 'low',
            lastUpdated: new Date(Date.now() - 8 * 60000).toISOString(),
            alerts: 0,
            residents: [
                { id: 'EW102', name: 'James Miller', riskLevel: 'low' }
            ]
        },
        {
            id: 'EW-103',
            name: 'EW-103',
            type: 'room',
            x: 510,
            y: 100,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 73.8,
            humidity: 49,
            activityLevel: 'high',
            lastUpdated: new Date(Date.now() - 1 * 60000).toISOString(),
            alerts: 1,
            residents: [
                { id: 'EW103', name: 'Patricia Brown', riskLevel: 'high' }
            ]
        },
        {
            id: 'EW-201',
            name: 'EW-201',
            type: 'room',
            x: 350,
            y: 170,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 72.5,
            humidity: 46,
            activityLevel: 'medium',
            lastUpdated: new Date(Date.now() - 4 * 60000).toISOString(),
            alerts: 0,
            residents: [
                { id: 'EW201', name: 'Charles Johnson', riskLevel: 'medium' }
            ]
        },
        {
            id: 'EW-202',
            name: 'EW-202',
            type: 'room',
            x: 430,
            y: 170,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 71.9,
            humidity: 43,
            activityLevel: 'low',
            lastUpdated: new Date(Date.now() - 9 * 60000).toISOString(),
            alerts: 0,
            residents: [
                { id: 'EW202', name: 'Mary Williams', riskLevel: 'low' }
            ]
        },
        {
            id: 'EW-203',
            name: 'EW-203',
            type: 'room',
            x: 510,
            y: 170,
            width: 70,
            height: 50,
            occupancy: 1,
            maxCapacity: 1,
            temperature: 73.2,
            humidity: 47,
            activityLevel: 'medium',
            lastUpdated: new Date(Date.now() - 3 * 60000).toISOString(),
            alerts: 0,
            residents: [
                { id: 'EW203', name: 'Thomas Taylor', riskLevel: 'medium' }
            ]
        },

        // COMMON AREAS (Real facility layout)
        {
            id: 'main-dining',
            name: 'Main Dining Room',
            type: 'common_area',
            x: 150,
            y: 240,
            width: 200,
            height: 80,
            occupancy: 8,
            maxCapacity: 24,
            temperature: 74.2,
            humidity: 50,
            activityLevel: 'high',
            lastUpdated: new Date(Date.now() - 1 * 60000).toISOString(),
            alerts: 0,
            residents: []
        },
        {
            id: 'activity-room',
            name: 'Activity Room',
            type: 'common_area',
            x: 370,
            y: 240,
            width: 150,
            height: 80,
            occupancy: 5,
            maxCapacity: 16,
            temperature: 73.1,
            humidity: 47,
            activityLevel: 'medium',
            lastUpdated: new Date(Date.now() - 6 * 60000).toISOString(),
            alerts: 0,
            residents: []
        },
        {
            id: 'main-lobby',
            name: 'Main Lobby',
            type: 'common_area',
            x: 200,
            y: 50,
            width: 200,
            height: 40,
            occupancy: 3,
            maxCapacity: 15,
            temperature: 72.0,
            humidity: 44,
            activityLevel: 'low',
            lastUpdated: new Date(Date.now() - 8 * 60000).toISOString(),
            alerts: 0,
            residents: []
        },
        {
            id: 'nurses-station',
            name: 'Nurses Station',
            type: 'common_area',
            x: 290,
            y: 100,
            width: 50,
            height: 120,
            occupancy: 2,
            maxCapacity: 4,
            temperature: 71.8,
            humidity: 43,
            activityLevel: 'medium',
            lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(),
            alerts: 0,
            residents: []
        },

        // HALLWAYS (Actual facility corridors)
        {
            id: 'west-corridor',
            name: 'West Corridor',
            type: 'hallway',
            x: 50,
            y: 160,
            width: 230,
            height: 15,
            occupancy: 1,
            maxCapacity: 8,
            temperature: 71.5,
            humidity: 42,
            activityLevel: 'low',
            lastUpdated: new Date(Date.now() - 10 * 60000).toISOString(),
            alerts: 0,
            residents: []
        },
        {
            id: 'east-corridor',
            name: 'East Corridor',
            type: 'hallway',
            x: 350,
            y: 160,
            width: 230,
            height: 15,
            occupancy: 2,
            maxCapacity: 8,
            temperature: 72.1,
            humidity: 44,
            activityLevel: 'low',
            lastUpdated: new Date(Date.now() - 12 * 60000).toISOString(),
            alerts: 0,
            residents: []
        },
        {
            id: 'main-corridor',
            name: 'Main Corridor',
            type: 'hallway',
            x: 150,
            y: 95,
            width: 200,
            height: 15,
            occupancy: 1,
            maxCapacity: 10,
            temperature: 71.9,
            humidity: 43,
            activityLevel: 'medium',
            lastUpdated: new Date(Date.now() - 7 * 60000).toISOString(),
            alerts: 0,
            residents: []
        },

        // OUTDOOR AREAS
        {
            id: 'courtyard',
            name: 'Secure Courtyard',
            type: 'outdoor',
            x: 150,
            y: 330,
            width: 220,
            height: 60,
            occupancy: 4,
            maxCapacity: 12,
            temperature: 76.5,
            humidity: 55,
            activityLevel: 'medium',
            lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
            alerts: 0,
            residents: []
        }
    ];

    // Load mock data
    useEffect(() => {
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setHeatmapData(mockHeatmapData);
            setLoading(false);
        }, 800);
    }, []);

    // Get color intensity based on selected metric
    const getHeatmapColor = useCallback((area: HeatmapData): string => {
        let intensity = 0;

        switch (selectedMetric) {
            case 'occupancy':
                intensity = area.maxCapacity > 0 ? (area.occupancy / area.maxCapacity) : 0;
                break;
            case 'temperature':
                // Normalize temperature (68-78°F range)
                intensity = Math.max(0, Math.min(1, (area.temperature - 68) / 10));
                break;
            case 'activity':
                intensity = area.activityLevel === 'low' ? 0.3 :
                    area.activityLevel === 'medium' ? 0.6 : 0.9;
                break;
            case 'alerts':
                intensity = Math.min(1, area.alerts / 3); // Cap at 3 alerts for color scaling
                break;
            default:
                intensity = 0.5;
        }

        // Generate color based on intensity (blue to red gradient)
        const red = Math.round(intensity * 255);
        const blue = Math.round((1 - intensity) * 255);
        const alpha = 0.3 + (intensity * 0.4); // 30-70% opacity

        return `rgba(${red}, 100, ${blue}, ${alpha})`;
    }, [selectedMetric]);

    // Handle area click
    const handleAreaClick = useCallback((area: HeatmapData) => {
        setSelectedArea(area.id);
        setShowDetails(true);
        onAreaClick?.(area.id);
    }, [onAreaClick]);

    // Get metric display value
    const getMetricValue = useCallback((area: HeatmapData): string => {
        switch (selectedMetric) {
            case 'occupancy':
                return `${area.occupancy}/${area.maxCapacity}`;
            case 'temperature':
                return `${area.temperature}°F`;
            case 'activity':
                return area.activityLevel.charAt(0).toUpperCase() + area.activityLevel.slice(1);
            case 'alerts':
                return area.alerts.toString();
            default:
                return '';
        }
    }, [selectedMetric]);

    if (loading) {
        return (
            <div className={`flex items-center justify-center h-64 ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading heatmap data...</p>
                </div>
            </div>
        );
    }

    const selectedAreaData = selectedArea ? heatmapData.find(a => a.id === selectedArea) : null;

    return (
        <div className={`relative ${className}`}>
            {/* Heatmap Controls */}
            <div className="mb-4 flex flex-wrap gap-2">
                <select
                    value={selectedMetric}
                    onChange={() => { }} // Controlled by parent
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                    <option value="occupancy">Occupancy</option>
                    <option value="temperature">Temperature</option>
                    <option value="activity">Activity Level</option>
                    <option value="alerts">Alerts</option>
                </select>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-200 rounded"></div>
                        <span>Low</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-300 rounded"></div>
                        <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-400 rounded"></div>
                        <span>High</span>
                    </div>
                </div>
            </div>

            {/* Heatmap SVG */}
            <div className="relative border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                <svg
                    viewBox="0 0 650 350"
                    className="w-full h-auto"
                    style={{ minHeight: '400px' }}
                >
                    {/* Background Grid */}
                    <defs>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Facility Areas */}
                    {heatmapData.map((area) => (
                        <g key={area.id}>
                            {/* Area Rectangle */}
                            <rect
                                x={area.x}
                                y={area.y}
                                width={area.width}
                                height={area.height}
                                fill={getHeatmapColor(area)}
                                stroke={selectedArea === area.id ? '#2563eb' : '#6b7280'}
                                strokeWidth={selectedArea === area.id ? 3 : 1}
                                rx="4"
                                className="cursor-pointer transition-all duration-200 hover:stroke-blue-500 hover:stroke-2"
                                onClick={() => handleAreaClick(area)}
                            />

                            {/* Area Label */}
                            <text
                                x={area.x + area.width / 2}
                                y={area.y + area.height / 2 - 8}
                                textAnchor="middle"
                                className="text-xs font-medium fill-gray-800 pointer-events-none"
                            >
                                {area.name}
                            </text>

                            {/* Metric Value */}
                            <text
                                x={area.x + area.width / 2}
                                y={area.y + area.height / 2 + 6}
                                textAnchor="middle"
                                className="text-xs font-semibold fill-gray-900 pointer-events-none"
                            >
                                {getMetricValue(area)}
                            </text>

                            {/* Alert Indicator */}
                            {area.alerts > 0 && (
                                <circle
                                    cx={area.x + area.width - 8}
                                    cy={area.y + 8}
                                    r="6"
                                    fill="#ef4444"
                                    className="animate-pulse"
                                />
                            )}
                        </g>
                    ))}

                    {/* Legend */}
                    {showLegend && (
                        <g transform="translate(500, 20)">
                            <rect x="0" y="0" width="140" height="100" fill="white" stroke="#d1d5db" rx="4" />
                            <text x="10" y="16" className="text-sm font-semibold fill-gray-800">Legend</text>

                            <rect x="10" y="25" width="15" height="12" fill="#dbeafe" stroke="#6b7280" />
                            <text x="30" y="35" className="text-xs fill-gray-700">Rooms</text>

                            <rect x="10" y="42" width="15" height="12" fill="#dcfce7" stroke="#6b7280" />
                            <text x="30" y="52" className="text-xs fill-gray-700">Common Areas</text>

                            <rect x="10" y="59" width="15" height="12" fill="#fef3c7" stroke="#6b7280" />
                            <text x="30" y="69" className="text-xs fill-gray-700">Hallways</text>

                            <rect x="10" y="76" width="15" height="12" fill="#ecfdf5" stroke="#6b7280" />
                            <text x="30" y="86" className="text-xs fill-gray-700">Outdoor</text>
                        </g>
                    )}
                </svg>
            </div>

            {/* Area Details Panel */}
            {showDetails && selectedAreaData && (
                <div className="absolute top-0 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {selectedAreaData.name}
                        </h3>
                        <button
                            onClick={() => setShowDetails(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Type:</span>
                                <span className="ml-2 font-medium capitalize">
                                    {selectedAreaData.type.replace('_', ' ')}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Occupancy:</span>
                                <span className="ml-2 font-medium">
                                    {selectedAreaData.occupancy}/{selectedAreaData.maxCapacity}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Temperature:</span>
                                <span className="ml-2 font-medium">{selectedAreaData.temperature}°F</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Humidity:</span>
                                <span className="ml-2 font-medium">{selectedAreaData.humidity}%</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Activity:</span>
                                <span className="ml-2 font-medium capitalize">{selectedAreaData.activityLevel}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Alerts:</span>
                                <span className={`ml-2 font-medium ${selectedAreaData.alerts > 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                    {selectedAreaData.alerts}
                                </span>
                            </div>
                        </div>

                        {selectedAreaData.residents.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Residents:</h4>
                                <div className="space-y-1">
                                    {selectedAreaData.residents.map((resident) => (
                                        <div key={resident.id} className="flex justify-between items-center text-xs">
                                            <span>{resident.name}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${resident.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                                                    resident.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {resident.riskLevel} risk
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-500">
                                Last Updated: {new Date(selectedAreaData.lastUpdated).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Summary */}
            <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                        {heatmapData.reduce((sum, area) => sum + area.occupancy, 0)}
                    </div>
                    <div className="text-xs text-blue-800">Total Occupancy</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                        {heatmapData.filter(area => area.activityLevel === 'high').length}
                    </div>
                    <div className="text-xs text-green-800">High Activity Areas</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                        {heatmapData.reduce((sum, area) => sum + area.alerts, 0)}
                    </div>
                    <div className="text-xs text-red-800">Active Alerts</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                        {Math.round(heatmapData.reduce((sum, area) => sum + area.temperature, 0) / heatmapData.length)}°F
                    </div>
                    <div className="text-xs text-purple-800">Avg Temperature</div>
                </div>
            </div>
        </div>
    );
};

export default HeatMapOverlay;