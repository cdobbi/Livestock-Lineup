// exhibitorFetchLineups.js

import { validateAndSendNotification } from "./notifications.js";

/**
 * Displays the lineups given a container element and the grouped data.
 * Expected structure of showLineups:
 * {
 *   "CategoryName": {
 *      "ShowName": { breeds: ["breed1", "breed2", ...] }
 *   },
 *   ...
 * }
 */
export function displayLineups(lineupContainer, showLineups) {
    lineupContainer.innerHTML = ""; // Clear the container

    Object.keys(showLineups).forEach((category) => {
        Object.keys(showLineups[category]).forEach((show) => {
            const lineup = showLineups[category][show];
            const showDiv = document.createElement("div");
            showDiv.classList.add("lineup", "mb-4", "p-3", "border", "rounded");

            const showTitle = document.createElement("h3");
            showTitle.textContent = `Category: ${category} - Show: ${show}`;
            showTitle.classList.add("text-primary");
            showDiv.appendChild(showTitle);

            const breedList = document.createElement("ul");
            breedList.classList.add("list-group");

            lineup.breeds.forEach((breed) => {
                const breedItem = document.createElement("li");
                breedItem.classList.add("list-group-item");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `checkbox-${breed}`;
                checkbox.classList.add("breed-checkbox");

                const label = document.createElement("label");
                label.htmlFor = `checkbox-${breed}`;
                label.textContent = breed;
                label.style.cursor = "pointer";

                label.addEventListener("click", (event) => {
                    event.stopPropagation();
                    validateAndSendNotification(breed, category, show);
                });

                breedItem.appendChild(checkbox);
                breedItem.appendChild(label);
                breedList.appendChild(breedItem);
            });

            showDiv.appendChild(breedList);
            lineupContainer.appendChild(showDiv);
        });
    });
}

/**
 * Groups an array of lineup objects into a nested object structure.
 * Each lineup object is expected to have properties:
 *   - category_name (or category_id)
 *   - show_name (or show_id)
 *   - breed_name (or breed_id)
 */
function groupLineups(lineups) {
    const grouped = {};
    lineups.forEach((lineup) => {
        const category = lineup.category_name || lineup.category_id;
        const show = lineup.show_name || lineup.show_id;
        if (!grouped[category]) {
            grouped[category] = {};
        }
        if (!grouped[category][show]) {
            grouped[category][show] = { breeds: [] };
        }
        // Use breed_name if available; otherwise fallback to breed_id.
        grouped[category][show].breeds.push(lineup.breed_name || lineup.breed_id);
    });
    return grouped;
}

/**
 * Fetches the lineups from the API, groups them, and renders them
 * in the provided container. The optional filter parameter is available for future use.
 */
export async function fetchAndRenderLineups(lineupContainer, filter = null) {
    try {
        const response = await fetch("https://livestock-lineup.onrender.com/api/lineups");
        if (!response.ok) {
            throw new Error("Failed to fetch lineups");
        }
        const lineupsData = await response.json();
        // If the API returns a flat array, group it first:
        const groupedLineups = groupLineups(lineupsData);
        displayLineups(lineupContainer, groupedLineups);
    } catch (error) {
        console.error("Error fetching lineups:", error.message);
        lineupContainer.innerHTML = `<p class="error">Unable to load lineups at this time.</p>`;
    }
}

// Automatically fetch and render lineups on lineup.html when the DOM is loaded.
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("lineup-container");
    if (!container) {
        console.error("lineup-container not found on lineup.html");
        return;
    }
    // If no specific filter is needed, pass null.
    fetchAndRenderLineups(container, null);
});
