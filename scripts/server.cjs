/**
 * This script initializes and starts the backend server for the Livestock Lineup application.
 * It loads environment variables, imports the main app configuration from `app.js`,
 * and listens on the specified port. The server is responsible for handling all backend
 * routes and integrations with the database and frontend.
 */

const dotenv = require("dotenv"); // Load environment variables from .env file
dotenv.config();

const app = require("../app"); // Import the app.js file

const port = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});