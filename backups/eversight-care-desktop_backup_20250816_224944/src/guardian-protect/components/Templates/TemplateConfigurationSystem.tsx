import React, { useState, useRef } from 'react';
import {
    Plus, Save, Upload, Download, Copy, Settings, Users, Camera,
    MapPin, Calendar, FileText, ChevronRight, ChevronDown,
    Edit3, Trash2, Eye, CheckCircle, AlertCircle, Clock,
    Building, Bed, Shield, Activity, Phone, Mail
} from 'lucide-react';

// Template Configuration System Types
interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'phone' | 'select' | 'multiselect' | 'date' | 'time' | 'textarea' | 'file' | 'toggle' | 'coordinates' | 'color';
    required: boolean;
    placeholder?: string;
    options?: string[];
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
    defaultValue?: any;
    helpText?: string;
}

interface Template {
    id: string;
    name: string;
    category: 'floor_plan' | 'camera' | 'resident' | 'staff' | 'schedule' | 'emergency';
    description: string;
    icon: string;
    fields: TemplateField[];
    previewImage?: string;
    isBuiltIn: boolean;
    usageCount: number;
    lastModified: string;
}


// No-Code Template Builder Component
const TemplateConfigurationSystem: React.FC = () => {
    console.log('🎉 TemplateConfigurationSystem component is loading!');
    const [activeCategory, setActiveCategory] = useState<string>('floor_plan');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);



    // Built-in Templates
    const builtInTemplates: Template[] = [
        {
            id: 'floor_plan_residential',
            name: 'Residential Floor Plan',
            category: 'floor_plan',
            description: 'Standard residential care facility floor plan with rooms and common areas',
            icon: 'Building',
            isBuiltIn: true,
            usageCount: 45,
            lastModified: '2025-08-09',
            fields: [
                {
                    id: 'facility_name',
                    label: 'Facility Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter facility name',
                    helpText: 'The name of your care facility'
                },
                {
                    id: 'floor_level',
                    label: 'Floor Level',
                    type: 'select',
                    required: true,
                    options: ['Ground Floor', 'First Floor', 'Second Floor', 'Basement', 'Mezzanine'],
                    defaultValue: 'Ground Floor'
                },
                {
                    id: 'total_area',
                    label: 'Total Area (sq ft)',
                    type: 'number',
                    required: true,
                    validation: { min: 100, max: 50000 },
                    helpText: 'Total floor area in square feet'
                },
                {
                    id: 'room_count',
                    label: 'Number of Rooms',
                    type: 'number',
                    required: true,
                    validation: { min: 1, max: 100 }
                },
                {
                    id: 'common_areas',
                    label: 'Common Areas',
                    type: 'multiselect',
                    required: false,
                    options: ['Living Room', 'Dining Room', 'Kitchen', 'Recreation Room', 'Library', 'Garden', 'Therapy Room']
                },
                {
                    id: 'emergency_exits',
                    label: 'Emergency Exit Count',
                    type: 'number',
                    required: true,
                    validation: { min: 2, max: 20 },
                    helpText: 'Number of emergency exits on this floor'
                },
                {
                    id: 'accessibility_features',
                    label: 'Accessibility Features',
                    type: 'multiselect',
                    required: false,
                    options: ['Wheelchair Accessible', 'Elevator Access', 'Ramps', 'Grab Bars', 'Wide Doorways', 'Visual Alarms']
                },
                {
                    id: 'upload_blueprint',
                    label: 'Upload Floor Plan Image',
                    type: 'file',
                    required: false,
                    helpText: 'Upload a JPG, PNG, or PDF of your floor plan'
                }
            ]
        },
        {
            id: 'camera_installation',
            name: 'Camera Installation Setup',
            category: 'camera',
            description: 'Configure camera installations with location, specifications, and monitoring settings',
            icon: 'Camera',
            isBuiltIn: true,
            usageCount: 38,
            lastModified: '2025-08-09',
            fields: [
                {
                    id: 'camera_id',
                    label: 'Camera ID',
                    type: 'text',
                    required: true,
                    placeholder: 'CAM-001',
                    validation: { pattern: '^CAM-[0-9]{3}$', message: 'Format: CAM-XXX (e.g., CAM-001)' }
                },
                {
                    id: 'camera_name',
                    label: 'Camera Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Living Room Main Camera'
                },
                {
                    id: 'location_room',
                    label: 'Installation Room',
                    type: 'select',
                    required: true,
                    options: ['Living Room', 'Kitchen', 'Bedroom 1', 'Bedroom 2', 'Bathroom', 'Hallway', 'Dining Room', 'Entry']
                },
                {
                    id: 'coordinates',
                    label: 'Floor Plan Position',
                    type: 'coordinates',
                    required: true,
                    helpText: 'Click on the floor plan to set camera position'
                },
                {
                    id: 'camera_type',
                    label: 'Camera Type',
                    type: 'select',
                    required: true,
                    options: ['Fixed Dome', 'PTZ (Pan-Tilt-Zoom)', 'Bullet', 'Hidden/Discrete', 'Outdoor']
                },
                {
                    id: 'resolution',
                    label: 'Recording Resolution',
                    type: 'select',
                    required: true,
                    options: ['720p HD', '1080p Full HD', '4K Ultra HD'],
                    defaultValue: '1080p Full HD'
                },
                {
                    id: 'field_of_view',
                    label: 'Field of View (degrees)',
                    type: 'number',
                    required: true,
                    validation: { min: 60, max: 180 },
                    defaultValue: 110
                },
                {
                    id: 'night_vision',
                    label: 'Night Vision Enabled',
                    type: 'toggle',
                    required: false,
                    defaultValue: true
                },
                {
                    id: 'motion_detection',
                    label: 'Motion Detection',
                    type: 'toggle',
                    required: false,
                    defaultValue: true
                },
                {
                    id: 'fall_detection',
                    label: 'AI Fall Detection',
                    type: 'toggle',
                    required: false,
                    defaultValue: true
                },
                {
                    id: 'privacy_mode',
                    label: 'Privacy Mode Available',
                    type: 'toggle',
                    required: false,
                    defaultValue: false,
                    helpText: 'Allow temporary privacy mode for this camera'
                },
                {
                    id: 'recording_schedule',
                    label: 'Recording Schedule',
                    type: 'select',
                    required: true,
                    options: ['24/7 Continuous', 'Motion Triggered Only', 'Scheduled Hours', 'Emergency Only'],
                    defaultValue: '24/7 Continuous'
                },
                {
                    id: 'installation_date',
                    label: 'Installation Date',
                    type: 'date',
                    required: true,
                    defaultValue: new Date().toISOString().split('T')[0]
                },
                {
                    id: 'installer_notes',
                    label: 'Installation Notes',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Any special installation requirements or notes...'
                }
            ]
        },
        {
            id: 'resident_profile',
            name: 'Resident Profile',
            category: 'resident',
            description: 'Comprehensive resident information including medical, emergency contacts, and care preferences',
            icon: 'Users',
            isBuiltIn: true,
            usageCount: 67,
            lastModified: '2025-08-09',
            fields: [
                {
                    id: 'resident_id',
                    label: 'Resident ID',
                    type: 'text',
                    required: true,
                    placeholder: 'RES-001',
                    validation: { pattern: '^RES-[0-9]{3}$', message: 'Format: RES-XXX (e.g., RES-001)' }
                },
                {
                    id: 'first_name',
                    label: 'First Name',
                    type: 'text',
                    required: true,
                    placeholder: 'John'
                },
                {
                    id: 'last_name',
                    label: 'Last Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Doe'
                },
                {
                    id: 'date_of_birth',
                    label: 'Date of Birth',
                    type: 'date',
                    required: true
                },
                {
                    id: 'room_assignment',
                    label: 'Room Assignment',
                    type: 'select',
                    required: true,
                    options: ['Room 101', 'Room 102', 'Room 103', 'Room 201', 'Room 202', 'Room 203']
                },
                {
                    id: 'care_level',
                    label: 'Care Level Required',
                    type: 'select',
                    required: true,
                    options: ['Independent Living', 'Assisted Living', 'Memory Care', 'Skilled Nursing', 'Hospice Care']
                },
                {
                    id: 'mobility_status',
                    label: 'Mobility Status',
                    type: 'select',
                    required: true,
                    options: ['Fully Mobile', 'Walker Assisted', 'Wheelchair', 'Bedridden', 'Variable']
                },
                {
                    id: 'fall_risk_level',
                    label: 'Fall Risk Assessment',
                    type: 'select',
                    required: true,
                    options: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk']
                },
                {
                    id: 'medical_conditions',
                    label: 'Medical Conditions',
                    type: 'multiselect',
                    required: false,
                    options: ['Diabetes', 'Hypertension', 'Heart Disease', 'Dementia', 'Arthritis', 'Depression', 'Anxiety', 'COPD', 'Parkinson\'s']
                },
                {
                    id: 'medications',
                    label: 'Current Medications',
                    type: 'textarea',
                    required: false,
                    placeholder: 'List current medications, dosages, and schedules...'
                },
                {
                    id: 'allergies',
                    label: 'Known Allergies',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Food allergies, medication allergies, environmental allergies...'
                },
                {
                    id: 'emergency_contact_1_name',
                    label: 'Primary Emergency Contact',
                    type: 'text',
                    required: true,
                    placeholder: 'Jane Doe'
                },
                {
                    id: 'emergency_contact_1_relationship',
                    label: 'Relationship',
                    type: 'select',
                    required: true,
                    options: ['Spouse', 'Child', 'Sibling', 'Parent', 'Friend', 'Legal Guardian', 'Other']
                },
                {
                    id: 'emergency_contact_1_phone',
                    label: 'Primary Contact Phone',
                    type: 'phone',
                    required: true,
                    placeholder: '(555) 123-4567'
                },
                {
                    id: 'emergency_contact_2_name',
                    label: 'Secondary Emergency Contact',
                    type: 'text',
                    required: false,
                    placeholder: 'Bob Smith'
                },
                {
                    id: 'emergency_contact_2_phone',
                    label: 'Secondary Contact Phone',
                    type: 'phone',
                    required: false,
                    placeholder: '(555) 987-6543'
                },
                {
                    id: 'physician_name',
                    label: 'Primary Physician',
                    type: 'text',
                    required: false,
                    placeholder: 'Dr. Smith'
                },
                {
                    id: 'physician_phone',
                    label: 'Physician Phone',
                    type: 'phone',
                    required: false,
                    placeholder: '(555) 555-0123'
                },
                {
                    id: 'admission_date',
                    label: 'Admission Date',
                    type: 'date',
                    required: true
                },
                {
                    id: 'dietary_restrictions',
                    label: 'Dietary Restrictions',
                    type: 'multiselect',
                    required: false,
                    options: ['Diabetic', 'Low Sodium', 'Soft Foods', 'Pureed Foods', 'No Dairy', 'Vegetarian', 'Kosher', 'Halal']
                },
                {
                    id: 'preferences_activities',
                    label: 'Activity Preferences',
                    type: 'multiselect',
                    required: false,
                    options: ['Reading', 'Music', 'TV/Movies', 'Card Games', 'Crafts', 'Exercise', 'Gardening', 'Socializing']
                },
                {
                    id: 'special_notes',
                    label: 'Special Care Notes',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Any special care instructions, behavioral notes, or preferences...'
                }
            ]
        },
        {
            id: 'staff_schedule',
            name: 'Staff Scheduling',
            category: 'staff',
            description: 'Staff scheduling template with shifts, roles, and coverage requirements',
            icon: 'Calendar',
            isBuiltIn: true,
            usageCount: 29,
            lastModified: '2025-08-09',
            fields: [
                {
                    id: 'staff_id',
                    label: 'Staff ID',
                    type: 'text',
                    required: true,
                    placeholder: 'STF-001',
                    validation: { pattern: '^STF-[0-9]{3}$', message: 'Format: STF-XXX (e.g., STF-001)' }
                },
                {
                    id: 'staff_name',
                    label: 'Staff Member Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Sarah Johnson'
                },
                {
                    id: 'role',
                    label: 'Role/Position',
                    type: 'select',
                    required: true,
                    options: ['Registered Nurse (RN)', 'Licensed Practical Nurse (LPN)', 'Certified Nursing Assistant (CNA)', 'Care Assistant', 'Medication Aide', 'Activities Coordinator', 'Housekeeping', 'Maintenance', 'Administrator']
                },
                {
                    id: 'shift_type',
                    label: 'Shift Type',
                    type: 'select',
                    required: true,
                    options: ['Day Shift (7AM-3PM)', 'Evening Shift (3PM-11PM)', 'Night Shift (11PM-7AM)', 'Split Shift', 'On-Call']
                },
                {
                    id: 'work_days',
                    label: 'Work Days',
                    type: 'multiselect',
                    required: true,
                    options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                },
                {
                    id: 'start_time',
                    label: 'Shift Start Time',
                    type: 'time',
                    required: true,
                    defaultValue: '07:00'
                },
                {
                    id: 'end_time',
                    label: 'Shift End Time',
                    type: 'time',
                    required: true,
                    defaultValue: '15:00'
                },
                {
                    id: 'assigned_areas',
                    label: 'Assigned Areas/Wings',
                    type: 'multiselect',
                    required: false,
                    options: ['Wing A', 'Wing B', 'Common Areas', 'Memory Care Unit', 'Skilled Nursing', 'Administration']
                },
                {
                    id: 'specializations',
                    label: 'Specializations/Certifications',
                    type: 'multiselect',
                    required: false,
                    options: ['Dementia Care', 'Medication Administration', 'Wound Care', 'Physical Therapy', 'Occupational Therapy', 'Emergency Response', 'Mental Health']
                },
                {
                    id: 'phone_number',
                    label: 'Contact Phone',
                    type: 'phone',
                    required: true,
                    placeholder: '(555) 123-4567'
                },
                {
                    id: 'email',
                    label: 'Email Address',
                    type: 'email',
                    required: false,
                    placeholder: 'sarah.johnson@facility.com'
                },
                {
                    id: 'hire_date',
                    label: 'Hire Date',
                    type: 'date',
                    required: true
                },
                {
                    id: 'emergency_contact',
                    label: 'Staff Emergency Contact',
                    type: 'text',
                    required: true,
                    placeholder: 'Name and phone number'
                },
                {
                    id: 'coverage_notes',
                    label: 'Coverage & Substitute Notes',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Notes about shift coverage, substitutes, or special scheduling requirements...'
                }
            ]
        },
        {
            id: 'emergency_response',
            name: 'Emergency Response Plan',
            category: 'emergency',
            description: 'Emergency response procedures and contact information template',
            icon: 'Shield',
            isBuiltIn: true,
            usageCount: 15,
            lastModified: '2025-08-09',
            fields: [
                {
                    id: 'emergency_type',
                    label: 'Emergency Type',
                    type: 'select',
                    required: true,
                    options: ['Medical Emergency', 'Fall Incident', 'Fire Emergency', 'Severe Weather', 'Power Outage', 'Security Breach', 'Evacuation', 'Chemical Spill']
                },
                {
                    id: 'response_level',
                    label: 'Response Level',
                    type: 'select',
                    required: true,
                    options: ['Level 1 - Minor', 'Level 2 - Moderate', 'Level 3 - Major', 'Level 4 - Critical']
                },
                {
                    id: 'immediate_actions',
                    label: 'Immediate Response Actions',
                    type: 'textarea',
                    required: true,
                    placeholder: 'List step-by-step immediate actions to take...'
                },
                {
                    id: 'notification_contacts',
                    label: 'Who to Notify',
                    type: 'multiselect',
                    required: true,
                    options: ['911 Emergency Services', 'Facility Administrator', 'Charge Nurse', 'Family/Emergency Contacts', 'Primary Physician', 'Corporate Office', 'State Authorities']
                },
                {
                    id: 'primary_contact_phone',
                    label: 'Primary Emergency Phone',
                    type: 'phone',
                    required: true,
                    placeholder: '911 or facility emergency line'
                },
                {
                    id: 'backup_contact_phone',
                    label: 'Backup Contact Phone',
                    type: 'phone',
                    required: false,
                    placeholder: 'Secondary emergency contact'
                },
                {
                    id: 'equipment_needed',
                    label: 'Equipment/Supplies Needed',
                    type: 'multiselect',
                    required: false,
                    options: ['First Aid Kit', 'AED/Defibrillator', 'Oxygen Tank', 'Wheelchair/Stretcher', 'Fire Extinguisher', 'Flashlights', 'Emergency Radio', 'Evacuation Chairs']
                },
                {
                    id: 'special_considerations',
                    label: 'Special Considerations',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Special considerations for residents with mobility issues, dementia, medical conditions...'
                },
                {
                    id: 'documentation_required',
                    label: 'Documentation Requirements',
                    type: 'multiselect',
                    required: false,
                    options: ['Incident Report', 'Medical Assessment', 'Family Notification Log', 'Staff Witness Statements', 'Photos (if appropriate)', 'Regulatory Notifications']
                },
                {
                    id: 'follow_up_actions',
                    label: 'Follow-up Actions',
                    type: 'textarea',
                    required: false,
                    placeholder: 'Actions to take after immediate emergency response...'
                }
            ]
        }
    ];

    const categories = [
        { id: 'floor_plan', name: 'Floor Plans', icon: Building, color: 'blue' },
        { id: 'camera', name: 'Camera Setup', icon: Camera, color: 'green' },
        { id: 'resident', name: 'Resident Profiles', icon: Users, color: 'purple' },
        { id: 'staff', name: 'Staff Scheduling', icon: Calendar, color: 'orange' },
        { id: 'emergency', name: 'Emergency Plans', icon: Shield, color: 'red' }
    ];

    const filteredTemplates = builtInTemplates.filter(template => template.category === activeCategory);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const renderField = (field: TemplateField) => {
        const value = formData[field.id] || field.defaultValue || '';

        switch (field.type) {
            case 'text':
            case 'email':
            case 'phone':
                return (
                    <input
                        type={field.type}
                        id={field.id}
                        value={value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        id={field.id}
                        value={value}
                        onChange={(e) => handleFieldChange(field.id, parseInt(e.target.value) || 0)}
                        placeholder={field.placeholder}
                        min={field.validation?.min}
                        max={field.validation?.max}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                    />
                );

            case 'select':
                return (
                    <select
                        id={field.id}
                        value={value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );

            case 'multiselect':
                return (
                    <div className="space-y-2">
                        {field.options?.map(option => (
                            <label key={option} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={(value as string[] || []).includes(option)}
                                    onChange={(e) => {
                                        const currentValues = value as string[] || [];
                                        const newValues = e.target.checked
                                            ? [...currentValues, option]
                                            : currentValues.filter(v => v !== option);
                                        handleFieldChange(field.id, newValues);
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'date':
                return (
                    <input
                        type="date"
                        id={field.id}
                        value={value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                    />
                );

            case 'time':
                return (
                    <input
                        type="time"
                        id={field.id}
                        value={value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        id={field.id}
                        value={value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                    />
                );

            case 'toggle':
                return (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={field.id}
                            checked={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={field.id} className="text-sm text-gray-700">
                            {value ? 'Enabled' : 'Disabled'}
                        </label>
                    </div>
                );

            case 'file':
                return (
                    <div className="space-y-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleFieldChange(field.id, file.name);
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            accept=".jpg,.jpeg,.png,.pdf"
                        />
                        {value && (
                            <p className="text-sm text-gray-600">Selected: {value}</p>
                        )}
                    </div>
                );

            case 'coordinates':
                return (
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                placeholder="X Position (%)"
                                value={value?.x || ''}
                                onChange={(e) => handleFieldChange(field.id, { ...value, x: parseInt(e.target.value) || 0 })}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Y Position (%)"
                                value={value?.y || ''}
                                onChange={(e) => handleFieldChange(field.id, { ...value, y: parseInt(e.target.value) || 0 })}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <p className="text-xs text-gray-500">Position as percentage of floor plan (0-100)</p>
                    </div>
                );

            default:
                return null;
        }
    };

    const saveTemplate = () => {
        console.log('Saving template data:', formData);
        alert('Template saved successfully!');
        setSelectedTemplate(null);
        setFormData({});
    };

    const exportTemplate = () => {
        const dataStr = JSON.stringify(formData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedTemplate?.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Template Configuration System</h1>
                            <p className="text-gray-600">No-code/Low-code templates for easy data entry and configuration</p>
                        </div>
                        <div className="flex space-x-3">
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Create Custom Template</span>
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                                <Upload className="h-4 w-4" />
                                <span>Import Template</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Category Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Categories</h3>
                            <div className="space-y-2">
                                {categories.map(category => {
                                    const IconComponent = category.icon;
                                    const templateCount = builtInTemplates.filter(t => t.category === category.id).length;

                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => setActiveCategory(category.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeCategory === category.id
                                                ? `bg-${category.color}-100 text-${category.color}-700 border border-${category.color}-200`
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <IconComponent className="h-5 w-5" />
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                            <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                                {templateCount}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Usage Statistics</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Templates</span>
                                        <span className="font-medium">{builtInTemplates.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Most Used</span>
                                        <span className="font-medium">Resident Profile</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">This Month</span>
                                        <span className="font-medium">156 submissions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {!selectedTemplate ? (
                            /* Template Selection Grid */
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {categories.find(c => c.id === activeCategory)?.name} Templates
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">
                                            {filteredTemplates.length} templates available
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredTemplates.map(template => (
                                        <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            {template.icon === 'Building' && <Building className="h-6 w-6 text-blue-600" />}
                                                            {template.icon === 'Camera' && <Camera className="h-6 w-6 text-blue-600" />}
                                                            {template.icon === 'Users' && <Users className="h-6 w-6 text-blue-600" />}
                                                            {template.icon === 'Calendar' && <Calendar className="h-6 w-6 text-blue-600" />}
                                                            {template.icon === 'Shield' && <Shield className="h-6 w-6 text-blue-600" />}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                                                            <p className="text-sm text-gray-600">{template.fields.length} fields</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        {template.isBuiltIn && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Built-in
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                    <span>Used {template.usageCount} times</span>
                                                    <span>Updated {template.lastModified}</span>
                                                </div>

                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTemplate(template);
                                                            setFormData({});
                                                        }}
                                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                        <span>Use Template</span>
                                                    </button>
                                                    <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
                                                        <Copy className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Template Creation Wizard */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Plus className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Create Custom Template</h3>
                                            <p className="text-sm text-gray-600">Build your own template with drag-and-drop field builder</p>
                                        </div>
                                    </div>
                                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                        Launch Template Builder
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Template Form */
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setSelectedTemplate(null)}
                                                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                                            >
                                                <ChevronRight className="h-5 w-5 transform rotate-180" />
                                            </button>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900">{selectedTemplate.name}</h2>
                                                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={exportTemplate}
                                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                                            >
                                                <Download className="h-4 w-4" />
                                                <span>Export</span>
                                            </button>
                                            <button
                                                onClick={saveTemplate}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                                            >
                                                <Save className="h-4 w-4" />
                                                <span>Save</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Progress Indicator */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                            <span>Form Progress</span>
                                            <span>
                                                {Object.keys(formData).length} of {selectedTemplate.fields.filter(f => f.required).length} required fields completed
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${(Object.keys(formData).length / selectedTemplate.fields.filter(f => f.required).length) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-6">
                                        {selectedTemplate.fields.map((field, index) => {
                                            const sectionBreaks = {
                                                'resident_profile': {
                                                    'first_name': 'Personal Information',
                                                    'care_level': 'Care Requirements',
                                                    'medical_conditions': 'Medical Information',
                                                    'emergency_contact_1_name': 'Emergency Contacts',
                                                    'physician_name': 'Healthcare Providers',
                                                    'dietary_restrictions': 'Preferences & Notes'
                                                },
                                                'camera_installation': {
                                                    'camera_id': 'Basic Information',
                                                    'coordinates': 'Location & Positioning',
                                                    'camera_type': 'Technical Specifications',
                                                    'privacy_mode': 'Features & Settings',
                                                    'installation_date': 'Installation Details'
                                                },
                                                'staff_schedule': {
                                                    'staff_id': 'Staff Information',
                                                    'shift_type': 'Schedule Details',
                                                    'assigned_areas': 'Assignments & Specializations',
                                                    'phone_number': 'Contact Information'
                                                }
                                            };

                                            const sections = sectionBreaks[selectedTemplate.id as keyof typeof sectionBreaks];
                                            const sectionTitle = sections?.[field.id as keyof typeof sections];

                                            return (
                                                <div key={field.id}>
                                                    {sectionTitle && (
                                                        <div className="pt-6 pb-2 border-t border-gray-200 first:border-t-0 first:pt-0">
                                                            <button
                                                                onClick={() => toggleSection(sectionTitle)}
                                                                className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-blue-600"
                                                            >
                                                                {expandedSections[sectionTitle] !== false ? (
                                                                    <ChevronDown className="h-5 w-5" />
                                                                ) : (
                                                                    <ChevronRight className="h-5 w-5" />
                                                                )}
                                                                <span>{sectionTitle}</span>
                                                            </button>
                                                        </div>
                                                    )}

                                                    {(expandedSections[sectionTitle || 'default'] !== false) && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="md:col-span-2">
                                                                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                                                                    {field.label}
                                                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                                                </label>
                                                                {renderField(field)}
                                                                {field.helpText && (
                                                                    <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                                                                )}
                                                                {field.validation?.message && formData[field.id] && (
                                                                    <p className="mt-1 text-xs text-orange-600">{field.validation.message}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Form Actions */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                    <span className="text-sm text-gray-600">Auto-saved</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-5 w-5 text-gray-400" />
                                                    <span className="text-sm text-gray-500">Last saved: 2 minutes ago</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => setSelectedTemplate(null)}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                                    Save as Draft
                                                </button>
                                                <button
                                                    onClick={saveTemplate}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Submit & Complete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Access Templates */}
                {!selectedTemplate && (
                    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access Templates</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {builtInTemplates.slice(0, 5).map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => {
                                        setSelectedTemplate(template);
                                        setFormData({});
                                    }}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-center"
                                >
                                    <div className="p-2 bg-gray-100 rounded-lg mb-2 mx-auto w-fit">
                                        {template.icon === 'Building' && <Building className="h-6 w-6 text-gray-600" />}
                                        {template.icon === 'Camera' && <Camera className="h-6 w-6 text-gray-600" />}
                                        {template.icon === 'Users' && <Users className="h-6 w-6 text-gray-600" />}
                                        {template.icon === 'Calendar' && <Calendar className="h-6 w-6 text-gray-600" />}
                                        {template.icon === 'Shield' && <Shield className="h-6 w-6 text-gray-600" />}
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">{template.name}</h4>
                                    <p className="text-xs text-gray-500">{template.fields.length} fields</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateConfigurationSystem;