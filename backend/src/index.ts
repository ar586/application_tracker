import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Re-enable buffering but with a clear timeout to avoid the 10s hang
// IMPORTANT: This must be set BEFORE importing app/models
mongoose.set("bufferCommands", true);
mongoose.set("bufferTimeoutMS", 5000);

// Now import app (which will import models)
import app from "./app.js";

let cachedConnection: Promise<typeof mongoose> | null = null;

const connectDB = async () => {
    // If already connected, return
    if ((mongoose.connection.readyState as number) === 1) {
        return;
    }

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is missing from Vercel environment variables!");
    }

    // If a connection is already in progress, wait for it
    if (cachedConnection) {
        try {
            await cachedConnection;
            return;
        } catch (err) {
            cachedConnection = null; // Reset for retry
        }
    }

    try {
        console.log("Connecting to MongoDB Atlas...");
        cachedConnection = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        await cachedConnection;
        console.log("MongoDB Connected Successfully");
    } catch (error: any) {
        console.error("MongoDB Connection Error:", error);
        cachedConnection = null;
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
    try {
        await connectDB();
        next();
    } catch (err: any) {
        console.error("Middleware DB Failure:", err);
        res.status(500).json({
            error: "Database Connectivity Error",
            details: err.message,
            mongoState: mongoose.connection.readyState
        });
    }
});

export default app;
