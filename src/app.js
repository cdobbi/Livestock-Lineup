// <!-- // Verify, ensure that require and module.exports are used and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly. -


const express = require("express");
const cors = require("cors");
const path = require("path");
const Pusher = require("pusher");
const { Pool } = require("pg");

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

// Import routes using the correct relative path (going up one level)
const routeEx = require("../routes/route-ex");
const routeOr = require("../routes/route-or");
const authRoutes = require("../routes/route-auth");
const codeRoutes = require("../routes/route-codes");
const submissionsRoutes = require("../routes/route-submissions");
const showsRoutes = require("../routes/route-shows");
const lineupsRoutes = require("../routes/route-lineups");
const breedsRoutes = require("../routes/route-breeds");
const notificationsRoutes = require("../routes/route-notifications");
const categoriesRoutes = require("../routes/route-categories");

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

module.exports = app;