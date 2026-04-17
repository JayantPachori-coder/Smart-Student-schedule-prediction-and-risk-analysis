import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Teacher from "./models/Teacher.js";
import dotenv from "dotenv";

dotenv.config();

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });

const run = async () => {
  try {
    // 🔍 Check if user already exists
    const existingUser = await Teacher.findOne({
      email: "jayantpachori2004@gmail.com",
    });

    if (existingUser) {
      console.log("⚠️ User already exists");
      process.exit();
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash("Jayant@2004", 10);

    // 👨‍🏫 Create user
    await Teacher.create({
      name: "Admin Teacher",
      email: "jayantpachori2004@gmail.com",
      password: hashedPassword,
      role: "teacher",
    });

    console.log("✅ Admin Teacher inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting user:", error.message);
    process.exit(1);
  }
};

run();