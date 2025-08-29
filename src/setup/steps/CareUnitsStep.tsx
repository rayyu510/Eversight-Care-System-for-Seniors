import React from 'react';
import { Users, Check } from 'lucide-react';

const CareUnitsStep = ({ facilityProfile, setFacilityProfile }) => {
    const careUnitOptions = [
        'Assisted Living',
        'Memory Care',
        'Independent Living',
        'Skilled Nursing',
        'Rehabilitation',
        'Respite Care'
    ];

    const handleUnitToggle = (unit) => {
        const currentUnits = facilityProfile.units || [];
        const isSelected = currentUnits.includes(unit);

        setFacilityProfile(prev => ({
            ...prev,
            units: isSelected
                ? currentUnits.filter(u => u !== unit)
                : [...currentUnits, unit]
        }));
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Care Units</h3>
                <p className="text-gray-500">Select all care units your facility provides.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {careUnitOptions.map(unit => {
                    const isSelected = facilityProfile.units?.includes(unit);
                    return (
                        <button
                            key={unit}
                            onClick={() => handleUnitToggle(unit)}
                            className={`p-4 rounded-md border-2 transition-all ${isSelected
                                ? 'border-blue-600 bg-blue-50 text-blue-800'
                                : 'border-gray-300 bg-white text-gray-800 hover:border-blue-400'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{unit}</span>
                                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CareUnitsStep;