//src/setup/DashboardConfigurationWizard.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useConfigurationStore } from '../store/configurationStore'; // Correct import path

import {
    Settings, Plus, Trash2, Save, ArrowLeft, AlertCircle, TrendingUp,
    Users, Shield, Activity, Clock, Video, Eye, Heart, Database,
    CheckCircle, Upload, Download, FileText, Monitor, Building, Camera,
    Wifi, Server, ChevronRight, ChevronDown, X, Home, MapPin, Trees, Car,
    Utensils, Gamepad2, Bed, Bath, Edit3, Star, Zap, Target, Globe,
    AlertTriangle, XCircle, Loader2
} from 'lucide-react';

// Enhanced facility profile structure
const roomTypeTemplates = [
    { id: 'resident_room', name: 'Resident Room', icon: Bed, category: 'residential', description: 'Private living spaces for residents' },
    { id: 'bathroom', name: 'Bathroom', icon: Bath, category: 'residential', description: 'Private and shared bathroom facilities' },
    { id: 'dining_hall', name: 'Dining Hall', icon: Utensils, category: 'common', description: 'Main dining and meal areas' },
    { id: 'activity_center', name: 'Activity Center', icon: Activity, category: 'common', description: 'Recreation and wellness activities' },
    { id: 'recreation_room', name: 'Recreation Room', icon: Gamepad2, category: 'common', description: 'Games and entertainment spaces' },
    { id: 'lobby', name: 'Lobby', icon: Home, category: 'common', description: 'Main entrance and reception area' },
    { id: 'hallway', name: 'Hallway', icon: ArrowLeft, category: 'circulation', description: 'Corridors and walkways' },
    { id: 'office', name: 'Office', icon: FileText, category: 'administrative', description: 'Staff and administrative offices' },
    { id: 'kitchen', name: 'Kitchen', icon: Utensils, category: 'service', description: 'Food preparation areas' },
    { id: 'laundry', name: 'Laundry', icon: Settings, category: 'service', description: 'Laundry and cleaning facilities' },
    { id: 'storage', name: 'Storage', icon: Database, category: 'service', description: 'Storage and utility rooms' }
];

const cameraTypeTemplates = [
    { id: 'dome_indoor', name: 'Indoor Dome Camera', specs: '1080p, Night Vision, PTZ', environments: ['indoor'], cost: '$299' },
    { id: 'bullet_outdoor', name: 'Outdoor Bullet Camera', specs: '4K, Weatherproof, IR', environments: ['outdoor'], cost: '$399' },
    { id: 'ptz_outdoor', name: 'PTZ Outdoor Camera', specs: '4K, 30x Zoom, Auto-track', environments: ['outdoor'], cost: '$899' },
    { id: 'covert_indoor', name: 'Covert Indoor Camera', specs: '1080p, Discrete, Audio', environments: ['indoor'], cost: '$249' },
    { id: 'doorbell_camera', name: 'Video Doorbell', specs: '1080p, Two-way Audio, Motion', environments: ['entrance'], cost: '$199' },
    { id: 'thermal_camera', name: 'Thermal Camera', specs: 'Heat Detection, Alert System', environments: ['indoor', 'outdoor'], cost: '$1299' }
];

const buildingLayoutTemplates = [
    { id: 'single_story', name: 'Single Story', description: 'One floor, easy access', icon: '🏠', benefits: ['Wheelchair accessible', 'Lower construction cost', 'Easy navigation'] },
    { id: 'multi_story', name: 'Multi-Story', description: '2-4 floors with elevators', icon: '🏢', benefits: ['Space efficient', 'Separate care levels', 'Cost effective per unit'] },
    { id: 'tower', name: 'Tower Design', description: '5+ floors, vertical layout', icon: '🏬', benefits: ['Maximum capacity', 'Urban friendly', 'Centralized services'] },
    { id: 'campus', name: 'Campus Style', description: 'Multiple connected buildings', icon: '🏘️', benefits: ['Flexible expansion', 'Specialized buildings', 'Community feel'] },
    { id: 'cottage', name: 'Cottage Style', description: 'Small residential units', icon: '🏡', benefits: ['Homelike environment', 'Personal care', 'Family oriented'] }
];

