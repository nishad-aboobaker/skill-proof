import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Protect routes - verify JWT and attach user
export const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);

            req.user = await User.findById(decoded.userId).select("-password");

            if (!req.user) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authorized, authentication required" });
    }
    if (req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ success: false, message: "Not authorized as an admin" });
    }
};
