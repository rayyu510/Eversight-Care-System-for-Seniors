import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

export interface FacilityProfile {
    name: string;
    type: string;
    bedCount: number;
    units: string[];
    cameraCount: number;
    roomTypes: Record<string, number>;
}

export interface CameraProfile {
    cameraId: string;
    name: string;
    roomId: string;
    roomType: string;
    isOnline: boolean;
    hasAiFeatures: boolean;
    enabledAiFeatures: string[];
    lastActivity?: string;
    type: string;
    location: string;
    installationDate: string;
    specs?: string;
    ipAddress?: string;
    status: 'online' | 'offline' | 'maintenance' | 'error';
    streamUrl?: string;
    recordingEnabled: boolean;
}

export interface RoomCameraAssignment {
    roomId: string;
    roomType: string;
    roomName: string;
    assignedCameras: string[];
    recommendedCameraTypes: string[];
    maxCameras: number;
}

export interface CameraConfiguration {
    id: string;
    name: string;
    description: string;
    roomAssignments: RoomCameraAssignment[];
    totalCameras: number;
    estimatedCost: number;
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'active' | 'archived';
    createdBy: string;
    facilityProfile: FacilityProfile;
}

export interface CameraProfileTemplate {
    id: string;
    name: string;
    model: string;
    resolution: string;
    features: string[];
    cost: string;
    suitableFor: string[];
}

interface DataSource {
    enabled: boolean;
    type: string;
    endpoint: string;
    status: 'connected' | 'disconnected' | 'not_configured';
    apiKey?: string;
}

interface DashboardWidget {
    id: string;
    name: string;
    type: string;
    size: 'small' | 'medium' | 'large';
    config: Record<string, any>;
    position: { row: number; col: number };
}

interface ConfigurationState {
    isConfigured: boolean;
    facilityProfile: FacilityProfile;
    dataSources: Record<string, DataSource>;
    dashboardWidgets: DashboardWidget[];
    configVersion: string;
    deployedAt?: string;
    cameraProfiles: CameraProfile[];
    cameraTemplates: CameraProfileTemplate[];
    cameraConfigurations: CameraConfiguration[];
    roomCameraAssignments: RoomCameraAssignment[];
    activeCameraConfigId?: string;

