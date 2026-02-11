import AdminEmployer from "../models/adminEmployer.model.js";

const seedAdmin = async () => {
    try {
        const existingAdmin = await AdminEmployer.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            return;
        }

        const adminData = {
            email: "admin@skillproof.com",
            password: "Admin@123456",
            role: "admin",
            name: "Administrator",
            isActive: true,
        };

        const admin = await AdminEmployer.create(adminData);

        console.log("✅ Default admin created successfully!");
        console.log("━".repeat(50));
        console.log("📧 Email:    ", adminData.email);
        console.log("🔑 Password: ", adminData.password);
        console.log("━".repeat(50));
        console.log("⚠️  IMPORTANT: Change the password after first login!");
    } catch (error) {
        console.error("❌ Error seeding admin:", error.message);
    }
};

export default seedAdmin;
