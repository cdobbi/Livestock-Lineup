/**
 * This file handles all operations related to lineups.
 * It provides routes to fetch lineups for a specific show from the database.
 * The routes defined here are used to populate lineup-related data in the frontend.
 * It relies on the centralized database connection from db.js.
 */

const express = require("express");
const pool = require("../src/db"); // Import the centralized database connection

const router = express.Router(); // Initialize the router

// Fetch lineups for a specific show
router.get("/", async (req, res) => {
    const { showId } = req.query;

    // Validate input
    if (!showId) {
        return res.status(400).json({ message: "Show ID is required." });
    }

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

        res.status(200).json(result.rows); // Send the fetched data as JSON
    } catch (error) {
        console.error("Error fetching lineups:", error);
        res.status(500).json({ message: "Failed to fetch lineups." });
    }
});

module.exports = router; // Export the router