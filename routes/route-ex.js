import express from "express";
import pool from "../src/db.js"; // Centralized database connection

const router = express.Router();

// Fetch all exhibitors submissions
router.get("/exhibitors", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM submissions ORDER BY exhibitor_id");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching exhibitor submissions:", error);
        res.status(500).json({ message: "Failed to fetch exhibitors." });
    }
});

// Save exhibitor submission data
router.post("/save-exhibitor", async (req, res) => {
    try {
        const { exhibitor_id, category_id, show_id, breed_id } = req.body;

        // Validate required fields
        if (!exhibitor_id || !category_id || !show_id || !breed_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await pool.query(
            "INSERT INTO submissions (exhibitor_id, category_id, show_id, breed_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [exhibitor_id, category_id, show_id, breed_id]
        );

        res.status(201).json({ message: "Submission saved successfully!", submission: result.rows[0] });
    } catch (error) {
        console.error("Error saving submission data:", error);
        res.status(500).json({ error: "Failed to save submission data." });
    }
});

export default router;