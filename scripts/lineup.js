// This file handles the organizer's operations.

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
            const response = await fetch("https://livestock-lineup.onrender.com/api/all-exhibitors");
            if (!response.ok) {
                throw new Error("Failed to fetch exhibitor entries.");
            }
            exhibitorEntries = await response.json();
            console.log("Exhibitors data fetched:", exhibitorEntries);
        } catch (error) {
            console.error("Error fetching exhibitor entries:", error);
            alert("Failed to load exhibitor data. Please try again later.");
        }
    }

    // Fetch show lineups dynamically based on the show ID
    async function fetchShowLineups(showId) {
        try {
            const response = await fetch(`/api/lineups?showId=${showId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch show lineups.");
            }

            const lineupsData = await response.json();
            console.log("Fetched show lineups:", lineupsData);

            // Aggregate lineups by category and show
            showLineups = {}; // Reset showLineups to avoid duplication
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
            alert("Failed to fetch show lineups. Please try again later.");
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
            const response = await fetch("https://livestock-lineup.onrender.com/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, show, breed }),
            });

            if (response.ok) {
                alert(`Notification sent for Category: ${category}, Show: ${show}, Breed: ${breed}`);
                return true;
            } else {
                console.error("Failed to send notification:", response.statusText);
                alert("Failed to send notification. Please try again.");
                return false;
            }
        } catch (error) {
            console.error("Error sending notification:", error);
            alert("An error occurred while sending the notification.");
            return false;
        }
    }

    // Display the lineups in the UI
    function displayLineups() {
        lineupContainer.innerHTML = ""; // Clear the container

        Object.keys(showLineups).forEach((category) => {
            Object.keys(showLineups[category]).forEach((show) => {
                const lineup = showLineups[category][show];
                const showDiv = document.createElement("div");
                showDiv.classList.add("lineup");

                const showTitle = document.createElement("h3");
                showTitle.textContent = `Category: ${category} - Show: ${show}`;
                showDiv.appendChild(showTitle);

                const breedList = document.createElement("ul");

                if (!lineup.breeds || !Array.isArray(lineup.breeds)) {
                    console.warn(`No breeds found for category: ${category}, show: ${show}`);
                    return;
                }

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
                                breedItem.classList.add("notified"); // Mark as notified
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
