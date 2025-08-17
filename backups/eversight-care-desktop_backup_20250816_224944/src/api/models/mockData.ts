// EXPANDED MOCK DATA FOR GUARDIAN PROTECT SYSTEM
// This replaces your current mockData.ts with realistic, production-ready data

export interface Resident {
    id: string;
    firstName: string;
    lastName: string;
    roomNumber: string;
    floor: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    currentLocation: string;
    dateOfBirth: string;
    medicalConditions: string[];
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Alert {
    id: string;
    type: 'fall_detected' | 'wandering' | 'medication' | 'emergency' | 'vitals' | 'behavioral';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    location: string;
    roomId: string;
    residentId?: string;
    status: 'active' | 'acknowledged' | 'resolved';
    timestamp: string;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
    resolvedBy?: string;
    resolvedAt?: string;
    notes?: string;
}

export interface Camera {
    id: string;
    name: string;
    location: string;
    floor: number;
    status: 'online' | 'offline' | 'maintenance';
    type: 'indoor' | 'outdoor' | 'hallway' | 'room';
    resolution: string;
    hasAudio: boolean;
    canPanTilt: boolean;
    lastPing: string;
}

export interface StaffMember {
    id: string;
    firstName: string;
    lastName: string;
    role: 'doctor' | 'nurse' | 'caregiver' | 'security' | 'admin';
    status: 'on_duty' | 'off_duty' | 'break' | 'emergency';
    shift: 'day' | 'evening' | 'night';
    phone: string;
    department: string;
    certifications: string[];
    lastActive: string;
}

// EXPANDED RESIDENTS - 20 realistic residents
export const mockResidents: Resident[] = [
    // Your existing 3 residents
    {
        id: 'RES-101',
        firstName: 'Margaret',
        lastName: 'Johnson',
        roomNumber: '101',
        floor: 1,
        riskLevel: 'medium',
        currentLocation: 'Dining Room',
        dateOfBirth: '1935-03-15',
        medicalConditions: ['Type 2 Diabetes', 'Mild Dementia'],
        emergencyContact: {
            name: 'Sarah Johnson',
            phone: '+1-555-0123',
            relationship: 'Daughter'
        },
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-102',
        firstName: 'Harold',
        lastName: 'Williams',
        roomNumber: '102',
        floor: 1,
        riskLevel: 'high',
        currentLocation: 'Room 102',
        dateOfBirth: '1930-07-22',
        medicalConditions: ['Alzheimer\'s Disease', 'Hypertension', 'Fall Risk'],
        emergencyContact: {
            name: 'Michael Williams',
            phone: '+1-555-0456',
            relationship: 'Son'
        },
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-201',
        firstName: 'Robert',
        lastName: 'Martinez',
        roomNumber: '201',
        floor: 2,
        riskLevel: 'critical',
        currentLocation: 'Room 201',
        dateOfBirth: '1928-11-03',
        medicalConditions: ['Advanced Dementia', 'Mobility Issues', 'Heart Condition'],
        emergencyContact: {
            name: 'Maria Martinez',
            phone: '+1-555-0789',
            relationship: 'Wife'
        },
        createdAt: '2024-01-05T14:15:00Z',
        updatedAt: new Date().toISOString()
    },

    // NEW RESIDENTS - Floor 1 (103-110)
    {
        id: 'RES-103',
        firstName: 'Dorothy',
        lastName: 'Chen',
        roomNumber: '103',
        floor: 1,
        riskLevel: 'low',
        currentLocation: 'Recreation Room',
        dateOfBirth: '1940-05-12',
        medicalConditions: ['Arthritis', 'Mild Hearing Loss'],
        emergencyContact: {
            name: 'David Chen',
            phone: '+1-555-0321',
            relationship: 'Son'
        },
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-104',
        firstName: 'Frank',
        lastName: 'Thompson',
        roomNumber: '104',
        floor: 1,
        riskLevel: 'medium',
        currentLocation: 'Library',
        dateOfBirth: '1932-09-18',
        medicalConditions: ['COPD', 'Mild Cognitive Impairment'],
        emergencyContact: {
            name: 'Nancy Thompson',
            phone: '+1-555-0654',
            relationship: 'Daughter'
        },
        createdAt: '2024-01-18T11:30:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-105',
        firstName: 'Eleanor',
        lastName: 'Rodriguez',
        roomNumber: '105',
        floor: 1,
        riskLevel: 'low',
        currentLocation: 'Garden Area',
        dateOfBirth: '1938-12-07',
        medicalConditions: ['Osteoporosis', 'Hypertension'],
        emergencyContact: {
            name: 'Carlos Rodriguez Jr.',
            phone: '+1-555-0987',
            relationship: 'Son'
        },
        createdAt: '2024-01-22T14:45:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-106',
        firstName: 'William',
        lastName: 'Davis',
        roomNumber: '106',
        floor: 1,
        riskLevel: 'high',
        currentLocation: 'Room 106',
        dateOfBirth: '1929-04-23',
        medicalConditions: ['Parkinson\'s Disease', 'Depression', 'Fall Risk'],
        emergencyContact: {
            name: 'Jennifer Davis',
            phone: '+1-555-0147',
            relationship: 'Daughter'
        },
        createdAt: '2024-01-12T16:20:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-107',
        firstName: 'Mary',
        lastName: 'Wilson',
        roomNumber: '107',
        floor: 1,
        riskLevel: 'medium',
        currentLocation: 'Dining Room',
        dateOfBirth: '1934-08-14',
        medicalConditions: ['Diabetes', 'Cataracts', 'Mobility Aid Required'],
        emergencyContact: {
            name: 'Robert Wilson',
            phone: '+1-555-0258',
            relationship: 'Husband'
        },
        createdAt: '2024-01-25T10:15:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-108',
        firstName: 'James',
        lastName: 'Brown',
        roomNumber: '108',
        floor: 1,
        riskLevel: 'low',
        currentLocation: 'Recreation Room',
        dateOfBirth: '1941-01-30',
        medicalConditions: ['High Cholesterol', 'Mild Memory Issues'],
        emergencyContact: {
            name: 'Lisa Brown',
            phone: '+1-555-0369',
            relationship: 'Daughter'
        },
        createdAt: '2024-01-28T13:45:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-109',
        firstName: 'Patricia',
        lastName: 'Miller',
        roomNumber: '109',
        floor: 1,
        riskLevel: 'critical',
        currentLocation: 'Room 109',
        dateOfBirth: '1927-06-11',
        medicalConditions: ['Advanced Alzheimer\'s', 'Wheelchair Bound', 'Requires Assistance'],
        emergencyContact: {
            name: 'Thomas Miller',
            phone: '+1-555-0741',
            relationship: 'Son'
        },
        createdAt: '2024-01-08T08:30:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-110',
        firstName: 'Charles',
        lastName: 'Garcia',
        roomNumber: '110',
        floor: 1,
        riskLevel: 'medium',
        currentLocation: 'Physical Therapy',
        dateOfBirth: '1933-10-25',
        medicalConditions: ['Stroke Recovery', 'Physical Therapy', 'Speech Therapy'],
        emergencyContact: {
            name: 'Maria Garcia',
            phone: '+1-555-0852',
            relationship: 'Wife'
        },
        createdAt: '2024-01-30T15:00:00Z',
        updatedAt: new Date().toISOString()
    },

    // NEW RESIDENTS - Floor 2 (202-210)
    {
        id: 'RES-202',
        firstName: 'Barbara',
        lastName: 'Anderson',
        roomNumber: '202',
        floor: 2,
        riskLevel: 'low',
        currentLocation: 'Upper Lounge',
        dateOfBirth: '1939-02-17',
        medicalConditions: ['Arthritis', 'Hearing Aid User'],
        emergencyContact: {
            name: 'Mark Anderson',
            phone: '+1-555-0963',
            relationship: 'Son'
        },
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-203',
        firstName: 'Richard',
        lastName: 'Taylor',
        roomNumber: '203',
        floor: 2,
        riskLevel: 'high',
        currentLocation: 'Room 203',
        dateOfBirth: '1931-11-28',
        medicalConditions: ['Dementia', 'Wandering Risk', 'Medication Management'],
        emergencyContact: {
            name: 'Susan Taylor',
            phone: '+1-555-0174',
            relationship: 'Daughter'
        },
        createdAt: '2024-01-13T09:45:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-204',
        firstName: 'Susan',
        lastName: 'Moore',
        roomNumber: '204',
        floor: 2,
        riskLevel: 'medium',
        currentLocation: 'Computer Lab',
        dateOfBirth: '1936-07-03',
        medicalConditions: ['Mild Cognitive Decline', 'Hypertension'],
        emergencyContact: {
            name: 'John Moore',
            phone: '+1-555-0285',
            relationship: 'Husband'
        },
        createdAt: '2024-01-21T11:20:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-205',
        firstName: 'Joseph',
        lastName: 'Jackson',
        roomNumber: '205',
        floor: 2,
        riskLevel: 'low',
        currentLocation: 'Fitness Center',
        dateOfBirth: '1942-04-16',
        medicalConditions: ['Controlled Diabetes', 'Regular Exercise Program'],
        emergencyContact: {
            name: 'Angela Jackson',
            phone: '+1-555-0396',
            relationship: 'Daughter'
        },
        createdAt: '2024-01-26T14:30:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-206',
        firstName: 'Helen',
        lastName: 'White',
        roomNumber: '206',
        floor: 2,
        riskLevel: 'critical',
        currentLocation: 'Room 206',
        dateOfBirth: '1926-09-12',
        medicalConditions: ['End-stage Dementia', 'Bed-bound', '24-hour Care'],
        emergencyContact: {
            name: 'Paul White',
            phone: '+1-555-0507',
            relationship: 'Son'
        },
        createdAt: '2024-01-03T07:15:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-207',
        firstName: 'Donald',
        lastName: 'Harris',
        roomNumber: '207',
        floor: 2,
        riskLevel: 'medium',
        currentLocation: 'Game Room',
        dateOfBirth: '1935-12-08',
        medicalConditions: ['Mild Dementia', 'Social Activities Encouraged'],
        emergencyContact: {
            name: 'Betty Harris',
            phone: '+1-555-0618',
            relationship: 'Wife'
        },
        createdAt: '2024-01-19T16:45:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-208',
        firstName: 'Nancy',
        lastName: 'Martin',
        roomNumber: '208',
        floor: 2,
        riskLevel: 'high',
        currentLocation: 'Nurses Station',
        dateOfBirth: '1930-05-21',
        medicalConditions: ['Recent Fall', 'Physical Therapy', 'Medication Review'],
        emergencyContact: {
            name: 'Steven Martin',
            phone: '+1-555-0729',
            relationship: 'Son'
        },
        createdAt: '2024-01-11T13:20:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-209',
        firstName: 'Kenneth',
        lastName: 'Lee',
        roomNumber: '209',
        floor: 2,
        riskLevel: 'low',
        currentLocation: 'Craft Room',
        dateOfBirth: '1940-08-19',
        medicalConditions: ['Arthritis', 'Enjoys Art Activities'],
        emergencyContact: {
            name: 'Linda Lee',
            phone: '+1-555-0830',
            relationship: 'Wife'
        },
        createdAt: '2024-01-23T10:50:00Z',
        updatedAt: new Date().toISOString()
    },
    {
        id: 'RES-210',
        firstName: 'Betty',
        lastName: 'Clark',
        roomNumber: '210',
        floor: 2,
        riskLevel: 'medium',
        currentLocation: 'TV Room',
        dateOfBirth: '1937-03-26',
        medicalConditions: ['Moderate Dementia', 'Enjoys Music Therapy'],
        emergencyContact: {
            name: 'Daniel Clark',
            phone: '+1-555-0941',
            relationship: 'Son'
        },
        createdAt: '2024-01-16T15:30:00Z',
        updatedAt: new Date().toISOString()
    }
];

// EXPANDED CAMERAS - 25 cameras with complete coverage
export const mockCameras: Camera[] = [
    // Your existing 6 cameras
    {
        id: 'CAM-101',
        name: 'Room 101 Monitor',
        location: 'Room 101',
        floor: 1,
        status: 'online',
        type: 'room',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 30000).toISOString()
    },
    {
        id: 'CAM-102',
        name: 'Room 102 Monitor',
        location: 'Room 102',
        floor: 1,
        status: 'online',
        type: 'room',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 45000).toISOString()
    },
    {
        id: 'CAM-H01',
        name: 'Hallway Floor 1 East',
        location: 'Hallway Floor 1',
        floor: 1,
        status: 'online',
        type: 'hallway',
        resolution: '4K',
        hasAudio: true,
        canPanTilt: true,
        lastPing: new Date(Date.now() - 15000).toISOString()
    },
    {
        id: 'CAM-201',
        name: 'Room 201 Monitor',
        location: 'Room 201',
        floor: 2,
        status: 'online',
        type: 'room',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 60000).toISOString()
    },
    {
        id: 'CAM-H02',
        name: 'Hallway Floor 2 West',
        location: 'Hallway Floor 2',
        floor: 2,
        status: 'online',
        type: 'hallway',
        resolution: '4K',
        hasAudio: true,
        canPanTilt: true,
        lastPing: new Date(Date.now() - 20000).toISOString()
    },
    {
        id: 'CAM-G01',
        name: 'Garden Camera',
        location: 'Garden Area',
        floor: 0,
        status: 'online',
        type: 'outdoor',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: true,
        lastPing: new Date(Date.now() - 90000).toISOString()
    },

    // NEW CAMERAS - Additional room coverage
    {
        id: 'CAM-103',
        name: 'Room 103 Monitor',
        location: 'Room 103',
        floor: 1,
        status: 'online',
        type: 'room',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 25000).toISOString()
    },
    {
        id: 'CAM-104',
        name: 'Room 104 Monitor',
        location: 'Room 104',
        floor: 1,
        status: 'online',
        type: 'room',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 35000).toISOString()
    },
    {
        id: 'CAM-105',
        name: 'Room 105 Monitor',
        location: 'Room 105',
        floor: 1,
        status: 'online',
        type: 'room',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 40000).toISOString()
    },
    {
        id: 'CAM-202',
        name: 'Room 202 Monitor',
        location: 'Room 202',
        floor: 2,
        status: 'online',
        type: 'room',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 55000).toISOString()
    },
    {
        id: 'CAM-203',
        name: 'Room 203 Monitor',
        location: 'Room 203',
        floor: 2,
        status: 'online',
        type: 'room',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 50000).toISOString()
    },

    // Common Area Cameras
    {
        id: 'CAM-DINING',
        name: 'Dining Room Main',
        location: 'Dining Room',
        floor: 1,
        status: 'online',
        type: 'indoor',
        resolution: '4K',
        hasAudio: true,
        canPanTilt: true,
        lastPing: new Date(Date.now() - 10000).toISOString()
    },
    {
        id: 'CAM-REC01',
        name: 'Recreation Room',
        location: 'Recreation Room',
        floor: 1,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 25000).toISOString()
    },
    {
        id: 'CAM-LIBRARY',
        name: 'Library Camera',
        location: 'Library',
        floor: 1,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 30000).toISOString()
    },
    {
        id: 'CAM-LOBBY',
        name: 'Main Lobby',
        location: 'Main Lobby',
        floor: 1,
        status: 'online',
        type: 'indoor',
        resolution: '4K',
        hasAudio: true,
        canPanTilt: true,
        lastPing: new Date(Date.now() - 5000).toISOString()
    },
    {
        id: 'CAM-MAIN-ENT',
        name: 'Main Entrance',
        location: 'Main Entrance',
        floor: 1,
        status: 'online',
        type: 'indoor',
        resolution: '4K',
        hasAudio: true,
        canPanTilt: true,
        lastPing: new Date(Date.now() - 8000).toISOString()
    },
    {
        id: 'CAM-NURSES-1',
        name: 'Nurses Station F1',
        location: 'Nurses Station Floor 1',
        floor: 1,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: true,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 15000).toISOString()
    },
    {
        id: 'CAM-NURSES-2',
        name: 'Nurses Station F2',
        location: 'Nurses Station Floor 2',
        floor: 2,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: true,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 20000).toISOString()
    },
    {
        id: 'CAM-FITNESS',
        name: 'Fitness Center',
        location: 'Fitness Center',
        floor: 2,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: true,
        lastPing: new Date(Date.now() - 35000).toISOString()
    },
    {
        id: 'CAM-GAME',
        name: 'Game Room',
        location: 'Game Room',
        floor: 2,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 40000).toISOString()
    },
    {
        id: 'CAM-UPPER-LOUNGE',
        name: 'Upper Lounge',
        location: 'Upper Lounge',
        floor: 2,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 45000).toISOString()
    },
    {
        id: 'CAM-ELEVATOR',
        name: 'Elevator Lobby',
        location: 'Elevator Lobby',
        floor: 1,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: true,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 28000).toISOString()
    },
    {
        id: 'CAM-STAIR-1',
        name: 'Stairwell Floor 1',
        location: 'Stairwell',
        floor: 1,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 50000).toISOString()
    },
    {
        id: 'CAM-KITCHEN',
        name: 'Kitchen Area',
        location: 'Kitchen',
        floor: 1,
        status: 'maintenance',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: false,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 300000).toISOString()
    },
    {
        id: 'CAM-EMERGENCY-EXIT',
        name: 'Emergency Exit',
        location: 'Emergency Exit',
        floor: 1,
        status: 'online',
        type: 'indoor',
        resolution: '1080p',
        hasAudio: true,
        canPanTilt: false,
        lastPing: new Date(Date.now() - 22000).toISOString()
    }
];

