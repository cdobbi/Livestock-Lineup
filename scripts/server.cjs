const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");
const path = require("path");
const fs = require("fs");

// Initialize the Express app and set the port
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Import modularized routes
const routeEx = require("./routes/route-ex.js"); // Handles exhibitor logic
const routeOr = require("./routes/route-or.js"); // Handles organizer logic

// Delegate exhibitor and organizer routes to their respective paths
app.use("/exhibitors", routeEx);
app.use("/organizers", routeOr);

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

// API Route: Notifications
app.get("/api/notifications", (req, res) => {
    const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" },
        { breed: "Flemish Giant" },
    ];
    res.json(notifications);
});

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

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