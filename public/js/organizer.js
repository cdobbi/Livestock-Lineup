// Verify, ensure that require and module.exports are used and don't use the weird notations. Ensure that all variables, functions, and wording are consistent across files and that everything links properly.

const { fetchBreeds, saveLineup } = require('./uiHandlers.bundle.js');
const { initClearLineupButton } = require('./clearLineups.js');
const { initFinishedButton } = require('./finishLineups.js');
const { initPrintLineupButton } = require('./printLineups.js');

document.addEventListener("DOMContentLoaded", function () {
    // Select all button elements
    const saveLineupButton = document.getElementById("save-lineup");
    const printLineupButton = document.getElementById("print-lineup");
    const clearLineupButton = document.getElementById("clear-lineup");
    const finishedButton = document.getElementById("finished");
    const rabbitList = document.getElementById("rabbit-list");

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

// Export the function for use in other files (if needed)
module.exports = {};