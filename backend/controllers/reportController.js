import Report from '../models/Report.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Create a new report
export const createReport = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, latitude, longitude, title, description, species, severity, imageUrl } = req.body;

        // Get user's vessel info
        const user = await User.findById(req.user._id);
        
        const report = await Report.create({
            type,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            title,
            description,
            species: type === 'hotspot' ? species : undefined,
            severity,
            imageUrl,
            submittedBy: req.user._id,
            vesselInfo: {
                vesselName: user.vesselName,
                vesselType: user.vesselType
            }
        });

        // Populate submittedBy field
        await report.populate('submittedBy', 'name email role vesselName');

        res.status(201).json({ 
            message: 'Report created successfully', 
            report 
        });

    } catch (error) {
        next(error);
    }
};

// Get all reports with optional filters
export const getReports = async (req, res, next) => {
    try {
        const { type, severity, limit = 100, includeInactive = false } = req.query;

        const filter = {};
        
        if (type && ['hotspot', 'pollution'].includes(type)) {
            filter.type = type;
        }
        
        if (severity && ['low', 'medium', 'high', 'critical'].includes(severity)) {
            filter.severity = severity;
        }

        if (!includeInactive) {
            filter.isActive = true;
        }

        const reports = await Report.find(filter)
            .populate('submittedBy', 'name email role vesselName vesselType')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({ 
            count: reports.length,
            reports 
        });

    } catch (error) {
        next(error);
    }
};

// Get a single report by ID
export const getReportById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const report = await Report.findById(id)
            .populate('submittedBy', 'name email role vesselName vesselType');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json({ report });

    } catch (error) {
        next(error);
    }
};

// Get reports by current user
export const getMyReports = async (req, res, next) => {
    try {
        const reports = await Report.find({ submittedBy: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ 
            count: reports.length,
            reports 
        });

    } catch (error) {
        next(error);
    }
};

// Update a report (only by owner or admin)
export const updateReport = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { title, description, species, severity, imageUrl } = req.body;

        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Check if user is owner or admin
        if (report.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You can only update your own reports' });
        }

        // Update fields
        if (title) report.title = title;
        if (description) report.description = description;
        if (species && report.type === 'hotspot') report.species = species;
        if (severity) report.severity = severity;
        if (imageUrl !== undefined) report.imageUrl = imageUrl;

        await report.save();
        await report.populate('submittedBy', 'name email role vesselName vesselType');

        res.json({ 
            message: 'Report updated successfully', 
            report 
        });

    } catch (error) {
        next(error);
    }
};

// Delete a report (only by owner or admin)
export const deleteReport = async (req, res, next) => {
    try {
        const { id } = req.params;

        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Check if user is owner or admin
        if (report.submittedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You can only delete your own reports' });
        }

        await Report.findByIdAndDelete(id);

        res.json({ message: 'Report deleted successfully' });

    } catch (error) {
        next(error);
    }
};

// Get reports near a location (for alerts)
export const getReportsNearLocation = async (req, res, next) => {
    try {
        const { latitude, longitude, maxDistance = 50000 } = req.query; // maxDistance in meters (default 50km)

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const reports = await Report.find({
            isActive: true,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        })
        .populate('submittedBy', 'name role vesselName')
        .limit(20);

        res.json({ 
            count: reports.length,
            reports 
        });

    } catch (error) {
        next(error);
    }
};

// Toggle report active status (admin only)
export const toggleReportStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.isActive = !report.isActive;
        await report.save();

        res.json({ 
            message: `Report ${report.isActive ? 'activated' : 'deactivated'} successfully`, 
            report 
        });

    } catch (error) {
        next(error);
    }
};

