import express from "express";
const router = express.Router();

// Existing GET route for notifications
router.get("/", (req, res) => {
    // Simulated notifications for the frontend
    const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" },
        { breed: "Flemish Giant" },
    ];
    res.status(200).json(notifications);
});

// Add a POST route to handle incoming notifications
router.post("/", (req, res) => {
    console.log("Received notification payload:", req.body);

    // Here you can process the notification data.
    // For instance, you could save it to the database, forward it to a real-time system, etc.

    // Send back a success response
    res.status(200).json({ message: "Notification received successfully." });
});

export default router;