    // Actions
    setFacilityProfile: (profile: FacilityProfile) => void;
    updateDataSource: (key: string, source: DataSource) => void;
    setDashboardWidgets: (widgets: DashboardWidget[]) => void;
    markAsConfigured: () => void;
    resetConfiguration: () => void;
    setCameraProfiles: (cameras: CameraProfile[]) => void;
    addCameraProfile: (camera: CameraProfile) => void;
    updateCameraProfile: (cameraId: string, updates: Partial<CameraProfile>) => void;
    deleteCameraProfile: (cameraId: string) => void;
    setCameraTemplates: (templates: CameraProfileTemplate[]) => void;
    setRoomCameraAssignments: (assignments: RoomCameraAssignment[]) => void;
    updateRoomCameraAssignment: (roomId: string, updates: Partial<RoomCameraAssignment>) => void;
    assignCameraToRoom: (cameraId: string, roomId: string) => void;
    unassignCameraFromRoom: (cameraId: string, roomId: string) => void;
    saveCameraConfiguration: (config: Omit<CameraConfiguration, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateCameraConfiguration: (configId: string, updates: Partial<CameraConfiguration>) => void;
    deleteCameraConfiguration: (configId: string) => void;
    setActiveCameraConfiguration: (configId: string) => void;
    getCameraConfigurationById: (configId: string) => CameraConfiguration | undefined;
    getCamerasByRoom: (roomId: string) => CameraProfile[];
    getUnassignedCameras: () => CameraProfile[];
    generateRoomAssignmentsFromFacility: () => void;
    syncCameraCountWithFacility: () => void;
}

// Default camera templates matching DashboardConfigurationWizard.tsx
const defaultCameraTemplates: CameraProfileTemplate[] = [
    {
        id: 'dome_indoor',
        name: 'Dome Indoor',
        model: 'Dome Indoor',
        resolution: '1080p',
        features: ['Night Vision', 'Motion Detection'],
        cost: '$500',
        suitableFor: ['resident_room', 'lobby', 'dining_hall', 'hallway'],
    },
    {
        id: 'bullet_outdoor',
        name: 'Bullet Outdoor',
        model: 'Bullet Outdoor',
        resolution: '4K',
        features: ['Weatherproof', 'PTZ'],
        cost: '$800',
        suitableFor: ['hallway'],
    },
    {
        id: 'covert_indoor',
        name: 'Covert Indoor',
        model: 'Covert Indoor',
        resolution: '720p',
        features: ['Discreet', 'Motion Detection'],
        cost: '$300',
        suitableFor: ['resident_room'],
    },
    {
        id: 'doorbell_camera',
        name: 'Doorbell Camera',
        model: 'Doorbell Camera',
        resolution: '1080p',
        features: ['Two-Way Audio', 'Motion Detection'],
        cost: '$200',
        suitableFor: ['lobby'],
    },
    {
        id: 'ptz_outdoor',
        name: 'PTZ Outdoor',
        model: 'PTZ Outdoor',
        resolution: '4K',
        features: ['Pan-Tilt-Zoom', 'Weatherproof'],
        cost: '$1000',
        suitableFor: ['dining_hall'],
    },
];

export const useConfigurationStore = create<ConfigurationState>()(
    persist(
        (set, get) => ({
            isConfigured: false,
            facilityProfile: {
                name: '',
                type: '',
                bedCount: 0,
                units: [],
                cameraCount: 0,
                roomTypes: {},
            },
            dataSources: {
                ehr: { enabled: false, type: '', endpoint: '', status: 'not_configured' },
                staffing: { enabled: false, type: '', endpoint: '', status: 'not_configured' },
                cameras: { enabled: false, type: '', endpoint: '', status: 'not_configured' },
            },
            dashboardWidgets: [],
            configVersion: '1.0',
            cameraProfiles: [],
            cameraTemplates: defaultCameraTemplates,
            cameraConfigurations: [],
            roomCameraAssignments: [],
            activeCameraConfigId: undefined,

            setFacilityProfile: (profile) =>
                set((state) => {
                    console.log('[configurationStore] setFacilityProfile called with:', profile);
                    const updatedFacilityProfile = {
                        ...profile,
                        cameraCount: state.cameraProfiles.length,
                        roomTypes: profile.roomTypes || {},
                    };

                    // If roomTypes are provided, generate room assignments
                    if (profile.roomTypes && Object.keys(profile.roomTypes).length > 0) {
                        // Generate room assignments based on the new facility profile
                        const roomAssignments: RoomCameraAssignment[] = [];

                        Object.entries(profile.roomTypes).forEach(([roomType, count]) => {
                            const roomCount = typeof count === 'number' ? count : 0;
                            for (let i = 1; i <= roomCount; i++) {
                                const roomId = `${roomType}_${i}`;
                                const roomName = `${roomType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${i}`;

                                // Determine recommended camera types and max cameras based on room type
                                let recommendedCameraTypes: string[] = [];
                                let maxCameras = 1;

                                switch (roomType) {
                                    case 'resident_room':
                                        recommendedCameraTypes = ['dome_indoor', 'covert_indoor'];
                                        maxCameras = 2;
                                        break;
                                    case 'bathroom':
                                        recommendedCameraTypes = ['covert_indoor'];
                                        maxCameras = 1;
                                        break;
                                    case 'dining_hall':
                                        recommendedCameraTypes = ['ptz_outdoor', 'dome_indoor'];
                                        maxCameras = 4;
                                        break;
                                    case 'activity_center':
                                        recommendedCameraTypes = ['dome_indoor', 'ptz_outdoor'];
                                        maxCameras = 3;
                                        break;
                                    case 'lobby':
                                        recommendedCameraTypes = ['dome_indoor', 'doorbell_camera'];
                                        maxCameras = 3;
                                        break;
                                    case 'hallway':
                                        recommendedCameraTypes = ['dome_indoor', 'bullet_outdoor'];
                                        maxCameras = 2;
                                        break;
                                    default:
                                        recommendedCameraTypes = ['dome_indoor'];
                                        maxCameras = 1;
                                }

                                roomAssignments.push({
                                    roomId,
                                    roomType,
                                    roomName,
                                    assignedCameras: [],
                                    recommendedCameraTypes,
                                    maxCameras
                                });
                            }
                        });

                        return {
                            ...state,
                            facilityProfile: updatedFacilityProfile,
                            roomCameraAssignments: roomAssignments,
                        };
                    }

                    return {
                        ...state,
                        facilityProfile: updatedFacilityProfile,
                    };
                }),

            updateDataSource: (key, source) =>
                set((state) => ({
                    dataSources: { ...state.dataSources, [key]: source },
                })),

            setDashboardWidgets: (widgets) => set({ dashboardWidgets: widgets }),

            markAsConfigured: () =>
                set({
                    isConfigured: true,
                    deployedAt: new Date().toISOString(),
                }),

            resetConfiguration: () =>
                set({
                    isConfigured: false,
                    facilityProfile: {
                        name: '',
                        type: '',
                        bedCount: 0,
                        units: [],
                        cameraCount: 0,
                        roomTypes: {},
                    },
                    dashboardWidgets: [],
                    deployedAt: undefined,
                    cameraProfiles: [],
                    cameraTemplates: defaultCameraTemplates,
                    cameraConfigurations: [],
                    roomCameraAssignments: [],
                    activeCameraConfigId: undefined,
                }),

            setCameraProfiles: (cameras) =>
                set((state) => ({
                    cameraProfiles: cameras,
                    facilityProfile: {
                        ...state.facilityProfile,
                        cameraCount: cameras.length,
                    },
                })),

            addCameraProfile: (camera) =>
                set((state) => {
                    const room = state.roomCameraAssignments.find((r) => r.roomId === camera.roomId);
                    if (camera.roomId !== 'unassigned' && !room) {
                        console.warn(`Room ${camera.roomId} not found in room assignments. Camera will be added but not assigned to any room.`);
                    }

                    const newCameraProfiles = [...state.cameraProfiles, camera];
                    const newCameraCount = newCameraProfiles.length;

                    return {
                        cameraProfiles: newCameraProfiles,
                        facilityProfile: {
                            ...state.facilityProfile,
                            cameraCount: newCameraCount,
                        },
                    };
                }),

            updateCameraProfile: (cameraId, updates) =>
                set((state) => {
                    const camera = state.cameraProfiles.find((c) => c.cameraId === cameraId);
                    if (!camera) return state;

                    const updatedCamera = { ...camera, ...updates };

                    // If roomId is being updated, handle room assignment changes
                    if (updates.roomId !== undefined && updates.roomId !== camera.roomId) {
                        const newRoomId = updates.roomId;
                        const oldRoomId = camera.roomId;

                        let newRoomCameraAssignments = [...state.roomCameraAssignments];

                        // Remove camera from old room (if it was assigned)
                        if (oldRoomId && oldRoomId !== 'unassigned') {
                            newRoomCameraAssignments = newRoomCameraAssignments.map((assignment) =>
                                assignment.roomId === oldRoomId
                                    ? {
                                        ...assignment,
                                        assignedCameras: assignment.assignedCameras.filter((id) => id !== cameraId),
                                    }
                                    : assignment
                            );
                        }

                        // Add camera to new room (if it's not 'unassigned')
                        if (newRoomId && newRoomId !== 'unassigned') {
                            const newRoom = newRoomCameraAssignments.find((r) => r.roomId === newRoomId);
                            if (newRoom && !newRoom.assignedCameras.includes(cameraId)) {
                                newRoomCameraAssignments = newRoomCameraAssignments.map((assignment) =>
                                    assignment.roomId === newRoomId
                                        ? {
                                            ...assignment,
                                            assignedCameras: [...assignment.assignedCameras, cameraId],
                                        }
                                        : assignment
                                );
                            }
                        }

                        return {
                            ...state,
                            cameraProfiles: state.cameraProfiles.map((camera) =>
                                camera.cameraId === cameraId
                                    ? {
                                        ...updatedCamera,
                                        lastActivity: new Date().toLocaleString(),
                                    }
                                    : camera
                            ),
                            roomCameraAssignments: newRoomCameraAssignments,
                        };
                    }

                    // If no roomId change, just update the camera
                    return {
                        ...state,
                        cameraProfiles: state.cameraProfiles.map((camera) =>
                            camera.cameraId === cameraId
                                ? {
                                    ...updatedCamera,
                                    lastActivity: new Date().toLocaleString(),
                                }
                                : camera
                        ),
                    };
                }),

            deleteCameraProfile: (cameraId) =>
                set((state) => ({
                    cameraProfiles: state.cameraProfiles.filter((camera) => camera.cameraId !== cameraId),
                    facilityProfile: {
                        ...state.facilityProfile,
                        cameraCount: Math.max(0, state.cameraProfiles.length - 1),
                    },
                    roomCameraAssignments: state.roomCameraAssignments.map((assignment) => ({
                        ...assignment,
                        assignedCameras: assignment.assignedCameras.filter((id) => id !== cameraId),
                    })),
                })),

            setCameraTemplates: (templates) => set({ cameraTemplates: templates }),

            setRoomCameraAssignments: (assignments) => set({ roomCameraAssignments: assignments }),

            updateRoomCameraAssignment: (roomId, updates) =>
                set((state) => ({
                    roomCameraAssignments: state.roomCameraAssignments.map((assignment) =>
                        assignment.roomId === roomId ? { ...assignment, ...updates } : assignment
                    ),
                })),

            assignCameraToRoom: (cameraId, roomId) =>
                set((state) => {
                    const camera = state.cameraProfiles.find((c) => c.cameraId === cameraId);
                    const room = state.roomCameraAssignments.find((r) => r.roomId === roomId);

                    if (!camera) {
                        console.error(`Camera ${cameraId} not found`);
                        return state;
                    }

                    if (!room) {
                        console.error(`Room ${roomId} not found`);
                        return state;
                    }

                    if (room.assignedCameras.length >= room.maxCameras) {
                        console.warn(`Room ${roomId} has reached maximum camera capacity (${room.maxCameras})`);
                        return state;
                    }

                    if (room.assignedCameras.includes(cameraId)) {
                        console.warn(`Camera ${cameraId} is already assigned to room ${roomId}`);
                        return state;
                    }

                    return {
                        roomCameraAssignments: state.roomCameraAssignments.map((assignment) =>
                            assignment.roomId === roomId
                                ? {
                                    ...assignment,
                                    assignedCameras: [...assignment.assignedCameras, cameraId],
                                }
                                : {
                                    ...assignment,
                                    assignedCameras: assignment.assignedCameras.filter((id) => id !== cameraId),
                                }
                        ),
                        cameraProfiles: state.cameraProfiles.map((camera) =>
                            camera.cameraId === cameraId
                                ? { ...camera, roomId, lastActivity: new Date().toLocaleString() }
                                : camera
                        ),
                    };
                }),

            unassignCameraFromRoom: (cameraId, roomId) =>
                set((state) => ({
                    roomCameraAssignments: state.roomCameraAssignments.map((assignment) =>
                        assignment.roomId === roomId
                            ? {
                                ...assignment,
                                assignedCameras: assignment.assignedCameras.filter((id) => id !== cameraId),
                            }
                            : assignment
                    ),
                    cameraProfiles: state.cameraProfiles.map((camera) =>
                        camera.cameraId === cameraId
                            ? { ...camera, roomId: 'unassigned', lastActivity: new Date().toLocaleString() }
                            : camera
                    ),
                })),

            saveCameraConfiguration: (config) => {
                const newConfig: CameraConfiguration = {
                    ...config,
                    id: `config-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set((state) => ({
                    cameraConfigurations: [...state.cameraConfigurations, newConfig],
                    activeCameraConfigId: newConfig.id,
                }));
                return newConfig.id;
            },

            updateCameraConfiguration: (configId, updates) =>
                set((state) => ({
                    cameraConfigurations: state.cameraConfigurations.map((config) =>
                        config.id === configId
                            ? { ...config, ...updates, updatedAt: new Date().toISOString() }
                            : config
                    ),
                })),

            deleteCameraConfiguration: (configId) =>
                set((state) => ({
                    cameraConfigurations: state.cameraConfigurations.filter((config) => config.id !== configId),
                    activeCameraConfigId: state.activeCameraConfigId === configId ? undefined : state.activeCameraConfigId,
                })),

            setActiveCameraConfiguration: (configId) => set({ activeCameraConfigId: configId }),

            getCameraConfigurationById: (configId) => {
                return get().cameraConfigurations.find((config) => config.id === configId);
            },

            getCamerasByRoom: (roomId) => {
                return get().cameraProfiles.filter((camera) => camera.roomId === roomId);
            },

            getUnassignedCameras: () => {
                return get().cameraProfiles.filter((camera) => camera.roomId === 'unassigned' || !camera.roomId);
            },

            generateRoomAssignmentsFromFacility: () =>
                set((state) => {
                    const roomAssignments: RoomCameraAssignment[] = [];

                    // Generate room assignments based on facility profile room types
                    Object.entries(state.facilityProfile.roomTypes || {}).forEach(([roomType, count]) => {
                        const roomCount = typeof count === 'number' ? count : 0;
                        for (let i = 1; i <= roomCount; i++) {
                            const roomId = `${roomType}_${i}`;
                            const roomName = `${roomType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${i}`;

                            // Determine recommended camera types and max cameras based on room type
                            let recommendedCameraTypes: string[] = [];
                            let maxCameras = 1;

                            switch (roomType) {
                                case 'resident_room':
                                    recommendedCameraTypes = ['dome_indoor', 'covert_indoor'];
                                    maxCameras = 2;
                                    break;
                                case 'bathroom':
                                    recommendedCameraTypes = ['covert_indoor'];
                                    maxCameras = 1;
                                    break;
                                case 'dining_hall':
                                    recommendedCameraTypes = ['ptz_outdoor', 'dome_indoor'];
                                    maxCameras = 4;
                                    break;
                                case 'activity_center':
                                    recommendedCameraTypes = ['dome_indoor', 'ptz_outdoor'];
                                    maxCameras = 3;
                                    break;
                                case 'lobby':
                                    recommendedCameraTypes = ['dome_indoor', 'doorbell_camera'];
                                    maxCameras = 3;
                                    break;
                                case 'hallway':
                                    recommendedCameraTypes = ['dome_indoor', 'bullet_outdoor'];
                                    maxCameras = 2;
                                    break;
                                default:
                                    recommendedCameraTypes = ['dome_indoor'];
                                    maxCameras = 1;
                            }

                            roomAssignments.push({
                                roomId,
                                roomType,
                                roomName,
                                assignedCameras: [],
                                recommendedCameraTypes,
                                maxCameras
                            });
                        }
                    });

                    return {
                        ...state,
                        roomCameraAssignments: roomAssignments,
                    };
                }),

            syncCameraCountWithFacility: () =>
                set((state) => ({
                    facilityProfile: {
                        ...state.facilityProfile,
                        cameraCount: state.cameraProfiles.length,
                    },
                })),
        }),
        {
            name: 'eversight-configuration',
            version: 3,
            migrate: (persistedState: any, version: number) => {
                if (version < 3) {
                    if (!persistedState.facilityProfile.roomTypes) {
                        persistedState.facilityProfile.roomTypes = {};
                    }
                    if (!persistedState.cameraTemplates || persistedState.cameraTemplates.length === 0) {
                        persistedState.cameraTemplates = defaultCameraTemplates;
                    }
                    persistedState.facilityProfile.cameraCount = persistedState.cameraProfiles?.length || 0;
                }
                return persistedState as ConfigurationState;
            },
        } as PersistOptions<ConfigurationState>
    )
);