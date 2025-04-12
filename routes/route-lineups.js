router.post("/", async (req, res) => {
    const { showId, categoryId, breedIds } = req.body;

    // Debugging logs
    console.log("Payload received:", req.body);

    try {
        // Validate the payload structure
        if (!showId || !categoryId || !Array.isArray(breedIds) || breedIds.length === 0) {
            return res.status(400).json({
                message: "Invalid payload. Ensure 'showId', 'categoryId', and 'breedIds' are provided.",
            });
        }

        // Insert each breedId into the lineups table
        const queries = breedIds.map(async (breedId) => {
            try {
                console.log(`Inserting: showId=${showId}, categoryId=${categoryId}, breedId=${breedId}`);
                return await pool.query(
                    "INSERT INTO lineups (show_id, category_id, breed_id) VALUES ($1, $2, $3) RETURNING *",
                    [showId, categoryId, breedId]
                );
            } catch (queryError) {
                console.error(`Error inserting for breedId=${breedId}:`, queryError.message);
                throw queryError;
            }
        });

        // Await all queries
        const results = await Promise.all(queries);
        const savedLineups = results.map((result) => result.rows[0]);

        console.log("Successfully saved lineups:", savedLineups);
        res.status(201).json(savedLineups);
    } catch (error) {
        console.error("Error saving lineup:", error.stack);
        res.status(500).json({ message: "Failed to save lineup.", error: error.message });
    }
});
