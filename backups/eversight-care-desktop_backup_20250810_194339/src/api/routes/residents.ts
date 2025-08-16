import express from 'express';
import { mockResidents } from '../models/mockData';

const router = express.Router();

// GET all residents with pagination support
router.get('/', (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const floor = req.query.floor ? parseInt(req.query.floor as string) : null;
    const riskLevel = req.query.riskLevel as string;

    let filteredResidents = mockResidents;

    // Filter by floor if specified
    if (floor !== null) {
        filteredResidents = filteredResidents.filter(r => r.floor === floor);
    }

    // Filter by risk level if specified  
    if (riskLevel) {
        filteredResidents = filteredResidents.filter(r => r.riskLevel === riskLevel);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResidents = filteredResidents.slice(startIndex, endIndex);

    res.json({
        success: true,
        data: paginatedResidents,
        pagination: {
            current: page,
            total: Math.ceil(filteredResidents.length / limit),
            count: paginatedResidents.length,
            totalResidents: filteredResidents.length
        }
    });
});

// GET resident by ID
router.get('/:id', (req, res) => {
    const resident = mockResidents.find(r => r.id === req.params.id);

    if (!resident) {
        return res.status(404).json({
            success: false,
            error: 'Resident not found'
        });
    }

    res.json({
        success: true,
        data: resident
    });
});

// GET residents by floor
router.get('/floor/:floorNumber', (req, res) => {
    const floorNumber = parseInt(req.params.floorNumber);
    const residents = mockResidents.filter(r => r.floor === floorNumber);

    res.json({
        success: true,
        data: residents,
        count: residents.length
    });
});

// GET high-risk residents
router.get('/risk/high', (req, res) => {
    const highRiskResidents = mockResidents.filter(r =>
        r.riskLevel === 'high' || r.riskLevel === 'critical'
    );

    res.json({
        success: true,
        data: highRiskResidents,
        count: highRiskResidents.length
    });
});

export default router;