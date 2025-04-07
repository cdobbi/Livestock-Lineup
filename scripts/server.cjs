const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");
const path = require("path");
const { Pool } = require("pg"); // PostgreSQL client setup
const fs = require("fs");

const routeEx = require("../routes/route-ex.js"); // Handles exhibitor logic
const routeOr = require("../routes/route-or.js"); // Handles organizer logic
const authRoutes = require("../routes/route-auth.js"); // Handles authentication logic
const codeRoutes = require("../routes/route-codes.js"); // Handles code verification

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Pool Configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Render-hosted PostgreSQL
});

// Middleware
app.use(express.json());
app.use(cors());

// Delegate exhibitor, organizer, and authentication routes
app.use("/exhibitors", routeEx);
app.use("/organizers", routeOr);
app.use("/auth", authRoutes);
app.use("/codes", codeRoutes);

// Configure Pusher
const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
});

// Verify Code Endpoint
app.post("/verify-code", (req, res) => {
    const { code } = req.body;
    if (code === "12345") {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

// exhibitor Route: Fetch Lineups
app.get("/exhibitor/lineups", async (req, res) => {
    const { showId } = req.query; // Get the show ID from the query string

    try {
        const result = await pool.query(`
            SELECT l.id, s.name AS show_name, c.name AS category_name, b.name AS breed_name
            FROM Lineups l
            JOIN Shows s ON l.show_id = s.id
            JOIN Categories c ON l.category_id = c.id
            JOIN Breeds b ON l.breed_id = b.id
            WHERE l.show_id = $1
        `, [showId]);

        res.json(result.rows); // Send the fetched data as JSON
    } catch (error) {
        console.error("Error fetching lineups:", error);
        res.status(500).json({ message: "Failed to fetch lineups." });
    }
});

// exhibitor Route: Notifications
app.get("/exhibitor/notifications", (req, res) => {
    const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" },
        { breed: "Flemish Giant" },
    ];
    res.json(notifications);
});

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Serve index.html for the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Pusher Configuration Endpoint
app.get("/pusher-config", (req, res) => {
    res.json({
        key: process.env.key,
        cluster: process.env.cluster,
    });
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
