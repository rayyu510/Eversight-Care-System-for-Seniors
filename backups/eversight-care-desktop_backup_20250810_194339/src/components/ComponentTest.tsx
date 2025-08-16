// File: src/components/ComponentTest.tsx
// Fixed to work with new Guardian Protect component interfaces

import React, { useState } from 'react';
import FloorPlanView from '../guardian-protect/components/FloorPlanView';
import AlertPanel from '../guardian-protect/components/AlertPanel';
import VideoFeedGrid from '../guardian-protect/components/VideoFeedGrid';
import ResponseDashboard from '../guardian-protect/components/ResponseDashboard';
import HeatMapOverlay from '../guardian-protect/components/HeatMapOverlay';

const ComponentTest: React.FC = () => {
    const [selectedFloor, setSelectedFloor] = useState<number>(1);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
    const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Guardian Protect Components Test</h1>

            <div className="space-y-8">
                {/* Floor Controls */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Floor Controls</h2>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Selected Floor:</label>
                        <select
                            value={selectedFloor}
                            onChange={(e) => setSelectedFloor(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value={1}>Floor 1</option>
                            <option value={2}>Floor 2</option>
                        </select>
                    </div>
                </div>

                {/* Floor Plan View */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Floor Plan View</h2>
                    <FloorPlanView
                        selectedFloor={selectedFloor}
                        onRoomClick={(roomId: string) => {
                            setSelectedRoom(roomId);
                            console.log('Room selected:', roomId);
                        }}
                        showResidents={true}
                        className="mb-4"
                    />
                    {selectedRoom && (
                        <div className="mt-4 p-3 bg-blue-50 rounded">
                            <strong>Selected Room:</strong> {selectedRoom}
                        </div>
                    )}
                </div>

                {/* Alert Panel */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Alert Panel</h2>
                    <AlertPanel
                        autoRefresh={false}
                        maxHeight="400px"
                        onAlertClick={(alertId: string) => {
                            setSelectedAlert(alertId);
                            console.log('Alert selected:', alertId);
                        }}
                        showFilters={true}
                        className="mb-4"
                    />
                    {selectedAlert && (
                        <div className="mt-4 p-3 bg-red-50 rounded">
                            <strong>Selected Alert:</strong> {selectedAlert}
                        </div>
                    )}
                </div>

                {/* Video Feed Grid */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Video Feed Grid</h2>
                    <VideoFeedGrid
                        selectedFloor={selectedFloor}
                        gridSize="3x3"
                        maxHeight="400px"
                        autoRefresh={false}
                        onCameraSelect={(cameraId: string) => {
                            setSelectedCamera(cameraId);
                            console.log('Camera selected:', cameraId);
                        }}
                        className="mb-4"
                    />
                    {selectedCamera && (
                        <div className="mt-4 p-3 bg-green-50 rounded">
                            <strong>Selected Camera:</strong> {selectedCamera}
                        </div>
                    )}
                </div>

                {/* Response Dashboard */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Response Dashboard</h2>
                    <ResponseDashboard
                        autoRefresh={false}
                        maxHeight="400px"
                        onResponseClick={(responseId: string) => {
                            setSelectedResponse(responseId);
                            console.log('Response selected:', responseId);
                        }}
                        className="mb-4"
                    />
                    {selectedResponse && (
                        <div className="mt-4 p-3 bg-orange-50 rounded">
                            <strong>Selected Response:</strong> {selectedResponse}
                        </div>
                    )}
                </div>

                {/* Heat Map Overlay */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Heat Map Overlay</h2>
                    <HeatMapOverlay
                        selectedMetric="occupancy"
                        onAreaClick={(areaId: string) => {
                            setSelectedArea(areaId);
                            console.log('Area selected:', areaId);
                        }}
                        className="mb-4"
                        floor={selectedFloor}
                        viewMode="all"
                        timeRange="24h"
                        dimensions={{ width: 600, height: 400 }}
                        showLegend={true}
                        opacity={0.7}
                    />
                    {selectedArea && (
                        <div className="mt-4 p-3 bg-purple-50 rounded">
                            <strong>Selected Area:</strong> {selectedArea}
                        </div>
                    )}
                </div>

                {/* Selection Summary */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Current Selections</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <strong>Floor:</strong> {selectedFloor}
                        </div>
                        <div>
                            <strong>Room:</strong> {selectedRoom || 'None'}
                        </div>
                        <div>
                            <strong>Alert:</strong> {selectedAlert || 'None'}
                        </div>
                        <div>
                            <strong>Camera:</strong> {selectedCamera || 'None'}
                        </div>
                        <div>
                            <strong>Response:</strong> {selectedResponse || 'None'}
                        </div>
                        <div>
                            <strong>Area:</strong> {selectedArea || 'None'}
                        </div>
                    </div>
                </div>

                {/* Component Status */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Component Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-medium">FloorPlanView</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Loaded with mock data</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-medium">AlertPanel</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">6 alerts loaded</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-medium">VideoFeedGrid</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">15 cameras loaded</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-medium">ResponseDashboard</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">5 responses loaded</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-medium">HeatMapOverlay</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Facility layout loaded</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="font-medium">All Components</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Using mock data</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentTest;