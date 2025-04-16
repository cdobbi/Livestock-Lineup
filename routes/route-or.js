import express from "express";
import pool from "../src/db.js";
import Pusher from "pusher";

const router = express.Router();
const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

// Route to send notifications via Pusher
router.post("/api/notify", (req, res) => {
    const { category_name, show_name, breed_name } = req.body;

    if (!category_name || !show_name || !breed_name) {
        return res.status(400).json({ error: "Missing fields" });
    }

    pusher.trigger("livestock-lineup", "breed-notification", {
        category: category_name, 
        show: show_name,   
        breed: breed_name
    });

    console.log(`Notification sent for Category: ${category_name}, Show: ${show_name}, Breed: ${breed_name}`);
    res.status(200).json({ message: "Notification sent successfully!" });
});

// Route to save organizer lineups
router.post("/api/save-organizer-lineups", async (req, res) => {
    const { show_name, lineups } = req.body;

    if (!show_name || !lineups || !Array.isArray(lineups)) {
        return res.status(400).json({ error: "Invalid organizer data." });
    }

    try {
        const existingLineups = await pool.query(
            "SELECT * FROM organizers WHERE show_name = $1",
            [show_name]
        );

        if (existingLineups.rows.length > 0) {
            await pool.query(
                "UPDATE organizers SET lineups = $1 WHERE show_name = $2",
                [JSON.stringify(lineups), show_name]
            );
        } else {
            await pool.query(
                "INSERT INTO organizers (show_name, lineups) VALUES ($1, $2)",
                [show_name, JSON.stringify(lineups)]
            );
        }

        res.status(200).json({ message: "Organizer lineups saved successfully." });
    } catch (error) {
        console.error("Error saving organizer lineups:", error);
        res.status(500).json({ error: "Failed to save organizer lineups." });
    }
});

// Route to get all organizer lineups
router.get("/api/get-organizer-lineups", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM organizers");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching organizer lineups:", error);
        res.status(500).json({ error: "Failed to fetch organizer lineups." });
    }
});

export default router;


// import express from "express";
// import pool from "../src/db.js";
// import Pusher from "pusher";

// const router = express.Router();
// const pusher = new Pusher({
//     appId: process.env.APP_ID,
//     key: process.env.PUSHER_KEY,
//     secret: process.env.PUSHER_SECRET,
//     cluster: process.env.PUSHER_CLUSTER,
//     useTLS: true,
// });


// router.post("/api/save-organizers-lineups", async (req, res) => {
//     const { show_name, lineups } = req.body;

//     if (!show_name || !lineups || !Array.isArray(lineups)) {
//         return res.status(400).json({ error: "Invalid organizer data." });
//     }

//     try {
//         const lineups = await pool.query(
//             "SELECT * FROM organizers WHERE lineups = $1",
//             [show_name]
//         );

//         if (lineups.rows.length > 0) {
//             await pool.query(
//                 "UPDATE organizers SET lineups = $1 WHERE show_name = $2",
//                 [JSON.stringify(lineups), show_name]
//             );
//         } else {
//             await pool.query(
//                 "INSERT INTO rganizers (show_name, lineups) VALUES ($1, $2)",
//                 [show_name, JSON.stringify(lineups)]
//             );
//         }

//         res.status(200).json({ message: "Organizer lineups saved successfully." });
//     } catch (error) {
//         console.error("Error saving organizer lineups:", error);
//         res.status(500).json({ error: "Failed to save organizer lineups." });
//     }
// });

// router.get("/api/get-organizesr-lineups", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM Organizers");
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error("Error fetching organizer lineups:", error);
//         res.status(500).json({ error: "Failed to fetch organizer lineups." });
//     }
// });

// router.post("/api/notify", (req, res) => {
//     const { category_name, show_name, breed_name } = req.body;

//     if (!category_name || !show_name || !breed_name) {
//         return res.status(400).json({ error: "Missing fields" });
//     }

//     pusher.trigger("livestock-lineup", "breed-notification", {
//         category: category_name, 
//         show: show_name,   
//         breed: breed_name
// });

//     console.log(`Notification sent for Category: ${category_name}, Show: ${show_name}, Breed: ${breed_name}`);
//     res.status(200).json({ message: "Notification sent successfully!" });
// });

// export default router;