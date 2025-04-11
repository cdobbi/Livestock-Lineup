// Verify, ensure that require and module.exports are used and dont use the weird notations. ensure that all variables, functions, and wording are consistent across files and that everything links properly. 

/// Require modules
const { saveLineup } = require('./localStorage.js');
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

    // Fetch and display breeds
    fetch("https://livestock-lineup.onrender.com/api/breeds")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch rabbit breeds.");
            }
            return response.json();
        })
        .then((breeds) => {
            rabbitList.innerHTML = ""; // Clear existing content
            breeds.forEach((breed) => {
                const button = document.createElement("button");
                button.className = "breed-button btn btn-outline-secondary m-2";
                button.dataset.breedId = breed.id;
                button.textContent = breed.breed_name;

                button.addEventListener("click", function () {
                    this.classList.toggle("active");
                });

                rabbitList.appendChild(button);
            });
        })
        .catch((error) => {
            console.error("Error fetching rabbit breeds:", error);
            rabbitList.innerHTML = "<div class='text-danger'>Failed to load rabbit breeds.</div>";
        });

    // Initialize Save Lineup button
    if (saveLineupButton) {
        saveLineupButton.addEventListener("click", () => {
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            const categoryId = parseInt(categoryEl ? categoryEl.value : "", 10);
            const showId = parseInt(showEl ? showEl.value : "", 10);

            const selectedBreeds = Array.from(document.querySelectorAll(".breed-button.active"));
            const breedIds = selectedBreeds.map(btn => parseInt(btn.dataset.breedId, 10));
            const breedNames = selectedBreeds.map(btn => btn.textContent);

            if (!categoryId || !showId || breedIds.length === 0) {
                alert("Please select a category, show, and at least one breed.");
                return;
            }

            // Create the lineup object
            const lineup = {
                category_id: categoryId,
                show_id: showId,
                breedIds: breedIds,
                breeds: breedNames
            };

            // Save to localStorage
            saveLineup(lineup);

            // Show success message with flipping card
            const flippingCard = document.getElementById("flipping-card");
            if (flippingCard) {
                flippingCard.style.display = "block";

                setTimeout(() => {
                    flippingCard.querySelector(".flipping-card-inner").style.animation = "none";
                }, 2000);

                setTimeout(() => {
                    flippingCard.style.display = "none";
                }, 4000);
            }

            // Reset selections for next lineup
            selectedBreeds.forEach(btn => {
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