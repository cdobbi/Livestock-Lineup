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
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            const category = categoryEl ? categoryEl.value : "";
            const show = showEl ? showEl.value : "";
            const selectedBreeds = Array.from(document.querySelectorAll(".breed-button.active")).map(
                (btn) => btn.dataset.breed
            );

            if (!category || !show || selectedBreeds.length === 0) {
                alert("Please select a category, show, and at least one breed.");
                return;
            }

            // Call the saveLineup function (fixed typo: not saveLineusp)
            await saveLineup(category, show, selectedBreeds, `${apiBaseUrl}/lineups`, "Organizer123");

            // Reset selections for next lineup
            document.querySelectorAll(".breed-button.active").forEach((btn) => {
                btn.classList.remove("active");
            });
        });
    }

    // Initialize other buttons
    initPrintLineupButton(printLineupButton);
    initClearLineupButton(clearLineupButton);
    initFinishedButton(finishedButton);
});
