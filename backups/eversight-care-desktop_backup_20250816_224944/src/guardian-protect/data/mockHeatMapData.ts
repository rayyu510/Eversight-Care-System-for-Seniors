import { HeatMapPoint } from './types';

export const mockHeatMapData: { [key: string]: HeatMapPoint[] } = {
    '1': [ // Floor 1
        {
            x: 25,
            y: 15,
            intensity: 0.8,
            riskLevel: 'high',
            incidentCount: 3,
            lastIncident: '2024-07-28 16:20',
            location: 'Main Hallway Junction'
        },
        // ... add more heat map points
    ],
    '2': [ // Floor 2
        {
            x: 15,
            y: 25,
            intensity: 0.9,
            riskLevel: 'critical',
            incidentCount: 4,
            lastIncident: '2024-07-30 11:45',
            location: 'Room 201 Area'
        },
        // ... add more heat map points
    ],
    '0': [ // Outdoor
        {
            x: 30,
            y: 40,
            intensity: 0.2,
            riskLevel: 'low',
            incidentCount: 1,
            lastIncident: '2024-07-20 14:00',
            location: 'Garden Path'
        }
    ]
};