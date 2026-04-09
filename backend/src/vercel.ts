import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/app_tracker";

// Helper to ensure MongoDB is connected before handling requests
let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Fail faster if it's a network issue
        });
        isConnected = true;
        console.log("Connected to MongoDB successfully");
        isConnected = true;
        console.log("Connected to MongoDB via Vercel Handler");
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
