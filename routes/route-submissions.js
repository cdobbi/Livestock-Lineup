import express from "express";
import pool from "../src/db.js"; // Adjust the path as needed

const router = express.Router();

// Save exhibitor submissions – each breed in the submission becomes its own row
router.post("/", async (req, res) => {
  const { exhibitor_id, showId, categoryId, breedIds } = req.body;

  console.log("Received submission payload:", req.body);

  // Validate the payload
  if (!exhibitor_id || !showId || !categoryId || !Array.isArray(breedIds) || breedIds.length === 0) {
    return res.status(400).json({
      message:
        "Invalid payload. Ensure that exhibitor_id, showId, categoryId, and breedIds (as a non-empty array) are provided.",
    });
  }

  try {
    // Insert each breed ID as a separate row in the submissions table
    const queries = breedIds.map(async (breedId) => {
      return await pool.query(
        "INSERT INTO submissions (exhibitor_id, show_id, category_id, breed_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [exhibitor_id, showId, categoryId, breedId]
      );
    });

    const results = await Promise.all(queries);
    const savedSubmissions = results.map((result) => result.rows[0]);

    res.status(201).json(savedSubmissions);
  } catch (error) {
    console.error("Error saving submission:", error.message);
    res.status(500).json({ message: "Failed to save submission.", error: error.message });
  }
});

// Fetch all submissions
router.get("/", async (req, res) => {
  try {
    // Join submissions with related tables to include human-readable names
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
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching submissions:", error.message);
    res.status(500).json({ message: "Failed to fetch submissions.", error: error.message });
  }
});

// Clear all submissions (for testing purposes)
router.delete("/", async (req, res) => {
  try {
    await pool.query("DELETE FROM submissions");
    res.status(200).json({ message: "All submissions cleared successfully." });
  } catch (error) {
    console.error("Error clearing submissions:", error.message);
    res.status(500).json({ message: "Failed to clear submissions.", error: error.message });
  }
});

export default router;
