/**
 * This file handles all operations related to exhibitors.
 * It provides routes to fetch all exhibitors and save new exhibitor data to the database.
 * The routes defined here are used to manage exhibitor-related data in the frontend.
 * It relies on the centralized database connection from db.js.
 */

const express = require("express");
const pool = require("../src/db"); // Import the centralized database connection

const router = express.Router(); // Initialize the router

// Fetch all exhibitors
router.get("/all-exhibitors", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM sumbissions ORDER BY id"); // Fetch all exhibitors
        res.status(200).json(result.rows); // Send the fetched data as JSON
    } catch (error) {
        console.error("Error fetching exhibitorssubmissions:", error);
        res.status(500).json({ message: "Failed to fetch exhibitors." });
    }
});

// Save exhibitor data
router.post("/save-exhibitor", async (req, res) => {
    try {
        const { exhibitor_id, category_id, show_id, breed_id } = req.body;

        // Validate required fields
        if (!exhibitor_id || !category_id || !show_id || !breed_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await pool.query(
            "INSERT INTO submissions (exhibitor_is, category_id, show_id, breed_is) VALUES ($1, $2, $3, $4) RETURNING *",
            [exhibitor_is, category_id, show_id, breed_is]
        );

        res.status(201).json({ message: "Submission saved successfully!", submission: result.rows[0] });
    } catch (error) {
        console.error("Error saving submission data:", error);
        res.status(500).json({ error: "Failed to save submission data." });
    }
});

module.exports = router;