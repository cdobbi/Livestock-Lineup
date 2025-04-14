import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import app from "./app.js"; // Import your Express app

const port = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

// Fallback route to serve index.html for any unmatched routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});