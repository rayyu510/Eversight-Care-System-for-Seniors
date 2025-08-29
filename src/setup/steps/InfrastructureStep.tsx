import React from 'react';
import { Camera } from 'lucide-react';

const InfrastructureStep = ({ facilityProfile, setFacilityProfile }) => (
    <div className="space-y-6">
        <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Infrastructure & Devices</h3>
            <p className="text-gray-500">Configure your security cameras and other safety devices.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Cameras *
                </label>
                <input
                    type="number"
                    value={facilityProfile.cameraCount}
                    onChange={(e) => setFacilityProfile({ ...facilityProfile, cameraCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="80"
                    min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Include all ONVIF-compatible cameras
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Safety Devices
                </label>
                <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="48"
                    min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Call buttons, sensors, monitoring devices
                </p>
            </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-6">
            <h4 className="font-medium text-blue-900 mb-2">Guardian Module Requirements</h4>
            <div className="text-sm text-blue-700 space-y-1">
                <div>• <strong>Guardian Protect:</strong> Requires cameras in common areas and resident rooms</div>
                <div>• <strong>Guardian Insight:</strong> Uses all available data sources for AI analysis</div>
                <div>• <strong>Guardian CarePro:</strong> Integrates with EHR and staffing systems</div>
                <div>• <strong>Guardian CareTrack:</strong> Monitors medication and nutrition activities</div>
            </div>
        </div>
    </div>
);

export default InfrastructureStep;