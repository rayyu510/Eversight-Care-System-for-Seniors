import express from 'express';
import { Camera, mockCameras } from '../models/mockData';

const router = express.Router();

// In-memory store (in production, this would be a database)
let cameras: Camera[] = [...mockCameras];

// GET /api/cameras - Get all cameras or filter by floor/status
router.get('/', (req, res) => {
    try {
        const { floor, status, type } = req.query;
        let filteredCameras = [...cameras];

        // Filter by floor
        if (floor && typeof floor === 'string') {
            const floorNum = parseInt(floor);
            filteredCameras = filteredCameras.filter(camera => camera.floor === floorNum);
        }

        // Filter by status
        if (status && typeof status === 'string') {
            filteredCameras = filteredCameras.filter(camera => camera.status === status);
        }

        // Filter by type
        if (type && typeof type === 'string') {
            filteredCameras = filteredCameras.filter(camera => camera.type === type);
        }

        // Sort by name
        filteredCameras.sort((a, b) => a.name.localeCompare(b.name));

        res.json({
            success: true,
            data: filteredCameras,
            count: filteredCameras.length,
            total: cameras.length,
            summary: {
                online: filteredCameras.filter(c => c.status === 'online').length,
                offline: filteredCameras.filter(c => c.status === 'offline').length,
                maintenance: filteredCameras.filter(c => c.status === 'maintenance').length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cameras',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET /api/cameras/:id - Get specific camera
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const camera = cameras.find(c => c.id === id);

        if (!camera) {
            return res.status(404).json({
                success: false,
                message: 'Camera not found'
            });
        }

        res.json({
            success: true,
            data: camera
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch camera',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET /api/cameras/:id/feed - Get camera feed URL (mock)
router.get('/:id/feed', (req, res) => {
    try {
        const { id } = req.params;
        const camera = cameras.find(c => c.id === id);

        if (!camera) {
            return res.status(404).json({
                success: false,
                message: 'Camera not found'
            });
        }

        if (camera.status !== 'online') {
            return res.status(503).json({
                success: false,
                message: `Camera is ${camera.status} and feed is not available`
            });
        }

        // Mock feed URL - in production this would be real RTSP/WebRTC stream
        const feedUrl = `rtsp://camera-server/feed/${camera.id}`;
        const webStreamUrl = `ws://localhost:3001/camera-stream/${camera.id}`;

        res.json({
            success: true,
            data: {
                cameraId: camera.id,
                name: camera.name,
                feedUrl,
                webStreamUrl,
                resolution: camera.resolution,
                hasAudio: camera.hasAudio,
                canPanTilt: camera.canPanTilt,
                status: camera.status,
                lastPing: camera.lastPing
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get camera feed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// POST /api/cameras/:id/control - Control camera (pan, tilt, zoom)
router.post('/:id/control', (req, res) => {
    try {
        const { id } = req.params;
        const { action, value } = req.body;

        const camera = cameras.find(c => c.id === id);
        if (!camera) {
            return res.status(404).json({
                success: false,
                message: 'Camera not found'
            });
        }

        if (camera.status !== 'online') {
            return res.status(503).json({
                success: false,
                message: `Camera is ${camera.status} and cannot be controlled`
            });
        }

        // Validate control actions
        const validActions = ['pan_left', 'pan_right', 'tilt_up', 'tilt_down', 'zoom_in', 'zoom_out', 'preset', 'snapshot'];
        if (!action || !validActions.includes(action)) {
            return res.status(400).json({
                success: false,
                message: `Invalid action. Valid actions: ${validActions.join(', ')}`
            });
        }

        // Check if camera supports pan/tilt
        if (['pan_left', 'pan_right', 'tilt_up', 'tilt_down'].includes(action) && !camera.canPanTilt) {
            return res.status(400).json({
                success: false,
                message: 'This camera does not support pan/tilt functionality'
            });
        }

        // Mock control response - in production this would send commands to actual camera
        const controlResult = {
            cameraId: camera.id,
            action,
            value: value || null,
            timestamp: new Date().toISOString(),
            status: 'executed'
        };

        // Special handling for snapshot
        if (action === 'snapshot') {
            controlResult.value = `https://camera-server/snapshot/${camera.id}/${Date.now()}.jpg`;
        }

        res.json({
            success: true,
            data: controlResult,
            message: `Camera control ${action} executed successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to control camera',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// PUT /api/cameras/:id/status - Update camera status
router.put('/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['online', 'offline', 'maintenance'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
            });
        }

        const cameraIndex = cameras.findIndex(c => c.id === id);
        if (cameraIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Camera not found'
            });
        }

        cameras[cameraIndex] = {
            ...cameras[cameraIndex],
            status,
            lastPing: status === 'online' ? new Date().toISOString() : cameras[cameraIndex].lastPing
        };

        res.json({
            success: true,
            data: cameras[cameraIndex],
            message: `Camera status updated to ${status}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update camera status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// POST /api/cameras - Add new camera
router.post('/', (req, res) => {
    try {
        const {
            name,
            location,
            floor,
            type,
            resolution,
            hasAudio,
            canPanTilt
        } = req.body;

        // Validation
        if (!name || !location || floor === undefined || !type) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, location, floor, type'
            });
        }

        const newCamera: Camera = {
            id: `CAM-${Date.now()}`,
            name,
            location,
            floor: parseInt(floor),
            status: 'offline', // New cameras start offline
            type,
            resolution: resolution || '1080p',
            hasAudio: hasAudio || false,
            canPanTilt: canPanTilt || false,
            lastPing: new Date().toISOString()
        };

        cameras.push(newCamera);

        res.status(201).json({
            success: true,
            data: newCamera,
            message: 'Camera added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add camera',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// DELETE /api/cameras/:id - Remove camera
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const cameraIndex = cameras.findIndex(c => c.id === id);

        if (cameraIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Camera not found'
            });
        }

        const deletedCamera = cameras.splice(cameraIndex, 1)[0];

        res.json({
            success: true,
            data: deletedCamera,
            message: 'Camera removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove camera',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;