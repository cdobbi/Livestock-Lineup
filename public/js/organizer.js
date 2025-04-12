import { fetchAndRenderBreeds } from './fetchBreeds.js';
import { saveLineup } from './saveLineups.js';
import { initClearLineupButton } from './clearLineups.js';
import { initFinishedButton } from './finishLineups.js';
import { initPrintLineupButton } from './printLineups.js';

document.addEventListener("DOMContentLoaded", async function () {
    const apiBaseUrl = "https://livestock-lineup.onrender.com/api";

    // Select required DOM elements
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
            const categoryEl = document.getElementById("category"); // Dropdown for category
            const showEl = document.getElementById("show"); // Dropdown for show
            const categoryId = categoryEl ? categoryEl.value : ""; // Get selected category ID
            const showId = showEl ? showEl.value : ""; // Get selected show ID
            const breedCheckboxes = document.querySelectorAll("input[type='checkbox']:checked"); // Checked breeds
            const selectedBreeds = Array.from(breedCheckboxes).map((checkbox) => checkbox.value);

            // Debugging: Log the prepared payload
            console.log("Payload being prepared:", {
                categoryId,
                showId,
                breedId: selectedBreeds,
            });

            // Validate the payload before sending to the backend
            if (!categoryId || !showId || selectedBreeds.length === 0) {
                alert("Please select a category, show, and at least one breed.");
                console.error("Invalid payload:", { categoryId, showId: selectedBreeds });
                return;
            }

            // Call the saveLineup function with validated data
            try {
                await saveLineup(categoryId, showId, selectedBreeds, `${apiBaseUrl}/lineups`);
                alert("Lineup saved successfully!");
                // Reset selections for next lineup
                breedCheckboxes.forEach((checkbox) => (checkbox.checked = false));
            } catch (error) {
                console.error("Error saving lineup:", error);
                alert("Failed to save lineup. Please try again.");
            }
        });
    }

    // Initialize Print Preview button
    if (printLineupButton) {
        initPrintLineupButton(printLineupButton);
    }

    // Initialize Clear Lineup button
    if (clearLineupButton) {
        initClearLineupButton(clearLineupButton);
    }

    // Initialize Finished button
    if (finishedButton) {
        initFinishedButton(finishedButton);
    }
});
