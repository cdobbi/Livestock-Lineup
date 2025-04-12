import { fetchAndRenderBreeds } from './fetchBreeds.js';
import { saveLineup } from './saveLineups.js';
import { initClearLineupButton } from './clearLineups.js';
import { initFinishedButton } from './finishLineups.js';
import { initPrintLineupButton } from './printLineups.js';

document.addEventListener("DOMContentLoaded", async function () {
    const apiBaseUrl = "https://livestock-lineup.onrender.com/api";

    // Select the required DOM elements
    const saveLineupButton = document.getElementById("save-lineup");
    const printLineupButton = document.getElementById("print-lineup");
    const clearLineupButton = document.getElementById("clear-lineup");
    const finishedButton = document.getElementById("finished");
    const rabbitList = document.getElementById("rabbit-list");

    // Check if required elements exist
    if (!rabbitList) {
        console.error("Rabbit list element not found");
        return;
    }
    if (!saveLineupButton) console.error("Save Lineup button not found");
    if (!printLineupButton) console.error("Print Preview button not found");
    if (!clearLineupButton) console.error("Clear Lineup button not found");
    if (!finishedButton) console.error("Finished button not found");

    // Fetch and display breeds using the imported fetchAndRenderBreeds function
    fetchAndRenderBreeds(`${apiBaseUrl}/breeds`, rabbitList);

    // Initialize Save Lineup button
    if (saveLineupButton) {
        saveLineupButton.addEventListener("click", async () => {
            // Get selected category, show, and breeds
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            const categoryId = categoryEl ? categoryEl.value : ""; // Changed to categoryId to match backend
            const showId = showEl ? showEl.value : ""; // Changed to showId to match backend
            const breedCheckboxes = document.querySelectorAll(".breed-checkbox:checked"); // Checkbox selectors
            const selectedBreeds = Array.from(breedCheckboxes).map((checkbox) => checkbox.value);

            // Debugging: Log the payload to ensure the correct structure before sending
            console.log("Payload being prepared:", {
                categoryId,
                showId,
                breedIds: selectedBreeds, // Changed to breedIds to match backend
            });

            // Validate the payload before calling saveLineup
            if (!categoryId || !showId || selectedBreeds.length === 0) {
                alert("Please select a category, show, and at least one breed.");
                console.error("Invalid payload:", { categoryId, showId, breedIds: selectedBreeds });
                return;
            }

            // Call the saveLineup function and pass the validated payload
            await saveLineup(categoryId, showId, selectedBreeds, `${apiBaseUrl}/lineups`);

            // Reset selections for next lineup
            document.querySelectorAll(".breed-checkbox:checked").forEach((checkbox) => {
                checkbox.checked = false;
            });
        });
    }

    // Initialize other buttons
    initPrintLineupButton(printLineupButton);
    initClearLineupButton(clearLineupButton);
    initFinishedButton(finishedButton);
});
