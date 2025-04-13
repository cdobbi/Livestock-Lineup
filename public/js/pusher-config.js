// pusher-config.js
import express from 'express';
const router = express.Router();

// Read public Pusher configuration from environment variables.
// Render will supply PUSHER_APP_KEY and PUSHER_APP_CLUSTER via the environment.
const pusherConfig = {
  key: process.env.PUSHER_APP_KEY,      // Public Pusher key
  cluster: process.env.PUSHER_APP_CLUSTER // Pusher cluster (e.g. "mt1")
};

// Define the GET route for /pusher-config.
router.get('/', (req, res) => {
  res.json(pusherConfig);
});

export default router;
