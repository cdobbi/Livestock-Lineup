const express = require("express");

const router = express.Router();

// Example notifications
router.get("/", (req, res) => {
    const notifications = [
        { breed: "Holland Lop" },
        { breed: "Netherland Dwarf" },
        { breed: "Flemish Giant" },
    ];
    res.json(notifications);
});

module.exports = router;