import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log("Email:", existingAdmin.email);
            process.exit(0);
        }

        // Create default admin
        const adminData = {
            email: "admin@skillproof.com",
            password: "Admin@123456", // Will be hashed by pre-save hook
            role: "admin",
            name: "System Administrator",
            isActive: true,
        };

        const admin = await User.create(adminData);

        console.log("✅ Default admin created successfully!");
        console.log("━".repeat(50));
        console.log("📧 Email:    ", adminData.email);
        console.log("🔑 Password: ", adminData.password);
        console.log("━".repeat(50));
        console.log("⚠️  IMPORTANT: Change the password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin();
