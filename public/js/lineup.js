/**
 * This script handles the display and management of show lineups for the Livestock Lineup application.
 * It fetches exhibitor data and show lineups from the backend, validates breed matches,
 * and allows organizers to send notifications for specific breeds.
 * The script integrates with the backend server for data retrieval and notification handling
 * and uses Bootstrap for styling and UI components.
 */

document.addEventListener("DOMContentLoaded", function () {
    const lineupContainer = document.getElementById("lineup-container");

    if (!lineupContainer) {
        console.error("Error: lineup-container element not found.");
        return;
    }

    let exhibitorEntries = [];
    let showLineups = {};

    // Fetch exhibitor entries and cache them
    async function fetchExhibitorEntries() {
        try {
            const response = await fetch("https://livestock-lineup.onrender.com/api/exhibitors");
            if (!response.ok) {
                throw new Error("Failed to fetch exhibitor entries.");
            }
            exhibitorEntries = await response.json();
            console.log("Exhibitors data fetched:", exhibitorEntries);
        } catch (error) {
            console.error("Error fetching exhibitor entries:", error);
        }
    }

    async function fetchShowLineups(showId) {
        try {
            const response = await fetch(`/api/lineups?showId=${showId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch show lineups.");
            }
    
            const lineupsData = await response.json();
            console.log("Fetched show lineups:", lineupsData);
    
            // Aggregate lineups by category and show
            lineupsData.forEach((lineup) => {
                const { category_name, show_name, breed_name } = lineup;
    
                if (!showLineups[category_name]) showLineups[category_name] = {};
                if (!showLineups[category_name][show_name]) showLineups[category_name][show_name] = { breeds: [] };
    
                showLineups[category_name][show_name].breeds.push(breed_name);
            });
    
            console.log("Organized lineups:", showLineups);
            displayLineups(); // Render updated lineups
        } catch (error) {
            console.error("Error fetching show lineups:", error);
        }
    }

    // Validate if a breed matches any exhibitor's registration
    function isBreedMatched(category, show, breed) {
        return exhibitorEntries.some((exhibitor) =>
            exhibitor.submissions.some((submission) =>
                submission.category === category &&
                submission.show === show &&
                submission.breeds.includes(breed)
            )
        );
    }

    // Send a notification for a specific breed
    async function sendNotification(category, show, breed) {
        try {
            const response = await fetch("https://livestock-lineup.onrender.com/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, show, breed }),
            });

            if (response.ok) {
                alert(`Notification sent for Category: ${category}, Show: ${show}, Breed: ${breed}`);
                return true;
            } else {
                console.error("Failed to send notification:", response.statusText);
                return false;
            }
        } catch (error) {
            console.error("Error sending notification:", error);
            return false;
        }
    }

        // Display the lineups in the UI
    // Function to display lineups on the Lineup page
    function displayLineups() {
        console.log("Clearing lineup container...");
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
                    breedItem.textContent = breed;
                    breedItem.classList.add("breed-item");

                    // Add click event to send notification
                    breedItem.addEventListener("click", async () => {
                        const confirmMessage = `Send notification for breed: ${breed}?`;
                        if (confirm(confirmMessage)) {
                            if (!isBreedMatched(category, show, breed)) {
                                alert(`No exhibitors have selected the breed "${breed}" for Category: ${category}, Show: ${show}.`);
                                return;
                            }

                            const success = await sendNotification(category, show, breed);
                            if (success) {
                                breedItem.classList.add("list-group-item-primary"); // Mark as notified
                            }
                        }
                    });

                    breedList.appendChild(breedItem);
                });

                showDiv.appendChild(breedList);
                lineupContainer.appendChild(showDiv);
            });
        });
    }

    // Initialize the page
    async function initialize() {
        await fetchExhibitorEntries();

        const showId = 1; // Hardcoded for now; can be dynamic based on user input
        await fetchShowLineups(showId);
    }

    initialize();
});