const facilityTypeTemplates = [
    {
        id: 'assisted_living',
        name: 'Assisted Living Facility',
        icon: '🏥',
        description: 'Independent living with personal care services',
        features: ['24/7 staff', 'Medication management', 'Housekeeping', 'Meal service']
    },
    {
        id: 'memory_care',
        name: 'Memory Care Facility',
        icon: '🧠',
        description: 'Specialized care for dementia and Alzheimer\'s',
        features: ['Secure environment', 'Cognitive programs', 'Specialized staff', 'Safety monitoring']
    },
    {
        id: 'skilled_nursing',
        name: 'Skilled Nursing Facility',
        icon: '🏥',
        description: 'Medical care and rehabilitation services',
        features: ['Licensed nurses', 'Therapy services', 'Medical equipment', '24/7 care']
    },
    {
        id: 'independent_living',
        name: 'Independent Living',
        icon: '🏠',
        description: 'Maintenance-free living for active seniors',
        features: ['Private apartments', 'Community activities', 'Fitness center', 'Transportation']
    },
    {
        id: 'ccrc',
        name: 'Continuing Care Retirement Community (CCRC)',
        icon: '🏘️',
        description: 'Full spectrum of care from independent to skilled nursing',
        features: ['Multiple care levels', 'Aging in place', 'Healthcare services', 'Life care contracts']
    },
    {
        id: 'adult_day_care',
        name: 'Adult Day Care Center',
        icon: '🌅',
        description: 'Daytime supervision and activities for seniors',
        features: ['Daytime programs', 'Social activities', 'Meals included', 'Transportation services']
    },
    {
        id: 'adult_family_home',
        name: 'Adult Family Home',
        icon: '🏡',
        description: 'Small residential care in home-like setting',
        features: ['Home environment', 'Small capacity', 'Personal care', 'Family atmosphere']
    },
    {
        id: 'board_and_care',
        name: 'Board and Care Home',
        icon: '🏠',
        description: 'Residential care facility with shared living',
        features: ['Shared rooms', 'Basic care services', 'Meal provision', 'Supervision']
    },
    {
        id: 'rehabilitation',
        name: 'Rehabilitation Center',
        icon: '🏋️',
        description: 'Short-term recovery and therapy services',
        features: ['Physical therapy', 'Occupational therapy', 'Speech therapy', 'Medical supervision']
    },
    {
        id: 'respite_care',
        name: 'Respite Care Facility',
        icon: '💤',
        description: 'Temporary care to provide caregiver relief',
        features: ['Short-term stays', 'Emergency care', 'Caregiver support', 'Flexible scheduling']
    },
    {
        id: 'senior_housing',
        name: 'Senior Housing Complex',
        icon: '🏢',
        description: 'Age-restricted housing for independent seniors',
        features: ['Age-restricted', 'Affordable housing', 'Community amenities', 'Social programs']
    },
    {
        id: 'active_adult',
        name: 'Active Adult Community',
        icon: '⛳',
        description: 'Recreation-focused living for active seniors',
        features: ['Golf courses', 'Recreation centers', 'Fitness facilities', 'Social clubs']
    },
    {
        id: 'alzheimers_care',
        name: 'Alzheimer\'s Specialty Care',
        icon: '🧩',
        description: 'Specialized facility for Alzheimer\'s patients',
        features: ['Locked units', 'Specialized programs', 'Behavioral support', 'Family training']
    },
    {
        id: 'veterans_home',
        name: 'Veterans Care Home',
        icon: '🎖️',
        description: 'Specialized care facility for military veterans',
        features: ['VA benefits', 'Military culture', 'Specialized services', 'Veteran community']
    },
    {
        id: 'psychiatric_care',
        name: 'Geriatric Psychiatric Facility',
        icon: '🧠',
        description: 'Mental health services for seniors',
        features: ['Mental health care', 'Psychiatric services', 'Therapy programs', 'Medication management']
    }
];


