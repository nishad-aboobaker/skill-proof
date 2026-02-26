import express from 'express';
import { getDashboardStats } from '../controller/admin.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply protection to all admin routes
router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);

export default router;
