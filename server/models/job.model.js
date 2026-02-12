import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
        },
        requirements: {
            type: String,
            required: [true, "Job requirements are required"],
        },
        salary: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: "USD",
            },
        },
        location: {
            type: String,
            required: [true, "Location is required"],
        },
        remote: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            enum: ["full-time", "part-time", "contract", "internship"],
            required: [true, "Job type is required"],
        },
        skills: [String],

        // Posted by (any user can post)
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Company info (from user's profile or override)
        companyName: String,
        companyLogo: String,

        // Applicants
        applicants: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            appliedAt: {
                type: Date,
                default: Date.now,
            },
            status: {
                type: String,
                enum: ["pending", "reviewed", "shortlisted", "rejected", "accepted"],
                default: "pending",
            },
            resume: String,
            coverLetter: String,
        }],

        status: {
            type: String,
            enum: ["active", "closed", "draft"],
            default: "active",
        },

        expiresAt: Date,
    },
    { timestamps: true }
);

// Index for efficient querying
jobSchema.index({ postedBy: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });

export default mongoose.model("Job", jobSchema);
