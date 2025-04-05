const express = require("express");
const router = express.Router();

// Example route: Fetch all exhibitors
router.get("/api/all-exhibitors", (req, res) => {
    res.json({ message: "Exhibitor data goes here." });
});

// Example route: Save exhibitor data
router.post("/api/save-exhibitor", (req, res) => {
    const { name, category, breed } = req.body;

    if (!name || !category || !breed) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Simulate saving data
    res.status(201).json({ message: "Exhibitor saved successfully!" });
});

// Pusher initialization function
async function initializePusher() {
    try {
        const response = await fetch("https://livestock-lineup.onrender.com/pusher-config");
        if (!response.ok) {
            throw new Error("Failed to fetch Pusher configuration.");
        }

        const pusherConfig = await response.json();

        const pusher = new Pusher(pusherConfig.key, {
            cluster: pusherConfig.cluster,
        });

        const channel = pusher.subscribe("table-time");

        channel.bind("breed-notification", (data) => {
            const { breed, category, show } = data;
            console.log(`Notification received for Category: ${category}, Show: ${show}, Breed: ${breed}`);
        });

        return { pusher, channel };
    } catch (error) {
        console.error("Error initializing Pusher:", error);
        return null;
    }
}

module.exports = { router, initializePusher };