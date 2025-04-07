/**
 * This file handles all operations related to organizers.
 * It provides routes to validate organizer codes, save organizer lineups, retrieve lineups, 
 * and trigger notifications for specific breeds in the lineup.
 * The routes defined here are used to manage organizer-related data in the frontend.
 * It relies on the centralized database connection from db.js and integrates with Pusher for notifications.
 */

const express = require("express");
const pool = require("../db"); // Import the centralized database connection
const Pusher = require("pusher");

const router = express.Router(); // Initialize the router

// Configure Pusher
const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
});

// Validate organizer code
router.post("/api/validate-code", (req, res) => {
    const { code } = req.body;

    // Replace with your actual validation logic
    if (code === "12345") {
        res.status(200).json({ valid: true });
    } else {
        res.status(401).json({ valid: false, message: "Invalid code." });
    }
});

// Save organizer lineups
router.post("/api/save-organizer-lineups", async (req, res) => {
    const { show_name, lineup } = req.body;

    // Validate the input
    if (!show_name || !lineup || !Array.isArray(lineup)) {
        return res.status(400).json({ error: "Invalid organizer data." });
    }

    try {
        // Check if the show already exists in the database
        const existingShow = await pool.query(
            "SELECT * FROM Organizers WHERE show_name = $1",
            [show_name]
        );

        if (existingShow.rows.length > 0) {
            // Update the existing lineup
            await pool.query(
                "UPDATE Organizers SET lineup = $1 WHERE show_name = $2",
                [JSON.stringify(lineup), show_name]
            );
        } else {
            // Insert a new lineup
            await pool.query(
                "INSERT INTO Organizers (show_name, lineup) VALUES ($1, $2)",
                [show_name, JSON.stringify(lineup)]
            );
        }

        res.status(200).json({ message: "Organizer lineups saved successfully." });
    } catch (error) {
        console.error("Error saving organizer lineups:", error);
        res.status(500).json({ error: "Failed to save organizer lineups." });
    }
});

// Retrieve organizer lineups
router.get("/api/get-organizer-lineups", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Organizers");
        res.status(200).json(result.rows); // Send the fetched data as JSON
    } catch (error) {
        console.error("Error fetching organizer lineups:", error);
        res.status(500).json({ error: "Failed to fetch organizer lineups." });
    }
});

// Trigger a notification for a specific breed in the lineup
router.post("/api/notify", (req, res) => {
    const { category, show, breed } = req.body;

    // Validate input
    if (!category || !show || !breed) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // Trigger a notification using Pusher
    pusher.trigger("Livestock-Lineup", "breed-notification", {
        category,
        show,
        breed,
    });

    console.log(`Notification sent for Category: ${category}, Show: ${show}, Breed: ${breed}`);
    res.status(200).json({ message: "Notification sent successfully." });
});

module.exports = router; // Export the router