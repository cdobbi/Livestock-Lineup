import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    const notifications = [
        { breed: "Rhinelander" },
        { breed: "Harlequin" },
        { breed: "Mini Lop" },
    ];
    res.status(200).json(notifications);
});

router.post("/", (req, res) => {
    console.log("Received notification payload:", req.body);

    res.status(200).json({ message: "Notification received successfully." });
});

export default router;
