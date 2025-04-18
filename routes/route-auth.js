
import express from "express";
import bcrypt from "bcrypt";
import pool from "../src/db.js"; // Import the centralized database connection

const router = express.Router();

// Add a default test user for ease of testing
(async function addTestUser() {
    try {
        const testEmail = "test@example.com";
        const testPassword = "password";

        // Check if the test user already exists
        const existingUser = await pool.query("SELECT * FROM Users WHERE email = $1", [testEmail]);
        if (existingUser.rows.length === 0) {
            // Hash the test user's password
            const hashedPassword = await bcrypt.hash(testPassword, 10);

            // Insert the test user into the database
            await pool.query(
                "INSERT INTO Users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW())",
                ["Test User", testEmail, hashedPassword]
            );
            console.log("Test user added: test@example.com / password");
        }
    } catch (error) {
        console.error("Error adding test user:", error);
    }
})();

// Test database connection
router.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.status(200).json({ message: "Database connection successful!", time: result.rows[0] });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed." });
    }
});

// Handle user registration
router.post("/register", async (req, res) => {
    console.log("Register request body:", req.body); // Log the request body for debugging
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if the email is already registered
        const existingUser = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const result = await pool.query(
            "INSERT INTO Users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
            [username, email, hashedPassword]
        );

        res.status(200).json({ message: "Registration successful!", userId: result.rows[0].id });
    } catch (error) {
        console.error("Error during registration:", error); // Log the full error
        res.status(500).json({ message: "An error occurred during registration. Please try again." });
    }
});

router.post("/login", async (req, res) => {
    console.log("Incoming login request:", req.body); // Log the request body for debugging

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Find user by email
        const result = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            console.warn(`Login failed: User not found for email ${email}`);
            return res.status(401).json({ message: "Invalid credentials." }); // Use 401 for unauthorized
        }

        const user = result.rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.warn(`Login failed: Invalid password for email ${email}`);
            return res.status(401).json({ message: "Invalid credentials." }); // Use 401 for unauthorized
        }

        // Temporarily store user session data (if applicable)
        req.session = { userId: user.id, email: user.email };

        console.log(`Login successful for user ID: ${user.id}`);
        res.status(200).json({ success: true, message: "Login successful!", userId: user.id });
    } catch (error) {
        console.error("Error during login:", error); // Log the full error
        res.status(500).json({ message: "An error occurred during login. Please try again." });
    }
});

export default router;