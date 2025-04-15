import { fetchAndRenderLineups } from "./fetchLineups.js";
import { validateAndSendNotification } from "./notifications.js";

// This function displays the lineups given a container element and showLineups data.
export function displayLineups(lineupContainer, showLineups) {
    console.log("displayLineups called with showLineups:", showLineups);

    // Check if showLineups has valid content
    if (!showLineups || Object.keys(showLineups).length === 0) {
        console.warn("No lineup data received. Displaying fallback message.");
        lineupContainer.innerHTML = "<p class='text-center'>No lineups available at this time.</p>";
        return;
    }

    console.log("Clearing lineup container...");
    lineupContainer.innerHTML = "";

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
                label.style.cursor = "pointer"; // Indicates the label is clickable

                // When the label is clicked, trigger a notification.
                label.addEventListener("click", (event) => {
                    event.stopPropagation(); // Prevent checkbox toggle if not desired
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
