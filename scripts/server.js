const dotenv = require('dotenv');
dotenv.config();
console.log("Pusher Key:", process.env.key);

const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");
const path = require("path");
const fs = require("fs");

// Import modularized routes
const routeEx = require('routes/route-ex.js'); // Handles exhibitor logic
const routeOr = require('routes/route-or.js'); // Handles organizer logic

// Initialize the Express app and set the port
const app = express();
const port = process.env.PORT || 3000;

// Configure Pusher
const pusher = new Pusher({
    appId: process.env.app_id, 
    key: process.env.key,      
    secret: process.env.secret, 
    cluster: process.env.cluster, 
    useTLS: true,
});

// Middleware
app.use(express.json());
app.use(cors());

// Delegate exhibitor and organizer routes to their respective files
app.use("/", routeEx);
app.use("/", routeOr);

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
app.use(express.static(path.join(__dirname, '..')));

// GET "/" Route: Explicitly serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Pusher Configuration Endpoint
app.get("/pusher-config", (req, res) => {
    res.json({
        key: process.env.key,
        cluster: process.env.cluster,
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});