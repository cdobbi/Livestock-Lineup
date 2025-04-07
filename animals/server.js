import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Animal Explorer API! Use /api/animals or /api/supported-animals.');
});

// Route to fetch all supported animals
app.get('/api/supported-animals', async (req, res) => {
    try {
        const url = `https://animals7.p.rapidapi.com/api/supported-animals`; // Replace with the correct endpoint
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'animals7.p.rapidapi.com',
            },
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.text();
            res.status(response.status).json({
                error: 'Error fetching supported animals from RapidAPI',
                details: errorData,
            });
            return;
        }

        const supportedAnimals = await response.json();
        console.log('Supported Animals:', supportedAnimals); // Debug log
        res.json(supportedAnimals); // Send the list of supported animals to the frontend
    } catch (error) {
        console.error('Error fetching supported animals from RapidAPI:', error.message); // Debug log
        res.status(500).json({
            error: 'Error fetching supported animals from RapidAPI',
            details: error.message,
        });
    }
});

// Route to fetch data for multiple animals
app.get('/api/animals', async (req, res) => {
    try {
        // Hardcoded list of supported animals
        const supportedAnimals = ['Tiger', 'Lion', 'Elephant', 'Giraffe', 'Penguin'];
        const results = [];

        for (const animal of supportedAnimals) {
            const url = `https://animals7.p.rapidapi.com/api/animals?animal=${animal}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                    'x-rapidapi-host': 'animals7.p.rapidapi.com',
                },
            };

            const response = await fetch(url, options);
            if (response.ok) {
                const data = await response.json();
                results.push(...data); // Add the fetched data to the results array
            } else {
                const errorData = await response.text();
                console.error(`Error fetching data for ${animal}:`, errorData); // Debug log
            }
        }

        console.log('Fetched data for all animals:', results); // Debug log
        res.json(results); // Send the combined data to the frontend
    } catch (error) {
        console.error('Error fetching data from RapidAPI:', error.message); // Debug log
        res.status(500).json({
            error: 'Error fetching data from RapidAPI',
            details: error.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});