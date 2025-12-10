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

// Fix CORS for Vercel + Render
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173", // for local frontend development
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Unprotected routes
app.use("/api/auth", authRoutes);

// Protected API routes
app.use("/api/transactions", transactionsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/budgets", budgetsRoutes);

// Protected report endpoint
app.get("/api/reports/summary", authorize, summary);

// Health check for Render
app.get("/", (req, res) => {
  res.json({ status: "Backend API running" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
