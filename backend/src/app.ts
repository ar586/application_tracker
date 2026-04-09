import express from "express";
import cors from "cors";
import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Routes will be added here
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        version: "1.0.8",
        buildTime: "2026-04-09T22:35:00Z"
    });
});

export default app;
