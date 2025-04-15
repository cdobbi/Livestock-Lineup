import express from "express";
import Pusher from "pusher";

const router = express.Router();

// Public Pusher configuration for frontend clients
const pusherConfig = {
    PUSHER_KEY: process.env.PUSHER_KEY, // Public Pusher key
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER, // Pusher cluster (e.g., "mt1")
};

// Private Pusher instance for server-side operations
const pusher = new Pusher({
    APP_ID: process.env.APP_ID, // Private Pusher app ID
    PUSHER_KEY: process.env.PUSHER_KEY, // Public Pusher key
    PUSHER_SECRET: process.env.PUSHER_SECRET, // Private Pusher secret
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER, // Pusher cluster (e.g., "mt1")
    useTLS: true,
});

// Define the GET route for /pusher-config (for frontend clients)
router.get("/", (req, res) => {
  res.json(pusherConfig);
});

// Example POST route to trigger a Pusher event
router.post("/trigger", (req, res) => {
  const { channel, event, data } = req.body;

  try {
    pusher.trigger(channel, event, data);
    res.status(200).json({ message: "Event triggered successfully!" });
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    res.status(500).json({ message: "Failed to trigger event." });
  }
});

export default router;