import './config/db.js'; // 1. Set global Mongoose options immediately
import { connectDB } from './config/db.js';
import app from "./app.js";

const PORT = process.env.PORT || 5000;

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
            version: "1.1.0"
        });
    }
});

// For local development
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running locally on port ${PORT}`);
        });
    });
}

export default app;
