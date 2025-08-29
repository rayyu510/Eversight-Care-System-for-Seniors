// File: src/store/facilityStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FacilityState {
    // Basic Information
    id: string;
    name: string;
    type: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };

    // Operational Details
    bedCount: number;
    currentOccupancy: number;
    units: string[];

    // Infrastructure
    cameraCount: number;
    safetyDeviceCount: number;

    // Staff Information
    totalStaff: number;
    currentShiftStaff: number;
    staffRoles: string[];

    // System Configuration
    features: {
        aiDocumentation: boolean;
        realTimeAlerts: boolean;
        videoAnalytics: boolean;
        familyPortal: boolean;
    };

    // Contact Information
    contacts: {
        administrator: {
            name: string;
            email: string;
            phone: string;
        };
        it: {
            name: string;
            email: string;
            phone: string;
        };
        emergency: {
            name: string;
            email: string;
            phone: string;
        };
    };

    // Timestamps
    createdAt: string;
    updatedAt: string;
    lastSync: string;

    // Actions
    updateBasicInfo: (info: Partial<FacilityState>) => void;
    updateInfrastructure: (infrastructure: { cameraCount: number; safetyDeviceCount: number }) => void;
    updateFeatures: (features: Partial<FacilityState['features']>) => void;
    updateContacts: (contacts: Partial<FacilityState['contacts']>) => void;
    setOccupancy: (occupancy: number) => void;
    setStaffCount: (count: number) => void;
    addUnit: (unit: string) => void;
    removeUnit: (unit: string) => void;
    sync: () => void;
}

export const useFacilityStore = create<FacilityState>()(
    persist(
        (set, get) => ({
            // Initial state
            id: '',
            name: '',
            type: '',
            address: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: 'US'
            },
            bedCount: 0,
            currentOccupancy: 0,
            units: [],
            cameraCount: 0,
            safetyDeviceCount: 0,
            totalStaff: 0,
            currentShiftStaff: 0,
            staffRoles: ['nurse', 'aide', 'administrator', 'maintenance', 'dietary'],
            features: {
                aiDocumentation: true,
                realTimeAlerts: true,
                videoAnalytics: true,
                familyPortal: false
            },
            contacts: {
                administrator: { name: '', email: '', phone: '' },
                it: { name: '', email: '', phone: '' },
                emergency: { name: '', email: '', phone: '' }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastSync: new Date().toISOString(),

            // Actions
            updateBasicInfo: (info) => set((state) => ({
                ...state,
                ...info,
                updatedAt: new Date().toISOString()
            })),

            updateInfrastructure: (infrastructure) => set((state) => ({
                ...state,
                ...infrastructure,
                updatedAt: new Date().toISOString()
            })),

            updateFeatures: (features) => set((state) => ({
                ...state,
                features: { ...state.features, ...features },
                updatedAt: new Date().toISOString()
            })),

            updateContacts: (contacts) => set((state) => ({
                ...state,
                contacts: { ...state.contacts, ...contacts },
                updatedAt: new Date().toISOString()
            })),

            setOccupancy: (occupancy) => set((state) => ({
                ...state,
                currentOccupancy: Math.min(occupancy, state.bedCount),
                updatedAt: new Date().toISOString()
            })),

            setStaffCount: (count) => set((state) => ({
                ...state,
                currentShiftStaff: count,
                updatedAt: new Date().toISOString()
            })),

            addUnit: (unit) => set((state) => ({
                ...state,
                units: [...state.units.filter(u => u !== unit), unit],
                updatedAt: new Date().toISOString()
            })),

            removeUnit: (unit) => set((state) => ({
                ...state,
                units: state.units.filter(u => u !== unit),
                updatedAt: new Date().toISOString()
            })),

            sync: () => set((state) => ({
                ...state,
                lastSync: new Date().toISOString()
            }))
        }),
        {
            name: 'eversight-facility',
            version: 1
        }
    )
);

// Utility functions for facility store
export const getFacilityOccupancyRate = () => {
    const state = useFacilityStore.getState();
    return state.bedCount > 0 ? (state.currentOccupancy / state.bedCount) * 100 : 0;
};

export const getFacilityStaffRatio = () => {
    const state = useFacilityStore.getState();
    return state.currentShiftStaff > 0 && state.currentOccupancy > 0
        ? `1:${(state.currentOccupancy / state.currentShiftStaff).toFixed(1)}`
        : '0:0';
};

export const getFacilityCameraRatio = () => {
    const state = useFacilityStore.getState();
    return state.bedCount > 0 ? (state.cameraCount / state.bedCount).toFixed(2) : '0';
};

// Helper function to get facility stats summary
export const getFacilitySummary = () => {
    const state = useFacilityStore.getState();
    return {
        occupancyRate: getFacilityOccupancyRate(),
        staffRatio: getFacilityStaffRatio(),
        cameraRatio: getFacilityCameraRatio(),
        unitsCount: state.units.length,
        featuresEnabled: Object.values(state.features).filter(Boolean).length
    };
};

// Helper to validate facility setup completion
export const isFacilitySetupComplete = () => {
    const state = useFacilityStore.getState();
    return !!(
        state.name &&
        state.type &&
        state.bedCount > 0 &&
        state.units.length > 0 &&
        state.contacts.administrator.name
    );
};