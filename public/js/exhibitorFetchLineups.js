// Note: Change the import path to use the exhibitor-specific fetch module.
import { fetchAndRenderLineups } from "./exhibitorFetchLineups.js";
import { validateAndSendNotification } from "./notifications.js";

// This function displays the lineups given a container element and grouped showLineups data.
export function displayLineups(lineupContainer, showLineups) {
    console.log("Clearing lineup container...");
    lineupContainer.innerHTML = "";

    // Grouped data is assumed to have the following structure:
    // {
    //   "Open": {
    //       "Show 5": { breeds: [ 'MINI LOP', 'HARLEQUIN', ... ] },
    //       "Show 6": { breeds: [ ... ] },
    //   },
    //   "Youth": { ... }
    // }
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

            // For each breed in this group, create the list item.
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
                label.style.cursor = "pointer"; // Indicates the label is clickable

                // When the label is clicked, trigger a notification.
                label.addEventListener("click", (event) => {
                    event.stopPropagation(); // Prevent checkbox toggling if not desired
                    console.log(`Breed ${breed} clicked in lineup: Category ${category}, Show ${show}`);
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

// Automatically fetch and render lineups on lineup.html when the DOM is loaded.
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("lineup-container");
    if (!container) {
        console.error("lineup-container not found on lineup.html");
        return;
    }
    // Since lineup.html likely doesn't include a show selector, we pass null as the second argument.
    fetchAndRenderLineups(container, null);
});

/*
  The following DOMContentLoaded block that attaches event listeners to elements with class "breed-button"
  is removed (or commented out) because our dynamically created list items already include the click-event
  listener in the displayLineups() function above.
  
document.addEventListener("DOMContentLoaded", () => {
    const breedButtons = document.querySelectorAll(".breed-button");

    breedButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const breedId = button.dataset.breedId;
            const categoryId = button.dataset.categoryId;
            const showId = button.dataset.showId;

            if (!breedId || !categoryId || !showId) {
                console.error("Missing data attributes for breed button.");
                return;
            }

            try {
                const response = await fetch("https://livestock-lineup.onrender.com/api/notify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ breed_id: breedId, category_id: categoryId, show_id: showId }),
                });

                if (response.ok) {
                    console.log(`Notification sent for Breed ID: ${breedId}`);
                } else {
                    console.error("Failed to send notification:", await response.text());
                }
            } catch (error) {
                console.error("Error sending notification:", error);
            }
        });
    });
});
*/
