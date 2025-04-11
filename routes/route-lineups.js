import express from "express";
import pool from "../src/db.js"; // Import the centralized database connection

const router = express.Router(); // Initialize the router

// Save a lineup
router.post("/", async (req, res) => {
    const { showId, categoryId, breedIds } = req.body; // Expect integers or an array of integers
    try {
        // Insert each breed ID as a separate row in the database
        const queries = breedIds.map((breedId) =>
            pool.query(
                "INSERT INTO lineups (show_id, category_id, breed_id) VALUES ($1, $2, $3) RETURNING *",
                [showId, categoryId, breedId]
            )
        );

        const results = await Promise.all(queries); // Execute all queries
        const savedLineups = results.map((result) => result.rows[0]); // Collect saved rows

        res.status(201).json(savedLineups);
    } catch (error) {
        console.error("Error saving lineup:", error);
        res.status(500).json({ message: "Failed to save lineup." });
    }
});

// Fetch all lineups
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                l.id AS lineup_id,
                l.show_id,
                l.category_id,
                b.breed_name,
                c.name AS category_name, -- Use the correct column name and alias it
                s.name AS show_name -- Use the correct column name and alias it
            FROM 
                lineups l
            JOIN 
                breeds b ON l.breed_id = b.id
            JOIN 
                categories c ON l.category_id = c.id
            JOIN 
                shows s ON l.show_id = s.id
            ORDER BY 
                l.id
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching lineups:", error);
        res.status(500).json({ message: "Failed to fetch lineups." });
    }
});

// Clear all lineups
router.delete("/", async (req, res) => {
    try {
        // Delete all entries in the 'lineups' table
        await pool.query("DELETE FROM lineups");
        res.status(200).json({ message: "All lineups cleared successfully." });
    } catch (error) {
        console.error("Error clearing lineups:", error);
        res.status(500).json({ message: "Failed to clear lineups." });
    }
});

export default router; // Export the router