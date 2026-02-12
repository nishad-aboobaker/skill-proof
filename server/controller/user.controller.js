import User from '../models/user.model.js';

// @desc    Update user profile
// @route   PUT /users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const updates = req.body;

        // Prevent updating sensitive fields
        delete updates.email;
        delete updates.password;
        delete updates.role;
        delete updates._id;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get own profile
// @route   GET /users/profile
// @access  Private
export const getProfile = async (req, res) => {
    res.json({
        success: true,
        data: req.user,
    });
};

// @desc    Get user by ID
// @route   GET /users/:id
// @access  Admin only
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('postedJobs')
            .populate('appliedJobs');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /users
// @access  Admin only
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');

        res.json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Admin only
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