// EXPANDED STAFF - 15 staff members with shift coverage
export const mockStaff: StaffMember[] = [
    // Your existing 3 staff
    {
        id: 'STAFF-001',
        firstName: 'Patricia',
        lastName: 'Wells',
        role: 'doctor',
        status: 'on_duty',
        shift: 'day',
        phone: '+1-555-1001',
        department: 'Medical',
        certifications: ['MD', 'Geriatric Medicine', 'Emergency Medicine'],
        lastActive: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
        id: 'STAFF-002',
        firstName: 'Jennifer',
        lastName: 'Adams',
        role: 'nurse',
        status: 'on_duty',
        shift: 'day',
        phone: '+1-555-1002',
        department: 'Nursing',
        certifications: ['RN', 'CPR', 'First Aid', 'Medication Administration'],
        lastActive: new Date(Date.now() - 2 * 60000).toISOString()
    },
    {
        id: 'STAFF-003',
        firstName: 'Marcus',
        lastName: 'Thompson',
        role: 'security',
        status: 'on_duty',
        shift: 'day',
        phone: '+1-555-1003',
        department: 'Security',
        certifications: ['Security License', 'CPR', 'Crisis De-escalation'],
        lastActive: new Date(Date.now() - 10 * 60000).toISOString()
    },

    // NEW STAFF - Day Shift Additional
    {
        id: 'STAFF-004',
        firstName: 'Amanda',
        lastName: 'Foster',
        role: 'caregiver',
        status: 'on_duty',
        shift: 'day',
        phone: '+1-555-1004',
        department: 'Care Services',
        certifications: ['CNA', 'CPR', 'First Aid'],
        lastActive: new Date(Date.now() - 1 * 60000).toISOString()
    },
    {
        id: 'STAFF-005',
        firstName: 'David',
        lastName: 'Kumar',
        role: 'caregiver',
        status: 'on_duty',
        shift: 'day',
        phone: '+1-555-1005',
        department: 'Care Services',
        certifications: ['CNA', 'CPR', 'Dementia Care'],
        lastActive: new Date(Date.now() - 3 * 60000).toISOString()
    },
    {
        id: 'STAFF-006',
        firstName: 'Linda',
        lastName: 'Peterson',
        role: 'admin',
        status: 'on_duty',
        shift: 'day',
        phone: '+1-555-1006',
        department: 'Administration',
        certifications: ['Healthcare Administration', 'HIPAA Compliance'],
        lastActive: new Date(Date.now() - 8 * 60000).toISOString()
    },

    // Evening Shift Staff
    {
        id: 'STAFF-007',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        role: 'nurse',
        status: 'off_duty',
        shift: 'evening',
        phone: '+1-555-1007',
        department: 'Nursing',
        certifications: ['RN', 'CPR', 'Wound Care'],
        lastActive: new Date(Date.now() - 30 * 60000).toISOString()
    },
    {
        id: 'STAFF-008',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        role: 'caregiver',
        status: 'off_duty',
        shift: 'evening',
        phone: '+1-555-1008',
        department: 'Care Services',
        certifications: ['CNA', 'CPR', 'Medication Aide'],
        lastActive: new Date(Date.now() - 45 * 60000).toISOString()
    },
    {
        id: 'STAFF-009',
        firstName: 'Robert',
        lastName: 'Kim',
        role: 'security',
        status: 'off_duty',
        shift: 'evening',
        phone: '+1-555-1009',
        department: 'Security',
        certifications: ['Security License', 'CPR', 'Emergency Response'],
        lastActive: new Date(Date.now() - 60 * 60000).toISOString()
    },

    // Night Shift Staff
    {
        id: 'STAFF-010',
        firstName: 'Lisa',
        lastName: 'Park',
        role: 'nurse',
        status: 'off_duty',
        shift: 'night',
        phone: '+1-555-1010',
        department: 'Nursing',
        certifications: ['RN', 'CPR', 'Emergency Response'],
        lastActive: new Date(Date.now() - 2 * 60 * 60000).toISOString()
    },
    {
        id: 'STAFF-011',
        firstName: 'Michael',
        lastName: 'Johnson',
        role: 'caregiver',
        status: 'off_duty',
        shift: 'night',
        phone: '+1-555-1011',
        department: 'Care Services',
        certifications: ['CNA', 'CPR', 'Overnight Care'],
        lastActive: new Date(Date.now() - 3 * 60 * 60000).toISOString()
    },
    {
        id: 'STAFF-012',
        firstName: 'Jessica',
        lastName: 'Wong',
        role: 'security',
        status: 'off_duty',
        shift: 'night',
        phone: '+1-555-1012',
        department: 'Security',
        certifications: ['Security License', 'CPR', 'Night Patrol'],
        lastActive: new Date(Date.now() - 4 * 60 * 60000).toISOString()
    },

    // Specialist Staff
    {
        id: 'STAFF-013',
        firstName: 'Thomas',
        lastName: 'Rivera',
        role: 'caregiver',
        status: 'on_duty',
        shift: 'day',
        phone: '+1-555-1013',
        department: 'Physical Therapy',
        certifications: ['Physical Therapist', 'CPR', 'Mobility Specialist'],
        lastActive: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
        id: 'STAFF-014',
        firstName: 'Rachel',
        lastName: 'Green',
        role: 'caregiver',
        status: 'on_duty',
        shift: 'day',
        phone: '+1-555-1014',
        department: 'Activities',
        certifications: ['Activities Director', 'CPR', 'Recreation Therapy'],
        lastActive: new Date(Date.now() - 20 * 60000).toISOString()
    },
    {
        id: 'STAFF-015',
        firstName: 'Kevin',
        lastName: 'O\'Brien',
        role: 'caregiver',
        status: 'break',
        shift: 'day',
        phone: '+1-555-1015',
        department: 'Social Services',
        certifications: ['Social Worker', 'CPR', 'Crisis Counseling'],
        lastActive: new Date(Date.now() - 35 * 60000).toISOString()
    }
];

