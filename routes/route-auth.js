/**
 * This file handles user authentication, including registration and login.
 * It uses bcrypt for password hashing and PostgreSQL for database operations.
 * The routes defined here are used for user-related actions such as creating accounts
 * and logging in. It relies on the centralized database connection from db.js.
 */

const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../src/db"); // Import the centralized database connection

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

// Handle user login
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
            return res.status(400).json({ message: "User not found." });
        }

        const user = result.rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Temporarily store user session data (if applicable)
        req.session = { userId: user.id, email: user.email };

        res.status(200).json({ message: "Login successful!", userId: user.id });
    } catch (error) {
        console.error("Error during login:", error); // Log the full error
        res.status(500).json({ message: "An error occurred during login. Please try again." });
    }
});

module.exports = router;