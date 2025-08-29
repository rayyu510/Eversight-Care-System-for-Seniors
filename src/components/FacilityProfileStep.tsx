// src/components/FacilityProfileStep.tsx
import React from 'react';
// ... other imports for this component ...

const FacilityProfileStep = ({ facilityProfile, setFacilityProfile }) => {
    return (
        // ... input field here ...
        <input
            type="text"
            value={facilityProfile.name}
            onChange={(e) => setFacilityProfile({ ...facilityProfile, name: e.target.value })}
        />
    );
};
export default FacilityProfileStep;