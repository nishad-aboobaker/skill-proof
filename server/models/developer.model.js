import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const developerSchema = new mongoose.Schema(
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
            default: "developer",
        },
        name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        profilePicture: String,
        developerProfile: {
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
            appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: Date,
    },
    { timestamps: true }
);

developerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

developerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Developer", developerSchema);
