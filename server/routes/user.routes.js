import express from "express";
import {
    updateProfile,
    getProfile,
    getUserById,
    getAllUsers,
    deleteUser,
} from "../controller/user.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes (own profile)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin only routes
router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
