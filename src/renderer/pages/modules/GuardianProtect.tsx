import React from 'react';
import { Shield, Battery, Wifi, AlertTriangle } from 'lucide-react';
import { useGuardianProtectData } from '../../../shared/hooks/useModuleData';

const GuardianProtectPage: React.FC = () => {
    const { devices, alerts, loading, error } = useGuardianProtectData();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Guardian Protect...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Error loading data: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-red-500 rounded-lg p-3">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Guardian Protect</h1>
                        <p className="text-gray-600">Fall Detection & Emergency Response System</p>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Devices Online</p>
                                <p className="text-xl font-bold text-green-600">
                                    {devices?.filter(d => d.status === 'online').length}/{devices?.length}
                                </p>
                            </div>
                            <Wifi className="h-5 w-5 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Alerts</p>
                                <p className="text-xl font-bold text-orange-600">{alerts?.length || 0}</p>
                            </div>
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Low Battery</p>
                                <p className="text-xl font-bold text-red-600">
                                    {devices?.filter(d => d.battery < 20).length || 0}
                                </p>
                            </div>
                            <Battery className="h-5 w-5 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Safety Score</p>
                                <p className="text-xl font-bold text-blue-600">97%</p>
                            </div>
                            <Shield className="h-5 w-5 text-blue-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Devices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices?.map(device => (
                    <div key={device.id} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">{device.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${device.status === 'online'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {device.status}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Location:</strong> {device.location}</p>
                            <p><strong>Type:</strong> {device.type}</p>
                            <p><strong>Battery:</strong>
                                <span className={`ml-1 ${device.battery < 20 ? 'text-red-600 font-medium' : 'text-green-600'
                                    }`}>
                                    {device.battery}%
                                </span>
                            </p>
                            <p><strong>Last Update:</strong> {device.lastUpdate}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alerts */}
            {alerts && alerts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Active Alerts</h2>
                    <div className="space-y-3">
                        {alerts.map(alert => (
                            <div key={alert.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-red-900">{alert.title}</h4>
                                        <p className="text-red-700 mt-1">{alert.description}</p>
                                        <p className="text-red-600 text-sm mt-2">Location: {alert.location}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                                            Acknowledge
                                        </button>
                                        <button className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200">
                                            Resolve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuardianProtectPage;