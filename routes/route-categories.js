/**
 * This file handles all operations related to categories.
 * It provides routes to fetch all categories and add new categories to the database.
 * The routes defined here are used to populate category-related data in the frontend.
 * It relies on the centralized database connection from db.js.
 */

import express from "express";
import pool from "../src/db.js"; // Import the centralized database connection

const router = express.Router();

// Retrieve all categories
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Categories ORDER BY id");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Add a new category (optional, for admin use)
router.post("/", async (req, res) => {
    const { name } = req.body;

    // Validate input
    if (!name) {
        return res.status(400).json({ message: "Category name is required." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO Categories (name) VALUES ($1) RETURNING id",
            [name]
        );
        res.status(201).json({ message: "Category added successfully!", categoryId: result.rows[0].id });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

export default router;