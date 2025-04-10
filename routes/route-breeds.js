/**
 * This file handles all operations related to breeds.
 * It provides routes to fetch all breeds from the database.
 * The routes defined here are used to populate breed-related data in the frontend.
 * It relies on the centralized database connection from db.js.
 */

const express = require("express");
const router = express.Router();
const pool = require("../src/db"); // Assuming you're using PostgreSQL with a pool

// Define the /breeds route
router.get("/breeds", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, breed_name, category, related_show FROM breeds ORDER BY id");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching breeds:", error);
        res.status(500).json({ message: "Failed to fetch breeds." });
    }
});

module.exports = router;