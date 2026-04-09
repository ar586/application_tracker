import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// SET ALL OPTIONS BEFORE ANYTHING ELSE
mongoose.set('bufferCommands', true);
mongoose.set('bufferTimeoutMS', 15000); // 15 seconds

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return mongoose.connection;

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is missing from environment variables!");
    }

    if (!cachedPromise) {
        console.log("Creating new MongoDB connection promise...");
        cachedPromise = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        }).then((m) => {
            console.log("✅ MongoDB Connected!");
            return m;
        });
    }

    try {
        await cachedPromise;
        return mongoose.connection;
    } catch (err: any) {
        cachedPromise = null;
        console.error("❌ MongoDB Connection Error:", err.message);
        throw err;
    }
};
