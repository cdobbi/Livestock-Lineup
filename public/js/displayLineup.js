console.log("Starting displayLineup.js...");

document.addEventListener("DOMContentLoaded", async function () {
    // Verify lineup-container exists
    const lineupContainer = document.getElementById("lineup-container");

    if (!lineupContainer) {
        console.error("lineup-container element not found in the DOM.");
        return; // Stop execution if lineup-container is missing
    }

    try {
        // Dynamically fetch lineup data based on the selected showId
        const selectedShowId = document.getElementById("show-selector").value; // Dynamically get the selected showId
        if (!selectedShowId) {
            console.warn("No show selected.");
            lineupContainer.innerHTML = "<p>Please select a show to view its lineups.</p>";
            return; // Stop execution if no show is selected
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
        showLineups.forEach((lineup, index) => {
            const showDiv = document.createElement("div");

            const showName = document.createElement("h3");
            showName.textContent = `Lineup ${index + 1}: Category: ${lineup.category} - Show: ${lineup.show}`;
            showDiv.appendChild(showTitle);

            // Create a breed list
            const breedList = document.createElement("ul");

            lineup.breeds.forEach((breed) => {
                const breedItem = document.createElement("li");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";

                checkbox.addEventListener("click", async () => {
                    if (checkbox.checked) {
                        try {
                            // Fetch exhibitor entries from the backend
                            const exhibitorResponse = await fetch("https://livestock-lineup.onrender.com/api/exhibitors.submissions");
                            const exhibitorsSubmissions = await exhibitorResponse.json();

                            // Validate exhibitorEntries and check if the breed matches
                            const isBreedSelectedByExhibitor = exhibitorsSubmissions.show((exhibitor) =>
                                exhibitor.submissions.show((submission) =>
                                    submission.breeds.includes(breed)
                                )
                            );

                            if (!isBreedSelectedByExhibitor) {
                                console.warn(`Breed ${breed} is not selected by the exhibitor.`);
                                return; // Exit if the breed is not selected by any exhibitor
                            }

                            // If the breed matches, send the notification
                            const payload = {
                                breed_name: breed,
                                category: lineup.category,
                                show: lineup.show,
                            };
                            const response = await fetch("https://livestock-lineup.onrender.com/api/notifications", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(payload),
                            });

                            if (response.ok) {
                                console.log(`Notification sent for breed: ${breed}`);
                            } else {
                                console.error(`Failed to send notification: ${response.statusText}`);
                            }
                        } catch (error) {
                            console.error(`Error sending notification for breed: ${breed}`, error);
                        }
                    }
                });

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
    } catch (error) {
        console.error("Error fetching or rendering lineups:", error);
        lineupContainer.innerHTML = "<p>Failed to load lineups. Please try again later.</p>";
    }
    setInterval(checkForNotifications, 5000);

});console.log("Starting displayLineup.js...");