const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "your_database_url_here",
});

// Retrieve all submissions
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Submissions");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error retrieving submissions:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Retrieve submissions for a specific exhibitor
router.get("/exhibitor/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM Submissions WHERE exhibitor_id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No submissions found for this exhibitor." });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error retrieving submissions for exhibitor:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Add a new submission
router.post("/", async (req, res) => {
    const { exhibitor_id, category_id, show_id, breed_id } = req.body;

    // Validate input
    if (!exhibitor_id || !category_id || !show_id || !breed_id) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO Submissions (exhibitor_id, category_id, show_id, breed_id) VALUES ($1, $2, $3, $4) RETURNING id",
            [exhibitor_id, category_id, show_id, breed_id]
        );

        res.status(201).json({ message: "Submission added successfully!", submissionId: result.rows[0].id });
    } catch (error) {
        console.error("Error adding submission:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Export the router
module.exports = router;