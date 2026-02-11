import jwt from "jsonwebtoken";

const generateToken = (res, userId, userType) => {
    const token = jwt.sign({ userId, userType }, process.env.JWT_KEY, {
        expiresIn: "30d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
        sameSite: "lax", // Prevent CSRF attacks while allowing cross-origin cookie sending
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export default generateToken;
