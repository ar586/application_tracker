import express from "express";
import cors from "cors";
import mongoose from "mongoose";

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
app.get("/api/health", async (req, res) => {
    let dbStatus = "Checking...";
    try {
        const client = new mongoose.mongo.MongoClient(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 2000 });
        await client.connect();
        dbStatus = "Connected!";
        await client.close();
    } catch (err: any) {
        dbStatus = `Failed: ${err.message}`;
    }

    res.json({
        status: "ok",
        version: "1.0.9",
        dbConnection: dbStatus,
        buildTime: "2026-04-09T22:42:00"
    });
});

export default app;
