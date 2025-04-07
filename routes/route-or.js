const express = require("express");
const { Pool } = require("pg"); // PostgreSQL client setup
const Pusher = require("pusher");

const router = express.Router();

// Configure Pusher
const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
});

// Use the existing pool object from your server configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Render-hosted PostgreSQL
});

// Save organizer lineups
router.post("/api/save-organizer-lineups", async (req, res) => {
    const { show_name, lineup } = req.body;

    // Validate the input
    if (!show_name || !lineup || !Array.isArray(lineup)) {
        return res.status(400).send("Invalid organizer data.");
    }

    try {
        // Check if the show already exists in the database
        const existingShow = await pool.query(
            "SELECT * FROM Organizers WHERE show_name = $1",
            [show_name]
        );

        if (existingShow.rows.length > 0) {
            // Update the existing lineup
            await pool.query(
                "UPDATE Organizers SET lineup = $1 WHERE show_name = $2",
                [JSON.stringify(lineup), show_name]
            );
        } else {
            // Insert a new lineup
            await pool.query(
                "INSERT INTO Organizers (show_name, lineup) VALUES ($1, $2)",
                [show_name, JSON.stringify(lineup)]
            );
        }

        res.status(200).send("Organizer lineups saved successfully.");
    } catch (error) {
        console.error("Error saving organizer lineups:", error);
        res.status(500).send("Failed to save organizer lineups.");
    }
});

// Retrieve organizer lineups
router.get("/api/get-organizer-lineups", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Organizers");
        res.json(result.rows); // Send the fetched data as JSON
    } catch (error) {
        console.error("Error fetching organizer lineups:", error);
        res.status(500).send("Failed to fetch organizer lineups.");
    }
});

// Trigger a notification for a specific breed in the lineup
router.post("/api/notify", (req, res) => {
    const { category, show, breed } = req.body;

    if (!category || !show || !breed) {
        return res.status(400).json({ error: "Missing fields" });
    }

    pusher.trigger("Livestock-Lineup", "breed-notification", {
        category,
        show,
        breed,
    });

    console.log(`Notification sent for Category: ${category}, Show: ${show}, Breed: ${breed}`);
    res.status(200).send("Notification sent successfully.");
});

module.exports = router;