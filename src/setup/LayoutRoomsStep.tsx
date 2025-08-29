import React from 'react';

type LayoutRoomsStepProps = {
    rooms?: any[];
    onAddRoom?: (room: any) => void;
    onUpdateRoom?: (roomId: string, updates: any) => void;
    onDeleteRoom?: (roomId: string) => void;
};

const LayoutRoomsStep: React.FC<LayoutRoomsStepProps> = () => {
    // This module intentionally provides a lightweight fallback component.
    // The main DashboardConfigurationWizard defines its own in-file LayoutRoomsStep,
    // so this file exists only to satisfy the TypeScript compiler and any imports.
    return null;
};

export default LayoutRoomsStep;