const DashboardConfigurationWizard = () => {
    // Use a loosely-typed selector to avoid relying on the full inferred ConfigurationState
    // (prevents TypeScript from resolving outdated declaration files in dist/)
    const useConfigAny: any = useConfigurationStore as any;
    const saveFacilityProfile = useConfigAny((s: any) => s.setFacilityProfile);
    const markAsConfigured = useConfigAny((s: any) => s.markAsConfigured);
    const setRoomCameraAssignments = useConfigAny((s: any) => s.setRoomCameraAssignments);
    const [currentStep, setCurrentStep] = useState(0);

    const [facilityProfile, setFacilityProfile] = useState({
        name: '',
        type: '',
        location: '',
        totalCapacity: 0,
        currentResidents: 0,
        staffCount: 0,
        buildingCount: 1,
        floorsPerBuilding: 1,
        layoutStyle: '',
        totalSquareFootage: 0,
        outdoorAcres: 0,
        parkingSpaces: 0,
        roomTypes: {},
        roomNames: {},
        cameras: [],
        features: [],
        aiIntegrations: [],
        cameraAssignments: {},
        buildingType: ''
    });

    const [expandedRoomType, setExpandedRoomType] = useState<string | null>(null);
    const [bulkNamingInputs, setBulkNamingInputs] = useState<Record<string, string>>({});

    // Local UI state for naming rooms and choosing camera types per room
    const [roomNames, setRoomNames] = useState<Record<string, string>>({});
    const [roomCameraPrefs, setRoomCameraPrefs] = useState<Record<string, { preferredType?: string; camerasRequired?: number }>>({});

    // Build flat list of individual rooms from roomTypes counts
    const buildRoomsFromRoomTypes = (roomTypes: Record<string, number>) => {
        const rooms: { roomId: string; roomType: string; defaultName: string }[] = [];
        Object.entries(roomTypes || {}).forEach(([roomType, count]) => {
            const roomCount = typeof count === 'number' ? count : 0;
            for (let i = 1; i <= roomCount; i++) {
                const roomId = `${roomType}_${i}`;
                const defaultName = `${roomType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${i}`;
                rooms.push({ roomId, roomType, defaultName });
            }
        });
        return rooms;
    };

    // Keep roomNames in sync when counts change (preserve existing names where possible)
    useEffect(() => {
        const rooms = buildRoomsFromRoomTypes(facilityProfile.roomTypes || {});
        setRoomNames(prev => {
            const next: Record<string, string> = {};
            rooms.forEach(r => {
                next[r.roomId] = prev[r.roomId] || r.defaultName;
            });
            return next;
        });
        // ensure camera prefs exist for rooms
        setRoomCameraPrefs(prev => {
            const next: typeof prev = { ...prev };
            rooms.forEach(r => {
                next[r.roomId] = next[r.roomId] || { preferredType: undefined, camerasRequired: 1 };
            });
            return next;
        });
    }, [facilityProfile.roomTypes]);

    // Local handler to update typed room name (keeps local roomNames state)
    const handleRoomNameChange = (roomId: string, name: string) => {
        setRoomNames(prev => ({ ...prev, [roomId]: name }));
    };

    // Fix operator precedence: ensure (camerasRequired ?? prev...) evaluated before || 1
    const handleRoomCameraPrefChange = (roomId: string, preferredType?: string, camerasRequired?: number) => {
        setRoomCameraPrefs(prev => ({
            ...prev,
            [roomId]: {
                preferredType: preferredType || prev[roomId]?.preferredType,
                camerasRequired: (camerasRequired ?? prev[roomId]?.camerasRequired) || 1
            }
        }));
    };

    // Memoized input change handlers to prevent re-renders
    const handleNameChange = useCallback((value: string) => {
        setFacilityProfile(prev => ({ ...prev, name: value }));
    }, []);

    const handleLocationChange = useCallback((value: string) => {
        setFacilityProfile(prev => ({ ...prev, location: value }));
    }, []);

    const handleCapacityChange = useCallback((value: number) => {
        setFacilityProfile(prev => ({ ...prev, totalCapacity: value }));
    }, []);

    const handleResidentsChange = useCallback((value: number) => {
        setFacilityProfile(prev => ({ ...prev, currentResidents: value }));
    }, []);

    const handleStaffChange = useCallback((value: number) => {
        setFacilityProfile(prev => ({ ...prev, staffCount: value }));
    }, []);

    const handleLayoutChange = useCallback((layoutId: string) => {
        setFacilityProfile(prev => ({ ...prev, layoutStyle: layoutId }));
    }, []);

    const handleRoomTypeChange = useCallback((roomId: string, count: number) => {
        setFacilityProfile(prev => ({
            ...prev,
            roomTypes: { ...prev.roomTypes, [roomId]: count }
        }));
    }, []);

    // Handle facility type selection from OverviewStep
    const handleTypeChange = useCallback((typeId: string) => {
        setFacilityProfile(prev => ({ ...prev, type: typeId }));
    }, []);

    // Bulk room naming should update local roomNames (not facilityProfile) to avoid unnecessary re-renders and duplicate declarations
    const handleBulkRoomNaming = useCallback((roomType: string, baseName: string) => {
        const roomCount = facilityProfile.roomTypes?.[roomType] || 0;
        setRoomNames(prev => {
            const newNames = { ...prev };
            for (let i = 0; i < roomCount; i++) {
                const roomId = `${roomType}_${i + 1}`;
                if (!newNames[roomId]) {
                    newNames[roomId] = `${baseName}${String(i + 1).padStart(3, '0')}`;
                }
            }
            return newNames;
        });
    }, [facilityProfile.roomTypes]);

    // Memoized statistics calculations
    const facilityStats = useMemo(() => {
        const occupancyRate = facilityProfile.totalCapacity > 0
            ? Math.round((facilityProfile.currentResidents / facilityProfile.totalCapacity) * 100)
            : 0;

        const staffRatio = facilityProfile.staffCount > 0 && facilityProfile.currentResidents > 0
            ? (facilityProfile.currentResidents / facilityProfile.staffCount).toFixed(1)
            : '0';

        const availableSpaces = facilityProfile.totalCapacity - facilityProfile.currentResidents;

        return { occupancyRate, staffRatio, availableSpaces };
    }, [facilityProfile.totalCapacity, facilityProfile.currentResidents, facilityProfile.staffCount]);

    const handleSave = () => {
        try {
            console.log('Starting save process...');

            // Convert your local state to the store format
            const storeProfile = {
                name: facilityProfile.name,
                type: facilityProfile.type,
                bedCount: facilityProfile.totalCapacity,
                units: Object.keys(facilityProfile.roomTypes || {}),
                cameraCount: facilityProfile.cameras?.length || 0,
                roomTypes: facilityProfile.roomTypes || {}
            };

            console.log('Saving profile:', storeProfile);
            saveFacilityProfile(storeProfile);

            console.log('Marking as configured...');
            markAsConfigured();

            console.log('Configuration process completed');
        } catch (error) {
            console.error('Error during save:', error);
            alert('Error saving configuration: ' + error.message);
        }
    };

    const steps = [
        { id: 'overview', name: 'Overview', icon: Target, description: 'Choose your facility type' },
        { id: 'facility', name: 'Facility Details', icon: Building, description: 'Basic information' },
        { id: 'layout', name: 'Layout & Rooms', icon: Home, description: 'Structure and rooms' },
        { id: 'technology', name: 'Technology', icon: Camera, description: 'Cameras and AI features' },
        { id: 'review', name: 'Review', icon: CheckCircle, description: 'Final configuration' }
    ];

    // Step 0: Overview - Facility Type Selection
    const OverviewStep = React.memo(() => (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
                }}>
                    <Target size={40} color="white" />
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1f2937', marginBottom: '12px' }}>
                    Welcome to EverSight Care
                </h1>
                <p style={{ color: '#6b7280', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                    Let's configure your facility to maximize care delivery and operational efficiency with AI-powered solutions
                </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '16px', textAlign: 'center' }}>
                    Select Your Facility Type
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {facilityTypeTemplates.map((type) => {
                        const isSelected = facilityProfile.type === type.id;
                        return (
                            <div
                                key={type.id}
                                onClick={() => handleTypeChange(type.id)}
                                style={{
                                    padding: '20px',
                                    border: isSelected ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    backgroundColor: isSelected ? '#eff6ff' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isSelected ? '0 8px 25px rgba(59, 130, 246, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
                                    transform: isSelected ? 'translateY(-2px)' : 'none'
                                }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>
                                        {type.icon}
                                    </span>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        color: isSelected ? '#1e40af' : '#1f2937',
                                        marginBottom: '6px',
                                        lineHeight: '1.3'
                                    }}>
                                        {type.name}
                                    </h3>
                                    <p style={{
                                        color: isSelected ? '#3b82f6' : '#6b7280',
                                        fontSize: '12px',
                                        marginBottom: '12px',
                                        lineHeight: '1.4'
                                    }}>
                                        {type.description}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        marginBottom: '6px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Key Features
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        {type.features.map((feature, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '11px',
                                                color: isSelected ? '#1e40af' : '#6b7280'
                                            }}>
                                                <CheckCircle size={10} />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '8px',
                                        backgroundColor: '#3b82f6',
                                        borderRadius: '6px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>
                                            ✓ Selected
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    ));

    // Step 1: Basic Facility Information
    const FacilityDetailsStep = React.memo(() => (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                }}>
                    <Building size={32} color="white" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                    Facility Details
                </h2>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                    Tell us about your facility's basic information and capacity
                </p>
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Facility Name *
                        </label>
                        <input
                            type="text"
                            value={facilityProfile.name || ''}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g., Sunrise Senior Living - Main Campus"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Location
                        </label>
                        <input
                            type="text"
                            value={facilityProfile.location || ''}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            placeholder="e.g., Palo Alto, CA"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Total Capacity *
                        </label>
                        <input
                            type="number"
                            value={facilityProfile.totalCapacity || ''}
                            onChange={(e) => handleCapacityChange(parseInt(e.target.value) || 0)}
                            placeholder="150"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Current Residents
                        </label>
                        <input
                            type="number"
                            value={facilityProfile.currentResidents || ''}
                            onChange={(e) => handleResidentsChange(parseInt(e.target.value) || 0)}
                            placeholder="125"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Staff Count
                        </label>
                        <input
                            type="number"
                            value={facilityProfile.staffCount || ''}
                            onChange={(e) => handleStaffChange(parseInt(e.target.value) || 0)}
                            placeholder="45"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Facility Statistics Display */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    padding: '24px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    marginTop: '24px'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
                            {facilityStats.occupancyRate}%
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Occupancy Rate</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                            {facilityStats.staffRatio}:1
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Resident:Staff Ratio</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                            {facilityStats.availableSpaces}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Available Spaces</div>
                    </div>
                </div>
            </div>
        </div>
    ));

    // Step 2: Layout and Rooms
    const LayoutRoomsStep = React.memo(() => (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                }}>
                    <Home size={32} color="white" />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                    Building Layout & Room Configuration
                </h2>
                <p style={{ color: '#6b7280', fontSize: '16px' }}>
                    Configure your facility's structure and room types
                </p>
            </div>

            {/* Building Layout Selection */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb',
                marginBottom: '24px'
            }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Building Layout Style
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {buildingLayoutTemplates.map((layout) => {
                        const isSelected = facilityProfile.layoutStyle === layout.id;
                        return (
                            <div
                                key={layout.id}
                                onClick={() => handleLayoutChange(layout.id)}
                                style={{
                                    padding: '20px',
                                    border: isSelected ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    backgroundColor: isSelected ? '#eff6ff' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{layout.icon}</div>
                                <div style={{ fontWeight: '600', marginBottom: '4px', color: isSelected ? '#1e40af' : '#1f2937' }}>
                                    {layout.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                                    {layout.description}
                                </div>
                                <div style={{ fontSize: '11px' }}>
                                    {layout.benefits.map((benefit, idx) => (
                                        <div key={idx} style={{
                                            color: isSelected ? '#3b82f6' : '#6b7280',
                                            marginBottom: '2px'
                                        }}>
                                            • {benefit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Room Configuration */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb'
            }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                    Room Types & Quantities
                </h3>

                {roomTypeTemplatesByCategory.map(({ category, categoryName, categoryRooms }) => (
                    <div key={category} style={{ marginBottom: '32px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                            {categoryName} Spaces
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                            {categoryRooms.map((room) => {
                                const IconComponent = room.icon;
                                const currentCount = facilityProfile.roomTypes?.[room.id] || 0;
                                const isExpanded = expandedRoomType === room.id;

                                return (
                                    <div key={room.id} style={{
                                        padding: '20px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px',
                                        backgroundColor: '#f9fafb',
                                        transition: 'border-color 0.2s ease'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: '#3b82f6',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <IconComponent size={20} color="white" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                                                    {room.name}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    {room.description}
                                                </div>
                                            </div>
                                            {currentCount > 0 && (
                                                <button
                                                    onClick={() => setExpandedRoomType(isExpanded ? null : room.id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: isExpanded ? '#ef4444' : '#3b82f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {isExpanded ? 'Hide Names' : 'Name Rooms'}
                                                </button>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <input
                                                type="number"
                                                value={currentCount}
                                                onChange={(e) => handleRoomTypeChange(room.id, parseInt(e.target.value) || 0)}
                                                placeholder="Quantity"
                                                min="0"
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    border: '2px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    backgroundColor: 'white'
                                                }}
                                            />
                                            {currentCount > 0 && (
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#6b7280',
                                                    fontWeight: '500',
                                                    minWidth: '60px'
                                                }}>
                                                    {currentCount} rooms
                                                </div>
                                            )}
                                        </div>

                                        {/* Individual Room Naming */}
                                        {isExpanded && currentCount > 0 && (
                                            <div style={{
                                                marginTop: '20px',
                                                padding: '16px',
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                                    <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>
                                                        Room Names
                                                    </h5>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <input
                                                            type="text"
                                                            placeholder="Base name (e.g., Room)"
                                                            value={bulkNamingInputs[room.id] || ''}
                                                            onChange={(e) => setBulkNamingInputs(prev => ({
                                                                ...prev,
                                                                [room.id]: e.target.value
                                                            }))}
                                                            style={{
                                                                padding: '6px 12px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                width: '120px'
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const baseName = bulkNamingInputs[room.id] || room.name.split(' ')[0];
                                                                handleBulkRoomNaming(room.id, baseName);
                                                            }}
                                                            style={{
                                                                padding: '6px 12px',
                                                                backgroundColor: '#10b981',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Auto-Name
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                                    gap: '8px',
                                                    maxHeight: '200px',
                                                    overflowY: 'auto'
                                                }}>
                                                    {Array.from({ length: currentCount }, (_, index) => {
                                                        const roomId = `${room.id}_${index + 1}`;
                                                        const currentName = roomNames[roomId] || '';

                                                        return (
                                                            <div key={roomId} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{
                                                                    fontSize: '12px',
                                                                    color: '#6b7280',
                                                                    minWidth: '40px'
                                                                }}>
                                                                    #{index + 1}
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    value={currentName}
                                                                    onChange={(e) => handleRoomNameChange(roomId, e.target.value)}
                                                                    placeholder={`Room ${index + 1}`}
                                                                    style={{
                                                                        flex: 1,
                                                                        padding: '6px 8px',
                                                                        border: '1px solid #d1d5db',
                                                                        borderRadius: '4px',
                                                                        fontSize: '12px',
                                                                        outline: 'none'
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ));

    // Step 3: Technology Configuration
    const TechnologyStep = () => {
        const rooms = buildRoomsFromRoomTypes(facilityProfile.roomTypes || {});
        return (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Technology & Camera Assignments</h2>
                    <p style={{ color: '#6b7280' }}>Choose the preferred camera type for each room and how many cameras you want installed.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {rooms.map(r => (
                        <div key={r.roomId} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: 'white' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>{roomNames[r.roomId] || r.defaultName}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>{r.roomType}</div>

                            <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Preferred Camera Type</label>
                            <select
                                value={roomCameraPrefs[r.roomId]?.preferredType || ''}
                                onChange={(e) => handleRoomCameraPrefChange(r.roomId, e.target.value || undefined)}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '12px' }}
                            >
                                <option value="">Auto (recommended)</option>
                                {cameraTypeTemplates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} — {t.specs}</option>
                                ))}
                            </select>

                            <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Cameras to Install</label>
                            <input
                                type="number"
                                min={1}
                                max={10}
                                value={roomCameraPrefs[r.roomId]?.camerasRequired || 1}
                                onChange={(e) => handleRoomCameraPrefChange(r.roomId, undefined, parseInt(e.target.value) || 1)}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Review and Submit step
    const ReviewStep = () => {
        const rooms = buildRoomsFromRoomTypes(facilityProfile.roomTypes || {});
        const handleSubmit = () => {
            // Build store profile and assignments
            const storeProfile = {
                name: facilityProfile.name,
                type: facilityProfile.type,
                bedCount: facilityProfile.totalCapacity,
                units: Object.keys(facilityProfile.roomTypes || {}),
                cameraCount: facilityProfile.cameras?.length || 0,
                roomTypes: facilityProfile.roomTypes || {},
            };
            // Save facility profile (this will also generate default room assignments in store)
            saveFacilityProfile(storeProfile);

            // Build custom room assignments including our preferred camera types
            const roomAssignments: any[] = rooms.map(r => ({
                roomId: r.roomId,
                roomType: r.roomType,
                roomName: roomNames[r.roomId] || r.defaultName,
                assignedCameras: [],
                recommendedCameraTypes: roomCameraPrefs[r.roomId]?.preferredType ? [roomCameraPrefs[r.roomId].preferredType!] : [],
                maxCameras: roomCameraPrefs[r.roomId]?.camerasRequired || 1,
            }));

            setRoomCameraAssignments(roomAssignments as any);
            markAsConfigured();
            alert('Configuration saved. Room assignments and preferences have been stored.');
        };

        return (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Review Configuration</h2>
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                    <div><strong>Facility:</strong> {facilityProfile.name} ({facilityProfile.type})</div>
                    <div><strong>Capacity:</strong> {facilityProfile.totalCapacity}</div>
                    <div><strong>Rooms:</strong> {rooms.length}</div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Room Assignments</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                        {rooms.map(r => (
                            <div key={r.roomId} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white' }}>
                                <div style={{ fontWeight: '600' }}>{roomNames[r.roomId] || r.defaultName}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{r.roomType}</div>
                                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                                    Preferred: {roomCameraPrefs[r.roomId]?.preferredType || 'Auto'} • Cameras: {roomCameraPrefs[r.roomId]?.camerasRequired || 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button onClick={handleSubmit} style={{ padding: '10px 16px', background: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none' }}>
                        Save & Finish
                    </button>
                </div>
            </div>
        );
    };

    // Memoized room type templates by category
    const roomTypeTemplatesByCategory = useMemo(() => {
        return ['residential', 'common', 'service', 'administrative'].map((category) => {
            const categoryRooms = roomTypeTemplates.filter(room => room.category === category);
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
            return { category, categoryName, categoryRooms };
        });
    }, []);

    // Navigation and Progress
    const navigation = (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '32px',
            marginTop: '32px',
            borderTop: '2px solid #e5e7eb'
        }}>
            <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                style={{
                    padding: '12px 24px',
                    backgroundColor: currentStep === 0 ? '#f3f4f6' : '#6b7280',
                    color: currentStep === 0 ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <ArrowLeft size={16} />
                Previous
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {steps.map((step, index) => (
                    <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: index <= currentStep ? '#3b82f6' : '#e5e7eb',
                            color: index <= currentStep ? 'white' : '#9ca3af',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                            <div style={{
                                width: '24px',
                                height: '2px',
                                backgroundColor: index < currentStep ? '#3b82f6' : '#e5e7eb',
                                marginLeft: '8px',
                                marginRight: '8px'
                            }} />
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={() => {
                    if (currentStep === steps.length - 1) {
                        handleSave(); // Change this line
                    } else {
                        setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
                    }
                }}
                style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {currentStep === steps.length - 1 ? (
                    <>
                        <Save size={16} />
                        Save Configuration
                    </>
                ) : (
                    <>
                        Next
                        <ChevronRight size={16} />
                    </>
                )}
            </button>
        </div>
    );

    return (
        <div style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: '#f3f4f6',
            minHeight: '100vh',
            padding: '24px'
        }}>
            {/* Progress Header */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto 32px',
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                        EverSight Care Configuration
                    </h1>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Step {currentStep + 1} of {steps.length}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;

                        return (
                            <div key={step.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                backgroundColor: isActive ? '#eff6ff' : isCompleted ? '#f0fdf4' : '#f9fafb',
                                border: isActive ? '2px solid #3b82f6' : '1px solid #e5e7eb'
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    backgroundColor: isActive ? '#3b82f6' : isCompleted ? '#10b981' : '#e5e7eb',
                                    color: isActive || isCompleted ? 'white' : '#9ca3af',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {isActive ? <Loader2 size={16} color="white" /> : index + 1}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '500', color: isActive ? '#1f2937' : '#374151' }}>
                                        {step.name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: isActive ? '#3b82f6' : '#6b7280' }}>
                                        {step.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
                {currentStep === 0 && <OverviewStep />}
                {currentStep === 1 && <FacilityDetailsStep />}
                {currentStep === 2 && <LayoutRoomsStep />}
                {currentStep === 3 && <TechnologyStep />}
                {currentStep === 4 && <ReviewStep />}
            </div>

            {/* Navigation */}
            {navigation}
        </div>
    );
};

export default DashboardConfigurationWizard;