const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const exhibitorFilePath = path.join(__dirname, "../data/exhibitors.json");

// Fetch all exhibitor data
router.get("/api/all-exhibitors", (req, res) => {
    if (fs.existsSync(exhibitorFilePath)) {
        const exhibitorData = JSON.parse(fs.readFileSync(exhibitorFilePath, "utf8"));
        res.json(exhibitorData);
    } else {
        res.status(404).send("No exhibitor data found.");
    }
});

// Save exhibitor data
router.post("/api/save-entries", (req, res) => {
    const { category, show, breeds } = req.body;

    if (!category || !show || !breeds) {
        return res.status(400).send("Invalid exhibitor data.");
    }

    let exhibitorData = [];
    if (fs.existsSync(exhibitorFilePath)) {
        exhibitorData = JSON.parse(fs.readFileSync(exhibitorFilePath, "utf8"));
    }

    exhibitorData.push({ category, show, breeds });
    fs.writeFileSync(exhibitorFilePath, JSON.stringify(exhibitorData, null, 2), "utf8");

    res.status(200).send("Exhibitor data saved successfully.");
});

module.exports = router;
