document.addEventListener("DOMContentLoaded", function () {
    const lineupContainer = document.getElementById("lineup-container");

    if (!lineupContainer) {
        console.error("Error: lineup-container element not found.");
        return;
    }

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

                lineup.breeds.forEach((breed) => {
                    const breedItem = document.createElement("li");
                    breedItem.textContent = breed;
                    breedItem.classList.add("breed-item");

                    // Add click event to send notification
                    breedItem.addEventListener("click", async () => {
                        const confirmMessage = `Send notification for breed: ${breed}?`;
                        if (confirm(confirmMessage)) {
                            try {
                                const response = await fetch("https://wdd330-owtb.onrender.com/api/notifications", {
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