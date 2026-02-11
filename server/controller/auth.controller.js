import Developer from '../models/developer.model.js';
import AdminEmployer from '../models/adminEmployer.model.js';
import generateToken from '../utils/generateToken.js';

// --- Developer Auth ---

// @desc    Register developer
// @route   POST /auth/developer/register
// @access  Public
export const registerDeveloper = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        const userExists = await Developer.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Developer already exists" });
        }

        const developer = await Developer.create({ name, email, password });

        if (developer) {
            generateToken(res, developer._id, "Developer");
            res.status(201).json({
                success: true,
                data: { _id: developer._id, name: developer.name, email: developer.email, role: "developer" },
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid developer data" });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Login developer
// @route   POST /auth/developer/login
// @access  Public
export const loginDeveloper = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const developer = await Developer.findOne({ email }).select("+password");

        if (developer && (await developer.comparePassword(password))) {
            generateToken(res, developer._id, "Developer");
            res.json({
                success: true,
                data: { _id: developer._id, name: developer.name, email: developer.email, role: "developer" },
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        next(error);
    }
};

// --- Admin/Employer Auth ---

// @desc    Register employer
// @route   POST /auth/employer/register
// @access  Public
export const registerEmployer = async (req, res, next) => {
    try {
        const { email, password, name, companyName } = req.body;

        const userExists = await AdminEmployer.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Account already exists" });
        }

        const employer = await AdminEmployer.create({
            name,
            email,
            password,
            role: "employer",
            employerProfile: { companyName }
        });

        if (employer) {
            generateToken(res, employer._id, "AdminEmployer");
            res.status(201).json({
                success: true,
                data: { _id: employer._id, name: employer.name, email: employer.email, role: "employer" },
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid employer data" });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Login Admin or Employer
// @route   POST /auth/admin-employer/login
// @access  Public
export const loginAdminEmployer = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await AdminEmployer.findOne({ email }).select("+password");

        if (user && (await user.comparePassword(password))) {
            generateToken(res, user._id, "AdminEmployer");
            res.json({
                success: true,
                data: { _id: user._id, name: user.name, email: user.email, role: user.role },
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        next(error);
    }
};

// --- Shared ---

// @desc    Logout user / clear cookie
// @route   POST /auth/logout
// @access  Public
export const logout = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @desc    Get user profile (Developer or AdminEmployer)
// @route   GET /auth/me
// @access  Private
export const getMe = async (req, res) => {
    if (!req.user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
        success: true,
        data: req.user,
        userType: req.userType
    });
};
