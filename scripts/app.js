const express = require("express");
const cors = require("cors");
const path = require("path");
const Pusher = require("pusher");
const { Pool } = require("pg");

// Import routes
const routeEx = require("./routes/route-ex");
const routeOr = require("./routes/route-or");
const authRoutes = require("./routes/route-auth");
const codeRoutes = require("./routes/route-codes");
const submissionsRoutes = require("./routes/route-submissions");
const showsRoutes = require("./routes/route-shows"); // New route for shows
const lineupsRoutes = require("./routes/route-lineups");
app.use("/lineups", lineupsRoutes);
const breedsRoutes = require("./routes/route-breeds");
app.use("/breeds", breedsRoutes);
const notificationsRoutes = require("./routes/route-notifications");
app.use("/notifications", notificationsRoutes);
const categoriesRoutes = require("./routes/route-categories"); // Import the categories route
app.use("/categories", categoriesRoutes); // Add the categories route
// Initialize the app
const app = express();

// PostgreSQL Pool Configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Render-hosted PostgreSQL
});

// Fetch categories from the backend and populate a dropdown
async function fetchCategories() {
    try {
        const response = await fetch("/categories");
        const categories = await response.json();

        const dropdown = document.getElementById("categoryDropdown");
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Configure Pusher
const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true,
});

// Routes
app.use("/exhibitors", routeEx);
app.use("/organizers", routeOr);
app.use("/auth", authRoutes);
app.use("/codes", codeRoutes);
app.use("/submissions", submissionsRoutes);
app.use("/shows", showsRoutes); // Add the shows route

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("Route not found");
});

module.exports = app;