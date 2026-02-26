import User from '../models/user.model.js';
import Job from '../models/job.model.js';

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
