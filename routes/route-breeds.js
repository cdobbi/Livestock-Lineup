/**
 * This file handles all operations related to breeds.
 * It provides routes to fetch all breeds from the database.
 * The routes defined here are used to populate breed-related data in the frontend.
 * It relies on the centralized database connection from db.js.
 */

const express = require("express");
const pool = require("../db"); // Import the centralized database connection

const router = express.Router();

// Fetch all breeds
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Breeds ORDER BY id");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching breeds:", error);
        res.status(500).json({ message: "Failed to fetch breeds." });
    }
});

module.exports = router;