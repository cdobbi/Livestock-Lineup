const express = require("express");
const { Pool } = require("pg"); // PostgreSQL client setup

const router = express.Router(); // Initialize the router

// Use the existing pool object from your server configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Render-hosted PostgreSQL
});

// Fetch all exhibitors
router.get("/all-exhibitors", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Exhibitors"); // Adjust table name if needed
        res.json(result.rows); // Send the fetched data as JSON
    } catch (error) {
        console.error("Error fetching exhibitor data:", error);
        res.status(500).json({ error: "Failed to fetch exhibitor data." });
    }
});

// Save exhibitor data
router.post("/save-exhibitor", async (req, res) => {
    try {
        const { name, category, show, breeds } = req.body;

        if (!name || !category || !show || !breeds || !Array.isArray(breeds)) {
            return res.status(400).json({ error: "Missing or invalid fields" });
        }

        // Insert exhibitor data into the database
        const result = await pool.query(
            "INSERT INTO Exhibitors (name, category, show, breeds) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, category, show, JSON.stringify(breeds)] // Store breeds as JSON
        );

        res.status(201).json({ message: "Exhibitor saved successfully!", exhibitor: result.rows[0] });
    } catch (error) {
        console.error("Error saving exhibitor data:", error);
        res.status(500).json({ error: "Failed to save exhibitor data." });
    }
});

module.exports = router; // Export the router