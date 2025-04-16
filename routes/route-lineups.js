import express from "express";
import pool from "../src/db.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
    "/",
    [
        body("show_id")
            .exists()
            .withMessage("Show ID is required."),
        body("category_id")
            .exists()
            .withMessage("Category ID is required."),
        body("breed_ids")
            .isArray({ min: 1 })
            .withMessage("Breed must be a non-empty array."),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { show_id, category_id, breed_ids } = req.body;
        console.log("Received lineup payload:", req.body);

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const savedLineups = [];
            // Insert one row per breed into the lineups table.
            // Use "breed_id" (singular) to match your table and your GET route.
            for (const breed_id of breed_ids) {
                const result = await client.query(
                    `INSERT INTO lineups 
             (show_id, category_id, breed_id)
           VALUES ($1, $2, $3) RETURNING *`,
                    [show_id, category_id, breed_id]
                );
                savedLineups.push(result.rows[0]);
            }

            await client.query("COMMIT");
            return res.status(201).json(savedLineups);
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error saving lineup:", error.message);
            return res.status(500).json({
                message: "Failed to save lineup.",
                error: error.message,
            });
        } finally {
            client.release();
        }
    }
);

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        l.id AS lineup_id,
        l.show_id AS show_name,
        l.category_id AS category_name,
        l.breed_id AS breed_name
      FROM lineups l
      LEFT JOIN shows sh ON l.show_id = sh.id
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN breeds b ON l.breed_id = b.id
      ORDER BY l.id
    `);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching lineups:", error.message);
        return res.status(500).json({
            message: "Failed to fetch lineups.",
            error: error.message,
        });
    }
});

router.delete("/", async (req, res) => {
    try {
        await pool.query("DELETE FROM lineups");
        return res.status(200).json({ message: "All lineups cleared successfully." });
    } catch (error) {
        console.error("Error clearing lineups:", error.message);
        return res.status(500).json({
            message: "Failed to clear lineups.",
            error: error.message,
        });
    }
});

export default router;
