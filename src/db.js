// Does this file need to go into the uiHandlers.bundle.js file? Also which html file does it belong in if any? If it doesn't belong in an HTML or any of the other files, how is it initialized, called or used? What is it's purpose? Please, verify, ensure that this file is updated to use ES Modals and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly.

import { Pool } from "pg"; // Import the Pool class from the pg library

// Create a new pool instance with the database connection details
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL from the .env file
    ssl: {
        rejectUnauthorized: false, // Allow self-signed certificates for SSL
    },
});

// Export the pool object for use in other files
export default pool;