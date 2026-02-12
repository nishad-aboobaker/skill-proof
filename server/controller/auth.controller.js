import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "Name, email and password are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            generateToken(res, user._id, "User");
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid user data" });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (user && (await user.comparePassword(password))) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();

            generateToken(res, user._id, "User");
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        next(error);
    }
};

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

// @desc    Get current user profile
// @route   GET /auth/me
// @access  Private
export const getMe = async (req, res) => {
    if (!req.user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
        success: true,
        data: req.user,
    });
};
