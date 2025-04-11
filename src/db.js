// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.

import pool from "../src/db.js";

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.status(200).json({ message: "Database connection successful!", time: result.rows[0] });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed." });
    }
});