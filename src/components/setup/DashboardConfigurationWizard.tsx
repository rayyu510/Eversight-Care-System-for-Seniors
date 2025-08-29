import React, { useState } from 'react';
import { useConfigurationStore } from '../../store/configurationStore'; // corrected relative path

import {
    Settings, Plus, Trash2, Save, ArrowLeft, AlertCircle, TrendingUp,
    Users, Shield, Activity, Clock, Video, Eye, Heart, Database,
    CheckCircle, Upload, Download, FileText, Monitor, Building, Camera,
    Wifi, Server, ChevronRight, ChevronDown, X, Home, MapPin, Trees, Car,
    Utensils, Gamepad2, Bed, Bath, Edit3, Star, Zap, Target, Globe
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


const EnhancedDashboardConfigurationWizard = () => {
    const { setFacilityProfile: saveFacilityProfile, markAsConfigured } = useConfigurationStore();
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
        units: [],
        cameras: [],
        features: [],
        aiIntegrations: []
    });

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
    const OverviewStep = () => (
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
                                onClick={() => setFacilityProfile({ ...facilityProfile, type: type.id })}
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
    );

    // Step 1: Basic Facility Information
    const FacilityDetailsStep = () => (
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
                            onChange={(e) => setFacilityProfile({ ...facilityProfile, name: e.target.value })}
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
                            onChange={(e) => setFacilityProfile({ ...facilityProfile, location: e.target.value })}
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
                            onChange={(e) => setFacilityProfile({ ...facilityProfile, totalCapacity: parseInt(e.target.value) || 0 })}
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
                            onChange={(e) => setFacilityProfile({ ...facilityProfile, currentResidents: parseInt(e.target.value) || 0 })}
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
                            onChange={(e) => setFacilityProfile({ ...facilityProfile, staffCount: parseInt(e.target.value) || 0 })}
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
                            {Math.round((facilityProfile.currentResidents / facilityProfile.totalCapacity) * 100) || 0}%
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Occupancy Rate</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                            {facilityProfile.staffCount ? (facilityProfile.currentResidents / facilityProfile.staffCount).toFixed(1) : '0'}:1
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Resident:Staff Ratio</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                            {facilityProfile.totalCapacity - facilityProfile.currentResidents || 0}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Available Spaces</div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Step 2: Layout and Rooms
    const LayoutRoomsStep = () => (
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
                                onClick={() => setFacilityProfile({ ...facilityProfile, layoutStyle: layout.id })}
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

                {['residential', 'common', 'service', 'administrative'].map((category) => {
                    const categoryRooms = roomTypeTemplates.filter(room => room.category === category);
                    const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');

                    return (
                        <div key={category} style={{ marginBottom: '32px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                                {categoryName} Spaces
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                                {categoryRooms.map((room) => {
                                    const IconComponent = room.icon;
                                    const currentCount = facilityProfile.roomTypes?.[room.id] || 0;

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
                                                <div>
                                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                                                        {room.name}
                                                    </div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        {room.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                type="number"
                                                value={currentCount}
                                                onChange={(e) => {
                                                    const newRoomTypes = { ...facilityProfile.roomTypes };
                                                    newRoomTypes[room.id] = parseInt(e.target.value) || 0;
                                                    setFacilityProfile({ ...facilityProfile, roomTypes: newRoomTypes });
                                                }}
                                                placeholder="Quantity"
                                                min="0"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: '2px solid #d1d5db',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    backgroundColor: 'white'
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

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
                                    borderRadius: '50%',
                                    backgroundColor: isActive ? '#3b82f6' : isCompleted ? '#10b981' : '#e5e7eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {isCompleted ? (
                                        <CheckCircle size={14} color="white" />
                                    ) : (
                                        <IconComponent size={14} color={isActive ? 'white' : '#9ca3af'} />
                                    )}
                                </div>
                                <div>
                                    <div style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: isActive ? '#1e40af' : isCompleted ? '#059669' : '#6b7280'
                                    }}>
                                        {step.name}
                                    </div>
                                    <div style={{
                                        fontSize: '10px',
                                        color: isActive ? '#3b82f6' : '#9ca3af'
                                    }}>
                                        {step.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
                padding: '48px'
            }}>
                {currentStep === 0 && <OverviewStep />}
                {currentStep === 1 && <FacilityDetailsStep />}
                {currentStep === 2 && <LayoutRoomsStep />}
                {currentStep === 3 && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <Camera size={64} color="#3b82f6" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                            Technology Configuration
                        </h3>
                        <p style={{ color: '#6b7280' }}>Camera setup and AI integrations - Coming soon</p>
                    </div>
                )}
                {currentStep === 4 && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <CheckCircle size={64} color="#10b981" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                            Configuration Review
                        </h3>
                        <p style={{ color: '#6b7280' }}>Review and finalize your settings - Coming soon</p>
                    </div>
                )}

                {navigation}
            </div>
        </div>
    );
};

export default EnhancedDashboardConfigurationWizard;