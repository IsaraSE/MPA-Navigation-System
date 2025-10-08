import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import { requireRoles } from '../middleware/roles.js';
import {
    createReport,
    getReports,
    getReportById,
    getMyReports,
    updateReport,
    deleteReport,
    getReportsNearLocation,
    toggleReportStatus
} from '../controllers/reportController.js';

const router = express.Router();

// Validation rules for creating a report
const createReportValidation = [
    body('type')
        .isIn(['hotspot', 'pollution'])
        .withMessage('Type must be either hotspot or pollution'),
    body('latitude')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),
    body('longitude')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title must not exceed 100 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    body('species')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Species name must not exceed 100 characters'),
    body('severity')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Severity must be low, medium, high, or critical'),
    body('imageUrl')
        .optional()
        .trim()
        .isURL()
        .withMessage('Invalid image URL')
];

// Validation rules for updating a report
const updateReportValidation = [
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Title must not exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Description cannot be empty')
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    body('species')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Species name must not exceed 100 characters'),
    body('severity')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Severity must be low, medium, high, or critical'),
    body('imageUrl')
        .optional()
        .trim()
];

// Public routes
router.get('/', getReports);                           // Get all reports with filters
router.get('/nearby', getReportsNearLocation);         // Get reports near a location
router.get('/:id', getReportById);                     // Get single report

// Protected routes (require authentication)
router.post('/', auth, createReportValidation, createReport);        // Create new report
router.get('/user/my-reports', auth, getMyReports);                  // Get current user's reports
router.patch('/:id', auth, updateReportValidation, updateReport);    // Update report
router.delete('/:id', auth, deleteReport);                           // Delete report

// Admin only routes
router.patch('/:id/toggle-status', auth, requireRoles('admin'), toggleReportStatus);  // Toggle active status

export default router;

