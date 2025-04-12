import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the "public".
app.use(express.static(path.join(__dirname, "../public")));

// Fallback route to serve index.html for any unmatched routes (useful for SPAs)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;