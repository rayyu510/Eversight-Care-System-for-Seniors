import { Camera } from './types';

export const mockCameras: Camera[] = [
    // Floor 1 Cameras
    {
        id: 'CAM-101',
        name: 'Room 101 Monitor',
        location: 'Room 101',
        floor: 1,
        type: 'room',
        status: 'online',
        coverage: 'Full Room',
        lastPing: '2024-07-31 09:30:15',
        recordingStatus: 'recording'
    },
    {
        id: 'CAM-H01',
        name: 'Main Hallway North',
        location: 'North Corridor Floor 1',
        floor: 1,
        type: 'hallway',
        status: 'online',
        coverage: 'Hallway Coverage',
        lastPing: '2024-07-31 09:30:18',
        recordingStatus: 'recording'
    },
    // ... add more cameras as needed
];