import dotenv from 'dotenv';
dotenv.config();
console.log("Pusher Key:", process.env.key);

import express, { json } from "express";
import Pusher from "pusher";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Express app and set the port
const app = express();
const port = process.env.PORT || 3000;

// Configure Pusher
const pusher = new Pusher({
    appId: process.env.app_id, 
    key: process.env.key,      
    secret: process.env.secret, 
    cluster: process.env.cluster, 
    useTLS: true,
});

// Middleware
app.use(json());
app.use(cors());

// Verify Code Endpoint
app.post("/verify-code", (req, res) => {
    const { code } = req.body;
    // Replace "12345" with your actual verification logic
    if (code === "12345") {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

app.get("/api/all-exhibitors", (req, res) => {
    if (fs.existsSync(dataFilePath)) {
        const exhibitorsData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        res.json(exhibitorsData);
    } else {
        res.status(404).send("No exhibitor data found.");
    }
});

import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(__dirname, 'data', 'exhibitors.json');

// Save Entries Endpoint
app.post("/api/save-entries", (req, res) => {
    const { breeds } = req.body;
    const exhibitorId = req.ip; // Example unique identifier for exhibitors

    console.log("Received request to save entries."); // Log the request
    console.log("Request body:", req.body); // Log the request data

    if (!breeds || breeds.length === 0) {
        console.warn("No breeds provided in the request.");
        return res.status(400).send("No breeds provided.");
    }

    // Read existing data
    let exhibitorsData = [];
    if (fs.existsSync(dataFilePath)) {
        exhibitorsData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        console.log("Existing exhibitors data:", exhibitorsData); // Log existing data
    } else {
        console.warn("No existing data file found. Creating a new one.");
    }

    // Update or add the exhibitor's data
    const existingExhibitor = exhibitorsData.find((entry) => entry.id === exhibitorId);
    if (existingExhibitor) {
        console.log(`Updating data for exhibitor with ID: ${exhibitorId}`);
        existingExhibitor.breeds = breeds;
    } else {
        console.log(`Adding new exhibitor with ID: ${exhibitorId}`);
        exhibitorsData.push({ id: exhibitorId, breeds });
    }

    // Write updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(exhibitorsData, null, 2), 'utf8');
    console.log("Updated exhibitors data:", exhibitorsData); // Log updated data

    res.status(200).send("Entries saved successfully.");
});


// API Route: Notifications
app.get("/api/notifications", (req, res) => {
    const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" },
        { breed: "Flemish Giant" },
    ];
    res.json(notifications);
});

app.use(express.static(path.join(__dirname, '..')));

// GET "/" Route: Explicitly serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Pusher Configuration Endpoint
app.get("/pusher-config", (req, res) => {
    res.json({
        key: process.env.key,        // Matches your .env variable
        cluster: process.env.cluster, // Matches your .env variable
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