// EXPANDED ALERTS - 20 diverse alerts with realistic scenarios
export const mockAlerts: Alert[] = [
    // Your existing 4 alerts
    {
        id: 'ALERT-001',
        type: 'fall_detected',
        severity: 'critical',
        title: 'Fall Detected - Room 201',
        description: 'AI detected fall in Room 201. Resident appears to be on the floor near bathroom.',
        location: 'Room 201',
        roomId: '201',
        residentId: 'RES-201',
        status: 'active',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
        id: 'ALERT-002',
        type: 'wandering',
        severity: 'high',
        title: 'Wandering Alert - Harold Williams',
        description: 'Resident found in unauthorized area (main entrance). May be attempting to leave facility.',
        location: 'Main Entrance',
        roomId: '102',
        residentId: 'RES-102',
        status: 'active',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
        id: 'ALERT-003',
        type: 'medication',
        severity: 'medium',
        title: 'Medication Reminder - Margaret Johnson',
        description: 'Evening medication dose overdue by 30 minutes.',
        location: 'Room 101',
        roomId: '101',
        residentId: 'RES-101',
        status: 'active',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString()
    },
    {
        id: 'ALERT-004',
        type: 'vitals',
        severity: 'low',
        title: 'Blood Pressure Reading - Robert Martinez',
        description: 'Scheduled blood pressure check completed. Reading: 140/85 mmHg.',
        location: 'Room 201',
        roomId: '201',
        residentId: 'RES-201',
        status: 'resolved',
        timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        resolvedBy: 'STAFF-002',
        resolvedAt: new Date(Date.now() - 1.5 * 60 * 60000).toISOString()
    },

    // NEW ALERTS - More realistic scenarios
    {
        id: 'ALERT-005',
        type: 'fall_detected',
        severity: 'high',
        title: 'Fall Detected - Dining Room',
        description: 'Potential fall detected near dining table 3. Dorothy Chen appears to have slipped.',
        location: 'Dining Room',
        roomId: 'DINING',
        residentId: 'RES-103',
        status: 'acknowledged',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        acknowledgedBy: 'STAFF-004',
        acknowledgedAt: new Date(Date.now() - 43 * 60000).toISOString()
    },
    {
        id: 'ALERT-006',
        type: 'emergency',
        severity: 'medium',
        title: 'Fire Alarm Test - Floor 2',
        description: 'Scheduled fire alarm test in progress. All systems functioning normally.',
        location: 'Floor 2',
        roomId: 'FLOOR-2',
        status: 'resolved',
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        resolvedBy: 'STAFF-003',
        resolvedAt: new Date(Date.now() - 115 * 60000).toISOString(),
        notes: 'All residents evacuated successfully during drill'
    },
    {
        id: 'ALERT-007',
        type: 'behavioral',
        severity: 'medium',
        title: 'Agitation - Richard Taylor',
        description: 'Resident showing signs of agitation during evening medication time. Refusing care.',
        location: 'Room 203',
        roomId: '203',
        residentId: 'RES-203',
        status: 'active',
        timestamp: new Date(Date.now() - 20 * 60000).toISOString()
    },
    {
        id: 'ALERT-008',
        type: 'wandering',
        severity: 'high',
        title: 'Exit Attempt - William Davis',
        description: 'Resident with Parkinson\'s found near emergency exit. Appears confused about location.',
        location: 'Emergency Exit',
        roomId: '106',
        residentId: 'RES-106',
        status: 'acknowledged',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        acknowledgedBy: 'STAFF-003',
        acknowledgedAt: new Date(Date.now() - 32 * 60000).toISOString()
    },
    {
        id: 'ALERT-009',
        type: 'vitals',
        severity: 'high',
        title: 'Elevated Heart Rate - Nancy Martin',
        description: 'Heart rate monitor showing 110 BPM at rest. Above normal range for resident.',
        location: 'Room 208',
        roomId: '208',
        residentId: 'RES-208',
        status: 'active',
        timestamp: new Date(Date.now() - 12 * 60000).toISOString()
    },
    {
        id: 'ALERT-010',
        type: 'medication',
        severity: 'critical',
        title: 'Medication Error Alert - Patricia Miller',
        description: 'Double dose of medication detected. Immediate medical review required.',
        location: 'Room 109',
        roomId: '109',
        residentId: 'RES-109',
        status: 'active',
        timestamp: new Date(Date.now() - 8 * 60000).toISOString()
    },
    {
        id: 'ALERT-011',
        type: 'fall_detected',
        severity: 'medium',
        title: 'Near Fall - Recreation Room',
        description: 'AI detected unsteady movement. James Brown caught himself on chair before falling.',
        location: 'Recreation Room',
        roomId: 'REC01',
        residentId: 'RES-108',
        status: 'resolved',
        timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
        resolvedBy: 'STAFF-014',
        resolvedAt: new Date(Date.now() - 85 * 60000).toISOString(),
        notes: 'Resident stable, encouraged to use walking aid'
    },
    {
        id: 'ALERT-012',
        type: 'emergency',
        severity: 'low',
        title: 'Camera Maintenance - Kitchen',
        description: 'Kitchen camera offline for scheduled maintenance. Security doing manual checks.',
        location: 'Kitchen',
        roomId: 'KITCHEN',
        status: 'acknowledged',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        acknowledgedBy: 'STAFF-003',
        acknowledgedAt: new Date(Date.now() - 58 * 60000).toISOString()
    },
    {
        id: 'ALERT-013',
        type: 'behavioral',
        severity: 'low',
        title: 'Social Withdrawal - Helen White',
        description: 'Resident has not participated in activities for 3 days. Wellness check recommended.',
        location: 'Room 206',
        roomId: '206',
        residentId: 'RES-206',
        status: 'acknowledged',
        timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
        acknowledgedBy: 'STAFF-015',
        acknowledgedAt: new Date(Date.now() - 3.5 * 60 * 60000).toISOString()
    },
    {
        id: 'ALERT-014',
        type: 'vitals',
        severity: 'medium',
        title: 'Blood Sugar Check - Mary Wilson',
        description: 'Pre-meal blood glucose reading: 180 mg/dL. Above target range.',
        location: 'Dining Room',
        roomId: '107',
        residentId: 'RES-107',
        status: 'resolved',
        timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
        resolvedBy: 'STAFF-002',
        resolvedAt: new Date(Date.now() - 2.8 * 60 * 60000).toISOString(),
        notes: 'Insulin adjusted, will monitor at next meal'
    },
    {
        id: 'ALERT-015',
        type: 'wandering',
        severity: 'medium',
        title: 'Location Check - Donald Harris',
        description: 'Resident not in expected location for scheduled physical therapy session.',
        location: 'Game Room',
        roomId: '207',
        residentId: 'RES-207',
        status: 'resolved',
        timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        resolvedBy: 'STAFF-013',
        resolvedAt: new Date(Date.now() - 1.9 * 60 * 60000).toISOString(),
        notes: 'Found resident in game room, escorted to PT'
    },
    {
        id: 'ALERT-016',
        type: 'emergency',
        severity: 'high',
        title: 'Power Outage - Floor 2 East Wing',
        description: 'Partial power outage affecting rooms 205-210. Emergency lighting activated.',
        location: 'Floor 2 East Wing',
        roomId: 'FLOOR-2-EAST',
        status: 'active',
        timestamp: new Date(Date.now() - 25 * 60000).toISOString()
    },
    {
        id: 'ALERT-017',
        type: 'medication',
        severity: 'low',
        title: 'Med Reminder - Charles Garcia',
        description: 'Physical therapy session medication (pain relief) due in 15 minutes.',
        location: 'Room 110',
        roomId: '110',
        residentId: 'RES-110',
        status: 'acknowledged',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        acknowledgedBy: 'STAFF-004',
        acknowledgedAt: new Date(Date.now() - 9 * 60000).toISOString()
    },
    {
        id: 'ALERT-018',
        type: 'behavioral',
        severity: 'high',
        title: 'Anxiety Episode - Kenneth Lee',
        description: 'Resident experiencing anxiety during craft activity. Requesting to return to room.',
        location: 'Craft Room',
        roomId: '209',
        residentId: 'RES-209',
        status: 'active',
        timestamp: new Date(Date.now() - 18 * 60000).toISOString()
    },
    {
        id: 'ALERT-019',
        type: 'vitals',
        severity: 'low',
        title: 'Weekly Weight Check - Frank Thompson',
        description: 'Scheduled weekly weight measurement completed. Weight: 165 lbs (stable).',
        location: 'Room 104',
        roomId: '104',
        residentId: 'RES-104',
        status: 'resolved',
        timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(),
        resolvedBy: 'STAFF-004',
        resolvedAt: new Date(Date.now() - 5.9 * 60 * 60000).toISOString(),
        notes: 'Weight stable, nutrition plan on track'
    },
    {
        id: 'ALERT-020',
        type: 'emergency',
        severity: 'critical',
        title: 'Medical Emergency - Betty Clark',
        description: 'Resident unresponsive during TV time. 911 called, staff performing CPR.',
        location: 'TV Room',
        roomId: '210',
        residentId: 'RES-210',
        status: 'active',
        timestamp: new Date(Date.now() - 3 * 60000).toISOString()
    }
];

