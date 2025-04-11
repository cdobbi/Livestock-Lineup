// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.

import express from "express";
import cors from "cors";
import path from "path";
import Pusher from "pusher";
import { Pool } from "pg";
import { fileURLToPath } from "url";
import routeEx from "../routes/route-ex.js";
import routeOr from "../routes/route-or.js";
import authRoutes from "../routes/route-auth.js";
import codeRoutes from "../routes/route-codes.js";
import submissionsRoutes from "../routes/route-submissions.js";
import showsRoutes from "../routes/route-shows.js";
import lineupsRoutes from "../routes/route-lineups.js";
import breedsRoutes from "../routes/route-breeds.js";
import notificationsRoutes from "../routes/route-notifications.js";
import categoriesRoutes from "../routes/route-categories.js";

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for your client-side code)
app.use(express.static(path.join(__dirname, "../public")));

// PostgreSQL Pool Configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Render-hosted PostgreSQL
});
app.locals.pool = pool; // Optional: make the pool available to route modules

// Configure Pusher (if using notifications)
const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
});

// Logging middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Mount the routes, for example under an API namespace:
app.use("/api/exhibitors", routeEx);
app.use("/api/organizers", routeOr);
app.use("/api/auth", authRoutes);
app.use("/api/codes", codeRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/shows", showsRoutes);
app.use("/api/lineups", lineupsRoutes);
app.use("/api", breedsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/categories", categoriesRoutes);

// Test database connection
app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.status(200).json({ message: "Database connection successful!", time: result.rows[0] });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed." });
    }
});

// Default route (if you need one)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

export default app;