// This file handles organizer logic. 

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Pusher = require("pusher");

const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
});

const organizerFilePath = path.join(__dirname, "../data/organizers.json");

// Save organizer lineups
router.post("/api/save-organizer-lineups", (req, res) => {
    const { show, lineup } = req.body;

    if (!show || !lineup || !Array.isArray(lineup)) {
        return res.status(400).send("Invalid organizer data.");
    }

    let organizerData = [];
    if (fs.existsSync(organizerFilePath)) {
        organizerData = JSON.parse(fs.readFileSync(organizerFilePath, "utf8"));
    }

    const existingShow = organizerData.find((org) => org.show === show);
    if (existingShow) {
        existingShow.lineup = lineup;
    } else {
        organizerData.push({ show, lineup });
    }

    fs.writeFileSync(organizerFilePath, JSON.stringify(organizerData, null, 2), "utf8");
    res.status(200).send("Organizer lineups saved successfully.");
});

// Trigger a notification for a specific breed in the lineup
router.post("/api/notify", (req, res) => {
    const { category, show, breed } = req.body;

    if (!category || !show || !breed) {
        return res.status(400).json({ error: "Missing fields" });
    }

    pusher.trigger("table-time", "breed-notification", {
        category,
        show,
        breed,
    });

    console.log(`Notification sent for Category: ${category}, Show: ${show}, Breed: ${breed}`);
    res.status(200).send("Notification sent successfully.");
});

module.exports = router;