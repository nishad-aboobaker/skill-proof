import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        profilePicture: String,

        // Unified profile supporting both job seeker and employer functionality
        profile: {
            // Job Seeker fields
            github: {
                username: String,
                profileUrl: String,
                repos: Number,
                followers: Number,
                connectedAt: Date,
            },
            resume: {
                fileName: String,
                fileUrl: String,
                uploadedAt: Date,
            },
            skills: [String],
            experience: {
                type: String,
                enum: ["junior", "mid", "senior", "lead"],
            },
            bio: String,
            portfolio: String,

            // Employer fields (when user posts jobs)
            companyName: String,
            companyWebsite: String,
            companySize: {
                type: String,
                enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
            },
            industry: String,
            companyLogo: String,
            companyDescription: String,
        },

        // Activity tracking
        postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
        appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: Date,
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
