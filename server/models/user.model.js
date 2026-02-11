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
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["developer", "employer", "admin"],
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
    profilePicture: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },

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
      appliedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
    },

    employerProfile: {
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
      companyLogo: String,
      companyDescription: String,
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


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};

export default mongoose.model("User", userSchema);
