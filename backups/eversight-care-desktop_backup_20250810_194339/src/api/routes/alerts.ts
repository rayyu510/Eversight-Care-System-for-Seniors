import express from 'express';
import { Alert, mockAlerts } from '../models/mockData';

const router = express.Router();

// In-memory store (in production, this would be a database)
let alerts: Alert[] = [...mockAlerts];

// GET /api/alerts - Get all alerts or filter by status
router.get('/', (req, res) => {
    try {
        const { status, severity, floor, limit } = req.query;
        let filteredAlerts = [...alerts];

        // Filter by status
        if (status && typeof status === 'string') {
            filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
        }

        // Filter by severity
        if (severity && typeof severity === 'string') {
            filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
        }

        // Filter by floor (if roomId indicates floor)
        if (floor && typeof floor === 'string') {
            const floorNum = parseInt(floor);
            filteredAlerts = filteredAlerts.filter(alert => {
                const roomFloor = Math.floor(parseInt(alert.roomId) / 100);
                return roomFloor === floorNum;
            });
        }

        // Limit results
        if (limit && typeof limit === 'string') {
            const limitNum = parseInt(limit);
            filteredAlerts = filteredAlerts.slice(0, limitNum);
        }

        // Sort by timestamp (newest first)
        filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        res.json({
            success: true,
            data: filteredAlerts,
            count: filteredAlerts.length,
            total: alerts.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch alerts',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET /api/alerts/:id - Get specific alert
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const alert = alerts.find(a => a.id === id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        res.json({
            success: true,
            data: alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch alert',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// POST /api/alerts - Create new alert
router.post('/', (req, res) => {
    try {
        const {
            type,
            severity,
            title,
            description,
            location,
            roomId,
            residentId
        } = req.body;

        // Validation
        if (!type || !severity || !title || !location || !roomId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: type, severity, title, location, roomId'
            });
        }

        const newAlert: Alert = {
            id: `ALERT-${Date.now()}`,
            type,
            severity,
            title,
            description: description || '',
            location,
            roomId,
            residentId,
            status: 'active',
            timestamp: new Date().toISOString()
        };

        alerts.push(newAlert);

        res.status(201).json({
            success: true,
            data: newAlert,
            message: 'Alert created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create alert',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// PUT /api/alerts/:id - Update alert
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const alertIndex = alerts.findIndex(a => a.id === id);
        if (alertIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        // Update alert
        alerts[alertIndex] = {
            ...alerts[alertIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        res.json({
            success: true,
            data: alerts[alertIndex],
            message: 'Alert updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update alert',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// PUT /api/alerts/:id/acknowledge - Acknowledge alert
router.put('/:id/acknowledge', (req, res) => {
    try {
        const { id } = req.params;
        const { acknowledgedBy } = req.body;

        const alertIndex = alerts.findIndex(a => a.id === id);
        if (alertIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        alerts[alertIndex] = {
            ...alerts[alertIndex],
            status: 'acknowledged',
            acknowledgedBy: acknowledgedBy || 'Unknown User',
            acknowledgedAt: new Date().toISOString()
        };

        res.json({
            success: true,
            data: alerts[alertIndex],
            message: 'Alert acknowledged successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to acknowledge alert',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// PUT /api/alerts/:id/resolve - Resolve alert
router.put('/:id/resolve', (req, res) => {
    try {
        const { id } = req.params;
        const { resolvedBy, notes } = req.body;

        const alertIndex = alerts.findIndex(a => a.id === id);
        if (alertIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        alerts[alertIndex] = {
            ...alerts[alertIndex],
            status: 'resolved',
            resolvedBy: resolvedBy || 'Unknown User',
            resolvedAt: new Date().toISOString(),
            notes: notes || ''
        };

        res.json({
            success: true,
            data: alerts[alertIndex],
            message: 'Alert resolved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to resolve alert',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// DELETE /api/alerts/:id - Delete alert
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const alertIndex = alerts.findIndex(a => a.id === id);

        if (alertIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Alert not found'
            });
        }

        const deletedAlert = alerts.splice(alertIndex, 1)[0];

        res.json({
            success: true,
            data: deletedAlert,
            message: 'Alert deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete alert',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;