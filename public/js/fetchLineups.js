import { validateAndSendNotification } from "./notifications.js";

export const fetchAndRenderLineups = async (lineupContainer, showSelectorId) => {
    // Verify lineup-container exists
    if (!lineupContainer) {
        console.error("lineup-container element not found in the DOM.");
        return;
    }

    // Try to get a selected show ID if a showSelectorId was provided
    let selectedShowId = null;
    if (showSelectorId) {
        const showSelector = document.getElementById(showSelectorId);
        if (showSelector) {
            selectedShowId = showSelector.value;
        } else {
            console.warn("Show-selector element not found. Fetching all lineups.");
        }
    }

    // Build the URL – if no show is specified, fetch all lineups.
    const url = selectedShowId ? `/api/lineups?showId=${selectedShowId}` : `/api/lineups`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch lineups: ${response.statusText}`);
        }

        const showLineups = await response.json();
        console.log("Retrieved lineups from backend:", showLineups);
        console.log("Retrieved lineups:", showLineups);

        if (showLineups.length === 0) {
            lineupContainer.innerHTML = "<p>No lineups saved.</p>";
            console.warn("No lineups found in the backend.");
            return;
        }

        // Render the lineups
        renderLineups(lineupContainer, showLineups);
    } catch (error) {
        console.error("Error fetching or rendering lineups:", error);
        lineupContainer.innerHTML = "<p>Failed to load lineups. Please try again later.</p>";
    }
};

export const renderLineups = (lineupContainer, showLineups) => {
    lineupContainer.innerHTML = ""; // Clear the container

    showLineups.forEach((lineup, index) => {
        const showDiv = document.createElement("div");

        const showName = document.createElement("h3");
        showName.textContent = `Lineup ${index + 1}: Category: ${lineup.category} - Show: ${lineup.show}`;
        showDiv.appendChild(showName);

        // Create a breed list
        const breedList = document.createElement("ul");

        lineup.breeds.forEach((breed) => {
            const breedItem = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("breed-checkbox");
            checkbox.dataset.breed = breed;

            const label = document.createElement("label");
            label.textContent = breed;
            label.style.cursor = "pointer"; // Indicates it's clickable

            // Minimal change: Add an event listener to the label to trigger a notification.
            label.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevents toggling the checkbox if not desired
                console.log(`Breed ${breed} clicked in lineup: Category ${lineup.category}, Show ${lineup.show}`);
                validateAndSendNotification(breed, lineup.category, lineup.show);
            });

            breedItem.appendChild(checkbox);
            breedItem.appendChild(label);
            breedList.appendChild(breedItem);
        });

        showDiv.appendChild(breedList);
        lineupContainer.appendChild(showDiv);
    });

    console.log("Lineups rendered successfully!");
};
