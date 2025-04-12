import { fetchAndRenderBreeds } from './fetchBreeds.js';
import { saveLineup } from './saveLineup.js';
import { initClearLineupButton } from './clearLineups.js';
import { initFinishedButton } from './finishLineups.js';
import { initPrintLineupButton } from './printLineups.js';

document.addEventListener("DOMContentLoaded", async function () {
    // Select all button elements
    const apiEndpoint = "https://livestock-lineup.onrender.com/api/breeds";
    const saveLineupButton = document.getElementById("save-lineup");
    const printLineupButton = document.getElementById("print-lineup");
    const clearLineupButton = document.getElementById("clear-lineup");
    const finishedButton = document.getElementById("finished");
    const rabbitList = document.getElementById("rabbit-list");

        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error("Failed to fetch rabbit breeds.");
            }
            const breeds = await response.json();
            rabbitList.innerHTML = ""; // Clear existing content
    
            breeds.forEach((breed) => {
                const button = document.createElement("button");
                button.className = "btn btn-outline-secondary btn-sm mx-1 my-1 breed-button";
                button.dataset.breed = breed.name;
                button.textContent = breed.name;
    
                button.addEventListener("click", function () {
                    this.classList.toggle("active");
                    console.log(
                        `Breed ${this.dataset.breed} is now ${this.classList.contains("active") ? "selected" : "deselected"}.`
                    );
                });
                rabbitList.appendChild(button);
            });
        } catch (error) {
            console.error("Error fetching rabbit breeds:", error);
            rabbitList.innerHTML = "<div class='text-danger'>Failed to load rabbit breeds.</div>";
        }
    
    // Show error if any elements weren't found
    if (!saveLineupButton) console.error("Save Lineup button not found");   
    if (!printLineupButton) console.error("Print Preview button not found");
    if (!clearLineupButton) console.error("Clear Lineup button not found");
    if (!finishedButton) console.error("Finished button not found");
    if (!rabbitList) console.error("Rabbit list element not found");

    // Fetch and display breeds using fetchBreeds
    const apiBaseUrl = "https://livestock-lineup.onrender.com/api";
    fetchBreeds(`${apiBaseUrl}/breeds`, rabbitList);

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

            // Save lineup using saveLineup
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