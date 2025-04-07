const express = require("express");
const { Pool } = require("pg");

const router = express.Router();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Fetch lineups for a specific show
router.get("/", async (req, res) => {
    const { showId } = req.query;

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

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching lineups:", error);
        res.status(500).json({ message: "Failed to fetch lineups." });
    }
});

module.exports = router;