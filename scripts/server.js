import express from 'express';
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import the app logic from app.js
import app from "../src/app.js";

// Serve static files from the "public" directory
app.use(express.static('public'));

// Use the port provided by Render or default to 3000 for local development
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} or on Render's assigned port.`);
});