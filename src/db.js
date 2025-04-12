import pkg from "pg"; // Import the pg module as a default import

// Create a new pool instance with the database connection details
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL from the .env file
    ssl: {
        rejectUnauthorized: false, // Allow self-signed certificates for SSL
    },
});

// Export the pool object for use in other files
export default pool;