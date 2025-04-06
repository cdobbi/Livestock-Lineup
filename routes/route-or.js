const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

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