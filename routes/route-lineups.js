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
function render_lineups(container, data) {
    container.innerHTML = "";
  
    const grouped_lineups = {};
    data.forEach((row) => {
      const key = `${row.show_name}|${row.category_name}`;
      if (!grouped_lineups[key]) {
        grouped_lineups[key] = {
          show_name: row.show_name,
          category_name: row.category_name,
          breed_names: []
        };
      }
      grouped_lineups[key].breed_names.push(row.breed_name);
    });
  
    Object.keys(grouped_lineups).forEach((key) => {
      const group = grouped_lineups[key];
  
      const lineup_div = document.createElement("div");
      lineup_div.classList.add("lineup", "mb-4");
  
      const show_title = document.createElement("h2");
      show_title.textContent = `Show: ${group.show_name}`;
      lineup_div.appendChild(show_title);
  
      const category_title = document.createElement("h3");
      category_title.textContent = `Category: ${group.category_name}`;
      lineup_div.appendChild(category_title);
  
      const breeds_list = document.createElement("ul");
      group.breed_names.forEach((breed) => {
        const li = document.createElement("li");
        li.textContent = breed;
        breeds_list.appendChild(li);
      });
      lineup_div.appendChild(breeds_list);
  
      container.appendChild(lineup_div);
    });
  }
  

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
