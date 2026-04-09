import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Disable Mongoose buffering globally to fail fast on connection issues
mongoose.set("bufferCommands", false);

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    if (!MONGODB_URI) {
        console.error("MONGODB_URI is missing from environment variables!");
        return;
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        // Do not throw here to allow the process to stay alive if it's a transient error,
        // but queries will fail fast due to bufferCommands: false
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
