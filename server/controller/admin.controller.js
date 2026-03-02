import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import Job from '../models/job.model.js';
import Settings from '../models/settings.model.js';

// @desc    Get dashboard statistics for admin
// @route   GET /admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
    try {
        // 1. Total Users (excluding admins)
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

        // 2. Total Job Listings
        const totalJobs = await Job.countDocuments();

        // 3. Total Applicants (across all jobs)
        const jobs = await Job.find({}, 'applicants');
        let totalApplicants = 0;
        jobs.forEach(job => {
            totalApplicants += job.applicants.length;
        });

        // 4. Monthly Metrics (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // Aggegrate applications across all jobs for charts
        // We'll use a manual aggregation approach since applicants are embedded in jobs
        const monthlyStats = {};

        // Initialize last 6 months
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });
            monthlyStats[monthName] = { applied: 0, hired: 0, rejected: 0 };
        }

        // Fetch jobs with applicants from last 6 months
        const jobsWithRecentApplicants = await Job.find({
            'applicants.appliedAt': { $gte: sixMonthsAgo }
        }, 'applicants');

        jobsWithRecentApplicants.forEach(job => {
            job.applicants.forEach(app => {
                if (app.appliedAt >= sixMonthsAgo) {
                    const monthName = new Date(app.appliedAt).toLocaleString('default', { month: 'short' });
                    if (monthlyStats[monthName]) {
                        monthlyStats[monthName].applied++;
                        if (app.status === 'accepted') {
                            monthlyStats[monthName].hired++;
                        } else if (app.status === 'rejected') {
                            monthlyStats[monthName].rejected++;
                        }
                    }
                }
            });
        });

        // Convert monthlyStats to sorted arrays for ApexCharts
        const months = Object.keys(monthlyStats).reverse();
        const appliedData = months.map(m => monthlyStats[m].applied);
        const hiredData = months.map(m => monthlyStats[m].hired);
        const rejectedData = months.map(m => monthlyStats[m].rejected);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalJobs,
                totalApplicants,
                chartData: {
                    months,
                    series: [
                        { name: 'Applied', data: appliedData },
                        { name: 'Hired', data: hiredData },
                        { name: 'Rejected', data: rejectedData }
                    ]
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current admin profile
// @route   GET /admin/settings
// @access  Private (Admin)
export const getAdminSettings = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update admin profile (name, email, phone)
// @route   PUT /admin/settings/profile
// @access  Private (Admin)
export const updateAdminProfile = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, phone },
            { new: true, runValidators: true, select: '-password' }
        );
        res.json({ success: true, data: updated, message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Change admin password
// @route   PUT /admin/settings/password
// @access  Private (Admin)
export const updateAdminPassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get platform settings (Maintenance mode etc)
// @route   GET /admin/platform-settings
// @access  Private (Admin)
export const getPlatformSettings = async (req, res, next) => {
    try {
        const settings = await Settings.findOne() || await Settings.create({});
        res.json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
};

// @desc    Update platform settings
// @route   PUT /admin/platform-settings
// @access  Private (Admin)
export const updatePlatformSettings = async (req, res, next) => {
    try {
        const { maintenanceMode, maintenanceMessage, announcement } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ maintenanceMode, maintenanceMessage, announcement, updatedBy: req.user._id });
        } else {
            settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode;
            settings.maintenanceMessage = maintenanceMessage || settings.maintenanceMessage;

            if (announcement) {
                settings.announcement.enabled = announcement.enabled !== undefined ? announcement.enabled : settings.announcement.enabled;
                settings.announcement.message = announcement.message || settings.announcement.message;
            }

            settings.updatedBy = req.user._id;
        }
        await settings.save();
        res.json({ success: true, data: settings, message: 'Platform settings updated' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get public maintenance status
// @route   GET /admin/maintenance-status (Publicly accessible but handled here for convenience)
// @access  Public
export const getMaintenanceStatus = async (req, res, next) => {
    try {
        const settings = await Settings.findOne();
        res.json({
            success: true,
            maintenanceMode: settings ? settings.maintenanceMode : false,
            message: settings ? settings.maintenanceMessage : '',
            announcement: settings ? settings.announcement : { enabled: false, message: '' }
        });
    } catch (error) {
        next(error);
    }
};
