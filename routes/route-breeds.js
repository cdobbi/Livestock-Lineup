import express from "express";
import pool from "../src/db.js"; // Assuming you're using PostgreSQL with a pool

const router = express.Router();

// Change the GET route from "/breeds" to "/" so that the final URL is "/api/breeds"
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, breed_name, category, related_show FROM breeds ORDER BY id");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching breeds:", error);
    res.status(500).json({ message: "Failed to fetch breeds." });
  }
});

export default router;
