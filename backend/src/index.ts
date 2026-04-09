import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Disable Mongoose buffering globally to fail fast on connection issues
mongoose.set("bufferCommands", false);

let cachedConnection: Promise<typeof mongoose> | null = null;

const connectDB = async () => {
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // throw error if URI is missing
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is missing from Vercel environment variables!");
    }

    // If a connection is already in progress, wait for it
    if (cachedConnection) {
        console.log("Waiting for existing connection attempt...");
        await cachedConnection;
        return;
    }

    try {
        console.log("Connecting to MongoDB Atlas (New Attempt)...");
        cachedConnection = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        await cachedConnection;
        console.log("MongoDB Connected Successfully");
    } catch (error: any) {
        console.error("MongoDB Connection Error:", error);
        cachedConnection = null; // Reset so next request can try again
        throw new Error(`DB Connection Failed: ${error.message}`);
    }
};

// For local development
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running locally on port ${PORT}`);
        });
    });
}

// Ensure DB is connected for every request on Vercel (serverless)
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

export default app;
