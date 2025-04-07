/**
 * This file handles all operations related to exhibitors.
 * It provides routes to fetch all exhibitors and save new exhibitor data to the database.
 * The routes defined here are used to manage exhibitor-related data in the frontend.
 * It relies on the centralized database connection from db.js.
 */

const express = require("express");
const pool = require("../db"); // Import the centralized database connection

const router = express.Router(); // Initialize the router

// Fetch all exhibitors
router.get("/all-exhibitors", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Exhibitors ORDER BY id"); // Fetch all exhibitors
        res.status(200).json(result.rows); // Send the fetched data as JSON
    } catch (error) {
        console.error("Error fetching exhibitor data:", error);
        res.status(500).json({ error: "Failed to fetch exhibitor data." });
    }
});

// Save exhibitor data
router.post("/save-exhibitor", async (req, res) => {
    try {
        const { name, submissions } = req.body;

        // Validate the input
        if (!name || !submissions || !Array.isArray(submissions)) {
            return res.status(400).json({ error: "Missing or invalid fields" });
        }

        // Insert exhibitor data into the database
        const result = await pool.query(
            "INSERT INTO Exhibitors (name, submissions) VALUES ($1, $2) RETURNING *",
            [name, JSON.stringify(submissions)] // Store submissions as JSON
        );

        res.status(201).json({ message: "Exhibitor saved successfully!", exhibitor: result.rows[0] });
    } catch (error) {
        console.error("Error saving exhibitor data:", error);
        res.status(500).json({ error: "Failed to save exhibitor data." });
    }
});

module.exports = router; // Export the router