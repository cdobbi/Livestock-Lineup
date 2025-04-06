// Fetch all exhibitors
router.get("/all-exhibitors", (req, res) => {
    try {
        if (fs.existsSync(exhibitorFilePath)) {
            const exhibitorData = JSON.parse(fs.readFileSync(exhibitorFilePath, "utf8"));
            res.json(exhibitorData);
        } else {
            res.status(404).send("No exhibitor data found.");
        }
    } catch (error) {
        console.error("Error reading exhibitor data:", error);
        res.status(500).json({ error: "Failed to fetch exhibitor data." });
    }
});

// Save exhibitor data
router.post("/save-exhibitor", (req, res) => {
    try {
        const { name, category, show, breeds } = req.body;

        if (!name || !category || !show || !breeds || !Array.isArray(breeds)) {
            return res.status(400).json({ error: "Missing or invalid fields" });
        }

        let exhibitorData = [];
        if (fs.existsSync(exhibitorFilePath)) {
            exhibitorData = JSON.parse(fs.readFileSync(exhibitorFilePath, "utf8"));
        }

        const newEntry = {
            id: exhibitorData.length > 0 ? exhibitorData[exhibitorData.length - 1].id + 1 : 1, // Generate unique ID
            name,
            submissions: [{ category, show, breeds }]
        };

        exhibitorData.push(newEntry);

        fs.writeFileSync(exhibitorFilePath, JSON.stringify(exhibitorData, null, 2), "utf8");
        res.status(201).json({ message: "Exhibitor saved successfully!" });
    } catch (error) {
        console.error("Error saving exhibitor data:", error);
        res.status(500).json({ error: "Failed to save exhibitor data." });
    }
});