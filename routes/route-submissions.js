import express from "express";
import pool from "../src/db.js"; // Adjust the path as needed
import { body, validationResult } from "express-validator";

const router = express.Router();

/**
 * POST /api/submissions
 * Save exhibitor submissions – each breed in the submission becomes its own row.
 *
 * Expected payload (as sent by the client):
 * {
 *    "exhibitor_id": <number>,
 *    "showId": <number>,
 *    "categoryId": <number>,
 *    "breedIds": [<number>, ...]
 * }
 */
router.post(
  "/",
  [
    body("exhibitor_id")
      .exists()
      .withMessage("Exhibitor ID is required."),
    body("showId")
      .exists()
      .withMessage("Show ID is required."),
    body("categoryId")
      .exists()
      .withMessage("Category ID is required."),
    body("breedIds")
      .isArray({ min: 1 })
      .withMessage("breedIds must be a non-empty array."),
  ],
  async (req, res) => {
    // Validate request payload
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the payload exactly as received
    const { exhibitor_id, showId, categoryId, breedIds } = req.body;
    console.log("Received submission payload:", req.body);

    // Get a client from the pool and start a transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const savedSubmissions = [];
      // Insert each breed ID as a separate row in the submissions table
      for (const breedId of breedIds) {
        const result = await client.query(
          `INSERT INTO submissions 
             (exhibitor_id, show_id, category_id, breed_id)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [exhibitor_id, showId, categoryId, breedId]
        );
        savedSubmissions.push(result.rows[0]);
      }

      // Commit the transaction after all successful inserts
      await client.query("COMMIT");
      return res.status(201).json(savedSubmissions);
    } catch (error) {
      // Roll back the transaction if any error occurs
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

/**
 * GET /api/submissions
 * Fetch all submissions (with additional human-readable names by joining related tables).
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id AS submission_id,
        s.exhibitor_id,
        e.name AS exhibitor_name,
        s.show_id,
        sh.name AS show_name,
        s.category_id,
        c.name AS category_name,
        s.breed_id,
        b.breed_name,
        s.submission_time
      FROM submissions s
      LEFT JOIN exhibitors e ON s.exhibitor_id = e.id
      LEFT JOIN shows sh ON s.show_id = sh.id
      LEFT JOIN categories c ON s.category_id = c.id
      LEFT JOIN breeds b ON s.breed_id = b.id
      ORDER BY s.id
    `);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching submissions:", error.message);
    return res.status(500).json({
      message: "Failed to fetch submissions.",
      error: error.message,
    });
  }
});

/**
 * DELETE /api/submissions
 * Clear all submissions (for testing purposes only).
 */
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
