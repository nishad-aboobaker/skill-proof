import express from "express";
import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    applyToJob,
    getMyPostedJobs,
    getMyApplications,
    updateApplicationStatus,
} from "../controller/job.controller.js";
import { protect, adminOnly, optionalProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (optionally authenticated to show hasApplied status)
router.get("/", optionalProtect, getJobs);
router.get("/:id", optionalProtect, getJobById);

// Protected routes (authenticated users)
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);
router.post("/:id/apply", protect, applyToJob);
router.get("/my/posted", protect, getMyPostedJobs);
router.get("/my/applications", protect, getMyApplications);

// Admin or job owner routes
router.put("/:id/applicants/:userId", protect, updateApplicationStatus);

export default router;
