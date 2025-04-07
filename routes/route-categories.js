const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for hosted PostgreSQL
});

// Retrieve all categories
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Categories ORDER BY id");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Add a new category (optional, for admin use)
router.post("/", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Category name is required." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO Categories (name) VALUES ($1) RETURNING id",
            [name]
        );
        res.status(201).json({ message: "Category added successfully!", categoryId: result.rows[0].id });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

module.exports = router;