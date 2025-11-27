// backend/utils/createAdmin.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const createAdmin = async () => {
  try {
    const adminEmail = "admin@blogapp.com";

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashed = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
      });

      console.log("✅ Admin user created: admin@blogapp.com / admin123");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  }
};

export default createAdmin;
