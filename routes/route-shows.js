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



// (Optional) The POST endpoint for adding shows remains as before...

export default router;


// /**
//  * This file handles all operations related to shows.
//  * It provides routes to retrieve all shows and add new shows to the database.
//  * The routes defined here are used to manage show-related data in the frontend.
//  * It relies on the centralized database connection from db.js.
//  */

// import express from "express";
// import pool from "../src/db.js"; // Import the centralized database connection

// const router = express.Router(); // Initialize the router

// // Retrieve all shows
// router.get("/", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM Shows ORDER BY id");
//         res.status(200).json(result.rows); // Send the fetched data as JSON
//     } catch (error) {
//         console.error("Error retrieving shows:", error);
//         res.status(500).json({ message: "An error occurred. Please try again." });
//     }
// });

// // Add a new show (optional, for admin use)
// router.post("/", async (req, res) => {
//     const { name } = req.body;

//     // Validate input
//     if (!name) {
//         return res.status(400).json({ message: "Show name is required." });
//     }

//     try {
//         const result = await pool.query(
//             "INSERT INTO Shows (name) VALUES ($1) RETURNING id",
//             [name]
//         );
//         res.status(201).json({ message: "Show added successfully!", showId: result.rows[0].id });
//     } catch (error) {
//         console.error("Error adding show:", error);
//         res.status(500).json({ message: "An error occurred. Please try again." });
//     }
// });

// export default router; // Export the router