import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Protect routes - verify JWT and attach user
export const protect = async (req, res, next) => {
    let token;

    // Prefer Authorization header (used by admin panel to avoid cookie collisions)
    if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        token = req.cookies.jwt;
    }

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

// Optional protect - populate req.user if token exists, but don't block
export const optionalProtect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        token = req.cookies.jwt;
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            next();
        }
    } else {
        next();
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
