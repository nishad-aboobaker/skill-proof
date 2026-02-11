import jwt from "jsonwebtoken";
import Developer from "../models/developer.model.js";
import AdminEmployer from "../models/adminEmployer.model.js";

export const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY);

            const Model = decoded.userType === "Developer" ? Developer : AdminEmployer;
            req.user = await Model.findById(decoded.userId).select("-password");
            req.userType = decoded.userType;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401).json({ success: false, message: "Not authorized as an admin" });
    }
};

export const employerOnly = (req, res, next) => {
    if (req.user && req.user.role === "employer") {
        next();
    } else {
        res.status(401).json({ success: false, message: "Not authorized as an employer" });
    }
};
