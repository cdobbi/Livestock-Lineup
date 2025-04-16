import express from "express";
import pool from "../src/db.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
    "/",
    [
        body("exhibitor_id").exists().withMessage("Exhibitor_id is required."),
        body("show_id").exists().withMessage("Show_id is required."),
        body("category_id").exists().withMessage("Category_id is required."),
        body("breed_ids").isArray({ min: 1 }).withMessage("breed must be a non-empty array."),
    ],
    async (req, res) => {
        // Validate request payload.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { exhibitor_id, show_id, category_id, breed_ids } = req.body;
        console.log("Received submission payload:", req.body);

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const savedSubmissions = [];

            for (const breed_id of breed_ids) {
                const result = await client.query(
                    `INSERT INTO submissions 
               (exhibitor_id, show_id, category_id, breed_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
                    [exhibitor_id, show_id, category_id, breed_id]
                );

                savedSubmissions.push(result.rows[0]);
            }

            await client.query("COMMIT");
            return res.status(201).json(savedSubmissions);
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Error saving submission:", error.message);
            return res.status(500).json({
                message: "Failed to save submission.",
                error: error.message,
            });
        } finally {
            client.release();
        }
    }
);

router.get("/", async (req, res) => {
    // Check if an exhibitor_id is provided as a query parameter.
    const exhibitorId = req.query.exhibitor_id;
    let query = `
      SELECT 
        s.id AS submission_id,
        s.exhibitor_id,
        e.name AS exhibitor_name,
        b.show_id::INTEGER AS show_id, -- Explicitly cast to INTEGER
        sh.name AS show_name,
        b.category AS category_name,
        s.breed_id,
        b.breed_name
      FROM submissions s
      LEFT JOIN exhibitors e ON s.exhibitor_id = e.id
      LEFT JOIN breeds b ON s.breed_id = b.id
      LEFT JOIN shows sh ON CAST(b.show_id AS INTEGER) = sh.id
    `;
    const params = [];

    if (exhibitorId) {
        query += " WHERE s.exhibitor_id = $1";
        params.push(exhibitorId);
    }

    query += " ORDER BY s.id;";

    try {
        const result = await pool.query(query, params);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching submissions:", error.message);
        return res.status(500).json({
            message: "Failed to fetch submissions.",
            error: error.message,
        });
    }
});



router.delete("/", async (req, res) => {
    try {
        await pool.query("DELETE FROM submissions");
        return res.status(200).json({ message: "All submissions cleared successfully." });
    } catch (error) {
        console.error("Error clearing submissions:", error.message);
        return res.status(500).json({
            message: "Failed to clear submissions.",
            error: error.message,
        });
    }
});

export default router;
