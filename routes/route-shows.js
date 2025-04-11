/**
 * This file handles all operations related to shows.
 * It provides routes to retrieve all shows and add new shows to the database.
 * The routes defined here are used to manage show-related data in the frontend.
 * It relies on the centralized database connection from db.js.
 */

const express = require("express");
const pool = require("../src/db"); // Import the centralized database connection

const router = express.Router(); // Initialize the router

// Retrieve all shows
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Shows ORDER BY id");
        res.status(200).json(result.rows); // Send the fetched data as JSON
    } catch (error) {
        console.error("Error retrieving shows:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Add a new show (optional, for admin use)
router.post("/", async (req, res) => {
    const { name } = req.body;

    // Validate input
    if (!name) {
        return res.status(400).json({ message: "Show name is required." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO Shows (name) VALUES ($1) RETURNING id",
            [name]
        );
        res.status(201).json({ message: "Show added successfully!", showId: result.rows[0].id });
    } catch (error) {
        console.error("Error adding show:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

module.exports = router; // Export the router
