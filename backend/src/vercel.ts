import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/app_tracker";

// Helper to ensure MongoDB is connected before handling requests
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        console.log("Connecting to MongoDB... URI starts with:", MONGODB_URI.substring(0, 20));
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log("Connected to MongoDB via Vercel Handler");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

// Vercel handles the request starting from here
export default async (req: any, res: any) => {
    await connectDB();
    return app(req, res);
};
