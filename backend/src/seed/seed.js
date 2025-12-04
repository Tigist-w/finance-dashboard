import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
const run = async () => {
  await connectDB();
  await Category.deleteMany();
  const cats = [
    { name: "Salary", type: "income", color: "#16a34a" },
    { name: "Business", type: "income", color: "#0ea5e9" },
    { name: "Food", type: "expense", color: "#ef4444" },
    { name: "Transport", type: "expense", color: "#f59e0b" },
    { name: "Utilities", type: "expense", color: "#6b7280" },
  ];
  await Category.insertMany(cats);
  await User.deleteMany();
  const pw = await bcrypt.hash("password", 10);
  await User.create({
    name: "Admin",
    email: "admin@example.com",
    passwordHash: pw,
  });
  console.log("Seed done");
  process.exit(0);
};
run();
