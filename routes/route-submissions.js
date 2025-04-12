import express from "express";
import pool from "../src/db.js"; // Import the centralized database connection

const router = express.Router(); // Initialize the router

// Save a lineup
router.post("/", async (req, res) => {
    const { showId, categoryId, breedId } = req.body; // Expect integers or an array of integers

    // Debugging: Log the received request body
    console.log("Request body received for saving lineup:", req.body);

    try {
        if (!showId || !categoryId || !Array.isArray(breedId) || breedId.length === 0) {
            return res.status(400).json({
                message: "Invalid payload. Ensure 'showId', 'categoryId', and 'breedId' are provided.",
            });
        }

        // Insert each breed ID as a separate row in the database
        const queries = breedId.map(async (breedId) => {
            try {
                return await pool.query(
                    "INSERT INTO lineups (show_id, category_id, breed_id) VALUES ($1, $2, $3) RETURNING *",
                    [showId, categoryId, breedId]
                );
            } catch (queryError) {
                console.error(`Error inserting breedId ${breedId}:`, queryError.message);
                throw queryError; // Re-throw to propagate error
            }
        });

        const results = await Promise.all(queries); // Execute all queries
        const savedLineups = results.map((result) => result.rows[0]); // Collect saved rows

        res.status(201).json(savedLineups);
    } catch (error) {
        console.error("Error saving lineup:", error.message);
        res.status(500).json({ message: "Failed to save lineup.", error: error.message });
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
                c.name AS category_name, 
                s.name AS show_name
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
        console.error("Error fetching lineups:", error.message);
        res.status(500).json({ message: "Failed to fetch lineups.", error: error.message });
    }
});

// Clear all lineups
router.delete("/", async (req, res) => {
    try {
        await pool.query("DELETE FROM lineups"); // Delete all entries in the 'lineups' table
        res.status(200).json({ message: "All lineups cleared successfully." });
    } catch (error) {
        console.error("Error clearing lineups:", error.message);
        res.status(500).json({ message: "Failed to clear lineups.", error: error.message });
    }
});

export default router; // Export the router
