import { Resident } from './types';

export const mockResidents: Resident[] = [
    {
        id: 'RES-101',
        firstName: 'Margaret',
        lastName: 'Johnson',
        age: 78,
        roomNumber: '101',
        floor: 1,
        riskLevel: 'medium',
        medicalConditions: ['Arthritis', 'Mild Dementia'],
        fallHistory: [
            {
                id: 'FALL-001',
                date: '2024-07-25',
                time: '14:30',
                location: 'Room 101 Bathroom',
                severity: 'minor',
                description: 'Slipped getting out of shower',
                responseTime: 3
            }
        ],
        emergencyContact: {
            name: 'Robert Johnson',
            relationship: 'Son',
            phone: '(555) 123-4567'
        },
        admissionDate: '2024-03-15',
        lastActivity: '2024-07-31 08:45',
        currentLocation: 'Dining Room'
    },
    {
        id: 'RES-102',
        firstName: 'Harold',
        lastName: 'Williams',
        age: 82,
        roomNumber: '102',
        floor: 1,
        riskLevel: 'high',
        medicalConditions: ['Parkinson\'s Disease', 'Balance Issues'],
        fallHistory: [
            {
                id: 'FALL-002',
                date: '2024-07-28',
                time: '16:20',
                location: 'Main Hallway',
                severity: 'moderate',
                description: 'Lost balance while walking',
                responseTime: 2
            }
        ],
        emergencyContact: {
            name: 'Susan Williams',
            relationship: 'Daughter',
            phone: '(555) 234-5678'
        },
        admissionDate: '2024-01-22',
        lastActivity: '2024-07-31 09:15',
        currentLocation: 'Room 102'
    },
    // ... add more residents as needed
];