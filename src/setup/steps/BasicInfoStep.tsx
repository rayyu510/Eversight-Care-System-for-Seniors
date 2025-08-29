import React, { memo, useState, useEffect } from 'react';
import { Building } from 'lucide-react';

const BasicInfoStep = ({ facilityProfile, setFacilityProfile }) => {
    // Add this check to prevent crashes if the state is null or undefined
    if (!facilityProfile) {
        return null;
    }

    // Local state to avoid store-driven re-renders causing one-character typing issues
    const [localName, setLocalName] = useState(facilityProfile.name || '');
    const [localBedCount, setLocalBedCount] = useState<string>(
        facilityProfile.bedCount === 0 ? '' : String(facilityProfile.bedCount)
    );

    useEffect(() => {
        setLocalName(facilityProfile.name || '');
    }, [facilityProfile.name]);

    useEffect(() => {
        setLocalBedCount(facilityProfile.bedCount === 0 ? '' : String(facilityProfile.bedCount));
    }, [facilityProfile.bedCount]);

    const commitName = () => {
        setFacilityProfile(prev => ({ ...prev, name: localName }));
    };

    const commitBedCount = (val: string) => {
        const newCount = val === '' ? 0 : parseInt(val);
        setFacilityProfile(prev => ({ ...prev, bedCount: newCount }));
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Facility Details</h3>
                <p className="text-gray-500">Provide basic information about your facility.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facility Name *
                    </label>
                    <input
                        type="text"
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                        onBlur={commitName}
                        onKeyDown={(e) => { if (e.key === 'Enter') commitName(); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Sunrise Senior Living"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facility Type *
                    </label>
                    <select
                        value={facilityProfile.type}
                        onChange={(e) => setFacilityProfile(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Primary Type</option>
                        <option value="assisted_living">Assisted Living</option>
                        <option value="memory_care">Memory Care Facility</option>
                        <option value="skilled_nursing">Skilled Nursing Facility</option>
                        <option value="ccrc">Continuing Care Retirement Community</option>
                        <option value="mixed_care">Mixed Care Facility</option>
                    </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Beds *
                    </label>
                    <input
                        type="text"
                        value={localBedCount}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^[0-9]+$/.test(val)) {
                                setLocalBedCount(val);
                            }
                        }}
                        onBlur={(e) => commitBedCount(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') commitBedCount((e.target as HTMLInputElement).value); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="150"
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(BasicInfoStep);