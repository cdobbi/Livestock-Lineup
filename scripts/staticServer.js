// filepath: c:\Livestock-Lineup\scripts\staticServer.js
// Serve static files from the "public" directory
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

// Add fallback route to serve index.html for unmatched routes (after all other routes)
app.get("*", (req, res) => {
    if (!req.originalUrl.startsWith("/api")) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    }
});

export default app;