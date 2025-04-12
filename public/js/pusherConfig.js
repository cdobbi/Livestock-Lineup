// pusher-config.js
const express = require('express');
const router = express.Router();

// In a production system, you’ll want to use environment variables for these values.
const pusherConfig = {
  key: process.env.PUSHER_APP_KEY || 'your-pusher-key-here',
  cluster: process.env.PUSHER_APP_CLUSTER || 'your-pusher-cluster-here'
};

// When the frontend makes a GET request to /pusher-config,
// send back the configuration details.
router.get('/', (req, res) => {
  res.json(pusherConfig);
});

module.exports = router;
