document.addEventListener("DOMContentLoaded", function () {
    const lineupContainer = document.getElementById("lineup-container");

    if (!lineupContainer) {
        console.error("Error: lineup-container element not found.");
        return;
    }

    async function fetchExhibitorEntries() {
        try {
            const response = await fetch("/api/all-exhibitors");
            const exhibitors = await response.json();
            console.log("Exhibitors data fetched:", exhibitors);
    
            exhibitors.forEach((exhibitor) => {
                exhibitor.submissions.forEach((submission) => {
                    console.log(
                        `Exhibitor ID: ${exhibitor.id}, Category: ${submission.category}, Show: ${submission.show}, Breeds: ${submission.breeds.join(", ")}`
                    );
                    // Process and display the submissions as needed
                });
            });
        } catch (error) {
            console.error("Error fetching exhibitor entries:", error);
        }
    }
    
    fetchExhibitorEntries();
    
    

    const showLineups = JSON.parse(localStorage.getItem("showLineups")) || {};

    // Display the lineups
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
                
                console.log("showLineups data:", showLineups);
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
                            try {
                                const response = await fetch("https://Livestock-Lineup.onrender.com/api/notifications", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ breed }),
                                });

                                const data = await response.json();
                                alert(`Notification sent for breed: ${breed}`);
                            } catch (error) {
                                console.error("Error sending notification:", error);
                                alert("Failed to send notification. Please try again.");
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

    // Display the lineups on page load
    displayLineups();
});