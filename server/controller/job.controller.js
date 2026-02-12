import Job from '../models/job.model.js';
import User from '../models/user.model.js';

// @desc    Create new job posting
// @route   POST /jobs
// @access  Private
export const createJob = async (req, res, next) => {
    try {
        const { title, description, requirements, salary, location, remote, type, skills, companyName } = req.body;

        if (!title || !description || !requirements || !location || !type) {
            return res.status(400).json({
                success: false,
                message: "Title, description, requirements, location, and type are required"
            });
        }

        // Use company name from request or user's profile
        const finalCompanyName = companyName || req.user.profile?.companyName || "Unknown Company";

        const job = await Job.create({
            title,
            description,
            requirements,
            salary,
            location,
            remote,
            type,
            skills,
            companyName: finalCompanyName,
            companyLogo: req.user.profile?.companyLogo,
            postedBy: req.user._id,
        });

        // Add to user's posted jobs
        await User.findByIdAndUpdate(req.user._id, {
            $push: { postedJobs: job._id }
        });

        res.status(201).json({
            success: true,
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all jobs (with filters)
// @route   GET /jobs
// @access  Public
export const getJobs = async (req, res, next) => {
    try {
        const { status, type, location, search } = req.query;

        const query = { status: status || "active" };

        if (type) query.type = type;
        if (location) query.location = new RegExp(location, 'i');
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
            ];
        }

        const jobs = await Job.find(query)
            .populate('postedBy', 'name email profile.companyName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single job by ID
// @route   GET /jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email profile.companyName profile.companyWebsite')
            .populate('applicants.user', 'name email profile.skills profile.experience');

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.json({
            success: true,
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update job
// @route   PUT /jobs/:id
// @access  Private (owner or admin)
export const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Check ownership (or admin)
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to update this job" });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: updatedJob,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete job
// @route   DELETE /jobs/:id
// @access  Private (owner or admin)
export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Check ownership (or admin)
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
        }

        await Job.findByIdAndDelete(req.params.id);

        // Remove from user's posted jobs
        await User.findByIdAndUpdate(job.postedBy, {
            $pull: { postedJobs: job._id }
        });

        res.json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Apply to job
// @route   POST /jobs/:id/apply
// @access  Private
export const applyToJob = async (req, res, next) => {
    try {
        const { coverLetter, resume } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Check if already applied
        const alreadyApplied = job.applicants.some(
            app => app.user.toString() === req.user._id.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({ success: false, message: "You have already applied to this job" });
        }

        // Add applicant
        job.applicants.push({
            user: req.user._id,
            coverLetter,
            resume: resume || req.user.profile?.resume?.fileUrl,
            appliedAt: new Date(),
        });

        await job.save();

        // Add to user's applied jobs
        await User.findByIdAndUpdate(req.user._id, {
            $push: { appliedJobs: job._id }
        });

        res.json({
            success: true,
            message: "Application submitted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my posted jobs
// @route   GET /jobs/my/posted
// @access  Private
export const getMyPostedJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id })
            .populate('applicants.user', 'name email profile.skills')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: jobs.length,
            data: jobs,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my job applications
// @route   GET /jobs/my/applications
// @access  Private
export const getMyApplications = async (req, res, next) => {
    try {
        const jobs = await Job.find({
            'applicants.user': req.user._id
        })
            .populate('postedBy', 'name email profile.companyName')
            .sort({ createdAt: -1 });

        // Filter to show only user's application status
        const applicationsWithStatus = jobs.map(job => {
            const myApplication = job.applicants.find(
                app => app.user.toString() === req.user._id.toString()
            );
            return {
                ...job.toObject(),
                myApplicationStatus: myApplication?.status,
                appliedAt: myApplication?.appliedAt,
            };
        });

        res.json({
            success: true,
            count: applicationsWithStatus.length,
            data: applicationsWithStatus,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PUT /jobs/:id/applicants/:userId
// @access  Private (job owner or admin)
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Check if user is job owner or admin
        if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // Find and update applicant status
        const applicant = job.applicants.find(
            app => app.user.toString() === req.params.userId
        );

        if (!applicant) {
            return res.status(404).json({ success: false, message: "Applicant not found" });
        }

        applicant.status = status;
        await job.save();

        res.json({
            success: true,
            message: "Application status updated successfully",
        });
    } catch (error) {
        next(error);
    }
};
