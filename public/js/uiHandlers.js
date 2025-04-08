// This file provides utility functions and event handlers to manage user interactions and dynamically update the user interface (UI) on the exhibitor.html page. It includes reusable functions for rendering UI elements, handling user input, and managing dynamic content such as breed options or notifications. These handlers ensure a responsive and interactive experience for exhibitors by updating the page based on user actions or backend data.

import { fetchAndRenderBreeds } from "./fetchBreeds.js";
import { saveLineup } from "../../scripts/lineupActions.js";

document.addEventListener("DOMContentLoaded", function () {
    const rabbitList = document.getElementById("rabbit-list");
    const saveLineupButton = document.getElementById("save-lineup");
    const apiBase = "https://livestock-lineup.onrender.com/api"; // Base URL for API endpoints

    // Fetch and Render Rabbit Breeds from /api/breeds
    fetchAndRenderBreeds(`${apiBase}/breeds`, rabbitList);

    // Save Lineup Action
    if (saveLineupButton) {
        saveLineupButton.addEventListener("click", async () => {
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            const category = categoryEl ? categoryEl.value : "";
            const show = showEl ? showEl.value : "";

            const selectedBreeds = Array.from(document.querySelectorAll(".breed-button.active")).map(
                (btn) => btn.dataset.breed
            );

            // Using the /api/lineups route to save lineups
            await saveLineup(category, show, selectedBreeds, `${apiBase}/lineups`, "Organizer123");
        });
    }
});
