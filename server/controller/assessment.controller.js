import Job from '../models/job.model.js';
import { generateAssessmentQuestion } from '../services/gemini.services.js';

export const generateQuestion = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        const raw = await generateAssessmentQuestion(job);
        const clean = raw.replace(/```json|```/g, '').trim();
        const question = JSON.parse(clean);

        res.json({ success: true, question });
    } catch (error) {
        console.error('Gemini generate error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate question' });
    }
};