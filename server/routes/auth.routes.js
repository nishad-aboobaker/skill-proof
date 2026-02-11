import express from "express"
import {
    registerDeveloper,
    loginDeveloper,
    registerEmployer,
    loginAdminEmployer,
    logout,
    getMe
} from "../controller/auth.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// Developer Routes
router.post("/developer/register", registerDeveloper)
router.post("/developer/login", loginDeveloper)

// Employer/Admin Routes
router.post("/employer/register", registerEmployer)
router.post("/admin-employer/login", loginAdminEmployer)

// Shared Routes
router.post("/logout", logout)
router.get("/me", protect, getMe)

export default router