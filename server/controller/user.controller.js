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
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).select('-password');

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
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
        const { search } = req.query;

        let pipeline = [
            {
                $match: {
                    role: { $ne: 'admin' }
                }
            }
        ];

        // Match based on search query if provided
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        // Project fields (excluding password)
        pipeline.push({
            $project: {
                password: 0
            }
        });

        // Sort by creation date (newest first)
        pipeline.push({
            $sort: { createdAt: -1 }
        });

        const users = await User.aggregate(pipeline);

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

        user.isActive = false;
        await user.save();

        res.json({
            success: true,
            message: "User blocked successfully",
        });
    } catch (error) {
        next(error);
    }
};
