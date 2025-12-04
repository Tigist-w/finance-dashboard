import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import transactionsRoutes from "./routes/transactions.js";
import categoriesRoutes from "./routes/categories.js";
import accountsRoutes from "./routes/accounts.js";
import budgetsRoutes from "./routes/budgets.js";
import { authorize } from "./middleware/auth.js";
import { summary } from "./controllers/reportController.js";

dotenv.config();
const app = express();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/budgets", budgetsRoutes);
// protected report endpoint
app.get("/api/reports/summary", authorize, summary);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on", PORT));
