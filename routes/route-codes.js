/**
 * This file handles all operations related to organizer codes.
 * It provides routes to verify codes stored in the database.
 * The routes defined here are used to validate organizer codes in the frontend.
 * It relies on the centralized database connection from db.js.
 */

const express = require("express");
const pool = require("../src/db"); // Import the centralized database connection

const router = express.Router();

// Endpoint for verifying codes
router.post("/verify", async (req, res) => {
    const { code } = req.body;

    // Validate input
    if (!code) {
        return res.status(400).json({ valid: false, message: "Code is required." });
    }

    try {
        // Query the database for the code
        const result = await pool.query("SELECT * FROM Codes WHERE code = $1", [code]);

        // Check if the code exists
        if (result.rows.length > 0) {
            res.json({
                valid: true,
                description: result.rows[0].description, // Return the description of the code
            });
        } else {
            res.status(401).json({ valid: false, message: "Invalid code." });
        }
    } catch (error) {
        console.error("Error verifying code:", error);
        res.status(500).json({ valid: false, message: "An error occurred. Please try again." });
    }
});

module.exports = router;