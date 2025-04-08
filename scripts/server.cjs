/**
 * This script initializes and starts the backend server for the Livestock Lineup application.
 * It loads environment variables, imports the main app configuration from `app.js`,
 * and listens on the specified port. The server is responsible for handling all backend
 * routes and integrations with the database and frontend.
 */

// scripts/server.cjs
const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
// Debug: log the resolved path for clarity
const appPath = path.join(__dirname, "../src/app.js");
console.log("Loading Express app from:", appPath);

const app = require(appPath);

const port = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
