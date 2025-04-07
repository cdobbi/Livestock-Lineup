const express = require("express");
const cors = require("cors");
const path = require("path");
const Pusher = require("pusher");
const { Pool } = require("pg");

// Import routes
const routeEx = require("./routes/route-ex");
const routeOr = require("./routes/route-or");
const authRoutes = require("./routes/route-auth");
const codeRoutes = require("./routes/route-codes");
const submissionsRoutes = require("./routes/route-submissions");

// Initialize the app
const app = express();

// PostgreSQL Pool Configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Render-hosted PostgreSQL
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Configure Pusher
const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
});

// Routes
app.use("/exhibitors", routeEx);
app.use("/organizers", routeOr);
app.use("/auth", authRoutes);
app.use("/codes", codeRoutes);
app.use("/submissions", submissionsRoutes);

// Example route: Fetch breeds
app.get("/api/breeds", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Breeds");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching breeds:", error);
        res.status(500).json({ message: "Failed to fetch breeds." });
    }
});

// Example route: Fetch lineups
app.get("/api/lineups", async (req, res) => {
    const { showId } = req.query;

    try {
        const result = await pool.query(
            `
            SELECT l.id, s.name AS show_name, c.name AS category_name, b.name AS breed_name
            FROM Lineups l
            JOIN Shows s ON l.show_id = s.id
            JOIN Categories c ON l.category_id = c.id
            JOIN Breeds b ON l.breed_id = b.id
            WHERE l.show_id = $1
            `,
            [showId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching lineups:", error);
        res.status(500).json({ message: "Failed to fetch lineups." });
    }
});

// Example route: Notifications
app.get("/exhibitor/notifications", (req, res) => {
    const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" },
        { breed: "Flemish Giant" },
    ];
    res.json(notifications);
});

// Pusher configuration endpoint
app.get("/pusher-config", (req, res) => {
    res.json({
        key: process.env.key,
        cluster: process.env.cluster,
    });
});

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("Route not found");
});

module.exports = app;