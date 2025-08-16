import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const PORT = process.env.API_PORT || 3002;

// Middleware
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));
app.use(express.json());

// Mock data
const mockAlerts = [
    {
        id: 'ALERT-001',
        type: 'fall_detected',
        severity: 'critical',
        title: 'Fall Detected - Room 201',
        description: 'AI detected fall in Room 201',
        location: 'Room 201',
        roomId: '201',
        status: 'active',
        timestamp: new Date().toISOString()
    }
];

const mockResidents = [
    {
        id: 'RES-101',
        firstName: 'Margaret',
        lastName: 'Johnson',
        roomNumber: '101',
        floor: 1,
        riskLevel: 'medium',
        currentLocation: 'Dining Room'
    }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Simple API endpoints
app.get('/api/alerts', (req, res) => {
    res.json({
        success: true,
        data: mockAlerts,
        count: mockAlerts.length
    });
});

app.get('/api/residents', (req, res) => {
    res.json({
        success: true,
        data: mockResidents,
        count: mockResidents.length
    });
});

app.get('/api/cameras', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 'CAM-101', name: 'Room 101 Monitor', floor: 1, status: 'online' },
            { id: 'CAM-201', name: 'Room 201 Monitor', floor: 2, status: 'online' }
        ],
        count: 2
    });
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Guardian Protect API Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Alerts: http://localhost:${PORT}/api/alerts`);
    console.log(`👥 Residents: http://localhost:${PORT}/api/residents`);
    console.log(`📹 Cameras: http://localhost:${PORT}/api/cameras`);
});

export { io };