const express = require("express");
const { Pool } = require("pg"); // PostgreSQL connection
const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "your_external_database_url_here",
});

// Endpoint for verifying codes
router.post("/verify", async (req, res) => {
    const { code } = req.body;

    try {
        // Query the database for the code
        const result = await pool.query("SELECT * FROM Codes WHERE code = $1", [code]);

        // Check if the code exists
        if (result.rows.length > 0) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false });
        }
    } catch (error) {
        console.error("Error verifying code:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

module.exports = router;
