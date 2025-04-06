// This file handles exhibitor logic

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const exhibitorFilePath = path.join(__dirname, "../data/exhibitors.json");

// Fetch all exhibitors
router.get("/api/all-exhibitors", (req, res) => {
    if (fs.existsSync(exhibitorFilePath)) {
        const exhibitorData = JSON.parse(fs.readFileSync(exhibitorFilePath, "utf8"));
        res.json(exhibitorData);
    } else {
        res.status(404).send("No exhibitor data found.");
    }
});

// Save exhibitor data
router.post("/api/save-exhibitor", (req, res) => {
    const { name, category, show, breeds } = req.body;

    if (!name || !category || !show || !breeds || !Array.isArray(breeds)) {
        return res.status(400).json({ error: "Missing or invalid fields" });
    }

    let exhibitorData = [];
    if (fs.existsSync(exhibitorFilePath)) {
        exhibitorData = JSON.parse(fs.readFileSync(exhibitorFilePath, "utf8"));
    }

    const newEntry = {
        id: exhibitorData.length + 1, // Generate a simple ID
        name,
        submissions: [{ category, show, breeds }]
    };

    exhibitorData.push(newEntry);

    fs.writeFileSync(exhibitorFilePath, JSON.stringify(exhibitorData, null, 2), "utf8");
    res.status(201).json({ message: "Exhibitor saved successfully!" });
});

module.exports = router;