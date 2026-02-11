import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminEmployerSchema = new mongoose.Schema(
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
            enum: ["employer", "admin"],
            default: "employer",
        },
        name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        employerProfile: {
            companyName: String,
            companyWebsite: String,
            companySize: {
                type: String,
                enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
            },
            industry: String,
            companyLogo: String,
            companyDescription: String,
            postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: Date,
    },
    { timestamps: true }
);

adminEmployerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

adminEmployerSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("AdminEmployer", adminEmployerSchema);
