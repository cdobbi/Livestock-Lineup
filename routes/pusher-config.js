import express from "express";
import Pusher from "pusher";

const router = express.Router();
Pusher.logToConsole = true;

// Public Pusher configuration for frontend clients
const pusherConfig = {
  key: process.env.PUSHER_KEY, // Public Pusher key
  cluster: process.env.PUSHER_CLUSTER, // Pusher cluster (e.g., "mt1")
};

// GET route for /pusher-config (for frontend clients)
router.get("/", (req, res) => {
    res.json(pusherConfig);
  });

// Private Pusher instance for server-side operations
const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});


// Define the POST route for /pusher-config (for frontend clients)
router.post("/trigger", (req, res) => {
    console.log("Received trigger request:", req.body);
    const { channel, event, data } = req.body;
  
    try {
      pusher.trigger(channel, event, data);
      console.log(
        `Triggered event on channel "${channel}" with event "${event}" and data:`,
        data
      );
      res.status(200).json({ message: "Event triggered successfully!" });
    } catch (error) {
      console.error("Error triggering Pusher event:", error);
      res.status(500).json({ message: "Failed to trigger event." });
    }
  });
  

export default router;