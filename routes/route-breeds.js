const express = require("express");
const { Pool } = require("pg");

const router = express.Router();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Fetch all breeds
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Breeds");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching breeds:", error);
        res.status(500).json({ message: "Failed to fetch breeds." });
    }
});

module.exports = router;