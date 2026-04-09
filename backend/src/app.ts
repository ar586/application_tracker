import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

// ✅ Connect DB BEFORE any routes, for every request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err: any) {
        console.error("DB Middleware Error:", err.message);
        res.status(500).json({ error: "Database Connectivity Error", details: err.message });
    }
});

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        version: "1.2.0",
        buildTime: "2026-04-09T22:52:00"
    });
});

export default app;
