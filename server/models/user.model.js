import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Core Authentication
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ["developer", "employer", "admin"],
      default: "developer",
    },

    // Common Fields
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String, // URL to profile picture
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },

    // Developer-Specific Fields
    developerProfile: {
      // GitHub Integration
      github: {
        username: String,
        profileUrl: String,
        repos: Number,
        followers: Number,
        connectedAt: Date,
      },
      // Resume
      resume: {
        fileName: String,
        fileUrl: String,
        uploadedAt: Date,
      },
      // Skills & Experience
      skills: [String],
      experience: {
        type: String,
        enum: ["junior", "mid", "senior", "lead"],
      },
      bio: String,
      portfolio: String, // Portfolio website URL
      // Job Application Tracking
      appliedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
    },

    // Employer-Specific Fields
    employerProfile: {
      // Company Details
      companyName: {
        type: String,
        trim: true,
      },
      companyWebsite: String,
      companySize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
      },
      industry: String,
      companyLogo: String, // URL to company logo
      companyDescription: String,
      // Job Postings
      postedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};

export default mongoose.model("User", userSchema);
