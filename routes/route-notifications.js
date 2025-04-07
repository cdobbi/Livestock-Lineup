/**
 * This file handles all operations related to notifications.
 * It provides routes to fetch example notifications for the frontend.
 * The routes defined here are used to simulate notification-related data.
 * This file can be extended to integrate real-time notifications using services like Pusher.
 */

const express = require("express");

const router = express.Router(); // Initialize the router

// Example notifications
router.get("/", (req, res) => {
    // Simulated notifications for the frontend
    const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" },
        { breed: "Flemish Giant" },
    ];

    res.status(200).json(notifications); // Send the notifications as JSON
});

module.exports = router; // Export the router