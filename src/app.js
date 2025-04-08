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
app.use(express.static(path.join(__dirname, "public")));

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

// Import routes
const routeEx = require("./routes/route-ex");
const routeOr = require("./routes/route-or");
const authRoutes = require("./routes/route-auth");
const codeRoutes = require("./routes/route-codes");
const submissionsRoutes = require("./routes/route-submissions");
const showsRoutes = require("./routes/route-shows");
const lineupsRoutes = require("./routes/route-lineups");
const breedsRoutes = require("./routes/route-breeds");
const notificationsRoutes = require("./routes/route-notifications");
const categoriesRoutes = require("./routes/route-categories");

// Mount routes under the /api prefix for consistency
app.use("/api/exhibitors", routeEx);
app.use("/api/organizers", routeOr);
app.use("/api/auth", authRoutes);
app.use("/api/codes", codeRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/shows", showsRoutes);
app.use("/api/lineups", lineupsRoutes);
app.use("/api/breeds", breedsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/categories", categoriesRoutes);

// Default route -- serves your HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("Route not found");
});

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

module.exports = app;
