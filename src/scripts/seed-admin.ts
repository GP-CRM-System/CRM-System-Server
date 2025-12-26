import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Role from "../models/role.model.js";
import Employee from "../models/employee.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/neocrm-dev";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for admin seeding");

    // Create or find the root role
    let rootRole = await Role.findOne({ name: "Root" });
    if (!rootRole) {
      rootRole = await Role.create({
        name: "Root",
        isActive: true,
        Company: { read: true, write: true, delete: true },
        Employee: { read: true, write: true, delete: true },
        Contact: { read: true, write: true, delete: true },
        Deal: { read: true, write: true, delete: true },
        Role: { read: true, write: true, delete: true },
        Order: { read: true, write: true, delete: true },
        Ticket: { read: true, write: true, delete: true },
      });
      console.log("Root role created");
    } else {
      console.log("Root role already exists");
    }

    // Create or update the admin user
    const adminEmail = "admin@nexify.com";
    const adminPassword = "123456789";
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    let admin = await Employee.findOne({ email: adminEmail });
    if (!admin) {
      admin = await Employee.create({
        fullName: "Admin User",
        phone: "+1 (999) 999-9999",
        email: adminEmail,
        password: hashedPassword,
        role: rootRole._id,
        salary: 999999,
        isActive: true
      });
      console.log("Admin user created");
    } else {
      admin.password = hashedPassword;
      admin.role = rootRole._id;
      admin.isActive = true;
      await admin.save();
      console.log("Admin user updated");
    }

    mongoose.connection.close();
    console.log("Admin seeding completed!");
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
};

run();
