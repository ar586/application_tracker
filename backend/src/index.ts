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
    // 1. If we are already fully connected, just return
    if ((mongoose.connection.readyState as number) === 1) {
        return;
    }

    // 2. Check for URI
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is missing from Vercel environment variables!");
    }

    // 3. If a connection is already in progress, wait for it
    if (cachedConnection) {
        console.log("Waiting for existing connection promise...");
        try {
            await cachedConnection;
            if ((mongoose.connection.readyState as number) === 1) return;
        } catch (err) {
            cachedConnection = null; // Reset for retry
        }
    }

    // 4. Start a new connection attempt
    try {
        console.log("Starting fresh MongoDB connection attempt...");
        cachedConnection = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 8000, // 8 seconds
        });

        await cachedConnection;

        // Final sanity check
        if ((mongoose.connection.readyState as number) !== 1) {
            throw new Error(`Connection state is ${mongoose.connection.readyState} after connect() resolved`);
        }

        console.log("MongoDB Connected Successfully");
    } catch (error: any) {
        console.error("CRITICAL MongoDB Connection Error:", error);
        cachedConnection = null;
        throw new Error(`Production DB Error: ${error.message}`);
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
    try {
        await connectDB();
        next();
    } catch (err: any) {
        console.error("Middleware DB Failure:", err);
        res.status(500).json({
            error: "Database Connectivity Error",
            details: err.message,
            state: mongoose.connection.readyState
        });
    }
});

export default app;
