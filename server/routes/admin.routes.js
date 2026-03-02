import express from 'express';
import {
    getDashboardStats,
    getAdminSettings,
    updateAdminProfile,
    updateAdminPassword,
    getPlatformSettings,
    updatePlatformSettings,
    getMaintenanceStatus
} from '../controller/admin.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Publicly accessible route for maintenance check
router.get('/maintenance-status', getMaintenanceStatus);

// Apply protection to all other admin routes
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/settings', getAdminSettings);
router.put('/settings/profile', updateAdminProfile);
router.put('/settings/password', updateAdminPassword);

router.get('/platform-settings', getPlatformSettings);
router.put('/platform-settings', updatePlatformSettings);

export default router;
