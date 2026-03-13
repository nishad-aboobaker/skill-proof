import express from 'express';
import { generateQuestion } from '../controller/assessment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/generate/:jobId', protect, generateQuestion);

export default router;