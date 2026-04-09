import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/app_tracker";

// Disable command buffering so we fail fast if not connected
mongoose.set("bufferCommands", false);

// Helper to ensure MongoDB is connected before handling requests
let isConnected = false;

const connectDB = async () => {
    console.log("Current Mongo State:", mongoose.connection.readyState);
    if (isConnected || mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    try {
        console.log("Connecting to MongoDB Atlas (5s timeout)...");
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error details:", error);
        throw error;
    }
};

// Vercel handles the request starting from here
export default async (req: any, res: any) => {
    await connectDB();
    return app(req, res);
};