// ADDITIONAL DATA STRUCTURES FOR COMPLETE SYSTEM

// Floor Plan Data
export const floorPlanData = {
    floors: [
        {
            id: 'FLOOR-1',
            name: 'First Floor',
            level: 1,
            dimensions: { width: 1000, height: 800 },
            rooms: [
                { id: '101', coordinates: { x: 50, y: 100, width: 80, height: 60 }, occupant: 'RES-101', status: 'occupied' },
                { id: '102', coordinates: { x: 150, y: 100, width: 80, height: 60 }, occupant: 'RES-102', status: 'occupied' },
                { id: '103', coordinates: { x: 250, y: 100, width: 80, height: 60 }, occupant: 'RES-103', status: 'occupied' },
                { id: '104', coordinates: { x: 350, y: 100, width: 80, height: 60 }, occupant: 'RES-104', status: 'occupied' },
                { id: '105', coordinates: { x: 450, y: 100, width: 80, height: 60 }, occupant: 'RES-105', status: 'occupied' },
                { id: '106', coordinates: { x: 50, y: 200, width: 80, height: 60 }, occupant: 'RES-106', status: 'occupied' },
                { id: '107', coordinates: { x: 150, y: 200, width: 80, height: 60 }, occupant: 'RES-107', status: 'occupied' },
                { id: '108', coordinates: { x: 250, y: 200, width: 80, height: 60 }, occupant: 'RES-108', status: 'occupied' },
                { id: '109', coordinates: { x: 350, y: 200, width: 80, height: 60 }, occupant: 'RES-109', status: 'occupied' },
                { id: '110', coordinates: { x: 450, y: 200, width: 80, height: 60 }, occupant: 'RES-110', status: 'occupied' }
            ],
            commonAreas: [
                { id: 'DINING', name: 'Dining Room', coordinates: { x: 600, y: 200, width: 200, height: 150 }, capacity: 40, currentOccupancy: 8 },
                { id: 'RECREATION', name: 'Recreation Room', coordinates: { x: 600, y: 400, width: 150, height: 100 }, capacity: 25, currentOccupancy: 12 },
                { id: 'LIBRARY', name: 'Library', coordinates: { x: 800, y: 400, width: 120, height: 80 }, capacity: 15, currentOccupancy: 3 },
                { id: 'LOBBY', name: 'Main Lobby', coordinates: { x: 400, y: 600, width: 200, height: 100 }, capacity: 50, currentOccupancy: 5 }
            ]
        },
        {
            id: 'FLOOR-2',
            name: 'Second Floor',
            level: 2,
            dimensions: { width: 1000, height: 800 },
            rooms: [
                { id: '201', coordinates: { x: 50, y: 100, width: 80, height: 60 }, occupant: 'RES-201', status: 'occupied' },
                { id: '202', coordinates: { x: 150, y: 100, width: 80, height: 60 }, occupant: 'RES-202', status: 'occupied' },
                { id: '203', coordinates: { x: 250, y: 100, width: 80, height: 60 }, occupant: 'RES-203', status: 'occupied' },
                { id: '204', coordinates: { x: 350, y: 100, width: 80, height: 60 }, occupant: 'RES-204', status: 'occupied' },
                { id: '205', coordinates: { x: 450, y: 100, width: 80, height: 60 }, occupant: 'RES-205', status: 'occupied' },
                { id: '206', coordinates: { x: 50, y: 200, width: 80, height: 60 }, occupant: 'RES-206', status: 'occupied' },
                { id: '207', coordinates: { x: 150, y: 200, width: 80, height: 60 }, occupant: 'RES-207', status: 'occupied' },
                { id: '208', coordinates: { x: 250, y: 200, width: 80, height: 60 }, occupant: 'RES-208', status: 'occupied' },
                { id: '209', coordinates: { x: 350, y: 200, width: 80, height: 60 }, occupant: 'RES-209', status: 'occupied' },
                { id: '210', coordinates: { x: 450, y: 200, width: 80, height: 60 }, occupant: 'RES-210', status: 'occupied' }
            ],
            commonAreas: [
                { id: 'UPPER-LOUNGE', name: 'Upper Lounge', coordinates: { x: 600, y: 200, width: 150, height: 100 }, capacity: 20, currentOccupancy: 4 },
                { id: 'FITNESS', name: 'Fitness Center', coordinates: { x: 600, y: 350, width: 140, height: 120 }, capacity: 15, currentOccupancy: 6 },
                { id: 'GAME-ROOM', name: 'Game Room', coordinates: { x: 780, y: 350, width: 120, height: 100 }, capacity: 12, currentOccupancy: 3 },
                { id: 'COMPUTER-LAB', name: 'Computer Lab', coordinates: { x: 600, y: 500, width: 100, height: 80 }, capacity: 8, currentOccupancy: 2 }
            ]
        }
    ]
};

