const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const exhibitorFilePath = path.join(__dirname, "data/exhibitors.json");

// Fetch all exhibitor data
router.get("https://livestock-lineup.onrender.com/api/all-exhibitors", (req, res) => {
    if (fs.existsSync(exhibitorFilePath)) {
        try {
            const exhibitorData = JSON.parse(fs.readFileSync(exhibitorFilePath, "utf8"));
            res.json(exhibitorData);
        } catch (error) {
            res.status(500).send("Error reading exhibitor data.");
        }
    } else {
        res.status(404).send("No exhibitor data found.");
    }
});

// Save exhibitor data
router.post("https://livestock-lineup.onrender.com/api/save-entries", (req, res) => {
    const { category, show, breeds } = req.body;

    // Validate the request body
    if (!category || !show || !breeds) {
        return res.status(400).send("Invalid exhibitor data. 'category', 'show', and 'breeds' are required.");
    }

    // Ensure breeds is an array
    if (!Array.isArray(breeds)) {
        return res.status(400).send("Invalid exhibitor data. 'breeds' must be an array.");
    }

    // Read existing exhibitor data
    let exhibitorData = [];
    if (fs.existsSync(exhibitorFilePath)) {
        exhibitorData = JSON.parse(fs.readFileSync(exhibitorFilePath, "utf8"));
    }

    // Add the new entry
    exhibitorData.push({ category, show, breeds });

    // Save the updated data back to the file
    fs.writeFileSync(exhibitorFilePath, JSON.stringify(exhibitorData, null, 2), "utf8");

    res.status(200).send("Exhibitor data saved successfully.");
});

module.exports = router;