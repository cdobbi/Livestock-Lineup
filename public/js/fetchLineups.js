export async function fetchAndRenderLineups(lineupContainer, showSelectorId) {
    // Verify lineup-container exists
    if (!lineupContainer) {
        console.error("lineup-container element not found in the DOM.");
        return;
    }

    // Verify show-selector exists and get its value
    const showSelector = document.getElementById(showSelectorId);
    if (!showSelector) {
        console.error("Error: show-selector element not found.");
        lineupContainer.innerHTML = "<p>Please select a show to view its lineups.</p>";
        return;
    }
    const selectedShowId = showSelector.value;

    try {
        // Fetch lineup data based on the selected showId
        if (!selectedShowId) {
            console.warn("No show selected.");
            lineupContainer.innerHTML = "<p>Please select a show to view its lineups.</p>";
            return;
        }

        const response = await fetch(`/api/lineups?showId=${selectedShowId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch lineups: ${response.statusText}`);
        }

        const showLineups = await response.json();
        console.log("Retrieved lineups from backend:", showLineups);

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
}

function renderLineups(lineupContainer, showLineups) {
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

            breedItem.appendChild(checkbox);
            breedItem.appendChild(label);
            breedList.appendChild(breedItem);
        });

        showDiv.appendChild(breedList);
        lineupContainer.appendChild(showDiv);
    });

    console.log("Lineups rendered successfully!");
}