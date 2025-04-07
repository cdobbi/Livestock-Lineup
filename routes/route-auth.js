const express = require("express");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "your_database_url_here",
});

// Handle user registration
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const result = await pool.query(
            "INSERT INTO Users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
            [username, email, hashedPassword]
        );

        res.status(200).json({ message: "Registration successful!", userId: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Handle user login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

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

        res.status(200).json({ message: "Login successful!", userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

module.exports = router;
