// route-shows.js
import express from "express";
import pool from "../src/db.js"; // Import the centralized database connection

const router = express.Router();

// Retrieve all shows with associated submissions
router.get("/", async (req, res) => {
    try {
        const query = `
          SELECT 
            s.*,
            COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', sub.id,
                    'exhibitor_id', sub.exhibitor_id,
                    'category_id', sub.category_id,
                    'show_id', sub.show_id,
                    'breed_id', sub.breed_id
                  )
                )
                FROM submissions AS sub
                WHERE sub.show_id = s.id
              ),
              '[]'
            ) AS submissions
          FROM Shows s
          ORDER BY s.id;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error retrieving shows:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

export default router;