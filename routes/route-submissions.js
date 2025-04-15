import express from "express";
import axios from "axios";
import pool from "../src/db.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// POST route to handle submissions
router.post(
  "/",
  [
    body("exhibitor_id").exists().withMessage("Exhibitor_id is required."),
    body("show_id").exists().withMessage("Show_id is required."),
    body("category_id").exists().withMessage("Category_id is required."),
    body("breed_ids").isArray({ min: 1 }).withMessage("breed_ids must be a non-empty array."),
  ],
  async (req, res) => {
    // Validate request payload
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

      // Insert each breed ID as a separate row
      for (const breed_id of breed_ids) {
        const result = await client.query(
          `INSERT INTO submissions 
             (exhibitor_id, show_id, category_id, breed_id)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [exhibitor_id, show_id, category_id, breed_id]
        );

        savedSubmissions.push(result.rows[0]);

        // Fetch breed details for the notification
        const breedDetails = await pool.query(
          `SELECT breed_name, category, related_show 
           FROM breeds 
           WHERE id = $1`,
          [breed_id]
        );

        if (breedDetails.rows.length > 0) {
          const { breed_name, category, related_show } = breedDetails.rows[0];

          // Trigger Pusher notification
          await axios.post("http://localhost:5000/pusher-config/trigger", {
            channel: "livestock-lineup",
            event: "breed-notification",
            data: {
              category,
              show: related_show,
              breed: breed_name,
            },
          });
        }
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

// GET route to fetch all submissions
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          s.id AS submission_id,
          s.exhibitor_id,
          e.name AS exhibitor_name,
          b.related_show AS show_id,
          sh.name AS show_name,
          b.category AS category_name,
          s.breed_id,
          b.breed_name
      FROM submissions s
      LEFT JOIN exhibitors e ON s.exhibitor_id = e.id
      LEFT JOIN breeds b ON s.breed_id = b.id
      LEFT JOIN shows sh ON b.related_show = sh.id
      ORDER BY s.id;
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

// DELETE route to clear all submissions
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