const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const organizerFilePath = path.join(__dirname, "../data/organizer.json");

// Save organizer lineups
router.post("/api/save-organizer-lineups", (req, res) => {
    const { organizerId, lineups } = req.body;

    if (!organizerId || !lineups || !Array.isArray(lineups)) {
        return res.status(400).send("Invalid organizer data.");
    }

    let organizerData = [];
    if (fs.existsSync(organizerFilePath)) {
        organizerData = JSON.parse(fs.readFileSync(organizerFilePath, "utf8"));
    }

    const existingOrganizer = organizerData.find((org) => org.organizerId === organizerId);
    if (existingOrganizer) {
        existingOrganizer.lineups = lineups;
    } else {
        organizerData.push({ organizerId, lineups });
    }

    fs.writeFileSync(organizerFilePath, JSON.stringify(organizerData, null, 2), "utf8");
    res.status(200).send("Organizer lineups saved successfully.");
});

// Fetch all organizer lineups
router.get("/api/all-organizer-lineups", (req, res) => {
    if (fs.existsSync(organizerFilePath)) {
        const organizerData = JSON.parse(fs.readFileSync(organizerFilePath, "utf8"));
        res.json(organizerData);
    } else {
        res.status(404).send("No organizer lineups found.");
    }
});

module.exports = router;
