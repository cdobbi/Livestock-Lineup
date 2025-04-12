import express from "express";
import cors from "cors";
import path from "path";
import Pusher from "pusher";
import pool from "./db.js";
import { fileURLToPath } from "url";
import routeEx from "../routes/route-ex.js";
import routeOr from "../routes/route-or.js";
import authRoutes from "../routes/route-auth.js";
import codeRoutes from "../routes/route-codes.js";
import submissionsRoutes from "../routes/route-submissions.js";
import showsRoutes from "../routes/route-shows.js";
import lineupsRoutes from "../routes/route-lineups.js";
import breedsRoutes from "../routes/route-breeds.js";
import notificationsRoutes from "../routes/route-notifications.js";
import categoriesRoutes from "../routes/route-categories.js";

// Resolve __dirname for ES 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// const { pool } = pkg;
app.locals.pool = pool;
const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
});

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use("/api/exhibitors", routeEx);
app.use("/api/organizers", routeOr);
app.use("/api/auth", authRoutes);
app.use("/api/codes", codeRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/shows", showsRoutes);
app.use("/api/lineups", lineupsRoutes);
app.use("/api", breedsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/categories", categoriesRoutes);

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.status(200).json({ message: "Database connection successful!", time: result.rows[0] });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed." });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

export default app;