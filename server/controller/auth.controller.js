import User from '../models/user.model.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({ email, password });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};