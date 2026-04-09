import "./config/db.js"; // Set global Mongoose options first
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// For local development only
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    import("./config/db.js").then(({ connectDB }) => {
        connectDB().then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        });
    });
}

export default app;