// System Status Data
export const systemStatus = {
    timestamp: new Date().toISOString(),
    totalResidents: 20,
    residentsPresent: 19,
    activeAlerts: 7,
    criticalAlerts: 2,
    staffOnDuty: 6,
    camerasOnline: 24,
    camerasOffline: 1,
    systemHealth: 'good' as const,
    facilityStatus: 'normal_operation' as const,
    lastBackup: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    uptimePercentage: 99.7
};

// Heat Map Data for Analytics
export const heatMapData = {
    fallRiskZones: [
        { location: 'Room 201', riskLevel: 'critical', incidents: 3, coordinates: { x: 50, y: 100 } },
        { location: 'Dining Room', riskLevel: 'high', incidents: 2, coordinates: { x: 600, y: 200 } },
        { location: 'Bathroom 102', riskLevel: 'high', incidents: 2, coordinates: { x: 150, y: 100 } },
        { location: 'Hallway Floor 1', riskLevel: 'medium', incidents: 1, coordinates: { x: 300, y: 300 } }
    ],
    activityHotspots: [
        { location: 'Dining Room', activityLevel: 'high', peakHours: ['08:00', '12:00', '18:00'] },
        { location: 'Recreation Room', activityLevel: 'medium', peakHours: ['10:00', '14:00', '19:00'] },
        { location: 'Library', activityLevel: 'low', peakHours: ['15:00', '20:00'] }
    ]
};

// Export all data
export const comprehensiveMockData = {
    residents: mockResidents,
    cameras: mockCameras,
    staff: mockStaff,
    alerts: mockAlerts,
    floorPlans: floorPlanData,
    systemStatus,
    heatMapData
};

export default comprehensiveMockData;