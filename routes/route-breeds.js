import express from "express";
import pool from "../src/db.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, FROM breeds ORDER BY name");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching breeds:", error);
    res.status(500).json({ message: "Failed to fetch breeds." });
  }
});

export default router;
